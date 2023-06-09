#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..

$SCRIPT_DIR/stop-cookbooker.sh

cd $TOP_DIR/cookbooker

npm install
npm run format
pm2 start npm --name "cookbooker" -- run dev
