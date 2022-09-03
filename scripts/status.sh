#!/bin/bash

CPU_TEMP=$((s=( $(pmset -g therm | grep 'CPU_Speed_Limit') ) && (( "${s[2]}" >= 70 )) && echo "OK") || echo "HOT")

echo $(cat <<-EOF
{
}
EOF
)
