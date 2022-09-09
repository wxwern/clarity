import styles from "./lib/styles.jsx";
import parse from "./lib/parse.jsx";
import symbols from "./lib/symbols.jsx";
import Error from "./lib/Error.jsx";

const wallpaperBlurStyle = {
    backgroundColor: styles.colors.bgTint,
    WebkitBackdropFilter: "blur(10px)",
    position: "fixed",
    ...(styles.alignBottom ? {
        bottom: "28px",
        top: "0"
    } : {
        top: "28px",
        bottom: "0"
    }),
    left: "0",
    right: "0",
    zIndex: 99,
    transition: "opacity 1s ease-out",
}
const style = {
    backgroundColor: styles.colors.bgTint,
    position: "fixed",
    ...(styles.alignBottom ? {bottom: "0px"} : {top: "0px"}),
    left: "0px",
    right: "0px",
    height: "28px",
    lineHeight: "28px",
    width: "auto",
    WebkitBackdropFilter: "blur(20px)",
    WebkitUserSelect: "none",
    cursor: "default",
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    fontSize: styles.fontSize,
    textAlign: "center",
    transition: "all 100ms ease-out",
    color: styles.colors.fg,
    zIndex: 100,
}
const dimmedStyle = {
    color: styles.colors.dim,
}

export const refreshFrequency = false;
export const command = "./clarity/scripts/spaces.sh";
export const render = ({ output }) => {
    if (typeof output === "undefined") {
        return (
            <div style={style}>Loading...</div>
        )
    }
    const data = parse(output);
    if (typeof data === "undefined") {
        return (
            <div style={style}>
                <Error msg="Unrecognised script output!" />
            </div>
        );
    }
    if (!data.spaces || !data.displays) {
        return (
            <div style={style}>
                <Error msg="Script output has missing data!" />
            </div>
        );
    }
    if (typeof data.error !== "undefined") {
        return (
            <div style={style}>
                <Error msg={`Error: ${data.error}`}  />
            </div>
        );
    }

    const numDisplays = data.displays.length;
    const displayId = Number(window.location.pathname.split("/")[1]);
    const displayData      = data.displays.find(d => d.id === displayId) || data.displays[0];
    const visibleSpaceData = displayData && data.spaces.filter(s => s.display === displayData.index && s["is-visible"])[0];

    if (!displayData || !visibleSpaceData) {
        return (
            <div style={style}>
                <Error msg="No visible space!" />
            </div>
        );
    }

    let currentStyle    = visibleSpaceData["has-focus"] ? style : {...style, ...dimmedStyle};
    let backgroundStyle = visibleSpaceData.windows.length > 0 ? wallpaperBlurStyle : {...wallpaperBlurStyle, opacity: 0};

    let outComps = [];
    if (numDisplays > 1) {
        outComps.push(symbols.display + " " + displayData.index);
    }
    if (visibleSpaceData) {
        outComps.push(
            (visibleSpaceData.type === "bsp" ? symbols.bsp : symbols.float)
            + " " + visibleSpaceData.type
        );
    }
    outComps.push(symbols.space + " " + visibleSpaceData.index)

    let outStr = outComps.join(" / ");
    return (
        <div>
            <div style={backgroundStyle}></div>
            <div style={currentStyle}>{outStr}</div>
        </div>
    );
};

export default null;
