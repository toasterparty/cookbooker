#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase
BACKUP_DIR=$SUPABASE_DIR/backups

# Specify the backup filename
DATETIME=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${DATETIME}_backup"

$SCRIPT_DIR/stop-supabase.sh

cd $SUPABASE_DIR

rm -rf tmp
mkdir -p tmp
mkdir -p tmp/$BACKUP_NAME
sudo tar -cf ./tmp/$BACKUP_NAME/data.tar $SUPABASE_DIR/volumes/db/data/
sudo tar -cf ./tmp/$BACKUP_NAME/storage.tar $SUPABASE_DIR/volumes/storage/
cd tmp
tar -czf $BACKUP_NAME.tar.gz $BACKUP_NAME

cd $SUPABASE_DIR
mkdir -p backups
mv ./tmp/$BACKUP_NAME.tar.gz backups
rm -rf tmp

$SCRIPT_DIR/start-supabase.sh

# Idempotently add a cron job to do this every Tuesday at 2:30am
cron_command="$SCRIPT_DIR/backup-supabase.sh"

if crontab -l | grep -q "$cron_command"; then
    echo "Cron job already exists. No changes made."
    exit 0
fi

(crontab -l 2>/dev/null; echo "30 02 * * 2 $cron_command") | crontab -

echo "Cron job successfully added"
