#!/bin/bash

PATH=/usr/local/bin/:/opt/local/bin/:$PATH

# Check if yabai exists
if ! [ -x "$(command -v yabai)" ]; then
  echo "{\"error\":\"yabai binary not found\"}"
  exit 1
fi

SPACES=$(yabai -m query --spaces 2>&1)
DISPLAYS=$(yabai -m query --displays 2>&1)
FOCUSED_WINDOW=$(yabai -m query --windows --window 2>&1)

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
if [[ $FOCUSED_WINDOW == yabai-msg:* || $FOCUSED_WINDOW =~ "could not retrieve"* ]]; then
  FOCUSED_WINDOW="null"
fi

echo $(cat <<-EOF
{
  "spaces": $SPACES,
  "displays": $DISPLAYS,
  "focusedWindow": $FOCUSED_WINDOW
}
EOF
)
