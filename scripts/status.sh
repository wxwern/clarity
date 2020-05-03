#!/bin/bash

export LC_TIME="en_US.UTF-8"
TIME=$(date +"%H:%M")
DATE=$(date +"%a %d/%m")

BATTERY_PERCENTAGE=$(pmset -g batt | egrep '([0-9]+\%).*' -o --colour=auto | cut -f1 -d'%')
BATTERY_STATUS=$(pmset -g batt | grep "'.*'" | sed "s/'//g" | cut -c 18-19)
BATTERY_REMAINING=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\;  -f3 | cut -d\   -f2)
BATTERY_STATUS_DETAILED=$(pmset -g batt | egrep -o '([0-9]+%).*' | cut -d\;   -f2 | cut -c 2-)

#if remaining estimate is '(no estimate)' then use '?:??' instead
if [[ $BATTERY_REMAINING == "(no" ]]; then
    BATTERY_REMAINING="?:??"
fi
if [[ $BATTERY_STATUS_DETAILED == "AC attached" ]]; then
    BATTERY_REMAINING="not charging"
fi

BATTERY_CHARGING=""
if [ "$BATTERY_STATUS" == "Ba" ]; then
  BATTERY_CHARGING="false"
elif [ "$BATTERY_STATUS" == "AC" ]; then
  BATTERY_CHARGING="true"
fi

LOAD_AVERAGE=$(sysctl -n vm.loadavg | awk '{print $2}')

WIFI_STATUS=$(ifconfig en0 | grep status | cut -c 10-)
WIFI_SSID=$(networksetup -getairportnetwork en0 | cut -c 24-)

ETHERNET_STATUS=$(ifconfig en7 2>&1 | grep status | cut -c 10-) #custom ethernet config: en7

VPN_STATUS=$(ifconfig | grep "10.10.0" >> /dev/null 2>&1 && echo "active" || echo "inactive") #custom wireguard vpn config: static vpn client ip address

TM_STATUS=$(if [[ "$(tmutil status | grep Running | cut -d\=  -f2 | cut -c 2- | cut -c 1)" == "1" ]]; then echo "active"; else echo "inactive"; fi)

DND=$(defaults -currentHost read com.apple.notificationcenterui doNotDisturb)

echo $(cat <<-EOF
{
    "datetime": {
        "time": "$TIME",
        "date": "$DATE"
    },
    "battery": {
        "percentage": $BATTERY_PERCENTAGE,
        "charging": $BATTERY_CHARGING,
        "status": "$BATTERY_STATUS_DETAILED",
        "remaining": "$BATTERY_REMAINING"
    },
    "cpu": {
        "loadAverage": $LOAD_AVERAGE
    },
    "wifi": {
        "status": "$WIFI_STATUS",
        "ssid": "$WIFI_SSID"
    },
    "ethernet": {
        "status": "$ETHERNET_STATUS"
    },
    "vpn": {
        "status": "$VPN_STATUS"
    },
    "timemachine": {
        "status": "$TM_STATUS"
    },
    "dnd": $DND
}
EOF
)
