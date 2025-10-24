Sunshine react client
======================

The repository for the front-end client of sunshine.stageai.tech

## Running

**NOTICE**: All of the scripts and `yarn` commands in the repo depend on
[`react-scripts`](https://www.npmjs.com/package/react-scripts). You can install it by running:

    yarn add react-scripts

Running a development server:

    yarn start

This will fire up an HTTP server on http://localhost:3000/.

## Building

Then to build the project, run:

    yarn build

### Development lifecycle

New features are develped locally and pushed to gitlab.com/stage-ai/sunshine/sunshine-react in
a new feature branch.
After validating __all__ features (___new___ _and_ ___old___) work as expected locally a __merge request__ to `master` branch
is opened with detailed information on the introduced changes.

### Staging builds

Once a __merge request__ to `master` branch is accepted, an automatic `GitLab CI` pipeline will run automated tests and deploy the project in
`staging` environment by applying the `deplooyment.yaml` file to the configured `Kubernetes deployment`.

### Production builds

To deploy the project in `production` environment a new release `tag` needs to be pushed with a `version-x` string.
Please add a description with the introduced changes from the last version release. A convenient way of getting all
relevant changes is using

    git log --oneline version-0.1.2...origin/HEAD

where `version-0.1.2` is the latest release version.

### Running tests

The tests can be run with:

    yarn test


# sunshine
### private repo for the sunshine client by Amit

[*API docs*](./doc/README.md)

## Requirements

- Go 1.10+
- PostgreSQL 10+
- Set `$GOPATH`
- Put `$GOPATH/bin` inside `$PATH` (e.g. `export PATH=$PATH:$GOPATH/bin`)
- User with superuser access to the running PostgreSQL and do `createdb sunshine`

## Development setup

1. Install `texlive` and Libertine (in Arch the packages are `texlive-bin`,
   `texlive-most`, `texlive-lang` and `ttf-linux-libertine`, in Ubuntu -
   `texlive-xetex`, `texlive-fonts-extra`, `texlive-latex-extra` and
   `fonts-linuxlibertine`)
2. Run `make build migrate`
3. Develop and maintain!

## Running the tests

	make test

## Running the application

1. Make sure you've executed all steps start from `2` from "Development setup" after each `git pull`.
2. Run `sunshine serve`
3. Develop and maintain!


## Changes
### DONE
1. remove unique from steps & fields titles
2. add oss_admin_field to result object *include "oss_admin_id":"${email}" in post result payload.
3. input type [text/number] *include "text_number":"${enum_variable}" in the post result payload.
4. update step names fields or use stepID instead of name
5. require not changing back to false while updating step field
6. Record not found when updating step field
7. URGENT: could not convert argument of field step name from uuid.UUID to string while updating step item.
8. string data type throughout results table
9. create user results basic table
10. create user results basic API pipeline
11. create a table for each step with stepfields as columns
12. create CRUD API endpoints for all this tables

### ONGOING
1. Fetch formulas datas
2. Fetch field value
2. Do sum
3. Store it into new table

#### bugs
_>This 2 table use for get oss result with formula
steps_result
result_sub_object

->This table use for get user input value
user_result_calc_field

Store data in this table
get_result_tbl1
