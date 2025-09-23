#!/bin/bash

PATH=/opt/homebrew/bin/:/usr/local/bin/:$PATH

cd "$(dirname "$0")"
cd ..
mkdir -p appIcons
cd appIcons

APP_ICONS_STORAGE_PATH="$(pwd)"

# search for and delete .icns files older than 30 days
pwd
ls "$APP_ICONS_STORAGE_PATH"*.icns "$APP_ICONS_STORAGE_PATH"*.png 2>/dev/null
find "$APP_ICONS_STORAGE_PATH" -name "*.icns" -type l -mtime +30 -exec rm {} \;
find "$APP_ICONS_STORAGE_PATH" -name "*.icns" -type f -mtime +30 -exec rm {} \;
find "$APP_ICONS_STORAGE_PATH" -name "*.png" -type f -mtime +30 -exec rm {} \;

