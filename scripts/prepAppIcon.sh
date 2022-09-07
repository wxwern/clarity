#!/bin/bash

if [[ -z "$1" ]]; then
    echo "App name required as first argument."
    exit 1
fi

cd "$(dirname "$0")"
cd ..
mkdir -p appIcons
cd appIcons

if [[ ! -f "$1.icns" ]]; then
    BASE_APP_URL="/Applications/$1.app/"
    if [[ ! -d "$BASE_APP_URL" ]]; then
        BASE_APP_URL="/Applications/Utilities/$1.app/"
        if [[ ! -d "$BASE_APP_URL" ]]; then
            BASE_APP_URL="/System/Applications/$1.app/"
            if [[ ! -d "$BASE_APP_URL" ]]; then
                BASE_APP_URL="/System/Applications/Utilities/$1.app/"
                if [[ ! -d "$BASE_APP_URL" ]]; then
                    BASE_APP_URL="/System/Library/CoreServices/$1.app/"
                    if [[ ! -d "$BASE_APP_URL" ]]; then
                        echo "App $1 not found!"
                        exit 1
                    fi
                fi
            fi
        fi
    fi

    echo "App found at $BASE_APP_URL"

    cd "$BASE_APP_URL/Contents/Resources/"
    APP_ICON_NAME="$(ls *AppIcon*.icns | head -n 1)"

    if [[ -z "$APP_ICON_NAME" ]]; then
        APP_ICON_NAME="$(ls *.icns | head -n 1)"
    fi

    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "App icon not found!"
        exit 1
    fi

    echo "App icon: $APP_ICON_NAME"
    cd -

    ln -s "$BASE_APP_URL/Contents/Resources/$APP_ICON_NAME" "$1.icns"
    echo "Linked icns file!"
else
    echo "$1 icns icon file already linked!"
fi

if [[ ! -f "$1.png" ]]; then
    sips -Z 32 -s format png "$1.icns" --out "$1.png" && echo "Created png file!"
else
    echo "$1 png file already exists!"
fi
