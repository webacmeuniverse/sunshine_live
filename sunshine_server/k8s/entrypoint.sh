#!/bin/sh
set -e

sed -i "s/default_env/$ENVIRONMENT/g" services/env.go
sed -i "s/default_release/$VERSION/g" services/env.go

SUNSHINE_CONFIG="/data/config/config.toml"
export SUNSHINE_CONFIG

sunshine openapi
sunshine migrate
sunshine serve
