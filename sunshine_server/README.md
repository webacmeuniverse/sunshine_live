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
