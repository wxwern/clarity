import symbols from "./symbols.jsx";
import styles from "./styles.jsx";
import { getAppIconPath, getAppIconName } from "./getAppIcon.jsx";
import { run } from "uebersicht";

//
// Styles
//

const containerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "8px",
    fontSize: "12px",
    lineHeight: "20px",
    webkitUserSelect: "none",
};

const desktopBaseStyle = {
    minWidth: "12px",
    height: "20px",
    margin: "0px",
    padding: "0 11px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 100ms ease-out",
};

const appIconStyle = {
    display: "inline-block",
    verticalAlign: "top",
    width: "16px",
    height: "16px",
    margin: "2px",
    objectFit: "contain",
};

const unselectedStyle = {
    color: styles.colors.button.dimFg,
    background: styles.colors.button.dimBg
}
const selectedStyleInactiveDisplay = {
    color: styles.colors.button.halfDimFg,
    background: styles.colors.button.halfDimBg,
}

const selectedStyle = {
    color: styles.colors.button.fg,
    background: styles.colors.button.bg,
    fontWeight: "bold",
}



//
// Functions
//

let obtainIconRan = {};
const getAppIconImgTag = (appName) => {
    let appIconName = getAppIconName(appName)
    let path = getAppIconPath(appName)
    let obtainIconScript = "./clarity/scripts/prepAppIcon.sh " + appIconName;

    let runScript = () => {
        if (obtainIconRan[appIconName] == null) {
            return (obtainIconRan[appIconName] = run(obtainIconScript));
        } else {
            return obtainIconRan[appIconName];
        }
    }
    return (<img style={appIconStyle} src={path} alt={appName} onError={runScript()}></img>)
}

const renderStickyWindow = (displayData, stickyWindow) => {
    let X = displayData.frame.x;
    let Y = displayData.frame.y;
    let W = displayData.frame.w;
    let H = displayData.frame.h;
    let xMid = stickyWindow.frame.x - X + stickyWindow.frame.w/2;
    let yMid = stickyWindow.frame.y - Y + stickyWindow.frame.h/2;
    let stickyWindowSymbol = "";
    if (xMid <= W/2) {
        if (yMid <= H/2) {
            stickyWindowSymbol = (symbols.pipTopLeft);
        } else {
            stickyWindowSymbol = (symbols.pipTopRight);
        }
    } else {
        if (yMid <= H/2) {
            stickyWindowSymbol = (symbols.pipBottomLeft);
        } else {
            stickyWindowSymbol = (symbols.pipBottomRight);
        }
    }

    let contentStyle = {...desktopBaseStyle, ...selectedStyleInactiveDisplay};
    return (
        <div style={contentStyle} onClick={async () => {
                stickyWindow.id && await run('/usr/local/bin/yabai -m window --focus ' + stickyWindow.id);
            }}>
            {stickyWindowSymbol} {getAppIconImgTag(stickyWindow["app"])}
        </div>
    );
}

const renderSpace = (index, focused, visible, nativeFullscreen, windows) => {
    let contentStyle = desktopBaseStyle;
    if (focused == 1) {
        contentStyle = {...contentStyle, ...selectedStyle};
    } else if (visible == 1) {
        contentStyle = {...contentStyle, ...selectedStyleInactiveDisplay};
    } else {
        contentStyle = {...contentStyle, ...unselectedStyle};
    }

    let nonStickyWindows = windows.filter(w => !w["is-sticky"])

    let str = ""+index;
    if (nativeFullscreen) {
        str += " ";
        if (windows.length > 1) {
            str += symbols.splitScreen;
        } else {
            str += symbols.fullscreen;
        }
    }
    if (nonStickyWindows.length > 0) {
        str += " ";
        nonStickyWindows.sort((a,b) => {
            if (a.frame.x == b.frame.x) {
                if (a.frame.y == b.frame.y) {
                    return a["stack-index"] - b["stack-index"];
                }
                return a.frame.y - b.frame.y;
            }
            return a.frame.x - b.frame.x;
        })
    }
    return (
        <div style={contentStyle} onClick={async () => {
                await run('/usr/local/bin/yabai -m space --focus ' + index)
            }}>
            {str}{
                nonStickyWindows.map(w => getAppIconImgTag(w["app"]))
            }
        </div>
    );
};

const render = ({ displayData, spaceData, windowData }) => {
    if (typeof spaceData === "undefined") return null;

    const spaces = [];

    spaceData.forEach(function(space) {
        spaces.push(renderSpace(
            space.index,
            space["has-focus"],
            space["is-visible"],
            space["is-native-fullscreen"],
            windowData.filter(w => w.space === space.index)
        ));
    });

    let stickyWindows = windowData.filter(w => w["is-sticky"]);
    let stickyWindowElements = [];
    stickyWindows.forEach(stickyWindow => {
        stickyWindowElements.push(renderStickyWindow(displayData, stickyWindow))
    });

    return (
        <div style={containerStyle}>
            {stickyWindowElements}
            {spaces}
        </div>
    );
};

export default render;
