import Desktop from "./lib/Desktop.jsx";
import Error from "./lib/Error.jsx";
import parse from "./lib/parse.jsx";
import styles from "./lib/styles.jsx";
import settings from "./lib/settings.jsx";

const style = {
    padding: "0 8px",
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "16px",
    position: "fixed",
    overflow: "hidden",
    padding: "4px 8px",
    width: "auto",
    ...(settings.bar.alignBottom ? {bottom: "0px"} : {top: "0px"}),
    left: "0px",
    fontFamily: styles.fontFamily,
    lineHeight: styles.lineHeight,
    fontSize: styles.fontSize,
    color: styles.colors.dim,
    fontWeight: styles.fontWeight,
    zIndex: 101,
};

export const refreshFrequency = false;
export const command = "./clarity/scripts/windows.sh";

export const render = ({ output }, ...args) => {
    const data = parse(output);
    const displayId = Number(window.location.pathname.split("/")[1]);
    if (typeof output === "undefined") {
        return (
            <div style={style}>
                <Desktop placeholder={"..."}/>
            </div>
        );
    }
    if (typeof data === "undefined") {
        return (
            <div style={style}>
                <Desktop placeholder={"invalid"}/>
            </div>
        );
    }
    if (typeof data.error !== "undefined") {
        return (
            <div style={style}>
                <Desktop placeholder={"error"}/>
            </div>
        );
    }
    if (!data.spaces || !data.displays) {
        return (
            <div style={style}>
                <Desktop placeholder={"unknown"}/>
            </div>
        );
    }
    const display = data.displays.find(d => d.id === displayId);
    return (
        <div style={style}>
            <Desktop
                displayData={display}
                spaceData={data.spaces.filter(s => s.display === display.index)}
                windowData={data.windows.filter(w => w.display === display.index)}
            />
        </div>
    );
};

export default null;
