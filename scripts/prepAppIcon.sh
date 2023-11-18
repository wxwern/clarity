#!/bin/bash

PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

if [[ -z "$1" ]]; then
    echo "App name required as first argument."
    exit 1
fi

cd "$(dirname "$0")"
cd ..
mkdir -p appIcons
cd appIcons

if [[ ! -f "$1.icns" ]]; then

    # Locate the app
    BASE_APP_URL=""

    app_parent_directories=(
        "/Applications"
        "/Applications/Utilities"
        "/System/Applications"
        "/System/Applications/Utilities"
        "/System/Library/CoreServices"
        "/System/Library/CoreServices/Applications"
        "$HOME/Applications"
    )

    for dir in "${app_parent_directories[@]}"; do
        # Loop through each directory to search for the app path
        echo "Searching: $dir..."
        if [[ -d "$dir/$1.app" ]]; then
            BASE_APP_URL="$dir/$1.app";
            break;
        fi
    done

    if [[ -z "$BASE_APP_URL" ]]; then
        # We can't find the app at the given directories...
        for dir in "${app_parent_directories[@]}"; do
            # Loop through all subdirectories within the directory to find the app path
            for d in $dir/*; do
                if [ -d "$d" ] && [[ "$d" != *.app ]] && [[ "$d" != *.bundle ]]; then
                    echo "Searching: $d..."
                    if [[ -d "$d/$1.app" ]]; then
                        BASE_APP_URL="$d/$1.app";
                        break 2;
                    fi
                fi
            done
        done
    fi

    if [[ -z "$BASE_APP_URL" ]]; then
        echo "FAILED: App $1 not found!"
        exit 1
    fi

    echo "App found at $BASE_APP_URL"
    echo

    # Get the icon name required from the app
    cd "$BASE_APP_URL/Contents/Resources/"
    APP_ICON_NAME=""
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking CFBundleIconName..."
        APP_ICON_NAME="$(/usr/libexec/PlistBuddy -c 'print :CFBundleIconName' ../Info.plist)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking CFBundleIconFile..."
        APP_ICON_NAME="$(/usr/libexec/PlistBuddy -c 'print :CFBundleIconFile' ../Info.plist)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking icns files with AppIcon name..."
        APP_ICON_NAME="$(ls *AppIcon*.icns | head -n 1 | rev | cut -c6- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking icns files..."
        APP_ICON_NAME="$(ls *.icns | head -n 1 | rev | cut -c6- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "FAILED: App icon not found!"
        exit 1
    fi

    # Remove .icns suffix if there is one not stripped
    if [[ "$APP_ICON_NAME" == *.icns ]]; then
        APP_ICON_NAME="${APP_ICON_NAME%.*}"
    fi

    # Locate and extract the file from standard locations
    echo "Expected App Icon Name: $APP_ICON_NAME"
    echo

    if [[ -f "$APP_ICON_NAME.icns" ]]; then
        echo "App icon located at $APP_ICON_NAME.icns"
        cd -
        if [[ -f "$1.icns" ]]; then rm "$1.icns"; fi
        if [[ -f "$1.png" ]]; then rm "$1.png"; fi
        ln -sf "$BASE_APP_URL/Contents/Resources/$APP_ICON_NAME.icns" "$1.icns"
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
            echo "FAILED: We can't find anything! :("
            exit 1
        fi
    fi
else
    echo "$1 icns icon file already linked!"
fi
echo

if [[ ! -f "$1.png" ]]; then
    if [[ -f "$1.icns" ]]; then
        sips -Z 32 -s format png "$1.icns" --out "$1.png" && echo "Created png file!"
    fi
else
    echo "$1 png file already exists!"
fi
