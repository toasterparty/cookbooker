#!/usr/bin/env bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get clean -y
sudo apt-get autoremove -y
sudo apt-get autoclean -y
sudo apt-get dist-upgrade -y

set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..

$SCRIPT_DIR/stop-cookbooker.sh
$SCRIPT_DIR/stop-supabase.sh

cd $TOP_DIR/supabase
sudo docker compose pull

cd $TOP_DIR/cookbooker
npm install
npm update

$SCRIPT_DIR/start-supabase.sh
$SCRIPT_DIR/start-cookbooker.sh
