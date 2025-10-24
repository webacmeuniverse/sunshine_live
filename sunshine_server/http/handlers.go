package http

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"

	"acme.universe/sunshine/sunshine"
	"acme.universe/sunshine/sunshine/graphql"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"
	"acme.universe/sunshine/sunshine/services"

	sentryhttp "github.com/getsentry/sentry-go/http"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

const (
	uuidRe      = "{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}"
	countHeader = "X-Documents-Count"
	filenameRe  = `{filename:.+}`
)

var (
	_, b, _, _ = runtime.Caller(0)
	basepath   = filepath.Dir(b)
)

// New returns a new handler which a *http.ServeMux with applied
// middlewares.
func New(env *services.Env) http.Handler {
	var (
		auth                        = NewAuth(env)
		authfp                      = newAuthfp(env)
		user                        = newUser(env)
		step                        = newStepItem(env)
		stepsResult                 = newStepsResult(env)
		userResult                  = newUserResult(env)
		userResultBasic             = newUserResultBasic(env)
		eesCalcBackup               = newEesCalcBackup(env)
		getResult1                  = newGetResultTbl1(env)
		getResult2                  = newGetResultTbl2(env)
		ossAdmins                   = newOssAdminsList(env)
		onboardingResidentStep      = newOnboardingResidentStep(env)
		onboardingResidentStepField = newOnboardingResidentStepField(env)
		onboardingHousingStep       = newOnboardingHousingStep(env)
		onboardingHousingStepField  = newOnboardingHousingStepField(env)
		stepFieldOption             = newStepFieldOption(env)
		ossEesResTbl2               = newOssEesResultTbl2(env)
		ossEesResTbl2YearFormula    = newOssEesResultTbl2YearFormula(env)
		onboardingResidentQuestion  = newOnboardingResidentQuestion(env)
		onboardingHousingQuestion   = newOnboardingHousingQuestion(env)
		userInputData               = newUserInputData(env)
		ossEesUserRecord            = newOssEesUserRecord(env)
		onboardingUserData          = newOnboardingUserData(env)
		bookACall                   = newBookACall(env)
		supportAPI                  = newSupportAPI(env)
		sendMail                    = newSendMail(env)
		replyMail                   = newReplyMail(env)
		stepBackup                  = newOnboardingResidentStepBackup(env)
		org                         = newOrg(env)
		placeholder                 = newPlaceholder(env)
		setDefault                  = newSetDefaultTemp(env)
		userOtp                     = newUserOtp(env)
		orgRating                   = newOrganizationRating(env)
		renovateCalc                = newRenovateCalcInput(env)
		subscribers                 = newSubscribers(env)
		onboardDescr                = newOnboardingDescription(env)
		certDetails                 = newEnergyCertDetail(env)
		certCategory                = NewEnergyCertCategory(env)
		certReduction               = NewEnergyCertReduction(env)
		certFile                    = NewEnergyCertFile(env)
		masterTemplate              = newMasterTemplate(env)
		asset                       = newAsset(env)
		proj                        = newProject(env)
		meet                        = newMeeting(env)
		contr                       = newContractHandler(env)
		stats                       = newStats(env)
		wp                          = newWP(env)
		mp                          = newMP(env)
		gd                          = newGDPR(env)
		gqlh                        = graphql.Handler(env)
		fa                          = newForfaitingApplication(env)
		mux                         = mux.NewRouter().StrictSlash(true).UseEncodedPath()
	)

	mux.HandleFunc("/debug/ping", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintf(w, "version=%s\ngo=%s\n", sunshine.Version(), runtime.Version())
	})
	mux.HandleFunc("/openapi.json", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(basepath, "..", "openapi.json"))
	})
	mux.Handle("/", graphql.Playground("Sunshine API console", "/query"))
	mux.HandleFunc("/graphiql", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Del("Content-Type")
		graphql.Graphiql("/query")(w, r)
	})

	mux.Handle("/user", handlers.MethodHandler{
		"GET":  http.HandlerFunc(user.list),
		"POST": http.HandlerFunc(user.create), // no auth
	})
	mux.Handle("/user/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(user.get),
		"PUT": http.HandlerFunc(user.update),
	})
	mux.Handle("/user/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(user.upload),
	})
	mux.Handle("/user/"+uuidRe+"/assets", handlers.MethodHandler{
		"GET": http.HandlerFunc(asset.list),
	})
	mux.Handle("/user/"+uuidRe+"/my-assets", handlers.MethodHandler{
		"GET": http.HandlerFunc(asset.listMyAssets),
	})
	mux.Handle("/user/"+uuidRe+"/approved-assets", handlers.MethodHandler{
		"GET": http.HandlerFunc(asset.listApprovedAssets),
	})
	mux.Handle("/user/"+uuidRe+"/organizations", handlers.MethodHandler{
		"GET": http.HandlerFunc(org.list),
	})
	mux.Handle("/user/"+uuidRe+"/projects", handlers.MethodHandler{
		"GET": http.HandlerFunc(proj.list),
	})
	mux.Handle("/user/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(user.delFile),
		"GET":    http.HandlerFunc(user.getFile),
		"HEAD":   http.HandlerFunc(user.getFile),
	})

	mux.Handle("/user/reports", handlers.MethodHandler{
		"GET": http.HandlerFunc(user.reports),
	})
	mux.Handle("/auth/login", handlers.MethodHandler{
		"POST": http.HandlerFunc(auth.login),
	})
	mux.Handle("/auth/change_password", handlers.MethodHandler{
		"POST": http.HandlerFunc(auth.changePassword),
	})
	mux.Handle("/auth/forgotten_password", handlers.MethodHandler{
		"POST": http.HandlerFunc(authfp.declare),
	})
	mux.Handle("/auth/forgotten_password/"+uuidRe, handlers.MethodHandler{
		"GET":  http.HandlerFunc(authfp.confirm),
		"POST": http.HandlerFunc(authfp.change),
	})
	mux.Handle("/auth/logout", handlers.MethodHandler{
		"GET": http.HandlerFunc(auth.Logout),
	})
	mux.Handle("/confirm_user/"+uuidRe, handlers.MethodHandler{
		"POST": http.HandlerFunc(auth.confirm),
	})

	mux.Handle("/organization", handlers.MethodHandler{
		"GET":  http.HandlerFunc(org.list),
		"POST": http.HandlerFunc(org.create),
	})
	mux.Handle("/organization/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(org.get), // no auth
		"PUT": http.HandlerFunc(org.update),
	})
	mux.Handle("/organization/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(org.upload),
	})
	mux.Handle("/organization/"+uuidRe+"/roles", handlers.MethodHandler{
		"POST":   http.HandlerFunc(org.addRole),
		"DELETE": http.HandlerFunc(org.removeRole),
	})
	mux.Handle("/organization/"+uuidRe+"/meetings", handlers.MethodHandler{
		"GET": http.HandlerFunc(org.getMeetings),
	})
	mux.Handle("/organization/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(org.delFile),
		"GET":    http.HandlerFunc(org.getFile),
		"HEAD":   http.HandlerFunc(org.getFile),
	})

	mux.Handle("/asset", handlers.MethodHandler{
		"GET":  http.HandlerFunc(asset.list),
		"POST": http.HandlerFunc(asset.create),
	})
	mux.Handle("/asset/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(asset.get),
		"PUT": http.HandlerFunc(asset.update),
	})
	mux.Handle("/asset/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(asset.upload),
	})
	mux.Handle("/asset/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(asset.delFile),
		"GET":    http.HandlerFunc(asset.getFile),
		"HEAD":   http.HandlerFunc(asset.getFile),
	})

	mux.Handle("/project", handlers.MethodHandler{
		"GET":  http.HandlerFunc(proj.list),
		"POST": http.HandlerFunc(proj.create),
	})
	mux.Handle("/project/reports", handlers.MethodHandler{
		"GET": http.HandlerFunc(proj.reports),
	})
	mux.Handle("/project/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(proj.get),
		"PUT": http.HandlerFunc(proj.update),
	})
	mux.Handle("/project/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(proj.upload),
	})
	mux.Handle("/project/"+uuidRe+"/download/english",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadEnglishPDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/download/native",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadNativePDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/tex/english",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadEnglishTeX),
		},
	)
	mux.Handle("/project/"+uuidRe+"/tex/native",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadNativeTeX),
		},
	)
	mux.Handle("/project/"+uuidRe+"/agreement/download/native",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadNativeAgreementPDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/agreement/download/english",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadEnglishAgreementPDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/annex-n/download/native",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadNativeAnnexNPDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/annex-n/download/english",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadEnglishAnnexNPDF),
		},
	)
	mux.Handle("/project/"+uuidRe+"/agreement/tex/native",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadNativeAgreementTex),
		},
	)
	mux.Handle("/project/"+uuidRe+"/agreement/tex/english",
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.downloadEnglishAgreementTex),
		},
	)
	mux.Handle("/project/"+uuidRe+"/agreement/fields",
		handlers.MethodHandler{
			"PUT": http.HandlerFunc(contr.updateAgreement),
			"GET": http.HandlerFunc(contr.getAgreement),
		},
	)
	mux.Handle("/project/"+uuidRe+"/fields",
		handlers.MethodHandler{
			"PUT": http.HandlerFunc(contr.updateFields),
			"GET": http.HandlerFunc(contr.getFields),
		},
	)
	mux.Handle("/project/"+uuidRe+"/maintenance/fields",
		handlers.MethodHandler{
			"PUT": http.HandlerFunc(contr.updateMaintenance),
			"GET": http.HandlerFunc(contr.getMaintenance),
		},
	)

	mux.Handle("/project/"+uuidRe+"/indoorclima", handlers.MethodHandler{
		"GET": http.HandlerFunc(contr.getIndoorClima),
		"PUT": http.HandlerFunc(contr.updateIndoorClima),
	})
	mux.Handle("/project/"+uuidRe+`/markdown`,
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.getMarkdown),
			"PUT": http.HandlerFunc(contr.updateMarkdown),
		},
	)
	mux.Handle("/project/"+uuidRe+`/roles`,
		handlers.MethodHandler{
			"POST":   http.HandlerFunc(proj.addRole),
			"DELETE": http.HandlerFunc(proj.removeRole),
		},
	)
	mux.Handle("/project/"+uuidRe+"/meetings", handlers.MethodHandler{
		"GET": http.HandlerFunc(proj.getMeetings),
	})

	mux.Handle("/project/"+uuidRe+`/annex{n:[0-9]+}/{table:[0-9a-zA-Z_]+}`,
		handlers.MethodHandler{
			"GET": http.HandlerFunc(contr.getTable),
			"PUT": http.HandlerFunc(contr.updateTable),
		},
	)
	mux.Handle("/project/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(proj.delFile),
		"GET":    http.HandlerFunc(proj.getFile),
		"HEAD":   http.HandlerFunc(proj.getFile),
	})

	mux.Handle("/gdpr/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(gd.upload),
	})
	mux.Handle("/gdpr/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(gd.delFile),
		"GET":    http.HandlerFunc(gd.getFile),
		"HEAD":   http.HandlerFunc(gd.getFile),
	})

	mux.Handle("/country_stats", handlers.MethodHandler{
		"GET": http.HandlerFunc(stats.getCountryStats),
	})

	mux.Handle("/meeting/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(meet.upload),
	})
	mux.Handle("/meeting/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(meet.delFile),
		"GET":    http.HandlerFunc(meet.getFile),
		"HEAD":   http.HandlerFunc(meet.getFile),
	})

	mux.Handle("/forfaitinga/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(fa.upload),
	})
	mux.Handle("/forfaitinga/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(fa.delFile),
		"GET":    http.HandlerFunc(fa.getFile),
		"HEAD":   http.HandlerFunc(fa.getFile),
	})

	mux.Handle("/workphase/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(wp.getWP),
	})
	mux.Handle("/workphase/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(wp.uploadWP),
	})
	mux.Handle("/workphase/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(wp.delFileWP),
		"GET":    http.HandlerFunc(wp.getFileWP),
		"HEAD":   http.HandlerFunc(wp.getFileWP),
	})

	mux.Handle("/monitoringphase/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(mp.getMP),
	})
	mux.Handle("/monitoringphase/"+uuidRe+"/upload", handlers.MethodHandler{
		"POST": http.HandlerFunc(mp.uploadMP),
	})
	mux.Handle("/monitoringphase/"+uuidRe+"/"+filenameRe, handlers.MethodHandler{
		"DELETE": http.HandlerFunc(mp.delFileMP),
		"GET":    http.HandlerFunc(mp.getFileMP),
		"HEAD":   http.HandlerFunc(mp.getFileMP),
	})
	// create new step item
	// list all steps
	mux.Handle("/step", handlers.MethodHandler{
		"GET":  http.HandlerFunc(step.list),
		"POST": http.HandlerFunc(step.create),
	})
	// update step call
	// delete step call
	mux.Handle("/step/"+uuidRe, handlers.MethodHandler{
		"PUT":    http.HandlerFunc(step.update),
		"DELETE": http.HandlerFunc(step.delStep),
	})
	// create step-field item
	// list step-fields
	// update step-field call
	// delete step-field call
	mux.Handle("/step/"+uuidRe+"/field", handlers.MethodHandler{
		"GET":    http.HandlerFunc(step.get),
		"POST":   http.HandlerFunc(step.addField),
		"DELETE": http.HandlerFunc(step.delField),
		"PUT":    http.HandlerFunc(step.updateField),
	})
	// create new steps-result item
	// list all steps-result items
	mux.Handle("/step/result", handlers.MethodHandler{
		"POST": http.HandlerFunc(stepsResult.create),
		"GET":  http.HandlerFunc(stepsResult.list),
	})
	// get individual steps-result object
	// update steps-result item call
	// delete steps-result item call
	mux.Handle("/step/result/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(stepsResult.get),
		"PUT":    http.HandlerFunc(stepsResult.update),
		"DELETE": http.HandlerFunc(stepsResult.delStepResult),
	})
	// create new user-step-result item
	// list all user-step-result items
	mux.Handle("/step/result/user", handlers.MethodHandler{
		"POST": http.HandlerFunc(userResult.create),
		"GET":  http.HandlerFunc(userResult.list),
	})
	// get individual user-step-result object
	// update user-step-result item call
	// delete user-step-result item call
	mux.Handle("/step/result/user/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(userResult.get),
		"PUT":    http.HandlerFunc(userResult.update),
		"DELETE": http.HandlerFunc(userResult.delUserResult),
	})
	// create step-result-subitem
	// delete step-result-subitem
	mux.Handle("/step/result/subitem/"+uuidRe, handlers.MethodHandler{
		"POST":   http.HandlerFunc(stepsResult.createSubObject),
		"DELETE": http.HandlerFunc(stepsResult.delField),
	})
	// create multiple step result sub items
	mux.Handle("/step/result/subitems", handlers.MethodHandler{
		"POST": http.HandlerFunc(stepsResult.createSubObjects),
	})
	// create new user-basic-details item
	// list all user-basic-details items
	mux.Handle("/user/input/result", handlers.MethodHandler{
		"POST": http.HandlerFunc(userResultBasic.create),
		"GET":  http.HandlerFunc(userResultBasic.list),
	})
	// get individual user-basic-details object
	// update user-basic-details item call
	// delete user-basic-details item call
	mux.Handle("/user/input/result/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(userResultBasic.get),
		"PUT":    http.HandlerFunc(userResultBasic.update),
		"DELETE": http.HandlerFunc(userResultBasic.delUserResultBasic),
	})
	// add new user-result-calculation
	// delete existing user-result-calculation
	mux.Handle("/user/input/result/"+uuidRe+"/calculation", handlers.MethodHandler{
		"POST":   http.HandlerFunc(userResultBasic.createCalcObject),
		"DELETE": http.HandlerFunc(userResultBasic.delUserCalc),
	})
	// create new ees-calc backup
	// get all existing ees-calc backups
	// restore ees-calc from exisitng backup
	mux.Handle("/backup/restore/ees/calculator", handlers.MethodHandler{
		"POST": http.HandlerFunc(eesCalcBackup.create),
		"GET":  http.HandlerFunc(eesCalcBackup.list),
		"PUT":  http.HandlerFunc(eesCalcBackup.restore),
	})
	// create new get-result-tbl1 item
	mux.Handle("/get/result/tbl1", handlers.MethodHandler{
		"POST": http.HandlerFunc(getResult1.create),
	})
	// create get-result-tbl2 item
	// list get-result-tbl2 items
	mux.Handle("/get/result/tbl2", handlers.MethodHandler{
		"POST": http.HandlerFunc(getResult2.create),
		"GET":  http.HandlerFunc(getResult2.list),
	})
	// create get-result-tbl2 year-value
	// get individual get-result-tbl2 item
	// update get-result-tbl2 entry
	// delete get-result-tbl2 item
	mux.Handle("/get/result/tbl2/"+uuidRe, handlers.MethodHandler{
		"POST":   http.HandlerFunc(getResult2.createYearValue),
		"GET":    http.HandlerFunc(getResult2.get),
		"PUT":    http.HandlerFunc(getResult2.update),
		"DELETE": http.HandlerFunc(getResult2.delGetResult),
	})
	// get all oss admins
	// get oss admin dashboard/count
	mux.Handle("/oss/admins", handlers.MethodHandler{
		"GET": http.HandlerFunc(ossAdmins.list), // no auth
		"PUT": http.HandlerFunc(ossAdmins.counts),
	})
	// get all users for a specific oss admin
	mux.Handle("/oss/admins/users", handlers.MethodHandler{
		"GET": http.HandlerFunc(ossAdmins.users),
	})
	// post new onboarding-residents-step
	// list all onboarding-residents-step
	mux.Handle("/onboarding/residents/step", handlers.MethodHandler{
		"POST": http.HandlerFunc(onboardingResidentStep.create),
		"PUT":  http.HandlerFunc(onboardingResidentStep.list), // no auth
	})
	// get single onboarding-residents-step
	// update onboarding-residents-step
	// delete onboarding-residents-step
	mux.Handle("/onboarding/residents/step/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(onboardingResidentStep.get),
		"PUT":    http.HandlerFunc(onboardingResidentStep.update),
		"DELETE": http.HandlerFunc(onboardingResidentStep.delOnboardingResidentStep),
	})
	// create onboarding-resident-step-user-data answer
	// get onboarding-resident-step-user-data answers
	mux.Handle("/user/data/step/"+uuidRe, handlers.MethodHandler{
		"GET":  http.HandlerFunc(onboardingResidentStep.getUserDataStep),
		"POST": http.HandlerFunc(onboardingResidentStep.postUserDataAnswer),
	})
	// list all onboarding-residents-step-field
	mux.Handle("/onboarding/residents/field", handlers.MethodHandler{
		"GET": http.HandlerFunc(onboardingResidentStepField.list),
	})
	// post new onboarding-residents-step-field
	// get single onboarding-residents-step-field
	// update onboarding-residents-step-field
	// delete onboarding-residents-step-field
	mux.Handle("/onboarding/residents/field/"+uuidRe, handlers.MethodHandler{
		"POST":   http.HandlerFunc(onboardingResidentStepField.create),
		"GET":    http.HandlerFunc(onboardingResidentStepField.get),
		"PUT":    http.HandlerFunc(onboardingResidentStepField.update),
		"DELETE": http.HandlerFunc(onboardingResidentStepField.delOnboardingResidentStepField),
	})
	// list all onboarding-housing-step
	// post new onboarding-housing-step
	mux.Handle("/onboarding/housing/step", handlers.MethodHandler{
		"PUT":  http.HandlerFunc(onboardingHousingStep.list),
		"POST": http.HandlerFunc(onboardingHousingStep.create),
	})
	// get single onboarding-housing-step
	// update onboarding-housing-step
	// delete onboarding-housing-step
	mux.Handle("/onboarding/housing/step/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(onboardingHousingStep.get),
		"PUT":    http.HandlerFunc(onboardingHousingStep.update),
		"DELETE": http.HandlerFunc(onboardingHousingStep.delOnboardingHousingStep),
	})
	// get single onboarding-housing-step
	// update onboarding-housing-step
	// delete onboarding-housing-step
	mux.Handle("/onboarding/housing/field/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(onboardingHousingStepField.get),
		"POST":   http.HandlerFunc(onboardingHousingStepField.create),
		"PUT":    http.HandlerFunc(onboardingHousingStepField.update),
		"DELETE": http.HandlerFunc(onboardingHousingStepField.delOnboardingHousingStepField),
	})
	// get single step-field-option item
	// post new step-field-option item
	// update existing step-field-option item
	// delete existing step-field-option item
	mux.Handle("/step/field/option/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(stepFieldOption.get),
		"POST":   http.HandlerFunc(stepFieldOption.create),
		"PUT":    http.HandlerFunc(stepFieldOption.update),
		"DELETE": http.HandlerFunc(stepFieldOption.delStepFieldOption),
	})
	// list all oss-ees-result items
	// post new oss-ees-result item
	mux.Handle("/oss/ees/tbl2", handlers.MethodHandler{
		"PUT":  http.HandlerFunc(ossEesResTbl2.list),
		"POST": http.HandlerFunc(ossEesResTbl2.create),
	})
	// get single oss-ees-result item
	// update oss-ees-result item
	// delete oss-ees-result item
	mux.Handle("/oss/ees/tbl2/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(ossEesResTbl2.get),
		"PUT":    http.HandlerFunc(ossEesResTbl2.update),
		"DELETE": http.HandlerFunc(ossEesResTbl2.delOssEssResult),
	})
	// create oss-ees-result-year-formula item
	// delete oss-ees-result-year-formula item
	mux.Handle("/oss/ees/tbl2/"+uuidRe+"/year", handlers.MethodHandler{
		"POST":   http.HandlerFunc(ossEesResTbl2YearFormula.create),
		"DELETE": http.HandlerFunc(ossEesResTbl2YearFormula.delOssEssTbl2YearFormula),
		"PUT":    http.HandlerFunc(ossEesResTbl2YearFormula.insertMany),
	})
	// list all onboarding-resident-step-question items
	// post new onboarding-resident-step-question item
	mux.Handle("/onboarding/resident/question", handlers.MethodHandler{
		"GET":  http.HandlerFunc(onboardingResidentQuestion.list),
		"POST": http.HandlerFunc(onboardingResidentQuestion.create),
	})
	// get single onboarding-resident-step-question item
	// update onboarding-resident-step-question item
	// delete onboarding-resident-step-question item
	mux.Handle("/onboarding/resident/question/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(onboardingResidentQuestion.get),
		"PUT":    http.HandlerFunc(onboardingResidentQuestion.update),
		"DELETE": http.HandlerFunc(onboardingResidentQuestion.delOnboardingResidentQuestion),
	})
	// list all onboarding-housing-step-question items
	// post new onboarding-housing-step-question item
	mux.Handle("/onboarding/housing/question", handlers.MethodHandler{
		"GET":  http.HandlerFunc(onboardingHousingQuestion.list),
		"POST": http.HandlerFunc(onboardingHousingQuestion.create),
	})
	// get single onboarding-housing-step-question item
	// update onboarding-housing-step-question item
	// delete onboarding-housing-step-question item
	mux.Handle("/onboarding/housing/question/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(onboardingHousingQuestion.get),
		"PUT":    http.HandlerFunc(onboardingHousingQuestion.update),
		"DELETE": http.HandlerFunc(onboardingHousingQuestion.delOnboardingHousingQuestion),
	})
	// list all user-input-data items
	// post new user-input-data item
	mux.Handle("/user/input/data", handlers.MethodHandler{
		"GET":  http.HandlerFunc(userInputData.list),
		"POST": http.HandlerFunc(userInputData.create), // no auth
	})
	// get single user-input-data item
	// update user-input-data item
	// delete user-input-data item
	mux.Handle("/user/input/data/"+uuidRe, handlers.MethodHandler{
		"GET":    http.HandlerFunc(userInputData.get),
		"PUT":    http.HandlerFunc(userInputData.update),
		"DELETE": http.HandlerFunc(userInputData.delUserInputData),
	})
	// /oss/eesUserRecord
	mux.Handle("/oss/ees/user/record", handlers.MethodHandler{
		"GET": http.HandlerFunc(ossEesUserRecord.list),
	})
	// create onboarding/user/data
	// list onboarding/user/data items
	mux.Handle("/onboarding/user/data", handlers.MethodHandler{
		"POST": http.HandlerFunc(onboardingUserData.create), // no auth
		"GET":  http.HandlerFunc(onboardingUserData.list),
	})
	// get onboarding/user/data
	// update onboarding/user/data item
	mux.Handle("/onboarding/user/data/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(onboardingUserData.listInputs), // no auth
		"PUT": http.HandlerFunc(onboardingUserData.update),
	})
	// onboarding/user/data check if user exists
	mux.Handle("/onboarding/user/check", handlers.MethodHandler{
		"GET": http.HandlerFunc(onboardingUserData.check), // no auth
	})
	// create backup/step/question/field/options item
	// list backup/step/question/field/options items
	// update backup/step/question/field/option item
	mux.Handle("/backup/step/question/field/options", handlers.MethodHandler{
		"POST": http.HandlerFunc(stepBackup.create),
		"GET":  http.HandlerFunc(stepBackup.get),
		"PUT":  http.HandlerFunc(stepBackup.restore),
	})
	// create book/a/call entry
	// list book/a/call entries
	mux.Handle("/book/a/call", handlers.MethodHandler{
		"POST": http.HandlerFunc(bookACall.create), // no auth
		"GET":  http.HandlerFunc(bookACall.list),
	})
	// create support/api item
	// list support/api items
	mux.Handle("/support/api", handlers.MethodHandler{
		"POST": http.HandlerFunc(supportAPI.create),
		"GET":  http.HandlerFunc(supportAPI.list),
	})
	// post to send new mail
	// put to upload new pdf file to server
	mux.Handle("/send/mail", handlers.MethodHandler{
		"POST": http.HandlerFunc(sendMail.create), // no auth
		"PUT":  http.HandlerFunc(sendMail.upload),
	})
	// post to send reply/mail item
	// list reply/mail items
	// get one reply/mail item
	mux.Handle("/reply/mail", handlers.MethodHandler{
		"GET":  http.HandlerFunc(replyMail.list),
		"POST": http.HandlerFunc(replyMail.create),
		"PUT":  http.HandlerFunc(replyMail.get),
	})
	// find/my/partner API endpoints
	mux.Handle("/find/my/partner", handlers.MethodHandler{
		"PUT": http.HandlerFunc(org.findPartner), // no auth
	})
	// create master/template item
	// list master/template items
	mux.Handle("/master/template", handlers.MethodHandler{
		"POST": http.HandlerFunc(masterTemplate.create),
		"GET":  http.HandlerFunc(masterTemplate.get),
	})
	// create placeholder/master item
	// list placeholder/master item
	mux.Handle("/master/placeholder", handlers.MethodHandler{
		"GET":  http.HandlerFunc(placeholder.list),
		"POST": http.HandlerFunc(placeholder.create),
	})
	// set step + description default temp from oss-admin
	// set ess default template from oss-admin
	mux.Handle("/set/default/temp", handlers.MethodHandler{
		"POST": http.HandlerFunc(setDefault.create),
		"PUT":  http.HandlerFunc(setDefault.createEss),
	})
	// send otp verification
	// confirm existing otp
	mux.Handle("/user/otp", handlers.MethodHandler{
		"POST": http.HandlerFunc(userOtp.send),    // no auth
		"GET":  http.HandlerFunc(userOtp.confirm), // no auth
	})
	// create operator rating
	// list operator ratings
	mux.Handle("/organization/rating", handlers.MethodHandler{
		"POST": http.HandlerFunc(orgRating.create), // no auth
		"GET":  http.HandlerFunc(orgRating.list),   // no auth
	})
	// get renovation-calc-input items using baseDets obj ID
	mux.Handle("/renovation/calc/input/"+uuidRe, handlers.MethodHandler{
		"GET": http.HandlerFunc(renovateCalc.list),
	})
	// create subscriber
	// list subscribers
	mux.Handle("/subscribe", handlers.MethodHandler{
		"POST": http.HandlerFunc(subscribers.create), // no auth
		"GET":  http.HandlerFunc(subscribers.list),
	})
	// create onboarding-description
	// list onboarding-description(s) with params[oss, lang, menu-type, def-temp]
	mux.Handle("/onboarding/description", handlers.MethodHandler{
		"POST": http.HandlerFunc(onboardDescr.create),
		"GET":  http.HandlerFunc(onboardDescr.list),
	})

	mux.Handle("/energy/cert/details", handlers.MethodHandler{
		"POST":   http.HandlerFunc(certDetails.create),
		"GET":    http.HandlerFunc(certDetails.get),
		"PUT":    http.HandlerFunc(certDetails.update),
		"DELETE": http.HandlerFunc(certDetails.delEnergyCertDetail),
	})

	mux.Handle("/energy/cert/category", handlers.MethodHandler{
		"POST":   http.HandlerFunc(certCategory.create),
		"PUT":    http.HandlerFunc(certCategory.update),
		"GET":    http.HandlerFunc(certCategory.get),
		"DELETE": http.HandlerFunc(certCategory.delEnergyCertCategory),
	})

	mux.Handle("/energy/cert/reduction", handlers.MethodHandler{
		"POST":   http.HandlerFunc(certReduction.create),
		"PUT":    http.HandlerFunc(certReduction.update),
		"GET":    http.HandlerFunc(certReduction.get),
		"DELETE": http.HandlerFunc(certReduction.delEnergyCertReduction),
	})

	mux.Handle("/energy/cert/file/"+uuidRe, handlers.MethodHandler{
		"POST":   http.HandlerFunc(certFile.create),
		"GET":    http.HandlerFunc(certFile.get),
		"DELETE": http.HandlerFunc(certFile.delEnergyCertFile),
	})

	mux.Handle("/energy/file/"+uuidRe+"/cert", handlers.MethodHandler{
		"GET": http.HandlerFunc(certFile.getFile),
	})

	mux.Handle("/query", gqlh)
	mux.Use(func(h http.Handler) http.Handler { return authMiddleware(h, env) })
	var h http.Handler = mux
	sentryHandler := sentryhttp.New(sentryhttp.Options{
		Repanic:         false,
		WaitForDelivery: true,
	})
	if len(env.General.AllowedOrigins) > 0 {
		h = handlers.CORS(
			handlers.AllowCredentials(),
			handlers.AllowedHeaders([]string{"Content-Type"}),
			handlers.AllowedOrigins(env.General.AllowedOrigins),
			handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"}),
			handlers.ExposedHeaders([]string{"X-Documents-Count"}),
		)(mux)
	}
	if !env.Debug {
		h = handlers.LoggingHandler(os.Stdout, h)
		h = sentryHandler.Handle(h)
	}
	return ContentTypeResponseHandler(h, "application/json")
}

func ContentTypeResponseHandler(h http.Handler, contentType string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", contentType)
		h.ServeHTTP(w, r)
	})
}

func authMiddleware(next http.Handler, env *services.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s := services.Session(env.SessionStore, r)
		ctx, ok := sessionContext(r.Context(), env, s)
		if !ok && len(s.Values) > 0 {
			// s.Values is not empty when session is invalid, so
			// let's empty it to avoid subsequent bad writes.
			sentry.Report(errors.New("bad session store state"),
				sentry.CaptureRequest(r),
				func(e sentry.Extra) { e["session"] = s.Values },
			)

			NewAuth(env).Logout(w, r)
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func sessionContext(ctx context.Context, env *services.Env, s *sessions.Session) (context.Context, bool) {
	id, logged := s.Values["id"].(uuid.UUID)
	if !logged {
		return ctx, false
	}

	token, err := env.TokenStore.Get(ctx, models.SessionToken, id)
	if err != nil {
		// timed out or invalid token
		return ctx, false
	}

	return services.WithContext(ctx, token), true
}
