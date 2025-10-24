package cmd

import (
	"context"
	"log"

	"acme.universe/sunshine/sunshine/restore"
	"acme.universe/sunshine/sunshine/services"

	"github.com/spf13/cobra"
)

var (
	listrestores string
)

const longLR = `
The 'listrestores' command restore the state of the system back to the specified date in time.

By default it the command lists all available restore points that are run according to the weekly backup cron jobs.
-->Nit: The restore points are themselves archives of user-uploads and the state of the DB at the time the weekly
backup cron job was run.
`

// restoreCmd represents the restore command in cobra
var listrestoresCmd = &cobra.Command{
	Use:   "listrestores",
	Short: "List all available restore points in the system.",
	Long:  longLR,
	Run:   execListRestore,
}

func init() {
	restoreCmd.Flags().StringVarP(&listrestores, "listrestores", "r", "listrestores", "List all restore points available in the server.")

	rootCmd.AddCommand(listrestoresCmd)
}

func execListRestore(_ *cobra.Command, _ []string) {
	log.SetFlags(0)

	env, err := services.NewEnv()
	if err != nil {
		log.Fatalf("cannot setup environment: %v", err)
	}
	// restore := restore.NewRestore(env)

	log.Println("Start listing restores...")

	ListBackups(ctx, env)

	log.Printf("Restore commad %s/n", listrestores)

	log.Print("\nAll restore points listed.")
}

func ListBackups(ctx context.Context, env *services.Env) ([]string, error) {
	// Accept a number from the backup listings as restore-point in restore call
	r := restore.NewRestore(env)
	return r.ListBackups(ctx)

}
