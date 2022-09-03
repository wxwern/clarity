#!/bin/bash

PATH=/usr/local/bin/:$PATH

# Check if yabai exists
if ! [ -x "$(command -v yabai)" ]; then
  echo "{\"error\":\"yabai binary not found\"}"
  exit 1
fi

SPACES=$(yabai -m query --spaces)
DISPLAYS=$(yabai -m query --displays)
WINDOWS=$(yabai -m query --windows)

echo $(cat <<-EOF
{
  "spaces": $SPACES,
  "displays": $DISPLAYS,
  "windows": $WINDOWS
}
EOF
)
