package controller

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"path"
	"reflect"
	"sort"
	"strings"
	"time"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var (
	lowerCharSet   = "abcdedfghijklmnopqrst"
	upperCharSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	specialCharSet = "!@#$%&*"
	numberSet      = "0123456789"
	allCharSet     = lowerCharSet + upperCharSet + specialCharSet + numberSet
)

type SuccessMessage struct {
	Message string `json:"message"`
}

type EmailRequest struct {
	Email string `json:"email"`
}

type GetResTblRequest struct {
	BasicDetailsID string `json:"basic_details_id"`
	TotalYear      int    `json:"total_year"`
}

type OtpRequest struct {
	Email string `json:"email"`
	Otp   string `json:"otp"`
}

type GetRequest struct {
	OssAdminID string `json:"oss_admin_id"`
	Lang       string `json:"lang"`
}

type SetDefaultRequest struct {
	NewEmail string `json:"new_email"`
	MenuType string `json:"menu_type"`
	Lang     string `json:"lang"`
}

type FieldGetRequest struct {
	OssAdminID string    `json:"oss_admin_id"`
	Lang       string    `json:"lang"`
	StepID     uuid.UUID `json:"step_id"`
}

type MenuGetRequest struct {
	OssAdminID string `json:"oss_admin_id"`
	Lang       string `json:"lang"`
	MenuType   string `json:"menu_type"`
}

type GetOrganizationRequest struct {
	OssAdminID     string `json:"oss_admin_id"`
	OrganizationID string `json:"organization_id"`
	Lang           string `json:"lang"`
}

type OperatorResponse struct {
	Quality       float64 `json:"quality"`
	Speed         float64 `json:"speed"`
	Communication float64 `json:"communication"`
	TotalScore    float64 `json:"total_score"`
}

type TepmlateRequest struct {
	IsDefaultTemplate int    `json:"is_default_template"`
	OssAdminID        string `json:"oss_admin_id"`
	Lang              string `json:"lang"`
	MenuType          string `json:"menu_type"`
}

type BackupRequest struct {
	Title      string `json:"title"`
	OssAdminID string `json:"oss_admin_id"`
	MenuType   string `json:"menu_type"`
	Lang       string `json:"lang"`
}

type EesBackupRequest struct {
	Title      string `json:"title"`
	OssAdminID string `json:"oss_admin_id"`
	Lang       string `json:"lang"`
}

type PartnerRequest struct {
	OrganizationType int8   `json:"organization_type"`
	TypeOfServices   string `json:"type_of_services"`
	OssApproved      bool   `json:"oss_approved"`
	Country          string `json:"country"`
}

type EssBackupRequest struct {
	OssAdminID string `json:"oss_admin_id"`
	BackupTime string `json:"backup_time"`
	Lang       string `json:"lang"`
}

type BackupListingRequest struct {
	OssAdminID string `json:"oss_admin_id"`
	BackupTime string `json:"backup_time"`
	MenuType   string `json:"menu_type"`
	Lang       string `json:"lang"`
}

type BackupListing struct {
	BackupTitle string `json:"backup_title"`
	OssAdminID  string `josn:"oss_admin_id"`
	BackupTime  string `json:"backup_time"`
	MenuType    string `json:"menu_type"`
	Steps       int    `json:"steps"`
	Questions   int    `json:"questions"`
	Fields      int    `json:"fields"`
	Options     int    `json:"options"`
}

type EesBackupListing struct {
	BackupTitle      string `json:"backup_title"`
	OssAdminID       string `josn:"oss_admin_id"`
	BackupTime       string `json:"backup_time"`
	Steps            int    `json:"steps"`
	StepFields       int    `json:"step_fields"`
	StepResults      int    `json:"step_results"`
	Table2Results    int    `json:"oss_results"`
	ResultSubObjects int    `json:"result_sub_objects"`
}

type DashboardCount struct {
	ResidentsCount    int    `json:"residents_count"`
	AssociationsCount int    `json:"associations_count"`
	OperatorsCount    int    `json:"operators_count"`
	CalculatorsCount  int    `json:"calculators_count"`
	ChecklistCount    int    `json:"checklist_count"`
	ChecklistRefCount int    `json:"checklist_ref_count"`
	ProjectsCount     int    `json:"projects_count"`
	AssetsCount       int    `json:"assets_count"`
	EmployeesCount    int    `json:"employees_count"`
	OrganizationName  string `json:"organization_name"`
}

// 	user_ID: "c8dd07cf-e669-4df2-a79e-ca43ca229b73",
// 	organization_id: "7ac1d21a-8184-4438-8e80-db3e988c0394",
// 	organization_name: "TEST 5 OCT OSS",
// 	email: "ossadmin@gmail.com",
// 	country: "Germany"

type OssAdminUser struct {
	models.Value
	OrganizationName string         `json:"organization_name"`
	OrganizationID   uuid.UUID      `json:"organization_id"`
	UserID           uuid.UUID      `json:"user_id"`
	Email            string         `json:"email" validate:"email,required"`
	Country          models.Country `json:"country" validate:"required"`
}

type InsertManyRequest struct {
	FieldID   string `json:"field_id"`
	FieldName string `json:"field_name"`
	Lang      string `json:"lang"`
}

// GeneratePassword requires passwordLength, minSpecialChar, minNum, minUpperCase in that order
func GeneratePassword(passwordLength, minSpecialChar, minNum, minUpperCase int) string {
	var password strings.Builder

	//Set special character
	for i := 0; i < minSpecialChar; i++ {
		random := rand.Intn(len(specialCharSet))
		password.WriteString(string(specialCharSet[random]))
	}

	//Set numeric
	for i := 0; i < minNum; i++ {
		random := rand.Intn(len(numberSet))
		password.WriteString(string(numberSet[random]))
	}

	//Set uppercase
	for i := 0; i < minUpperCase; i++ {
		random := rand.Intn(len(upperCharSet))
		password.WriteString(string(upperCharSet[random]))
	}

	remainingLength := passwordLength - minSpecialChar - minNum - minUpperCase
	for i := 0; i < remainingLength; i++ {
		random := rand.Intn(len(allCharSet))
		password.WriteString(string(allCharSet[random]))
	}
	inRune := []rune(password.String())
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})
	return string(inRune)
}

func Log(ctx context.Context, session *sessions.Store, r *http.Request, tbl []string, mType, err, req string) error {

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnixMicro
	day := time.Now()
	cv := services.FromContext(ctx)
	usr := cv.User
	ss := services.Session(*session, r)
	lines := []string{
		fmt.Sprintf("\n\n\n%v\n", strings.Repeat("#", 100)),
		fmt.Sprintf("REQUEST TYPE: \t%s\n", req),
		fmt.Sprintf("Tables Queried: \t%v\n", tbl),
		fmt.Sprintf("%v\n", strings.Repeat("*", 100)),
		fmt.Sprintf("Loggedin ID: \t%s\n", usr.Email),
		fmt.Sprintf("Date & Time: \t%s\n", day),
		fmt.Sprintf("Session ID: \t%s\n", ss.Values["id"]),
		fmt.Sprintf("Session DocID: \t%s\n", ss.Values["uuid"]),
		fmt.Sprintf("Is Admin User: \t%v\n", usr.IsOssAdmin),
		fmt.Sprintf("Is Superuser: \t%v\n", usr.SuperUser),
		fmt.Sprintf("Is Platform Manager: \t%v\n", usr.PlatformManager),
		fmt.Sprintf("Is Admin NW Manager: \t%v\n", usr.AdminNwManager),
		fmt.Sprintf("Menu Type: \t%s\n", mType),
		fmt.Sprintf("Error: \t%s\n", err),
		fmt.Sprintf("Origin Path: \t%s\n", ss.Options.Path),
		fmt.Sprintf("Origin Domain: \t%s\n", ss.Options.Domain),
		fmt.Sprintf("Origin SameSite: \t%v\n\n\n\n", ss.Options.SameSite),
	}

	log.Info().
		Str("REQUEST TYPE:", req).
		Str("Tables Queried:", strings.Join(tbl, " | ")).
		Str("Loggedin ID:", usr.Email).
		Interface("Session ID:", ss.Values["id"]).
		Interface("Session DocID:", ss.Values["uuid"]).
		Interface("Is Admin User:", usr.IsOssAdmin).
		Bool("Is Superuser:", usr.SuperUser).
		Bool("Is Platform Manager:", usr.PlatformManager).
		Bool("Is Admin NW Manager:", usr.AdminNwManager).
		Str("Menu Type:", mType).
		Str("Error:", err).
		Str("Origin Path:", ss.Options.Path).
		Str("Origin Domain:", ss.Options.Domain).
		Interface("Origin SameSite:", ss.Options.SameSite).
		Msg("Endpoint: /backup/step/question/field/options")

	y, m, d := day.Date()
	fName := fmt.Sprintf("%s:%v|%v|%v.txt", strings.Split(usr.Email, "@")[0], d, m, y)

	dir := path.Join("logs", fName)

	if err := WriteToFile(lines, dir); err != nil {
		return errors.New("Couldn't create log file.")
	}
	return nil
}

func WriteToFile(lines []string, fileDir string) error {
	f, err := os.Create(fileDir)
	if err != nil {
		return err
	}
	// remember to close the file
	defer f.Close()

	for _, line := range lines {
		_, err := f.WriteString(line + "\n")
		if err != nil {
			return err
		}
	}
	return nil
}

func SortByIndex(slice interface{}, fieldName string) error {
	v := reflect.ValueOf(slice)
	if v.Kind() != reflect.Slice {
		return fmt.Errorf("got %T, expected slice", slice)
	}

	// Get slice element type.
	t := v.Type().Elem()

	// Handle pointer to struct.
	indirect := t.Kind() == reflect.Ptr
	if indirect {
		t = t.Elem()
	}
	if t.Kind() != reflect.Struct {
		return fmt.Errorf("got %T, expected slice of struct or pointer to struct", slice)
	}

	// Find the field.
	sf, ok := t.FieldByName(fieldName)
	if !ok {
		return fmt.Errorf("field name %s not found", fieldName)
	}

	// Create a less function based on the field's kind.
	var less func(a, b reflect.Value) bool
	switch sf.Type.Kind() {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		less = func(a, b reflect.Value) bool { return a.Int() < b.Int() }
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		less = func(a, b reflect.Value) bool { return a.Uint() < b.Uint() }
	case reflect.Float32, reflect.Float64:
		less = func(a, b reflect.Value) bool { return a.Float() < b.Float() }
	case reflect.String:
		less = func(a, b reflect.Value) bool { return a.String() < b.String() }
	case reflect.Bool:
		less = func(a, b reflect.Value) bool { return !a.Bool() && b.Bool() }
	default:
		return fmt.Errorf("field type %s not supported", sf.Type)
	}

	// Sort it!
	sort.Slice(slice, func(i, j int) bool {
		a := v.Index(i)
		b := v.Index(j)
		if indirect {
			a = a.Elem()
			b = b.Elem()
		}
		a = a.FieldByIndex(sf.Index)
		b = b.FieldByIndex(sf.Index)
		return less(a, b)
	})
	return nil
}

func SimpleJSONToFieldName(t reflect.Type, name string) (string, bool) {
	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		n := strings.Split(sf.Tag.Get("json"), ",")[0]
		if n == "" {
			n = strings.ToLower(sf.Name)
		}
		if n == name {
			return sf.Name, true
		}
	}
	return "", false
}
