#!/bin/bash

PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

# Check if yabai exists
if ! [ -x "$(command -v yabai)" ]; then
  echo "{\"error\":\"yabai binary not found\"}"
  exit 1
fi

SPACES=$(yabai -m query --spaces 2>&1)
DISPLAYS=$(yabai -m query --displays 2>&1)
WINDOWS=$(yabai -m query --windows 2>&1)

WARNING="null"

# check if yabai returned an unexpected item
# (prefixed with text "yabai-msg:" instead of json object)
#
# This is usually an error. We can show it.
if [[ $SPACES == yabai-msg:* ]]; then
  echo "{\"error\":\"$SPACES\"}"
  exit 1
fi
if [[ $DISPLAYS == yabai-msg:* ]]; then
  echo "{\"error\":\"$DISPLAYS\"}"
  exit 1
fi
if [[ $WINDOWS == yabai-msg:* ]]; then
  echo "{\"error\":\"$WINDOWS\"}"
  exit 1
fi

if [[ $WINDOWS == "[]" ]]; then
  # a bug in yabai may return an empty array for windows

  # in that case we attempt to construct the full list from each space
  query_window_for_space() {
    local space_id=$1
    yabai -m query --windows --space $space_id 2>&1
  }

  WINDOWS="[]"
  SPACE_INDICES=$(echo $SPACES | jq '.[].index')
  for space_id in $SPACE_INDICES; do
    WINDOWS=$(echo $WINDOWS | jq --argjson new_windows "$(query_window_for_space $space_id)" '. + $new_windows')
  done

  if [[ $WINDOWS != "[]" ]]; then
    WARNING="\"clarity-msg: yabai's commands are bugged, restart WM to fix\""
  fi

  # verify that the final output is valid parsable json
  if ! echo $WINDOWS | jq . >/dev/null 2>&1; then
    echo "{\"error\":\"clarity-msg: yabai not outputting windows and clarity workaround failed\"}"
    exit 1
  fi

fi

echo $(cat <<-EOF
{
  "spaces": $SPACES,
  "displays": $DISPLAYS,
  "windows": $WINDOWS,
  "warning": $WARNING
}
EOF
)
