import symbols from "./symbols.jsx";
import styles from "./styles.jsx";
import settings from "./settings.jsx";
import { getAppIconPath, getAppIconName } from "./getAppIcon.jsx";
import { run } from "uebersicht";

//
// Styles
//

const containerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "8px",
    fontSize: styles.fontSize,
    height:     styles.heightWithoutPadding + "px",
    lineHeight: styles.heightWithoutPadding + "px",
    WebkitUserSelect: "none",
};
const desktopGroupBaseStyle = {
    minWidth: settings.bar.space.minWidth + "px",
    height: containerStyle.height,
    padding: "0 " + settings.bar.space.paddingHorizontal + "px",
    margin: "0px",
    borderRadius: Math.max(0, Math.round(styles.heightWithoutPadding*settings.bar.space.roundedCornersFactor/2)) + "px",
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

const unselectedStyleMinimal = {
    background: styles.colors.button.dimFg,
}
const halfSelectedStyleMinimal = {
    background: styles.colors.button.halfDimFg,
}
const selectedStyleMinimal = {
    background: styles.colors.button.fg,
}


const appIconStyle = {
    display: "inline-block",
    verticalAlign: "middle",
    width: "16px",
    height: "16px",
    margin: "0px 1px",
    marginTop: "-1px",
    objectFit: "contain",
    filter: "drop-shadow(0 0 6px #333a)"
};
const appExtraInfoStyle = {
    fontWeight: "normal",
    opacity: 0.8,
    margin: "0px 2px",
    marginTop: "-1px",
    fontSize: "10px",
}
const stackAppIconStyleOverride = {
    marginLeft: "-8px",
    filter: "drop-shadow(0 0 6px #333f)"
};
const appIconStyleOverride = (windowData) => {
    let result = {};
    if (windowData["is-minimized"] || windowData["is-hidden"]) {
        result.opacity = 0.35;
    }
    if (windowData["stack-index"] > 0) {
        result = {...result, ...stackAppIconStyleOverride};
    }
    return result;
};


//
// Functions
//

let obtainIconRan = {};
const getAppIconElement = (appData, styleOverrides) => {
    let appName = appData.app;
    let appWindowId = appData.id;

    if (!settings.bar.space.showApps) return null;
    if (settings.bar.space.minimal || styles.heightWithoutPadding < 16) return (<span>{symbols.app}</span>);

    let appIconName      = getAppIconName(appName);
    let relAppIconPath   = appIconName ? getAppIconPath(appName) : null;
    let obtainIconScript = appIconName ? ("./clarity/scripts/prepAppIcon.sh " + JSON.stringify(appIconName)) : null;

    let runScript = async () => {
        if (obtainIconScript) {
            if (obtainIconRan[appIconName] == null) {
                console.log("Attempting auto extraction of app icon for " + appIconName + "!");
                return (obtainIconRan[appIconName] = run(obtainIconScript));
            } else {
                return obtainIconRan[appIconName];
            }
        }
    }
    if (!styleOverrides) styleOverrides = {};
    return (
        <img style={{...appIconStyle, ...styleOverrides}} src={relAppIconPath} alt={appName}
            onMouseDownCapture={async () => {
                if (appWindowId) {
                    await run('PATH=/usr/local/bin/:/opt/local/bin/:$PATH yabai -m window --focus ' + appWindowId);
                }
            }}
            onError={async e => {
                let target = e.target;
                target.onerror = () => {
                    target.onerror = null;
                    target.src = null;
                };
                console.log("Cache miss! App icon for " + appIconName + " will be cached at " + relAppIconPath);
                let result = await runScript();
                if (result && result.indexOf("FAILED") == -1) {
                    console.log("Sucessfully cached app icon for " + appIconName + "!");
                    target.src = relAppIconPath;
                } else {
                    console.error("Cannot find app icon for " + appIconName + "!");
                    console.error("Please check and run clarity/scripts/prepAppIcon.sh for more information of how Clarity obtains app icons. You may fix this by including more directories to search for, or by manually including custom icons in clarity/appIcon/, or by manually adding new mappings in clarity/lib/getAppIcon.jsx (if the running app name as seen in Menu Bar does not match the *.app name).")
                }
            }}
            onDragStart={e => { e.preventDefault(); return false; }}>
        </img>
    );
}

// Renders single sticky window element
const renderStickyWindow = (displayData, stickyWindow) => {
    if (styles.heightWithoutPadding < 16) return null;

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
        <div style={contentStyle} onMouseDownCapture={async () => {
                stickyWindow.id && await run('PATH=/usr/local/bin/:/opt/local/bin/:$PATH yabai -m window --focus ' + stickyWindow.id);
            }}>
            {stickyWindowSymbol} {getAppIconElement(stickyWindow, appIconStyleOverride(stickyWindow))}
        </div>
    );
}

// Renders single space element
const renderSpace = (index, focused, visible, nativeFullscreen, windows) => {
    let contentStyle = desktopGroupBaseStyle;
    if (styles.heightWithoutPadding < 16) {
        if (focused == 1) {
            contentStyle = {...contentStyle, ...selectedStyleMinimal};
        } else if (visible == 1) {
            contentStyle = {...contentStyle, ...halfSelectedStyleMinimal};
        } else {
            contentStyle = {...contentStyle, ...unselectedStyleMinimal};
        }
        return (
            <div style={contentStyle} onMouseDownCapture={async () => {
                await run('PATH=/usr/local/bin/:/opt/local/bin/:$PATH yabai -m space --focus ' + index)
            }}/>
        );
    }

    if (focused == 1) {
        contentStyle = {...contentStyle, ...selectedStyle};
    } else if (visible == 1) {
        contentStyle = {...contentStyle, ...halfSelectedStyle};
    } else {
        contentStyle = {...contentStyle, ...unselectedStyle};
    }

    let leadingStr = ""
    let itemRenders = [];
    let trailingStr = "";

    if (settings.bar.space.icons.length > index-1) {
        leadingStr = settings.bar.space.icons[index-1];
    } else if (settings.bar.space.showIndex) {
        leadingStr += index;
    }

    if (nativeFullscreen) {
        if (settings.bar.space.minimal) {
            leadingStr += symbols.zoom;
        } else {
            trailingStr += symbols.zoom;
        }
    }

    if (settings.bar.space.showApps) {
        let nonStickyWindows = windows.filter(w => !w["is-sticky"])
        nonStickyWindows.sort((a,b) => {
            if (a["is-floating"] != b["is-floating"]) {
                return a["is-floating"] ? -1 : 1;
            }
            if (a["has-fullscreen-zoom"] != b["has-fullscreen-zoom"]) {
                return a["has-fullscreen-zoom"] ? -1 : 1;
            }
            if (a.frame.x == b.frame.x) {
                if (a.frame.y == b.frame.y) {
                    return (a["stack-index"] - b["stack-index"]);
                }
                return a.frame.y - b.frame.y;
            }
            return a.frame.x - b.frame.x;
        });

        let tempStackData = [];
        function renderStack() {
            if (tempStackData.length == 0) return false;
            itemRenders.push((
                <div style={stackDesktopSubgroupStyle}>
                    {tempStackData.map(w =>
                        getAppIconElement(w, appIconStyleOverride(w))
                    )}
                </div>
            ));
            tempStackData = [];
            return true;
        }
        function renderSeparator(w1, w2) {
            if (settings.bar.space.minimal || styles.heightWithoutPadding < 16) return;
            if (!w1) return;
            if (
                (!w2 && (w1["is-floating"] || w1["has-fullscreen-zoom"])) ||
                (!!w2 && w1["is-floating"] != w2["is-floating"]) ||
                (!!w2 && w1["has-fullscreen-zoom"] != w2["has-fullscreen-zoom"])
            ) {
                let isLeadingZoom = w1["has-fullscreen-zoom"] && (!w2 || !w2["has-fullscreen-zoom"]);
                let isLeadingFloating = w1["is-floating"] && (!w2 || !w2["is-floating"]);
                let zoomSymbol = isLeadingZoom ? symbols.zoom : "";
                let floatingSymbol = isLeadingFloating ? symbols.float : "";
                let sepSymbol = !isLeadingZoom && !isLeadingFloating ? "|" : "";
                itemRenders.push(<span style={appExtraInfoStyle}>{floatingSymbol}{zoomSymbol}{sepSymbol}{!!w2 ? " " : ""}</span>);
            }
        }
        for (let i = 0; i < nonStickyWindows.length; i++) {
            let w = nonStickyWindows[i];
            if (w["stack-index"] == 0 || settings.bar.space.minimal || styles.heightWithoutPadding < 16) {
                if (renderStack()) {
                    if (i - 1 >= 0) {
                        let prevW = nonStickyWindows[i - 1];
                        renderSeparator(prevW, w);
                    }
                }

                itemRenders.push(getAppIconElement(w, appIconStyleOverride(w)));

                if (i + 1 < nonStickyWindows.length) {
                    let nextW = nonStickyWindows[i+1];
                    renderSeparator(w, nextW);
                }

            } else {
                tempStackData.push(w);
            }
        }
        renderStack()
        if (nonStickyWindows.length > 0) {
            renderSeparator(nonStickyWindows[nonStickyWindows.length - 1], null);
        }
    }

    return (
        <div style={contentStyle} onMouseDownCapture={async () => {
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
