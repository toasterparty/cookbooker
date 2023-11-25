#!/usr/bin/env bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TOP_DIR=$SCRIPT_DIR/..
SUPABASE_DIR=$TOP_DIR/supabase
BACKUP_DIR=$SUPABASE_DIR/backups

# Check if the argument was provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

get_full_path() {
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

BACKUP_FILEPATH_RELATIVE="$1"
BACKUP_FILEPATH_ABSOLUTE=$(readlink -f "$BACKUP_FILEPATH_RELATIVE")

# Check if the backup file exists
if [ ! -f "$BACKUP_FILEPATH_ABSOLUTE" ]; then
    echo "Backup file '$$BACKUP_FILEPATH_RELATIVE' not found."
    exit 1
fi

cd $SUPABASE_DIR
rm -rf tmp
mkdir -p tmp
cd tmp

# Extract the backup file
tar -xzf $BACKUP_FILEPATH_ABSOLUTE --strip-components=1
tar -xf data.tar --strip-components=3
tar -xf storage.tar --strip-components=2

$TOP_DIR/tools/stop-supabase.sh
sudo rm -rf $SUPABASE_DIR/volumes/db/data
sudo mv data $SUPABASE_DIR/volumes/db
sudo rm -rf $SUPABASE_DIR/volumes/storage
sudo mv storage $SUPABASE_DIR/volumes
cd $SUPABASE_DIR
sudo rm -rf tmp
$TOP_DIR/tools/start-supabase.sh

echo "Database restore completed"
