#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase

cd $TOP_DIR/supabase
sudo docker compose --env-file $SUPABASE_DIR/.env --env-file $SUPABASE_DIR/config.env down
sudo docker container prune -f
