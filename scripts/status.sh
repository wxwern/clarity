#!/bin/bash

BATTERY_PERCENTAGE=$(pmset -g batt | egrep '([0-9]+\%).*' -o --colour=auto | cut -f1 -d'%') # as number
BATTERY_STATUS=$(pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19) # "AC" or "Ba"
BATTERY_STATUS_DETAILED=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\;   -f2 | cut -c 2-) # as string

POWER_TIME_REMAINING=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\;  -f3 | cut -d\   -f2) # as ?:??, usually
LOW_POWER_MODE=$(if [[ "$(pmset -g | grep 'lowpowermode' | tail -c 2)" == 1 ]]; then echo "true"; else echo "false"; fi) # as true/false

#if remaining estimate is '(no estimate)' then use '?:??' instead
if [[ $POWER_TIME_REMAINING == "(no" ]]; then
    POWER_TIME_REMAINING="?:??"
fi

BATTERY_CHARGING=""
IS_WIRED="false"
if [ "$BATTERY_STATUS" == "AC" ]; then
  IS_WIRED="true"
fi

if [[ "$BATTERY_STATUS_DETAILED" == "charging" || "$BATTERY_STATUS_DETAILED" == "finishing charge" ]]; then
  BATTERY_CHARGING="true"
else
  BATTERY_CHARGING="false"
fi

if [[ "$BATTERY_STATUS_DETAILED" == "AC attached" ]]; then
    POWER_TIME_REMAINING="-:--"
    BATTERY_CHARGING="false"
fi

if [[ -z "$BATTERY_PERCENTAGE" ]]; then
    BATTERY_PERCENTAGE=-100;
    POWER_TIME_REMAINING="-:--"
    BATTERY_STATUS_DETAILED="Wired-only power"
fi

CPU_TEMP_LIMITED=$((s=( $(pmset -g therm | grep 'CPU_Speed_Limit') ) && (( "${s[2]}" >= 75 )) && echo "false") || echo "true")
LOAD_AVERAGE=$(sysctl -n vm.loadavg | awk '{print $2}')
CORES_AVAILABLE=$(nproc || echo 0)

echo $(cat <<-EOF
{
    "power": {
        "battery": {
            "percentage": $BATTERY_PERCENTAGE,
            "charging": $BATTERY_CHARGING
        },
        "wired": $IS_WIRED,
        "lowPowerMode": $LOW_POWER_MODE,
        "status": "$BATTERY_STATUS_DETAILED",
        "timeRemaining": "$POWER_TIME_REMAINING"
    },
    "cpu": {
        "loadAverage": $LOAD_AVERAGE,
        "coreCount": $CORES_AVAILABLE,
        "thermalLimited": $CPU_TEMP_LIMITED
    }
}
EOF
)
