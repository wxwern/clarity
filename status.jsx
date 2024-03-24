import styles from "./lib/styles.jsx";
import settings from "./lib/settings.jsx";
import parse from "./lib/parse.jsx";
import { run } from "uebersicht";
import Error from "./lib/Error.jsx";
import Clock from "./lib/Clock.jsx";
import Power from "./lib/Power.jsx";
import CPU from "./lib/CPU.jsx";
import WiFi from "./lib/WiFi.jsx";
import VPN from "./lib/VPN.jsx";
import Ethernet from "./lib/Ethernet.jsx";
import TimeMachine from "./lib/TimeMachine.jsx";
import SecureInput from "./lib/SecureInput.jsx";

const defaultStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "16px",
    position: "fixed",
    overflow: "hidden",
    padding: styles.padding + "px" + " " + settings.bar.paddingHorizontal + "px",
    height:     styles.heightWithoutPadding + "px",
    lineHeight: styles.heightWithoutPadding + "px",
    width: "auto",
    ...(settings.bar.alignBottom ? {bottom: "0px"} : {top: "0px"}),
    right: "0px",
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    color: styles.colors.minimalFg,
    fontWeight: styles.fontWeight,
    WebkitUserSelect: "none",
    cursor: "default",
    zIndex: 102,
};

const showDesktopHitboxStyle = {
    width: "20px",
    height: "20px",
    position: "fixed",
    bottom: "0px",
    right: "0px",
    zIndex: 110
}
const renderShowDesktopButton = () => {
    return (
        <div style={showDesktopHitboxStyle} onClick={() => {
            run("PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH yabai -m space mouse --toggle show-desktop")
        }}></div>
    )
}

const refresh = (dispatch) => {
    let disabled = true;
    for (let key in settings.bar.status) {
        if (settings.bar.status[key]) {
            disabled = false;
            break;
        }
    }

    if (disabled) {
        dispatch({type: 'DATA_UPDATE', output: {}});
    } else {
        run("./clarity/scripts/status.sh").then( (output) => {
            dispatch({type: 'DATA_UPDATE', output: output});
        });
    }
}

export const refreshFrequency = 30000;
export const command = (dispatch) => {
    // This synchronises the update interval with the system clock starting from :00 seconds.
    const scheduleUpdate = (action, updateInterval) => {
        let dd = new Date();
        let nextTimeout = updateInterval - ((dd.getSeconds()*1000 + dd.getMilliseconds()) % updateInterval);
        if (isNaN(nextTimeout) || updateInterval == 0) {
            action()
            return
        }
        nextTimeout = Math.min(Math.max(500, nextTimeout), 60000);

        setTimeout(() => {
            action()
        }, nextTimeout);
    }
    scheduleUpdate(() => dispatch({type: 'TIME_UPDATE'}), 60000);

    // Do standard refreshes normally
    refresh(dispatch);
}
export const updateState = (event, previousState) => {
  switch(event.type) {
      case 'DATA_UPDATE':
          return {output: event.output};
      case 'TIME_UPDATE':
      default:
          return previousState;
  }
}

export const render = ({ output }) => {

    if (settings.bar.fontSize > settings.bar.height || !settings.bar.status) {
        return (
            <div style={defaultStyle}/>
        );
    }

    if (typeof output === "undefined" || !output) {
        return (
            <div style={defaultStyle}>
                {settings.bar.status.clock && <Clock/>}
            </div>
        );
    }

    const data = parse(output);
    let style = {...defaultStyle};

    const displayId = Number(window.location.pathname.split("/")[1]);
    console.log(displayId, data.focusedDisplayId)
    if (data.focusedDisplayId && data.focusedDisplayId !== displayId) {
        style.opacity = "0.5";
    }

    if (typeof data === "undefined") {
        return (
            <div style={style}>
                <Error msg="Can't parse status output!"/>
                {settings.bar.status.clock && <Clock/>}
            </div>
        );
    }
    if (typeof data.error !== "undefined") {
        return (
            <div style={style}>
                <Error msg={data.error}/>
                {settings.bar.status.clock && <Clock/>}
            </div>
        );
    }

    return (
        <div style={style}>
            {settings.bar.status.secureInput && <SecureInput secureInputData={data.secureInput}/>}
            {settings.bar.status.wifi && <WiFi wifiData={data.wifi} ethernetData={data.ethernet}/>}
            {settings.bar.status.ethernet && <Ethernet wifiData={data.wifi} ethernetData={data.ethernet}/>}
            {settings.bar.status.vpn && <VPN vpnData={data.vpn}/>}
            {settings.bar.status.cpu && <CPU cpuData={data.cpu} powerData={data.power}/>}
            {settings.bar.status.timeMachine && <TimeMachine tmData={data.timeMachine}/>}
            {settings.bar.status.power && <Power powerData={data.power}/>}
            {settings.bar.status.clock && <Clock/>}
            {settings.bottomRightClickToShowDesktop && renderShowDesktopButton()}
        </div>
    );
};

export default null;
