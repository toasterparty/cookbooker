#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase
BACKUP_DIR=$SUPABASE_DIR/volumes/backups

# Specify the backup filename
DATETIME=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="${DATETIME}_backup.sql"

# Ensure sufficient permissions to make a backup
# sudo docker exec supabase-db psql --host=127.0.0.1 --port=5432 --username=supabase_admin --dbname=postgres -c 'ALTER ROLE postgres SUPERUSER;'

# Make the backup
sudo docker exec -e BACKUP_FILENAME="$BACKUP_FILENAME" supabase-db pg_dumpall --clean --host=127.0.0.1 --port=5432 --database=postgres --username=supabase_admin --file=/backups/$BACKUP_FILENAME

# Make the backup accessible
sudo chmod -R 777 $SUPABASE_DIR/volumes/backups/

# Archive
cd $BACKUP_DIR
tar -czvf ${BACKUP_FILENAME}.tar.gz $BACKUP_FILENAME
rm -f *.sql

# Idempotently add a cron job to do this every day at 12:30am
cron_command="$SCRIPT_DIR/backup-supabase.sh"

if crontab -l | grep -q "$cron_command"; then
    echo "Cron job already exists. No changes made."
    exit 0
fi

(crontab -l 2>/dev/null; echo "30 0 * * * $cron_command") | crontab -

echo "Cron job successfully added"
