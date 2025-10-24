package controller

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"acme.universe/sunshine/sunshine/config"
	"github.com/robfig/cron/v3"

	"google.golang.org/api/drive/v3"

	// "golang.org/x/oauth2"

	pg "github.com/habx/pg-commands"
)

type BackupManager struct {
	scheduler *cron.Cron
	dump      *pg.Dump
	cfg       config.Config
}

func NewBackupManager() *BackupManager {
	cfg := config.Load()
	return &BackupManager{
		scheduler: cron.New(cron.WithSeconds()),
		cfg:       cfg,
	}
}

func (bm *BackupManager) Start() {
	bm.scheduler.Start()
	dump, _ := pg.NewDump(&pg.Postgres{
		Host:     bm.cfg.DB.Host,
		Port:     int(bm.cfg.DB.Port),
		DB:       bm.cfg.DB.Name,
		Username: bm.cfg.DB.Username,
		Password: bm.cfg.DB.Password,
	})
	bm.dump = dump
}

func (bm *BackupManager) Stop() {
	bm.scheduler.Stop()
}

func (bm *BackupManager) AddBackup() (cron.EntryID, error) {
	// add backup details to database
	schedule := bm.cfg.General.Backupcron
	return bm.scheduler.AddFunc(schedule, func() {
		log.Print("creating backup ...")
		bm.createBackup()
	})
}

func (bm *BackupManager) createBackup() {
	ctx := context.Background()
	var buf bytes.Buffer
	timeDay := fmt.Sprintf("backups/" + "backup_" + time.Now().Format("20060102150405"))

	currentDir, err := os.Getwd()
	if err != nil {
		log.Printf("Err getting current dir: %v\n", err)
	}
	backupToday := filepath.Join(currentDir, timeDay)
	if err := os.MkdirAll(backupToday, os.ModePerm); err != nil {
		log.Printf("Err creating dir: %v\n", err)
	}

	srv, err := drive.NewService(ctx)
	if err != nil {
		log.Printf("Error starting google drive for periodic backup: %s\n", err.Error())
		return
	}
	log.Printf("google drive service ready for backup: %v\n", srv.About)

	dumpExec := bm.dump.Exec(pg.ExecOptions{StreamPrint: false})
	if dumpExec.Error != nil {
		log.Println(dumpExec.Error.Err)
		log.Println(dumpExec.Output)
		return
	}
	bm.moveBackup(buf, dumpExec.File, timeDay, currentDir, backupToday)

	file, err := os.Open(backupToday)
	info, _ := file.Stat()
	if err != nil {
		log.Printf("Unable to open dir: %v", err)
	}
	defer file.Close()

	// Create File metadata
	f := &drive.File{Name: info.Name()}

	// Create and upload the file
	res, err := srv.Files.
		Create(f).
		Media(file). //context.Background(), file, fileInf.Size(), baseMimeType).
		ProgressUpdater(func(now, size int64) { fmt.Printf("%d, %d\r", now, size) }).
		Do()
	if err != nil {
		log.Printf("Err uploading to google-drive: %v\n", err)
	}
	fmt.Printf("New file id: %s\n", res.Id)
	return
}

func (bm *BackupManager) RemoveBackup(id cron.EntryID) {
	bm.scheduler.Remove(id)
}

func (bm *BackupManager) ListBackups() []cron.Entry {
	// list backups
	return bm.scheduler.Entries()
}

func (bm *BackupManager) moveBackup(buf bytes.Buffer, _file, timeDay, currentDir, backupToday string) {
	destDir := filepath.Join(currentDir, timeDay)
	destPath := filepath.Join(destDir, _file)
	if err := os.MkdirAll(destPath, os.ModePerm); err != nil {
		log.Printf("Err creating dir 2: %v\n", err)
	}

	if err := os.Remove(_file); err != nil {
		log.Println("Unable to remove temp backup archive")
	}

	_ = bm.compress("./uploads/", &buf)

	// write the .tar.gzip
	fileToWrite, err := os.OpenFile(backupToday+"/user_uploads.tar.gzip", os.O_CREATE|os.O_RDWR, os.FileMode(600))
	if err != nil {
		log.Printf("Err opening file uploads: %v\n", err)
	}
	if _, err := io.Copy(fileToWrite, &buf); err != nil {
		log.Printf("Err copying uploads: %v\n", err)
	}
	log.Printf("Backup successfully created: %v\n", backupToday)
}

func (*BackupManager) compress(src string, buf io.Writer) error {
	// tar > gzip > buf
	zr := gzip.NewWriter(buf)
	tw := tar.NewWriter(zr)

	// is file a folder?
	fi, err := os.Stat(src)
	if err != nil {
		return err
	}
	mode := fi.Mode()
	if mode.IsRegular() {
		// get header
		header, err := tar.FileInfoHeader(fi, src)
		if err != nil {
			return err
		}
		// write header
		if err := tw.WriteHeader(header); err != nil {
			return err
		}
		// get content
		data, err := os.Open(src)
		if err != nil {
			return err
		}
		if _, err := io.Copy(tw, data); err != nil {
			return err
		}
	} else if mode.IsDir() { // folder

		// walk through every file in the folder
		filepath.Walk(src, func(file string, fi os.FileInfo, err error) error {
			// generate tar header
			header, err := tar.FileInfoHeader(fi, file)
			if err != nil {
				return err
			}

			// must provide real name
			// (see https://golang.org/src/archive/tar/common.go?#L626)
			header.Name = filepath.ToSlash(file)

			// write header
			if err := tw.WriteHeader(header); err != nil {
				return err
			}
			// if not a dir, write file content
			if !fi.IsDir() {
				data, err := os.Open(file)
				if err != nil {
					return err
				}
				if _, err := io.Copy(tw, data); err != nil {
					return err
				}
			}
			return nil
		})
	} else {
		return errors.New("error: file type not supported")
	}

	// produce tar
	if err := tw.Close(); err != nil {
		return err
	}
	// produce gzip
	if err := zr.Close(); err != nil {
		return err
	}
	//
	return nil
}

// check for path traversal and correct forward slashes
func validRelPath(p string) bool {
	if p == "" || strings.Contains(p, `\`) || strings.HasPrefix(p, "/") || strings.Contains(p, "../") {
		return false
	}
	return true
}

func decompress(src io.Reader, dst string) error {
	// ungzip
	zr, err := gzip.NewReader(src)
	if err != nil {
		return err
	}
	// untar
	tr := tar.NewReader(zr)

	// uncompress each element
	for {
		header, err := tr.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			return err
		}
		target := header.Name

		// validate name against path traversal
		if !validRelPath(header.Name) {
			return errors.New("tar contained invalid name error " + target)
		}

		// add dst + re-format slashes according to system
		target = filepath.Join(dst, header.Name)
		// if no join is needed, replace with ToSlash:
		// target = filepath.ToSlash(header.Name)

		// check the type
		switch header.Typeflag {

		// if its a dir and it doesn't exist create it (with 0755 permission)
		case tar.TypeDir:
			if _, err := os.Stat(target); err != nil {
				if err := os.MkdirAll(target, 0755); err != nil {
					return err
				}
			}
		// if it's a file create it (with same permission)
		case tar.TypeReg:
			fileToWrite, err := os.OpenFile(target, os.O_CREATE|os.O_RDWR, os.FileMode(header.Mode))
			if err != nil {
				return err
			}
			// copy over contents
			if _, err := io.Copy(fileToWrite, tr); err != nil {
				return err
			}
			// manually close here after each file operation; defering would cause each file close
			// to wait until all operations have completed.
			fileToWrite.Close()
		}
	}

	//
	return nil
}
