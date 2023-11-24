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

# Start Docker Containers
cd $SUPABASE_DIR
sudo docker compose --env-file $SUPABASE_DIR/.env --env-file $CONF_FILE up -d

# Modify permissions so that they can be tracked by git
sudo chmod -R a+rX $SUPABASE_DIR/volumes/
