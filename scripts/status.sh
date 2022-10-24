#!/bin/bash

WIFI_INTERFACE="en7"
ETHERNET_INTERFACE="en7"
VPN_WIREGUARD_IP_PREFIX="10.10.0"

#
# BATTERY STATUS
#
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

#
# CPU STATUS
#
CPU_TEMP_LIMITED=$((s=( $(pmset -g therm | grep 'CPU_Speed_Limit') ) && (( "${s[2]}" >= 75 )) && echo "false") || echo "true")
LOAD_AVERAGE=$(sysctl -n vm.loadavg | awk '{print $2}')
CORES_AVAILABLE=$(if [[ -z "$(which nproc)" ]]; then echo 0; else nproc; fi)

#
# TIME MACHINE STATUS
#
TM_STATUS=$(if [[ "$(tmutil status | grep Running | cut -d\=  -f2 | cut -c 2- | cut -c 1)" == "1" ]]; then echo true; else echo false; fi)

#
# WIFI STATUS
#
WIFI_SSID=""
WIFI_CONNECTED="false"
if [[ ! -z "$WIFI_INTERFACE" ]]; then
    WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
    if [[ "$WIFI_STATUS" == "active" ]]; then
        WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)
        WIFI_CONNECTED="true"
    fi
fi

#
# ETHERNET STATUS
#
if [[ ! -z "$ETHERNET_INTERFACE" ]]; then
    ETHERNET_STATUS=$(ifconfig "$ETHERNET_INTERFACE" 2>&1 | grep status | cut -c 10-)
fi
ETHERNET_CONNECTED=$(if [[ "$ETHERNET_STATUS" == "active" ]]; then echo true; else echo false; fi)

#
# SECURE TEXT INPUT
#
SECURE_TEXT_INPUT_ENABLED=$(if [ "$(ioreg -l -d 1 -w 0 | grep SecureInput | wc -l)" -gt 0 ]; then echo "true"; else echo "false"; fi)


# final output!
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
    },
    "wifi": {
        "connected": $WIFI_CONNECTED,
        "ssid": "$WIFI_SSID"
    },
    "ethernet": {
        "connected": $ETHERNET_CONNECTED
    },
    "timeMachine": {
        "running": $TM_STATUS
    },
    "secureInput": {
        "enabled": $SECURE_TEXT_INPUT_ENABLED
    }
}
EOF
)
