#!/bin/bash

set -e # Failing any of the following commands will exit this script immediately
       # and return a non-zero exit code

PORT=26
TIME=$(date +"%Y-%m-%d_%H-%M-%S")
SRC_DIR="./dist"
TARGET_DIR="/var/www/htfrontend/WebContent"
TEMP_DIR="/tmp/deploy/$TIME"
BACKUP_DIR="/var/www/htfrontend/backups/$TIME"
REMOTE="deploy-ci@houraiteahouse.net"

echo "Backing up existing data..."
ssh -p $PORT $REMOTE "mkdir $BACKUP_DIR && cp -r $TARGET_DIR $BACKUP_DIR"
echo "Copying to temp folder ($TEMP_DIR)..."
rsync -a -e "ssh -p $PORT" --rsync-path="mkdir -p $TEMP_DIR && rsync" $SRC_DIR/ $REMOTE:$TEMP_DIR
echo "Deploying to live folder..."
ssh -p $PORT $REMOTE "cp -Rf $TEMP_DIR/* $TARGET_DIR"
echo "Cleaning up..."
echo "Deleting temp folder ($TEMP_DIR)..."
ssh -p $PORT $REMOTE "rm -rf $TEMP_DIR"
