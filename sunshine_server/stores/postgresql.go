package stores

import (
	"context"
	"fmt"
	"reflect"
	"sync"

	"acme.universe/sunshine/sunshine/config"
	"acme.universe/sunshine/sunshine/models"

	"github.com/fatih/structs"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"gopkg.in/go-playground/validator.v9"
)

type store struct {
	// db model defined by the ORM layer.
	db *gorm.DB

	// validate is user-input validator.
	validate *validator.Validate

	// new creates new entity depending of the model.
	new func() models.Entity

	// index is unique field that it is not ID.
	index string

	// search query of the model or how you perform search for that entity.
	search func(*gorm.DB, Filter) *gorm.DB

	// member modifies the db instance (mostly adding necessary JOIN and
	// WHERE clauses) so that the parent entity to preload its members. The
	// point is to have the ability to list some enitities by its member/s.
	member func(*gorm.DB, ...uuid.UUID) *gorm.DB
}

func (s store) DB() *gorm.DB { return s.db }

func (s store) FromKind(kind string) Store {
	var constructor func(*gorm.DB, *validator.Validate) Store

	switch kind {
	case "user":
		constructor = NewUserStore
	case "asset":
		constructor = NewAssetStore
	case "organization":
		constructor = NewOrganizationStore
	case "project":
		constructor = NewProjectStore
	case "contract":
		constructor = NewContractStore
	case "indoorclima":
		constructor = NewIndoorClimaStore
	case "meeting":
		constructor = NewMeetingsStore
	case "forfaiting_application":
		constructor = NewForfaitingApplicationStore
	case "work_phase":
		constructor = NewWorkPhaseStore
	case "monitoring_phase":
		constructor = NewMonitoringPhaseStore
	case "forfaiting_payment":
		constructor = NewForfaitingPaymentStore
	default:
		panic(fmt.Sprintf("No store for %s", kind))
	}

	return constructor(s.db, s.validate)
}

func (s store) Notifications() Notifier {
	return NewNotifier(s.db, s.validate)
}

func (s store) Create(ctx context.Context, e models.Entity) (*models.Document, error) {
	if err := s.validate.Struct(e); err != nil {
		return nil, err
	}

	if err := verifyDependencies(ctx, s, e); err != nil {
		return nil, err
	}

	err := s.db.Create(e).Error
	if err != nil {
		return nil, err
	}
	doc := models.Wrap(e)
	return doc, s.populateAttachments(doc)

}

func (s store) Delete(_ context.Context, d *models.Document) error {
	return s.db.Delete(d.Data).Error
}

func (s store) Get(ctx context.Context, id uuid.UUID) (*models.Document, error) {
	var e = s.new()
	if err := s.db.Where(kv{"id": id}).First(e).Error; err != nil {
		return nil, WithID(err, id, e.Kind())
	}
	doc := models.Wrap(e)
	return doc, s.populateAttachments(doc)
}

func (s store) GetByEmail(ctx context.Context, email string) (*models.Document, error) {
	var e = s.new()
	if err := s.db.Where(kv{"email": email}).First(e).Error; err != nil {
		return nil, WithEmail(err, email, e.Kind())
	}
	doc := models.Wrap(e)
	return doc, s.populateAttachments(doc)
}

func (s store) GetByID(ctx context.Context, userID string) (*models.Document, error) {
	var e = s.new()
	if err := s.db.Where(kv{"user_id": userID}).First(e).Error; err != nil {
		return nil, WithIndex(err, userID, e.Kind())
	}
	doc := models.Wrap(e)
	return doc, s.populateAttachments(doc)
}

func (s store) GetByIndex(ctx context.Context, value string) (*models.Document, error) {
	var e = s.new()
	if err := s.db.Where(kv{s.index: value}).First(e).Error; err != nil {
		return nil, WithIndex(err, s.index, value)
	}
	doc := models.Wrap(e)
	return doc, s.populateAttachments(doc)
}

func (s store) populateAttachments(doc *models.Document) error {
	var atts []models.Attachment
	if err := s.db.Where(kv{"owner_id": doc.ID}).Find(&atts).Error; err != nil {
		return WithID(err, doc.ID, "attachment")
	}

	if doc.Attachments == nil {
		doc.Attachments = make(map[string]models.Attachment)
	}
	for _, att := range atts {
		doc.Attachments[att.Name] = att
	}

	return nil
}

// execList does reflect magic in order to construct a slice (reflect.Value of
// Slice kind, actually) of the correct entity type and execute Find query
// storing the result there. Can not just pass []models.Entity as GORM will not
// know which table to query for these records and how to unmarshal them
// afterwards.
//
// The reflection value of a slice is then converted to a regular slice of
// models.Entity, sacrificing performance (both in terms of memory for the
// second slice and CPU time to actually type assert and copy records to it)
// for the sake of readability outside of this method.
func (s store) execList(ctx context.Context, q *gorm.DB) ([]models.Entity, error) {
	var (
		// Extract the type of s.new() and make a slice of it.
		t     = reflect.TypeOf(s.new())
		slice = reflect.MakeSlice(reflect.SliceOf(t), 0, 0)

		// Create a reflect Value pointing to a slice.
		x = reflect.New(slice.Type())
	)

	// Point the reflect value to the slice allocated above.
	x.Elem().Set(slice)

	// It doesn't make sense to check the error above, as if the query has
	// failed x.Len() will be zero and this next block would be a noop.
	err := q.Find(x.Interface()).Error
	x = x.Elem()
	var result = make([]models.Entity, x.Len())
	for i := 0; i < x.Len(); i++ {
		result[i] = x.Index(i).Interface().(models.Entity)
	}

	return result, err
}

type qfunc func(*gorm.DB) *gorm.DB

func (s store) list(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}
	wg.Wait()

	for i, d := range docs {
		s.populateAttachments(&d)

		docs[i] = d
	}

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

// UnwrapDeps preload the dependencies for the given entity.
func UnwrapDeps(st Store, entities []models.Document) (Dependencies, error) {
	var (
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	wg.Add(len(entities))

	for _, v := range entities {
		d := v
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, st, deps, m, e)
		}(d.Data.Dependencies())
	}
	wg.Wait()

	return convertFromSyncMap(m), newErrorMap(e)
}

func (s store) count(ctx context.Context, q qfunc) (int, error) {
	cdb := s.db.Model(s.new()).Table(s.new().TableName()).
		Select(fmt.Sprintf("COUNT(DISTINCT %q.*)", s.new().TableName()))
	cdb = q(cdb)

	var count int

	return count, cdb.Row().Scan(&count)
}

func (s store) Count(ctx context.Context, f Filter) (int, error) {
	return s.count(ctx, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) List(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.list(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) ListByMember(ctx context.Context, f Filter, ids ...uuid.UUID) ([]models.Document, Dependencies, int, error) {
	if len(ids) == 0 {
		return []models.Document{}, Dependencies{}, 0, nil
	}

	return s.list(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.member(s.search(q, f), ids...)
	})
}

func (s store) GetAttachment(ctx context.Context, doc *models.Document, filename string) (*models.Attachment, error) {
	var att models.Attachment
	err := s.db.Where(kv{"name": filename, "owner_id": doc.ID}).First(&att).Error
	if err != nil {
		WithIndex(err, filename, doc.ID.String())
	}
	return &att, err
}

func (s store) PutAttachment(ctx context.Context, _ *models.Document, att *models.Attachment) error {
	if err := s.validate.Struct(att); err != nil {
		return err
	}

	return s.db.Save(att).Error
}

func (s store) DeleteAttachment(ctx context.Context, doc *models.Document, filename string) error {
	att, err := s.GetAttachment(ctx, doc, filename)
	if err != nil {
		return err
	}

	return s.db.Delete(att).Error
}

func (s store) Unwrap(ctx context.Context, id uuid.UUID) (*models.Document, Dependencies, error) {
	return Unwrap(ctx, s, id)
}

func (s store) Update(ctx context.Context, d *models.Document) (*models.Document, error) {
	structs.New(d.Data).Field("Value").Field("ID").Set(d.ID)
	if err := s.validate.Struct(d.Data); err != nil {
		return nil, err
	}

	if err := verifyDependencies(ctx, s, d.Data); err != nil {
		return nil, err
	}

	err := s.db.Save(d.Data).Error
	if err != nil {
		return nil, err
	}
	doc := models.Wrap(d.Data)
	return doc, s.populateAttachments(doc)
}

// AtomicDelete tries to delete all given values in transaction and
// rolls it back on any error. Calling this on any store
// implementation other than psqlStore is a noop.
func AtomicDelete(s Store, values ...interface{}) error {
	ps, ok := s.(store)
	if !ok {
		return nil
	}

	tx := ps.db.Begin()
	defer tx.Commit()
	for _, value := range values {
		if err := tx.Delete(value).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return nil
}

// kv is just an alias to shorten gorm.DB.Where calls.
type kv = map[string]interface{}

func pattern(v string) string {
	return "%" + v + "%"
}

func (s store) Portfolio() Portfolio {
	return NewPortfolioStore(s.db)
}

func (s store) listByOssAdminID(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Where(kv{"oss_admin_id": f.OssAdminID}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}
	wg.Wait()

	for i, d := range docs {
		s.populateAttachments(&d)

		docs[i] = d
	}

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListByOssAdminID(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listByOssAdminID(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) listByOssAdminMenuType(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Where(kv{"menu_type": f.MenuType}).Where(kv{"oss_admin_id": f.OssAdminID}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}
	wg.Wait()

	for i, d := range docs {
		s.populateAttachments(&d)

		docs[i] = d
	}

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListByOssAdminMenuType(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listByOssAdminMenuType(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) listBackups(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Order("created_at ASC").Where(kv{"lang": f.Lang}).Where(kv{"menu_type": f.MenuType}).Where(kv{"backup_time": f.BackupTime}).Where(kv{"oss_admin_id": f.OssAdminID}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}
	wg.Wait()

	fmt.Printf("%d backup steps found\n", len(docs))

	for i, d := range docs {
		s.populateQuestions(&d)

		docs[i] = d
	}

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListBackups(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listBackups(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) populateQuestions(doc *models.Document) error {
	var questions []models.ResidentStepQuestionBackup
	if err := s.db.Where(kv{"step_id": doc.Data.(*models.OnboardingResidentStepBackup).ID}).Find(&questions).Error; err != nil {
		return WithID(err, doc.ID, "questions")
	}

	step := doc.Data.(*models.OnboardingResidentStepBackup)
	step.Questions = questions

	for i, quiz := range step.Questions {
		fields, err := s.populateFields(&quiz)
		if err != nil {
			return err
		}
		step.Questions[i].StepFields = fields
		_fields := step.Questions[i].StepFields
		for j, field := range _fields {
			options, err := s.populateOptions(field.ID)
			if err != nil {
				return err
			}
			step.Questions[i].StepFields[j].Options = options
		}
	}

	return nil
}

func (s store) populateFields(quiz *models.ResidentStepQuestionBackup) ([]models.OnboardingResidentStepFieldBackup, error) {
	var fields []models.OnboardingResidentStepFieldBackup
	if err := s.db.Where(kv{"question_id": quiz.ID}).Find(&fields).Error; err != nil {
		return nil, WithID(err, quiz.ID, "fields")
	}

	return fields, nil
}

func (s store) populateOptions(fieldID uuid.UUID) ([]models.StepFieldOptionBackup, error) {
	var options []models.StepFieldOptionBackup
	if err := s.db.Where(kv{"step_field_id": fieldID}).Find(&options).Error; err != nil {
		return nil, WithID(err, fieldID, "options")
	}

	return options, nil
}

func (s store) listSteps(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Order("created_at ASC").Where(kv{"lang": f.Lang}).Where(kv{"menu_type": f.MenuType}).Where(kv{"oss_admin_id": f.OssAdminID}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}

	for i, d := range docs {
		wg.Add(1)
		go func(i int, d models.Document) {
			defer wg.Done()
			s.populateStepQuestions(&d)

			docs[i] = d
		}(i, d)
	}
	wg.Wait()

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListSteps(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listSteps(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) populateStepQuestions(doc *models.Document) error {
	var questions []models.ResidentStepQuestion
	if err := s.db.Where(kv{"step_id": doc.Data.(*models.OnboardingResidentStep).ID}).Find(&questions).Error; err != nil {
		return WithID(err, doc.ID, "questions")
	}

	step := doc.Data.(*models.OnboardingResidentStep)
	step.Questions = questions

	for i, quiz := range step.Questions {
		fields, err := s.populateQuizFields(&quiz)
		if err != nil {
			return err
		}
		step.Questions[i].StepFields = fields
		_fields := step.Questions[i].StepFields
		for j, field := range _fields {
			options, err := s.populateFieldOptions(field.ID)
			if err != nil {
				return err
			}
			step.Questions[i].StepFields[j].Options = options
		}
	}

	return nil
}

func (s store) populateUserDataQuestions(doc *models.Document) error {
	var questions []models.ResidentStepQuestion
	if err := s.db.Where(kv{"step_id": doc.Data.(*models.OnboardingResidentStep).ID}).Find(&questions).Error; err != nil {
		return WithID(err, doc.ID, "questions")
	}

	step := doc.Data.(*models.OnboardingResidentStep)
	step.Questions = questions

	for i, quiz := range step.Questions {
		fields, err := s.populateQuizFields(&quiz)
		if err != nil {
			return err
		}
		step.Questions[i].StepFields = fields
		_fields := step.Questions[i].StepFields
		for j, field := range _fields {
			answers, err := s.populateAnswers(field.ID)
			if err != nil {
				return err
			}
			step.Questions[i].StepFields[j].Answers = answers
		}
	}

	return nil
}

func (s store) populateAnswers(fieldID uuid.UUID) ([]models.UserAnswer, error) {
	var answers []models.UserAnswer
	if err := s.db.Where(kv{"field_id": fieldID}).Find(&answers).Error; err != nil {
		return nil, WithID(err, fieldID, "options")
	}

	return answers, nil
}

func (s store) populateQuizFields(quiz *models.ResidentStepQuestion) ([]models.OnboardingResidentStepField, error) {
	var fields []models.OnboardingResidentStepField
	if err := s.db.Where(kv{"question_id": quiz.ID}).Find(&fields).Error; err != nil {
		return nil, WithID(err, quiz.ID, "fields")
	}

	return fields, nil
}

func (s store) populateFieldOptions(fieldID uuid.UUID) ([]models.StepFieldOption, error) {
	var options []models.StepFieldOption
	if err := s.db.Where(kv{"step_field_id": fieldID}).Find(&options).Error; err != nil {
		return nil, WithID(err, fieldID, "options")
	}

	return options, nil
}

func (s store) listBySession(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Order("created_at ASC").Where(kv{"session": f.Session}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}

	for i, d := range docs {
		wg.Add(1)
		go func(i int, d models.Document) {
			s.populateStepQuestions(&d)

			docs[i] = d
		}(i, d)
	}
	wg.Wait()

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListBySession(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listBySession(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}

func (s store) listUserDataSteps(ctx context.Context, f Filter, q qfunc) ([]models.Document, Dependencies, int, error) {
	rdb := f.GORM(s.db.Model(s.new()).Order("created_at ASC").Where(kv{"lang": f.Lang}).Where(kv{"menu_type": f.MenuType}).Where(kv{"oss_admin_id": f.OssAdminID}).Select(fmt.Sprintf("DISTINCT %q.*", s.new().TableName())))
	rdb = q(rdb)

	result, err := s.execList(ctx, rdb)
	if err != nil {
		return nil, nil, 0, err
	}

	var (
		c int
		m = new(sync.Map)
		e = new(sync.Map)

		wg sync.WaitGroup
	)

	docs := make([]models.Document, len(result))
	wg.Add(len(docs) + 1)
	go func() {
		defer wg.Done()
		c, err = s.count(ctx, q)
		if err != nil {
			e.Store("count", err)
		}
	}()
	for i, v := range result {
		d := models.Wrap(v)
		docs[i] = *d
		go func(deps []config.Dependency) {
			defer wg.Done()

			unwrap(ctx, s, deps, m, e)
		}(d.Data.Dependencies())
	}

	for i, d := range docs {
		wg.Add(1)
		go func(i int, d models.Document) {
			defer wg.Done()
			s.populateUserDataQuestions(&d)

			docs[i] = d
		}(i, d)
	}
	wg.Wait()

	return docs, convertFromSyncMap(m), c, newErrorMap(e)
}

func (s store) ListUserDataSteps(ctx context.Context, f Filter) ([]models.Document, Dependencies, int, error) {
	return s.listUserDataSteps(ctx, f, func(q *gorm.DB) *gorm.DB {
		return s.search(q, f)
	})
}
