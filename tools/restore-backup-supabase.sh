#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase
BACKUP_DIR=$SUPABASE_DIR/volumes/backups

# Check if the argument was provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <filename>"
    echo "Note: Must be in /supabase/volumes/backups/"
    exit 1
fi

BACKUP_FILENAME=$(basename $1)

# Check if the backup file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILENAME" ]; then
    echo "Backup file '$BACKUP_FILENAME' not found."
    exit 1
fi

# Extract the backup file
cd $BACKUP_DIR
tar -xzvf $BACKUP_FILENAME -C .
BACKUP_FILENAME_SQL=${BACKUP_FILENAME/.tar.gz/}

# Drop existing database
echo "Clearing existing db for idempotency"
$TOP_DIR/tools/stop-supabase.sh
sudo rm -rf $SUPABASE_DIR/volumes/db/data
$TOP_DIR/tools/start-supabase.sh

# Restore the database from the backup file
sudo docker exec supabase-db psql --host=127.0.0.1 --port=5432 --username=supabase_admin --dbname=postgres --file="/backups/$BACKUP_FILENAME_SQL"

# Cleanup
rm -f $BACKUP_FILENAME_SQL
echo "Database restore completed"
