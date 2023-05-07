#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/../

cd $TOP_DIR
git submodule update --init --recursive supabase

cd $TOP_DIR/supabase/docker

sudo docker compose --env-file $TOP_DIR/.env up -d

cd $TOP_DIR/cookbooker

npm install
npm run format
npm run dev
