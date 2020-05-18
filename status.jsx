import DateTime from "./lib/DateTime.jsx";
import Battery from "./lib/Battery.jsx";
import Wifi from "./lib/Wifi.jsx";
import Ethernet from "./lib/Ethernet.jsx";
import VPN from "./lib/VPN.jsx";
import TimeMachine from "./lib/TimeMachine.jsx";
import Dnd from "./lib/Dnd.jsx";
import Error from "./lib/Error.jsx";
import parse from "./lib/parse.jsx";
import styles from "./lib/styles.jsx";

const style = {
    display: "grid",
    padding: "0 12px",
    gridAutoFlow: "column",
    gridGap: "16px",
    position: "fixed",
    overflow: "hidden",
    right: "0px",
    top: "0px",
    color: styles.colors.fg,
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    fontWeight: styles.fontWeight
};

export const refreshFrequency = 2000;

export const command = "./miniyabar/scripts/status.sh";

export const render = ({ output }) => {
    const data = parse(output);
    if (typeof data === "undefined") {
        return (
            <div style={style}>
                <Error msg="Error: unknown script output" side="right" />
            </div>
        );
    }
    return (
        <div style={style}>
            <Wifi output={data.wifi} />
            <Ethernet output={data.ethernet}/>
            <VPN output={data.vpn}/>
            <Battery output={data.battery} />
            <DateTime output={data.datetime} />
            <TimeMachine output={data.timemachine}/>
            <Dnd output={data.dnd} />
        </div>
    );
};

export default null;
