package http

import (
	"log"
	"time"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"

	"github.com/gorilla/sessions"
	"github.com/robfig/cron/v3"
)

type backupManager struct {
	cjID cron.EntryID
	ss   sessions.Store
	c    *controller.BackupManager
}

func NewBackupManager(env *services.Env) *backupManager {
	uc := controller.NewBackupManager()
	return &backupManager{
		ss: env.SessionStore,
		c:  uc,
	}
}

func (bm *backupManager) Start() {
	log.Print("starting backup manager ...")
	bm.c.Start()
}

func (bm *backupManager) Stop() {
	log.Print("stopping backup manager ...")
	bm.c.Stop()
	bm.RemoveBackup()
}

func (bm *backupManager) AddBackup() {
	id, err := bm.c.AddBackup()
	if err != nil {
		log.Fatalf("Could not schedule periodic backup Err: %s\n", err.Error())
	}
	bm.cjID = id
	log.Print("### Scheduled Backups ###")
	for i, backup := range bm.ListBackups() {
		log.Printf("backup %v scheduled for %v.\n", i+1, backup.Schedule.Next(time.Now()))
	}
	select {}
}

func (bm *backupManager) RemoveBackup() {
	bm.c.RemoveBackup(bm.cjID)
}

func (bm *backupManager) ListBackups() []cron.Entry {
	return bm.c.ListBackups()
}
