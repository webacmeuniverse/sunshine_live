export GO111MODULE=on

.PHONY: all build

ENV ?= dev

all: build migrate

build: dep ## Build binary file
	go install -ldflags "-X acme.universe/sunshine/sunshine.version=$$(date +%Y%m%d)-$$(git rev-parse --short HEAD)" acme.universe/sunshine/sunshine/cmd/...

dep: ## Install dependencies.
	git config --global url.git@gitlab.com:.insteadOf https://gitlab.com
	which goose > /dev/null || go install github.com/pressly/goose/cmd/goose@v2.6.0
	which staticcheck > /dev/null || go install honnef.co/go/tools/cmd/staticcheck@2020.1.4
	which dataloaden > /dev/null || go install github.com/vektah/dataloaden@v0.3.0
	go get github.com/99designs/gqlgen@v0.17.13
	go get github.com/99designs/gqlgen/codegen@v0.17.13
	go get github.com/99designs/gqlgen/codegen@v0.17.13
	go generate ./...
	go get ./...

migrate: ## Execute database migrations
	SUNSHINE_ENV=$(ENV) sunshine migrate

## Diff command for `go fmt` needs bash.
test: SHELL:=/bin/bash
test: ## Run tests.
	SUNSHINE_ENV=$(ENV) go test -coverprofile=coverage.out -covermode=count -coverpkg=./... -timeout 30m ./...
	@diff -u <(echo -n) <(go fmt ./...) || echo "Run go fmt -w on save!"
	go vet ./...
	staticcheck ./...

coverage.html: ## Generate HTML code coverage report
	go tool cover -html=coverage.out -o coverage.html

coverage.xml: ## Generate XML code coverage report
	gocov convert coverage.out | gocov-xml > coverage.xml

image:
	sudo docker build -t sunshine:v1.0.1 .

run:
	sudo docker run sunshine:v1.0.1

container: 
	sudo docker run -d -p 8000:8000 sunshine:v1.0.1

logs:
	sudo docker logs --follow d8d89af7f8d4

clean: ## Removes auto-generated fiels and project binary.
	rm -f coverage.xml
	rm -f coverage.html
	rm -f coverage.out
	rm -f $(GOPATH)/bin/sunshine
	rm -f openapi.json
	find . -name "*_gen.go" | xargs -r rm

image: ## Builds sunshine docker image
	sudo docker build -t sunshine:v0.1.0 .

run: ## Runs sunshine docker image
	sudo docker run sunshine:v0.1.0

dumpDB: ## Create a data only dump from the sunshine prod DB
	pg_dump --dbname=sunshine_prod --username='postgres' --no-owner --format=tar --data-only --exclude-schema=hdb_views --exclude-schema=hdb_catalog --exclude-table=app_configuration --exclude-table=migrations --exclude-table=goose_db_version --file=/tmp/sunshine_prod.data-only.dump

restoreDB: ## restore the dump to the final-DB
	pg_restore --username='postgres' --no-owner --exit-on-error --verbose --dbname=sunshine_live /tmp/sunshine_prod.data-only.dump

help: ## Display help screen.
	@grep -h -E '^[\.a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
