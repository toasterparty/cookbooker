#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/../
KONG_YAML=$TOP_DIR/supabase/docker/volumes/api/kong.yml

if [ ! -f $TOP_DIR/config ]
then
    cp -r $SCRIPT_DIR/config_default $TOP_DIR/config
    echo Config file not found, please edit $TOP_DIR/config to provide required configuration
fi

source $TOP_DIR/config

LINE=$(grep -n "username: anon" $KONG_YAML | cut -d ":" -f1)
(( LINE+=2 ))
sed -i "${LINE}s/.*/      - key: ${ANON_KEY}/" "$KONG_YAML"

LINE=$(grep -n "username: service_role" $KONG_YAML | cut -d ":" -f1)
(( LINE+=2 ))
sed -i "${LINE}s/.*/      - key: ${SERVICE_ROLE_KEY}/" "$KONG_YAML"

cd $TOP_DIR
git submodule update --init --recursive supabase

cd $TOP_DIR/supabase/docker

sudo docker compose --env-file $TOP_DIR/.env --env-file $TOP_DIR/config up -d

cd $TOP_DIR/cookbooker

npm install
npm run format
npm run dev

