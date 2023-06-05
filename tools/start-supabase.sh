#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase
CONF_FILE=$SUPABASE_DIR/config.env
KONG_YAML=$SUPABASE_DIR/volumes/api/kong.yml

# Ensure Configuration
if [ ! -f $CONF_FILE ]
then
    cp -r $SUPABASE_DIR/default.env $CONF_FILE
    echo Config file not found, please edit $CONF_FILE to provide required configuration
fi

source $CONF_FILE

# Generate Kong.yml with secrets
mkdir -p $SUPABASE_DIR/volumes/api/
cp -f $SUPABASE_DIR/default_kong.yml $KONG_YAML
LINE=$(grep -n "username: anon" $KONG_YAML | cut -d ":" -f1)
(( LINE+=2 ))
sed -i "${LINE}s/.*/      - key: ${ANON_KEY}/" "$KONG_YAML"

LINE=$(grep -n "username: service_role" $KONG_YAML | cut -d ":" -f1)
(( LINE+=2 ))
sed -i "${LINE}s/.*/      - key: ${SERVICE_ROLE_KEY}/" "$KONG_YAML"

# Start Docker Containers
cd $SUPABASE_DIR
sudo docker compose --env-file $SUPABASE_DIR/.env --env-file $CONF_FILE up -d
