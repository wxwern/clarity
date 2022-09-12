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
    APP_ICON_NAME="$(/usr/libexec/PlistBuddy -c 'print :CFBundleIconName' ../Info.plist)"
    if [[ -z "$APP_ICON_NAME" ]]; then
        APP_ICON_NAME="$(ls *AppIcon*.icns | head -n 1 | rev | cut -c6- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        APP_ICON_NAME="$(ls *.icns | head -n 1 | rev | cut -c6- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "App icon not found!"
        exit 1
    fi

    echo "App Icon Name: $APP_ICON_NAME"

    if [[ -f "$APP_ICON_NAME.icns" ]]; then
        echo "App icon found at $APP_ICON_NAME.icns"
        cd -
        if [[ -f "$1.icns" ]]; then rm "$1.icns"; fi
        if [[ -f "$1.png" ]]; then rm "$1.png"; fi
        ln -s "$BASE_APP_URL/Contents/Resources/$APP_ICON_NAME.icns" "$1.icns"
        echo "Linked icns file!"
    else
        echo "App icon not found at $APP_ICON_NAME.icns, trying $APP_ICON_NAME""16x16@2x.png in Assets.car"
        cd -
        ../scripts/acextract -i "$BASE_APP_URL/Contents/Resources/Assets.car" -o "$1/"
        if [[ -f "$1/$APP_ICON_NAME""16x16@2x.png" ]]; then
            echo "App icon found in Assets.car!"
            sips -s format icns "$1/$APP_ICON_NAME""16x16@2x.png" --out "$1.icns"
            cp "$1/$APP_ICON_NAME""16x16@2x.png" "$1.png"
            rm -r "$1/"
            echo "Copied 16x16@2x png file and created icns file for that size!"
        else
            echo "We can't find anything! :("
            exit 1
        fi
    fi
else
    echo "$1 icns icon file already linked!"
fi

if [[ ! -f "$1.png" ]]; then
    if [[ -f "$1.icns" ]]; then
        sips -Z 32 -s format png "$1.icns" --out "$1.png" && echo "Created png file!"
    fi
else
    echo "$1 png file already exists!"
fi
