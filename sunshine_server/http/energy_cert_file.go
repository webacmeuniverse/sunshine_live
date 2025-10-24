package http

import (
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type energyCertFile struct {
	st stores.Store
	c  *controller.EnergyCertFile
}

func NewEnergyCertFile(env *services.Env) *energyCertFile {
	ecfc := controller.NewEnergyCertFile(env)

	return &energyCertFile{
		st: env.EnergyCertFileStore,
		c:  ecfc,
	}
}

// Create new energy cert details item.
func (ecf *energyCertFile) create(w http.ResponseWriter, r *http.Request) {
	file, fheader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	ut := r.FormValue("upload-type")
	kind := r.FormValue("kind")

	form := controller.RequestForm{
		FileHeader: fheader,
		File:       file,
		UploadType: ut,
		Kind:       kind,
	}

	if err := ecf.c.Create(r.Context(), mustExtractUUID(r), form); err != nil {
		writeError(w, r, err)
		return
	}

	location := *r.URL
	base, _ := path.Split(location.Path) // removes '/upload' from the end
	location.Path = path.Join(base, fheader.Filename)
	w.Header().Set("Location", location.String())
	msg := SuccessMessage{Message: "File uploaded successfully!"}
	json.NewEncoder(w).Encode(msg)
}

// Get existing energy cert details item.
func (ecf *energyCertFile) get(w http.ResponseWriter, r *http.Request) {
	doc, err := ecf.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

func (ecf *energyCertFile) getFile(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	certFile, err := ecf.c.GetCert(id.String())
	if err != nil {
		writeError(w, r, err)
		return
	}
	name := certFile.FileName

	f, err := ecf.c.GetFile(r.Context(), id, name)
	if err != nil {
		writeError(w, r, err)
		return
	}
	defer f.Close()
	fmt.Printf("File name: %v\n", f.Name())
	ext := strings.Split(f.Name(), ".")[1]

	imageType := ecf.getImageType(ext)
	fi, err := f.Stat()
	if err != nil {
		writeError(w, r, err)
		return
	}
	imageSize := fi.Size()

	if !strings.HasPrefix(mime.TypeByExtension(filepath.Ext(name)), "image/") {
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", name))
	}

	fmt.Printf("type: %v\nsize: %v\n", imageType, imageSize)

	w.Header().Set("Content-Type", imageType)
	w.Header().Set("Content-Length", strconv.FormatInt(imageSize, 10))

	if r.Method != "HEAD" {
		io.Copy(w, f)
	}
}

func (ecf *energyCertFile) getImageType(ext string) string {
	switch ext {
	case "jpg":
		return "image/jpeg"
	case "png":
		return "image/png"
	case "pdf":
		return "application/pdf"
	default:
		return "image/jpeg"
	}
}

// delete energy cert details item
func (ecf *energyCertFile) delEnergyCertFile(w http.ResponseWriter, r *http.Request) {
	if err := ecf.c.DeleteEnergyCertFile(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Energy cert details file"}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
