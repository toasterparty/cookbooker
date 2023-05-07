#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..

cd $TOP_DIR/supabase/docker
sudo docker compose --env-file $TOP_DIR/.env --env-file $TOP_DIR/config down
sudo docker container prune -f
