import styles from "./lib/styles.jsx";
import parse from "./lib/parse.jsx";
import symbols from "./lib/symbols.jsx";

const style = {
    padding: "0 8px",
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "16px",
    position: "fixed",
    overflow: "hidden",
    padding: "4px 8px",
    height: "20px",
    width: "auto",
    bottom: "0px",
    right: "0px",
    fontFamily: styles.fontFamily,
    lineHeight: styles.lineHeight,
    fontSize: styles.fontSize,
    color: styles.colors.minimalFg,
    fontWeight: styles.fontWeight,
    zIndex: 102,
};

export const refreshFrequency = 2000;
export const command = "./clarity/scripts/status.sh";

export const render = ({ output }) => {
    const data = parse(output);
    if (typeof data === "undefined") {
        return null;
    }
    if (typeof data.error !== "undefined") {
        return null;
    }

    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return (
        <div style={style}>
            {symbols.clock + " " + new Date(Date.now()+2000).toLocaleString("en-SG", options)}
        </div>
    );
};

export default null;
