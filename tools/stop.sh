#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/../supabase/docker
sudo docker compose --env-file $SCRIPT_DIR/.env down
sudo docker container prune -f
