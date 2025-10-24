package stores

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"acme.universe/sunshine/sunshine/contract"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"gopkg.in/go-playground/validator.v9"
)

type notifier struct {
	db *gorm.DB

	validate *validator.Validate
}

func NewNotifier(db *gorm.DB, v *validator.Validate) *notifier {
	return &notifier{db: db, validate: v}
}

// AssetKey is the structured key used for asset notifications.
type AssetKey struct {
	Address string     `json:"address"`
	ESCO    *uuid.UUID `json:"communityOrganizationID"`
}

func (n notifier) Broadcast(ctx context.Context, ua models.UserAction, u models.User, target models.Document, old, new string, issuer uuid.UUID, comment *string) {
	recipients := make(map[uuid.UUID]struct{})

	// country of the target entity
	var c models.Country

	// determine the recipients and entity key depending on target type
	ekey := target.Data.Key()
	switch e := target.Data.(type) {
	case *models.Project:
		for _, role := range e.ProjectRoles {
			if ua == models.UserActionUpload &&
				(role.Position != "tama" && role.Position != "pm") {
				// skip notification for file upload unless it is a tama or pm
				continue
			}

			recipients[role.UserID] = struct{}{}
		}
		c = e.Country
	case *models.Organization:
		// add name and org type in json format
		j := fmt.Sprintf("{\"name\": %q,\"type\": %q}", e.Name, e.LegalForm)
		ekey = j
		for _, role := range e.OrganizationRoles {
			recipients[role.UserID] = struct{}{}
		}
		c = e.Country
	case *contract.IndoorClima:
		ps := NewProjectStore(n.db, nil)
		prj, err := ps.Get(ctx, e.Project)
		if err != nil {
			sentry.Report(err, "could not get project of indoor clima")
			return
		}
		for _, role := range prj.Data.(*models.Project).ProjectRoles {
			recipients[role.UserID] = struct{}{}
		}
		c = prj.Data.(*models.Project).Country
	case *models.Meeting:
		orgs := NewOrganizationStore(n.db, nil)
		org, err := orgs.Get(ctx, e.Host)
		if err != nil {
			sentry.Report(err, "could not get organization of meeting")
			return
		}
		for _, role := range org.Data.(*models.Organization).OrganizationRoles {
			recipients[role.UserID] = struct{}{}
		}
		c = org.Data.(*models.Organization).Country
	case *models.Asset:
		akey := &AssetKey{
			Address: e.Address,
			ESCO:    e.ESCO,
		}

		ekeyJ, err := json.Marshal(akey)
		if err != nil {
			sentry.Report(err, "could not marshal asset key")
			return
		}
		ekey = string(ekeyJ)
		orgs := NewOrganizationStore(n.db, nil)
		org, err := orgs.Get(ctx, e.Owner)
		if err != nil {
			sentry.Report(err, "could not get organization of asset")
			return
		}
		for _, role := range org.Data.(*models.Organization).OrganizationRoles {
			recipients[role.UserID] = struct{}{}
		}
		c = e.Country
	case *models.User:
		// Do not notify anyone
		c = e.Country
	default:
		sentry.Report(fmt.Errorf("broadcast to unknown target type: %T", target.Data))
	}

	// Add a PD and CA for the corresponding country to the list of recipients
	pdst := NewPortfolioStore(n.db)
	pd, err := pdst.GetPortfolioRole(ctx, c, models.PortfolioDirectorRole)
	if err != nil {
		sentry.Report(err)
		return
	}
	recipients[pd] = struct{}{}

	cadmins, err := pdst.GetPortfolioRolesPerCountry(ctx, c, models.CountryAdminRole)
	if err != nil {
		sentry.Report(err)
		return
	}

	// in this case we do NOT want to send to countr admins.
	if !(ua == models.UserActionAssign && new == "lsign") {

		for _, ca := range cadmins {
			recipients[ca] = struct{}{}
		}
	}

	adms, err := pdst.GetAllAdminNWManagers(ctx)
	if err != nil {
		sentry.Report(err)
		return
	}
	for _, adm := range adms {
		recipients[adm] = struct{}{}
	}
	// remove the one creating the notification from recievers in case
	// he has a role that makes him get notified for an action he did
	_, ok := recipients[issuer]
	if ok {
		delete(recipients, issuer)
	}

	cmnt := ""
	if comment != nil {
		cmnt = *comment
	}
	for rec := range recipients {
		notification := models.Notification{
			RecipientID: rec,
			Action:      ua,
			UserID:      u.ID,
			UserKey:     u.Name,
			TargetID:    target.ID,
			TargetKey:   ekey,
			TargetType:  models.EntityType(target.Kind),
			New:         new,
			Old:         old,
			Country:     c,
			Comment:     cmnt,
		}
		if err := n.Notify(ctx, &notification); err != nil {
			sentry.Report(err, "failed to notify")
		}
	}
}

func (n notifier) Notify(ctx context.Context, v *models.Notification) error {
	return n.db.Create(&v).Error
}

func (n notifier) NotifyMultiple(ctx context.Context, issuer uuid.UUID, v models.Notification, ids []uuid.UUID) error {
	recipients := make(map[uuid.UUID]struct{})
	// make uuids unique
	for _, id := range ids {
		if id == uuid.Nil {
			continue
		}
		recipients[id] = struct{}{}
	}
	// remove the one creating the notification from receivers in case
	_, ok := recipients[issuer]
	if ok {
		delete(recipients, issuer)
	}
	for rec := range recipients {
		v.RecipientID = rec
		v.ID = uuid.Nil
		err := n.db.
			Create(&v).Error
		if err != nil {
			return err
		}
	}
	return nil
}

func (n notifier) NotifyCountryRole(ctx context.Context, not *models.Notification, c models.Country, r models.PortfolioRole) {
	pdst := NewPortfolioStore(n.db)
	cadmins, err := pdst.GetPortfolioRolesPerCountry(ctx, c, r)
	if err != nil {
		sentry.Report(err)
		return
	}

	for _, ca := range cadmins {
		not.RecipientID = ca
		not.ID = uuid.UUID{}
		if err := n.Notify(ctx, not); err != nil {
			sentry.Report(err, "failed to notify")
		}
	}
}

func (n notifier) List(ctx context.Context, recp uuid.UUID, action *models.UserAction) ([]models.Notification, error) {
	q := n.db.Where("seen = FALSE AND recipient = ?", recp).Order("created_at DESC")
	if action != nil {
		q = q.Where("action = ?", *action)
	}
	var notifications []models.Notification
	return notifications, q.Find(&notifications).Error
}

func (n notifier) Filter(ctx context.Context, recp uuid.UUID, offset, limit int,
	action []models.UserAction, userID, targetID *uuid.UUID, seen *bool,
	key *string, etype *models.EntityType, country *models.Country,
) ([]models.Notification, error) {
	q := n.filter(recp, action, userID, targetID, seen, key, etype, country).
		Order("created_at DESC").Offset(offset)
	if limit > 0 {
		q = q.Limit(limit)
	}

	var records []models.Notification
	return records, q.Find(&records).Error
}

func (n notifier) filter(recp uuid.UUID, action []models.UserAction, userID,
	targetID *uuid.UUID, seen *bool, key *string, etype *models.EntityType, country *models.Country) *gorm.DB {
	q := n.db.Where("recipient = ?", recp)
	if action != nil {
		q = q.Where("action in (?)", action)
	}
	if userID != nil {
		q = q.Where("user_id = ?", *userID)
	}
	if targetID != nil {
		q = q.Where("target_id = ?", *targetID)
	}
	if seen != nil {
		q = q.Where("seen = ?", *seen)
	}
	if key != nil {
		q = q.Where("notifications.target_key ILIKE ?", pattern(*key))
	}
	if etype != nil {
		q = q.Where("target_type = ?", etype)
	}
	if country != nil {
		q = q.Where("country = ?", *country)
	}
	return q
}

func (n notifier) Count(ctx context.Context, recp uuid.UUID, action []models.UserAction,
	userID, targetID *uuid.UUID, seen *bool, key *string, etype *models.EntityType, country *models.Country) (int, error) {
	var result int
	q := n.filter(recp, action, userID, targetID, seen, key, etype, country)
	return result, q.Model([]models.Notification{}).Count(&result).Error
}

func (n notifier) See(ctx context.Context, id uuid.UUID, recp uuid.UUID) error {
	var no models.Notification
	return n.db.Model(&no).
		Where("id = ? AND recipient = ?", id, recp).
		Update("seen", true).Error
}

func (n notifier) Get(ctx context.Context, id uuid.UUID, recp uuid.UUID) (*models.Notification, error) {
	var no models.Notification
	return &no, n.db.Model(&no).
		Where("id = ? AND recipient = ?", id, recp).
		First(&no).Error
}

func (n notifier) GetDocument(ctx context.Context, id uuid.UUID, kind models.EntityType) (*models.Document, error) {
	var s Store
	switch kind {
	case models.UserT:
		s = NewUserStore(n.db, n.validate)
	case models.AssetT:
		s = NewAssetStore(n.db, n.validate)
	case models.ProjectT:
		s = NewProjectStore(n.db, n.validate)
	case models.MeetingT:
		s = NewMeetingsStore(n.db, n.validate)
	case models.OrganizationT:
		s = NewOrganizationStore(n.db, n.validate)
	default:
		return nil, errors.New("not found")
	}
	return s.Get(ctx, id)
}
