#!/bin/bash
query="$(yabai -m query --windows --window)"
if [[ "$(echo $query | jq -r '.display')" == "$1" ]]; then
    echo $query | jq -r '.title' 
fi
