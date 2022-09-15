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
    WebkitUserSelect: "none",
};
const desktopGroupBaseStyle = {
    minWidth: "12px",
    height: "20px",
    padding: "0 11px",
    margin: "0px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 100ms ease-out",
};
const stackDesktopSubgroupStyle = {
    display: "inline-block",
    height: "100%",
    width: "auto",
    margin: "0",
    paddingLeft: "10px"
}
const unselectedStyle = {
    color: styles.colors.button.dimFg,
    background: styles.colors.button.dimBg
}
const halfSelectedStyle = {
    fontWeight: "bold",
    color: styles.colors.button.halfDimFg,
    background: styles.colors.button.halfDimBg,
}
const selectedStyle = {
    color: styles.colors.button.fg,
    background: styles.colors.button.bg,
    fontWeight: "bold",
}


const appIconStyle = {
    display: "inline-block",
    verticalAlign: "top",
    width: "16px",
    height: "16px",
    margin: "2px 1px",
    objectFit: "contain",
    filter: "drop-shadow(0 0 6px #333a)"
};
const stackAppIconStyleOverride = {
    marginLeft: "-8px",
    filter: "drop-shadow(0 0 6px #333f)"
};



//
// Functions
//

let obtainIconRan = {};
const getAppIconImgTag = (appName, styleOverrides) => {
    let appIconName = getAppIconName(appName)
    let path = getAppIconPath(appName)
    let obtainIconScript = "./clarity/scripts/prepAppIcon.sh " + JSON.stringify(appIconName);
    let runScript = async () => {
        if (obtainIconRan[appIconName] == null) {
            console.log("Attempting auto retrieval of app icon for " + appIconName + "!");
            return (obtainIconRan[appIconName] = run(obtainIconScript));
        } else {
            return obtainIconRan[appIconName];
        }
    }
    if (!styleOverrides) styleOverrides = {};
    return (
        <img style={{...appIconStyle, ...styleOverrides}} src={path} alt={appName}
            onError={async e => {
                let target = e.target;
                target.onerror = null;
                await runScript();
                console.log("Reloading app icon at path: " + path);
                target.src = path;
            }}>
        </img>
    );
}

// Renders single sticky window element
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
            stickyWindowSymbol = (symbols.pipBottomLeft);
        }
    } else {
        if (yMid <= H/2) {
            stickyWindowSymbol = (symbols.pipTopRight);
        } else {
            stickyWindowSymbol = (symbols.pipBottomRight);
        }
    }

    let contentStyle = {...desktopGroupBaseStyle, ...halfSelectedStyle};
    return (
        <div style={contentStyle} onClick={async () => {
                stickyWindow.id && await run('PATH=/usr/local/bin/:/opt/local/bin/:$PATH yabai -m window --focus ' + stickyWindow.id);
            }}>
            {stickyWindowSymbol} {getAppIconImgTag(stickyWindow["app"])}
        </div>
    );
}

// Renders single space element
const renderSpace = (index, focused, visible, nativeFullscreen, windows) => {
    let contentStyle = desktopGroupBaseStyle;
    if (focused == 1) {
        contentStyle = {...contentStyle, ...selectedStyle};
    } else if (visible == 1) {
        contentStyle = {...contentStyle, ...halfSelectedStyle};
    } else {
        contentStyle = {...contentStyle, ...unselectedStyle};
    }

    let nonStickyWindows = windows.filter(w => !w["is-sticky"])

    let leadingStr = ""
    let trailingStr = "";

    leadingStr += index;
    if (nativeFullscreen) {
        trailingStr += symbols.zoom;
    }

    nonStickyWindows.sort((a,b) => {
        if (a.frame.x == b.frame.x) {
            if (a.frame.y == b.frame.y) {
                return -(a["stack-index"] - b["stack-index"]);
            }
            return a.frame.y - b.frame.y;
        }
        return a.frame.x - b.frame.x;
    });

    let itemRenders = [];
    let tempStackData = [];
    function renderStack() {
        if (tempStackData.length == 0) return;
        itemRenders.push((
            <div style={stackDesktopSubgroupStyle}>
                {tempStackData.map(w =>
                    getAppIconImgTag(w["app"], stackAppIconStyleOverride)
                )}
            </div>
        ));
        tempStackData = [];
    }
    for (let w of nonStickyWindows) {
        if (w["stack-index"] == 0) {
            renderStack();
            itemRenders.push(getAppIconImgTag(w["app"]));
        } else {
            tempStackData.push(w);
        }
    }
    renderStack();

    return (
        <div style={contentStyle} onClick={async () => {
                await run('PATH=/usr/local/bin/:/opt/local/bin/:$PATH yabai -m space --focus ' + index)
            }}>
            {leadingStr} {itemRenders} {trailingStr}
        </div>
    );
};

const render = ({ displayData, spaceData, windowData, placeholder }) => {
    if (typeof placeholder !== "undefined") return (
        <div style={containerStyle}>
            <div style={{...desktopGroupBaseStyle, ...unselectedStyle}}>
                {placeholder}
            </div>
        </div>
    );
    if (typeof spaceData === "undefined") return null;
    if (typeof displayData === "undefined") return null;
    if (typeof windowData === "undefined") windowData = [];

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
