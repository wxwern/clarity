#!/bin/bash

PATH=/opt/homebrew/bin/:/usr/local/bin/:$PATH

if [[ -z "$1" ]]; then
    echo "App name required as first argument."
    exit 1
fi

cd "$(dirname "$0")"
cd ..
mkdir -p appIcons
cd appIcons

APP_ICONS_STORAGE_PATH="$(pwd)"

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
    cd "$BASE_APP_URL" || exit 1

    cd ./Contents/Resources/ 2>/dev/null

    if [[ $? -ne 0 ]]; then
        INFO_PLIST_REL_PATH="./Info.plist"
    else
        INFO_PLIST_REL_PATH="../Info.plist"
    fi

    APP_RESOURCES_PATH="$(pwd)"

    echo "App Resources Path: $APP_RESOURCES_PATH"
    echo

    echo "Checking $INFO_PLIST_REL_PATH..."

    APP_ICON_NAME=""
    if [[ -z "$APP_ICON_NAME" && -f "$INFO_PLIST_REL_PATH" ]]; then
        echo "Checking CFBundleIconName..."
        APP_ICON_NAME="$(/usr/libexec/PlistBuddy -c 'print :CFBundleIconName' "$INFO_PLIST_REL_PATH" 2>/dev/null)"
    fi
    if [[ -z "$APP_ICON_NAME" && -f "$INFO_PLIST_REL_PATH" ]]; then
        echo "Checking CFBundleIconFile..."
        APP_ICON_NAME="$(/usr/libexec/PlistBuddy -c 'print :CFBundleIconFile' "$INFO_PLIST_REL_PATH" 2>/dev/null)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking icns files with AppIcon name..."
        APP_ICON_NAME="$(ls ./*AppIcon*.icns 2>/dev/null | head -n 1 | rev | cut -c6- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking png files with AppIcon16x16@2x name..."
        APP_ICON_NAME="$(ls ./*AppIcon*@16x16.png 2>/dev/null | head -n 1 | rev | cut -c5- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking png files with AppIcon name..."
        APP_ICON_NAME="$(ls ./*AppIcon*.png 2>/dev/null | head -n 1 | rev | cut -c5- | rev)"
    fi
    if [[ -z "$APP_ICON_NAME" ]]; then
        echo "Checking icns files..."
        APP_ICON_NAME="$(ls ./*.icns 2>/dev/null | head -n 1 | rev | cut -c6- | rev)"
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
        printf "Navigating to app icons storage: "
        cd "$APP_ICONS_STORAGE_PATH" || (echo "FAILED: Can't navigate to app icons storage!" && exit 1)
        pwd

        if [[ -f "$1.icns" ]]; then rm "./$1.icns"; fi
        if [[ -f "$1.png" ]]; then rm "./$1.png"; fi

        ln -sf "$APP_RESOURCES_PATH/$APP_ICON_NAME.icns" "$1.icns"
        echo "Linked icns file!"

    elif [[ -f "$APP_ICON_NAME.png" ]]; then
        echo "App icon located at $APP_ICON_NAME.png"
        printf "Navigating to app icons storage: "
        cd "$APP_ICONS_STORAGE_PATH" || (echo "FAILED: Can't navigate to app icons storage!" && exit 1)
        pwd

        if [[ -f "$1.icns" ]]; then rm "./$1.icns"; fi
        if [[ -f "$1.png" ]]; then rm "./$1.png"; fi

        ln -s "$APP_RESOURCES_PATH/$APP_ICON_NAME.png" "$1.png"

        echo "Linked png file directly to target location!"

    else
        echo "App icon not found at $APP_ICON_NAME.icns, trying $APP_ICON_NAME""16x16@2x.png in Assets.car"
        printf "Navigating to app icons storage: "
        cd "$APP_ICONS_STORAGE_PATH" || (echo "FAILED: Can't navigate to app icons storage!" && exit 1)
        pwd

        if [[ -f "$1.icns" ]]; then rm "./$1.icns"; fi
        if [[ -f "$1.png" ]]; then rm "./$1.png"; fi

        ../scripts/acextract -i "$APP_RESOURCES_PATH/Assets.car" -o "$1/"
        if [[ -f "$1/$APP_ICON_NAME""16x16@2x.png" ]]; then
            echo "App icon found in Assets.car!"

            cp "$1/$APP_ICON_NAME""16x16@2x.png" "$1.png"
            rm -r "./$1/"

            echo "Extracted 16x16@2x png from Assets.car!"

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
    echo "$1 png file exists!"
fi
