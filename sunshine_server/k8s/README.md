# Deploying on Kubernetes

This folder consist of **most** of the files needed for deploying on a
kubernetes cluster hosted by DigitalOcean. Despite minor difference in CSI
drivers released by cloud providers.

Some general knowledge about how to use Kubernetes is assumed below.

## Files

- `cert-issuer.yaml` - cert-manager builds on top of Kubernetes, introducing
  certificate authorities and certificates as first-class resource types in the
  Kubernetes API.

  See [https://cert-manager.io/docs/](https://cert-manager.io/docs/).
- `environments.yaml` - Defines namespaces for deployment environments (e.g.
  staging, production). Everything except for GitLab's RBAC is supposed to be
  applied on every single of these.
- `deployment.yaml` - Defines services and deployments for the backend and
  OpenAPI's docs. This is the file that should be applied after each build
  acme.universe/sunshine/sunshine.
- `entrypoint.sh` - Shell script which is the entrypoint of the backend
  service. Replaces secrets in the config, generates the OpenAPI documentation,
  runs migrations and serves.
- `gitlab.yaml` - RBAC which authorizes GitLab to run runner for the CI/CD.
- `ingress.yaml` - NGINX ingress configuration and endpoints.
- `postgres.yaml` - PostgreSQL service and deployment for the database.
- `pvc.yaml` - Volume claims for the database and file uploads.
- `snapshots.yaml` - Snapshots for the volume claims defined in `pvc.yaml`.

From [`sunshine-react`'s repo](https://gitlab.com/stage-ai/sunshine/sunshine-react/):

- `./provisioning/k8s/deployment.yaml` - Service and deployments for the
  frontend service.

## Steps

1. [Install and setup
   `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/). If
   running on DigitalOcean, might want to follow the steps with `doctl` from
   their [Kubernetes cluster
   page](https://cloud.digitalocean.com/kubernetes/clusters/)
2. [Install GitLab's RBAC and setup CI/CI](https://docs.gitlab.com/ee/user/project/clusters/add_remove_clusters.html)
(`kubectl apply -f k8s/gitlab.yaml` should
happen during this step).
3. Apply the namespaces and do steps 3, 4 and 5 for every single one of them.
4. Create volume claims: `kubectl apply -f k8s/pvc.yaml`
5. Create the PostgreSQL instance: `kubectl apply -f k8s/postgres.yaml`. Unless
   you're not planning to start with a clean database, might want to `kubectl
   exec` into it and `pg_restore` a dump from somewhere else.
6. Apply the backend and frontend services (`deployment.yaml` from both repos).
7. Apply the NGINX ingress, wait for it to get running and get the public IP
   (i.e. `kubectl -n ingress-nginx get svc`)
8. Make DNS A record for the desired domain to that public IP from the previous
   step.
9. Make sure everything is up and running for the chosen namespace in step 3
   and make a snapshot (`kubectl create -f k8s/snapshots.yaml`).

### TODO:

- Current setup is tested only for staging. Production deployment should happen in
  two weeks.

- Kubernetes CronJob should be setup to automatically do volume snapshots,
  backups and probably upload them on some file hosting service due to dubious
  requirements.

- The logic for replacing stuff inside a config file with `sed` is awkward at
  best. Proper usage of
  [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
  should fix that.

- Split the OpenAPI service out of backend's pod.
