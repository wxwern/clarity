import styles from "./lib/styles.jsx";
import settings from "./lib/settings.jsx";
import parse from "./lib/parse.jsx";
import symbols from "./lib/symbols.jsx";
import Error from "./lib/Error.jsx";


const style = {
    backgroundColor: styles.colors.bgTint,
    position: "fixed",
    ...(settings.bar.alignBottom ? {bottom: "0px"} : {top: "0px"}),
    left: "0px",
    right: "0px",
    height    : styles.height + "px",
    lineHeight: styles.height + "px",
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

const wallpaperBlurStyle = settings.backgroundBlurOnWindowOpen ? {
    backgroundColor: styles.colors.bgTint,
    WebkitBackdropFilter: "blur(10px)",
    position: "fixed",
    ...(settings.bar.alignBottom ? {
        bottom: style.height,
        top: "0"
    } : {
        top: style.height,
        bottom: "0"
    }),
    left: "0",
    right: "0",
    zIndex: 99,
    transition: "opacity 1s ease-out",
} : {display: "none"}

export const refreshFrequency = false;
export const command = settings.bar.info ? "./clarity/scripts/spaces.sh" : "";
export const render = ({ output }) => {
    if (settings.bar.fontSize > settings.bar.height || !settings.bar.info) {
        return (
            <div style={style}/>
        );
    }

    if (typeof output === "undefined") {
        return (
            <div style={style}>Loading...</div>
        )
    }
    const data = parse(output);
    if (typeof data === "undefined") {
        return (
            <div style={style}>
                <Error msg="Invalid Status Data!" />
            </div>
        );
    }
    if (typeof data.error !== "undefined" || !data.spaces || !data.displays) {
        return (
            <div style={style}>
                <Error msg={data.error} />
            </div>
        );
    }

    const numDisplays = data.displays.length;
    const displayId = Number(window.location.pathname.split("/")[1]);
    const displayData      = data.displays.find(d => d.id === displayId) || data.displays[0];
    const visibleSpaceData = displayData && data.spaces.filter(s => s.display === displayData.index && s["is-visible"])[0];
    const focusedWindowData = data.focusedWindow;

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
    let windowStr = "";

    if (focusedWindowData) {
        if (settings.bar.info.appName && focusedWindowData.app) {
            if (typeof settings.bar.status.appName !== 'number') {
                windowStr += focusedWindowData.app;
            } else {
                windowStr += focusedWindowData.app.substring(0, settings.bar.status.appName);
            }
        }
        if (settings.bar.info.windowTitle && focusedWindowData.title) {
            if (windowStr) {
                windowStr += " - ";
            }
            if (typeof settings.bar.status.windowTitle !== 'number') {
                windowStr += focusedWindowData.title;
            } else {
                windowStr += focusedWindowData.title.substring(0, +settings.bar.status.windowTitle);
            }
        }
    }


    if (settings.bar.info.display && numDisplays > 1) {
        outComps.push(symbols.display + " " + displayData.index);
    }

    if (settings.bar.info.yabaiMode && visibleSpaceData) {
        let type = visibleSpaceData.type;

        let modePref    = settings.bar.info.yabaiMode;
        let iconOnly    = modePref === "icon";
        let auto        = modePref === true;

        switch (visibleSpaceData.type) {
            case "bsp":
            case "float":
            case "stack":
                if (windowStr && (auto || iconOnly)) {
                    windowStr = symbols[type] + " " + windowStr;
                } else if (iconOnly) {
                    outComps.push(symbols[type]);
                } else {
                    outComps.push(symbols[type] + " " + type);
                }
                break;
            default:
                if (windowStr && (auto || iconOnly)) {
                    windowStr = symbols.macWindow + " " + windowStr;
                } else if (iconOnly) {
                    outComps.push(symbols.float);
                } else {
                    outComps.push(symbols.float + " " + type);
                }
                break;
        }
    }

    if (windowStr) {
        outComps.push(windowStr);
    }

    if (settings.bar.info.space && typeof visibleSpaceData?.index !== undefined) {
        outComps.push(symbols.space + " " + visibleSpaceData.index)
    }

    let outStr = outComps.join(" | ");
    return (
        <div>
            <div style={backgroundStyle}></div>
            <div style={currentStyle}>{outStr}</div>
        </div>
    );
};

export default null;
