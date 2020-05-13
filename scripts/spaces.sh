#!/bin/bash

PATH=/usr/local/bin/:$PATH

# Check if yabai exists
if ! [ -x "$(command -v yabai)" ]; then
  echo "{\"error\":\"yabai binary not found\"}"
  exit 1
fi

SPACES_PRIMARY=$(yabai -m query --spaces --display $1)

echo $(cat <<-EOF
{
  "spaces": $SPACES_PRIMARY,
  "index": $1
}
EOF
)
