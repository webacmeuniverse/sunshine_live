package cmd

import (
	"log"

	"acme.universe/sunshine/sunshine/restore"
	"acme.universe/sunshine/sunshine/services"

	"github.com/spf13/cobra"
)

var (
	point int
)

const longR = `
The 'restore' command restore the state of the system back to the specified date in time.

By default it the command lists all available restore points that are run according to the weekly backup cron jobs.
-->Nit: The restore points are themselves archives of user-uploads and the state of the DB at the time the weekly
backup cron job was run.
`

// restoreCmd represents the restore command in cobra
var restoreCmd = &cobra.Command{
	Use:   "restore",
	Short: "Restore the state of the app to the specified state.",
	Long:  longR,
	Run:   execRestore,
}

func init() {
	restoreCmd.Flags().IntVarP(&point, "point", "p", 1, "The selected restore point to initiate restore from.")

	rootCmd.AddCommand(restoreCmd)
}

func execRestore(_ *cobra.Command, _ []string) {
	log.SetFlags(0)

	env, err := services.NewEnv()
	if err != nil {
		log.Fatalf("cannot setup environment: %v", err)
	}

	log.Println("Start restore...")

	r := restore.NewRestore(env)

	log.Printf("Creating restore at point %d/n", point)

	if err := r.CreateRestoreBackup(ctx); err != nil {
		log.Fatalf("creating restore for backup fails: %v\n", err)
	}
	if err := r.PurgeUserFiles(ctx); err != nil {
		log.Fatalf("removing current user files fails: %v\n", err)
	}
	if err := r.ExtractUserFiles(ctx); err != nil {
		log.Fatalf("extracting user files fails: %v\n", err)
	}
	if err := r.PurgeDB(ctx); err != nil {
		log.Fatalf("deleting current DB fails: %v\n", err)
	}
	if err := r.CreateDB(ctx); err != nil {
		log.Fatalf("creating new DB fails: %v\n", err)
	}
	if err := r.RestoreDBFromArchive(ctx); err != nil {
		log.Fatalf("restoring DB from archive fails: %v\n", err)
	}

	log.Print("\nRestoring sunshine server system state done.")
}
