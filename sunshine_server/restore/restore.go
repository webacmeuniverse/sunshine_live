package restore

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"acme.universe/sunshine/sunshine/services"
)

// Users holds type : user : pass
// type Users map[string]map[*models.User]string

type Restore struct {
	env *services.Env
}

func NewRestore(env *services.Env) *Restore {
	return &Restore{
		env: env,
	}
}

// ListBackups lists all available backup-points numerically on cli
func (Restore) ListBackups(ctx context.Context) (result []string, err error) {
	log.Print("listing backups ...")
	currentDir, err := os.Getwd()
	backupDir := filepath.Join(currentDir, "backups/")

	file, err := os.Open(backupDir)
	names, _ := file.Readdirnames(0)
	for _, name := range names {
		println(name)
	}

	return
}

// CreateRestoreBackup immediate system backup on restore call
func (Restore) CreateRestoreBackup(ctx context.Context) (err error) {
	log.Print("creating restore backup ...")
	return
}

// PurgeUserFiles Remove current user uploads file
func (Restore) PurgeUserFiles(ctx context.Context) (err error) {
	log.Print("removing current user files ...")
	return
}

// ExtractUserFiles Extract the new files from the specified restore point to the sunshine_server's user directory
func (Restore) ExtractUserFiles(ctx context.Context) (err error) {
	log.Print("extracting user files from backup archive ...")
	return
}

// PurgeDB Deletes the current DB in config.toml from the postgres instance
func (Restore) PurgeDB(ctx context.Context) (err error) {
	log.Print("deleting current postgres DB instance ...")
	return
}

// CreateDB Creates a new DB instance from the config.toml
func (Restore) CreateDB(ctx context.Context) (err error) {
	log.Print("creating fresh DB instance ...")
	return
}

// RestoreDBFromArchive restores the DB state to the point of the selected archive
func (Restore) RestoreDBFromArchive(ctx context.Context) (err error) {
	log.Print("restoring DB from archives ...")
	return
}
