package graphql

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"

	"acme.universe/sunshine/sunshine/contract"
	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"
	"acme.universe/sunshine/sunshine/services"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/friendsofgo/graphiql"
	"github.com/google/uuid"
)

type Resolver struct {
	env     *services.Env
	ctr     *controller.Contract
	project *controller.Project
	gdpr    *controller.GDPR
	user    *controller.User
	org     *controller.Organization
	pf      *controller.Portfolio
	asset   *controller.Asset
	meet    *controller.Meeting
	fa      *controller.ForfaitingAgreement
	wp      *controller.WorkPhase
	mp      *controller.MonitoringPhase
	cr      *controller.User
	gl      *controller.Global
	ctry    *controller.Country
}

func NewResolver(e *services.Env) *Resolver {
	return &Resolver{
		env:     e,
		ctr:     controller.NewContract(e),
		project: controller.NewProject(e),
		gdpr:    controller.NewGDPR(e),
		user:    controller.NewUser(e),
		org:     controller.NewOrganization(e),
		pf:      controller.NewPortfolio(e),
		asset:   controller.NewAsset(e),
		meet:    controller.NewMeeting(e),
		fa:      controller.NewForfaitingAgreement(e),
		wp:      controller.NewWorkPhase(e),
		mp:      controller.NewMonitoringPhase(e),
		cr:      controller.NewUser(e),
		gl:      controller.NewGlobal(e),
		ctry:    controller.NewCountry(e),
	}
}

func Handler(e *services.Env) http.Handler {
	var mb int64 = 1 << 20 //mb

	rsl := NewResolver(e)
	h := handler.NewDefaultServer(NewExecutableSchema(Config{Resolvers: rsl}))
	h.AddTransport(transport.MultipartForm{
		MaxMemory:     4 * mb,
		MaxUploadSize: 10 * mb,
	})

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r.WithContext(dataloaderCtx(r.Context(), rsl)))
	})
}

// Playground is github.com/99designs/gqlgen/handler.Playground.
func Playground(title string, endpoint string) http.HandlerFunc {
	return playground.Handler(title, endpoint)
}

func Graphiql(endpoint string) http.HandlerFunc {
	h, err := graphiql.NewGraphiqlHandler(endpoint)
	if err != nil {
		log.Printf("\nfail to serve graphiql: %v", err)
	}

	return h.ServeHTTP
}

func (r *meetingsResolver) Host(ctx context.Context, obj *Meeting) (*models.Organization, error) {
	return organization(ctx, obj.Host)
}

func (r *meetingsResolver) Project(ctx context.Context, obj *Meeting) (*models.Project, error) {
	if obj.Project != nil {
		return project(ctx, *obj.Project)
	}

	return nil, nil
}

func (r *tableResolver) Rows(ctx context.Context, t *contract.Table) ([][]*string, error) {
	result := make([][]*string, t.Len())
	for i, row := range t.Rows() {
		cells := make([]*string, len(row))
		for j, cell := range row {
			cellstr := string(cell)
			cells[j] = &cellstr
		}
		result[i] = cells
	}
	return result, nil
}

func (r *tableResolver) Columns(ctx context.Context, t *contract.Table) ([]*contract.Column, error) {
	result := make([]*contract.Column, t.ColumnLen())
	for i, c := range t.Columns() {
		column := c
		result[i] = &column
	}
	return result, nil
}

func (r *faResolver) Project(ctx context.Context, fa *models.ForfaitingApplication) (*models.Project, error) {
	return project(ctx, fa.Project)
}

func (r *faResolver) ManagerID(ctx context.Context, fa *models.ForfaitingApplication) (*models.User, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	user, err := cv.User.Load(fa.ManagerID)
	return &user, err
}

func (r *faResolver) Reviews(ctx context.Context, fa *models.ForfaitingApplication) ([]models.FAReview, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	return cv.FAReviews.Load(fa.ID)
}

func (r *faResolver) FinancialStatements(ctx context.Context, obj *models.ForfaitingApplication) ([]*models.Attachment, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	statements, err := cv.FAStatementsAttachments.Load(obj.ID)
	var result = make([]*models.Attachment, 0)
	for _, st := range statements {
		tmp := st
		result = append(result, &tmp)
	}
	return result, err
}

func (r *faResolver) BankConfirmation(ctx context.Context, obj *models.ForfaitingApplication) ([]*models.Attachment, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	statements, err := cv.FABankAttachments.Load(obj.ID)
	var result = make([]*models.Attachment, 0)
	for _, st := range statements {
		tmp := st
		result = append(result, &tmp)
	}
	return result, err
}

func project(ctx context.Context, id uuid.UUID) (*models.Project, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	prj, err := cv.Project.Load(id)
	return &prj, err
}

func organization(ctx context.Context, id uuid.UUID) (*models.Organization, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	org, err := cv.Organization.Load(id)
	return &org, err
}

func (r *assetResolver) Category(ctx context.Context, obj *models.Asset) (string, error) {
	if obj.Category != nil {
		return string(*obj.Category), nil
	}
	return "", nil
}

func (r *assetResolver) Country(ctx context.Context, obj *models.Asset) (string, error) {
	return string(obj.Country), nil
}

func (r *assetResolver) Coords(ctx context.Context, obj *models.Asset) (string, error) {
	return fmt.Sprintf("{%v, %v}", obj.Coordinates.Lat, obj.Coordinates.Lng), nil
}

func (*assetResolver) OwnerName(ctx context.Context, obj *models.Asset) (*string, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return new(string), sentry.Report(errors.New("dataloader is missing"))
	}

	n, err := cv.AssetOwnerName.Load(obj.ID)
	return &n, err
}

func (r *assetResolver) Area(ctx context.Context, obj *models.Asset) (int, error) {
	return int(obj.Area), nil
}

func (r *assetResolver) HeatedArea(ctx context.Context, obj *models.Asset) (int, error) {
	return int(obj.HeatedArea), nil
}

func (r *assetResolver) BillingArea(ctx context.Context, obj *models.Asset) (int, error) {
	return int(obj.BillingArea), nil
}

func (r *assetResolver) ResidentsCount(ctx context.Context, obj *models.Asset) (int, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return *new(int), sentry.Report(errors.New("dataloader is missing"))
	}

	return cv.AssetResidentCount.Load(obj.ID)
}

func (r *projectResolver) Country(ctx context.Context, obj *models.Project) (string, error) {
	return string(obj.Country), nil
}

func (r *projectResolver) ConsortiumOrgs(ctx context.Context, obj *models.Project) ([]uuid.UUID, error) {
	orgs := []uuid.UUID{}
	for _, id := range obj.ConsortiumOrgs {
		orgs = append(orgs, uuid.MustParse(id))
	}

	return orgs, nil
}

func (r *projectResolver) MonitoringPhase(ctx context.Context, obj *models.Project) (*MonitoringPhase, error) {
	m := MonitoringPhase{}

	m.MonitoringPhase = obj.MonitoringPhase
	return &m, nil
}

func (r *projectResolver) WorkPhase(ctx context.Context, obj *models.Project) (*WorkPhase, error) {
	m := WorkPhase{}

	m.WorkPhase = obj.WorkPhase
	return &m, nil
}

func (r *userResolver) Country(ctx context.Context, obj *models.User) (*string, error) {
	c := string(obj.Country)
	return &c, nil
}

func (r *userResolver) IsOssAdmin(ctx context.Context, obj *models.User) (*bool, error) {
	adm := bool(obj.IsOssAdmin)
	return &adm, nil
}

func (r *prjCommentResolver) Author(ctx context.Context, obj *models.ProjectComment) (*models.User, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	user, err := cv.User.Load(obj.UserID)
	return &user, err
}

func (r *orgReportResolver) Country(ctx context.Context, obj *models.OrganizationReport) (string, error) {
	c := string(obj.Country)
	return c, nil
}

func (r *fareviewResolver) Author(ctx context.Context, obj *models.FAReview) (*models.User, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	var (
		user models.User
		err  error
	)

	if obj.Author != nil {
		user, err = cv.User.Load(*obj.Author)
	}

	return &user, err
}

func (r *wpreviewResolver) Author(ctx context.Context, obj *models.WPReview) (*models.User, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	var (
		user models.User
		err  error
	)

	if obj.Author != nil {
		user, err = cv.User.Load(*obj.Author)
	}

	return &user, err
}

func (r *mpreviewResolver) Author(ctx context.Context, obj *models.MPReview) (*models.User, error) {
	cv, ok := ctx.Value(ctxkey).(dataloader)
	if !ok {
		return nil, sentry.Report(errors.New("dataloader is missing"))
	}

	var (
		user models.User
		err  error
	)

	if obj.Author != nil {
		user, err = cv.User.Load(*obj.Author)
	}

	return &user, err
}

func (r *orgResolver) Country(ctx context.Context, obj *models.Organization) (string, error) {
	return string(obj.Country), nil
}

func (r *notifResolver) Country(ctx context.Context, obj *models.Notification) (string, error) {
	return string(obj.Country), nil
}

func (r *fpResolver) Currency(ctx context.Context, obj *models.ForfaitingPayment) (models.Currency, error) {
	return obj.Currency, nil
}

func (r *fpResolver) Project(ctx context.Context, fp *models.ForfaitingPayment) (*models.Project, error) {
	return project(ctx, fp.Project)
}

func (r *crResolver) Country(ctx context.Context, obj *models.CountryRole) (string, error) {
	return string(obj.Country), nil
}

func (r *ctryResolver) Country(ctx context.Context, obj *models.CountryVat) (string, error) {
	return string(obj.Country), nil
}

func messageResult(err error) (*Message, error) {
	if err != nil {
		return msgErr, err
	}
	return msgOK, nil
}

// func (r *calcMenuItemResolver) Idx(ctx context.Context, obj *models.StepItem) (int, error) {
// 	return int(obj.Index), nil
// }

// func (r *calcMenuItemResolver) Required(ctx context.Context, obj *models.StepItem) (bool, error) {
// 	return bool(obj.Require), nil
// }

// func (r *calcMenuSubItemResolver) Idx(ctx context.Context, obj *models.StepField) (int, error) {
// 	return int(obj.Index), nil
// }

// func (r *calcMenuSubItemResolver) Required(ctx context.Context, obj *models.StepField) (bool, error) {
// 	return bool(obj.Require), nil
// }

// func (r *calcMenuSubItemResolver) TextNumber(ctx context.Context, obj *models.StepField) (string, error) {
// 	// panic("not implemented")
// 	return string(obj.TextNumber), nil
// }

// func (r *mutationResolver) AddOssAdminRole(ctx context.Context, uid uuid.UUID) (*Message, error) {
// 	if err := r.pf.AddOssAdminRole(ctx, uid); err != nil {
// 		return msgErr, err
// 	}
// 	return msgOK, nil
// }

// func (r *mutationResolver) RemoveOssAdminRole(ctx context.Context, uid uuid.UUID) (*Message, error) {
// 	if err := r.pf.RemoveOssAdminRole(ctx, uid); err != nil {
// 		return msgErr, err
// 	}
// 	return msgOK, nil
// }

type (
	// calcMenuItemResolver    struct{ *Resolver }
	// calcMenuSubItemResolver struct{ *Resolver }
	queryResolver      struct{ *Resolver }
	mutationResolver   struct{ *Resolver }
	meetingsResolver   struct{ *Resolver }
	faResolver         struct{ *Resolver }
	tableResolver      struct{ *Resolver }
	assetResolver      struct{ *Resolver }
	projectResolver    struct{ *Resolver }
	userResolver       struct{ *Resolver }
	fareviewResolver   struct{ *Resolver }
	orgReportResolver  struct{ *Resolver }
	wpreviewResolver   struct{ *Resolver }
	mpreviewResolver   struct{ *Resolver }
	prjCommentResolver struct{ *Resolver }
	orgResolver        struct{ *Resolver }
	notifResolver      struct{ *Resolver }
	fpResolver         struct{ *Resolver }
	crResolver         struct{ *Resolver }
	ctryResolver       struct{ *Resolver }
)

// func (r *Resolver) CalcMenuItem() CalcMenuItemResolver                   { return &calcMenuItemResolver{r} }
// func (r *Resolver) CalcMenuSubItem() CalcMenuSubItemResolver             { return &calcMenuSubItemResolver{r} }
func (r *Resolver) Query() QueryResolver                                 { return &queryResolver{r} }
func (r *Resolver) Mutation() MutationResolver                           { return &mutationResolver{r} }
func (r *Resolver) Meeting() MeetingResolver                             { return &meetingsResolver{r} }
func (r *Resolver) Table() TableResolver                                 { return &tableResolver{r} }
func (r *Resolver) Asset() AssetResolver                                 { return &assetResolver{r} }
func (r *Resolver) Project() ProjectResolver                             { return &projectResolver{r} }
func (r *Resolver) ForfaitingApplication() ForfaitingApplicationResolver { return &faResolver{r} }
func (r *Resolver) User() UserResolver                                   { return &userResolver{r} }
func (r *Resolver) FAReview() FAReviewResolver                           { return &fareviewResolver{r} }
func (r *Resolver) OrganizationReport() OrganizationReportResolver       { return &orgReportResolver{r} }
func (r *Resolver) WPReview() WPReviewResolver                           { return &wpreviewResolver{r} }
func (r *Resolver) MPReview() MPReviewResolver                           { return &mpreviewResolver{r} }
func (r *Resolver) ProjectComment() ProjectCommentResolver               { return &prjCommentResolver{r} }
func (r *Resolver) Organization() OrganizationResolver                   { return &orgResolver{r} }
func (r *Resolver) Notification() NotificationResolver                   { return &notifResolver{r} }
func (r *Resolver) ForfaitingPayment() ForfaitingPaymentResolver         { return &fpResolver{r} }
func (r *Resolver) CountryRole() CountryRoleResolver                     { return &crResolver{r} }
func (r *Resolver) Country() CountryResolver                             { return &ctryResolver{r} }
