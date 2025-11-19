import symbols from "./symbols.jsx";
import styles from "./styles.jsx";
import settings from "./settings.jsx";
import { getAppIconPath, getAppIconName } from "./getAppIcon.jsx";
import { run } from "uebersicht";
import {applyBarHeight, getAutoBarHeight} from "./autoBarHeight.jsx";

//
// Styles
//

const containerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: settings.bar.space.gapHorizontal + "px",
    fontSize: styles.fontSize,
    height:     styles.heightWithoutPadding + "px",
    lineHeight: styles.heightWithoutPadding + "px",
    WebkitUserSelect: "none",
    overflow: "hidden",
};
const desktopGroupBaseStyle = {
    minWidth: settings.bar.space.minWidth + "px",
    height: containerStyle.height,
    lineHeight: containerStyle.lineHeight,
    padding: "0 " + settings.bar.space.paddingHorizontal + "px",
    margin: "auto 0px",
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
    paddingLeft: "10px",
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
    marginTop: "-2px",
    objectFit: "contain",
    transition: "all 250ms ease-out",
    filter: "drop-shadow(0 0 6px #333a)",
};
const appExtraInfoStyle = {
    fontWeight: "heavy",
    position: "relative",
    opacity: 0.75,
    margin: "0px 1px",
    fontSize: "10px",
    mixBlendMode: "color-dodge",
}
const stackAppIconStyleOverride = {
    marginLeft: "-10px",
    filter: "drop-shadow(0 0 8px #0008)",
    transform: "translateZ(-10px) rotateY(35deg)"
};
const appIconStyleOverride = (windowData) => {
    let result = { transform: "", borderBottom: "0px solid #0000" };

    if (windowData["is-minimized"] || windowData["is-hidden"]) {
        result.opacity = 0.5;
        result.transform = "translateY(+20%) rotateX(60deg)";
        result.filter = "grayscale(50%)";
        return result;
    }

    if (windowData["stack-index"] > 0) {
        result = {...stackAppIconStyleOverride};

        if (windowData["has-focus"]) {
            result.transform += " translateY(-10%)";
        }
    }

    if (windowData["is-visible"] && !windowData["is-sticky"]) {
        if (windowData["has-focus"]) {
            result.transform += " scale(1) translateY(-5%)";
            if (windowData["stack-index"] > 0) {
                result.filter = "drop-shadow(0px 1px 6px #ffff)";
                result.borderBottom = "1.5px solid #ffff";
                result.opacity = 1;
            } else {
                result.filter = "drop-shadow(0px 1px 6px #fff8)";
                result.borderBottom = "1.5px solid #fffc";
            }
        } else {
            if (windowData["stack-index"] > 0) {
                result.transform += " translateY(+5%)";
                result.opacity = 0.85;
            } else {
                result.filter = "drop-shadow(0 0 4px #fff2)",
                result.transform += " translateY(+5%)";
            }
        }
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
                console.log("[clarity]", "Attempting auto extraction of app icon for " + appIconName + "!");
                return (obtainIconRan[appIconName] = run(obtainIconScript));
            } else {
                return obtainIconRan[appIconName];
            }
        }
    }
    if (!styleOverrides) styleOverrides = {};
    return (<span
        key={"" + appData["id"]}
        style={{
            display: "inline-block",
            padding: "0px",
            margin: "0px",
            alignItems: "center",
            justifyContent: "center",
            opacity: styleOverrides.opacity ? styleOverrides.opacity : 1,
            perspective: "100px",
            transition: "all 250ms ease-out",
        }}
    >
        <img style={{...appIconStyle, ...styleOverrides}} src={relAppIconPath} alt={appName}
            onMouseDownCapture={async () => {
                if (appWindowId) {
                    await run('PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH yabai -m window --focus ' + appWindowId);
                }
            }}
            onError={async e => {
                let target = e.target;
                target.onerror = target.onError = () => {
                    target.onerror = null;
                    target.onError = null;
                    target.src = null;
                };
                console.log("[clarity]", "Cache miss! App icon for " + appIconName + " will be cached at " + relAppIconPath);
                console.log("[clarity]", "Executing:", obtainIconScript);

                let result = await runScript();
                if (result && result.indexOf("FAILED") == -1) {
                    console.log("[clarity]", "Sucessfully cached app icon for " + appIconName + "!");
                    target.src = relAppIconPath;
                } else {
                    console.log(result);
                    console.error("[clarity]", "Cannot find app icon for " + appIconName + "!");
                    console.error("[clarity]", "Please check and run clarity/scripts/prepAppIcon.sh for more information of how Clarity obtains app icons. You may fix this by including more directories to search for, or by manually including custom icons in clarity/appIcon/, or by manually adding new mappings in clarity/lib/getAppIcon.jsx (if the running app name as seen in Menu Bar does not match the *.app name).")
                }
            }}
            onDragStart={e => { e.preventDefault(); return false; }}>
        </img>
    </span>);
}

// Renders single sticky window element
const renderStickyWindows = (displayData, stickyWindows) => {
    if (styles.heightWithoutPadding < 16 || !stickyWindows.length) return null;

    let X = displayData.frame.x;
    let Y = displayData.frame.y;
    let W = displayData.frame.w;
    let H = displayData.frame.h;
    let xMid = stickyWindows[0].frame.x - X + stickyWindows[0].frame.w/2;
    let yMid = stickyWindows[0].frame.y - Y + stickyWindows[0].frame.h/2;
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

    const elements = [];
    for (let i = 0; i < stickyWindows.length; i++) {
        let w = stickyWindows[i];
        elements.push(getAppIconElement(w, appIconStyleOverride(w)));
    }

    let contentStyle = {...desktopGroupBaseStyle, ...halfSelectedStyle, marginRight: (settings.bar.space.paddingHorizontal) + "px"};
    return (
        <div style={contentStyle} onMouseDownCapture={async () => {
                stickyWindows[0].id && await run('PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH yabai -m window --focus ' + stickyWindows[0].id);
            }}>
            <span>{stickyWindowSymbol}</span>
            <span>{elements}</span>
        </div>
    );
}

// Renders single space element
const renderSpace = (displayData, index, focused, visible, nativeFullscreen, windows) => {

    let contentStyle = {...desktopGroupBaseStyle};
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
                await run('PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH yabai -m space --focus ' + index)
            }}/>
        );
    }

    const autoBarHeight = getAutoBarHeight(displayData.frame.w, displayData.frame.h, displayData.uuid);
    if (autoBarHeight > settings.bar.height) {
        const delta = autoBarHeight - settings.bar.height;
        contentStyle.padding = delta/8 + "px " + (settings.bar.space.paddingHorizontal + delta/8) + "px";
        contentStyle.borderRadius = Math.max(0, Math.round((styles.heightWithoutPadding + delta/2)*settings.bar.space.roundedCornersFactor/2)) + "px";
    }

    if (focused == 1) {
        contentStyle = {...contentStyle, ...selectedStyle};
    } else if (visible == 1) {
        contentStyle = {...contentStyle, ...halfSelectedStyle};
    } else {
        contentStyle = {...contentStyle, ...unselectedStyle};
    }

    windows = windows.filter(w => !settings.bar.space.windowExclusions.some(exclusion => {
        for (let key in exclusion) {
            const isRegex = exclusion[key].startsWith("/") && exclusion[key].endsWith("/");
            if (isRegex) {
                if (!new RegExp(exclusion[key].slice(1, -1)).test(w[key])) return false;
            } else {
                if (exclusion[key] != w[key]) return false;
            }
        }
        return true;
    }))

    windows = windows.filter(w => {
        return w.opacity > 0 || w["is-visible"] || w["is-minimized"] || w["is-hidden"];
    })

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
            if ((a["is-hidden"] || a["is-minimized"]) != (b["is-hidden"] || b["is-minimized"])) {
                return (a["is-hidden"] || a["is-minimized"]) ? 1 : -1;
            }
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
        <div style={{...contentStyle, position: "relative"}} onMouseDownCapture={async () => {
                await run('PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH yabai -m space --focus ' + index)
            }}>
            <span>{leadingStr}</span>
            <span>{itemRenders}</span>
            <span>{trailingStr}</span>
        </div>
    );
};

const render = ({ displayData, spaceData, windowData, placeholder }) => {

    let _containerStyle = {...containerStyle};

    if (typeof placeholder !== "undefined") return (
        <div style={_containerStyle}>
            <div style={{...desktopGroupBaseStyle, ...unselectedStyle}}>
                {placeholder}
            </div>
        </div>
    );
    if (typeof spaceData === "undefined") return null;
    if (typeof displayData === "undefined") return null;
    if (typeof windowData === "undefined") windowData = [];

    const [dw, dh, duuid] = [displayData.frame.w, displayData.frame.h, displayData.uuid];
    applyBarHeight(dw, dh, duuid)(_containerStyle, -settings.bar.paddingVertical*2);

    const spaces = [];

    spaceData.forEach(function(space) {
        spaces.push(renderSpace(
            displayData,
            space.index,
            space["has-focus"] && space["is-visible"],
            space["is-visible"],
            space["is-native-fullscreen"],
            windowData.filter(w => w.space === space.index)
        ));
    });

    let stickyWindows = windowData
        .filter(w => w["is-sticky"])
        .sort((a,b) => {
            if (a.frame.x == b.frame.x) {
                return a.frame.y - b.frame.y;
            }
            return a.frame.x - b.frame.x;
        });

    let stickyWindowElement = renderStickyWindows(displayData, stickyWindows);

    return (
        <div style={_containerStyle}>
            {stickyWindowElement}
            {spaces}
        </div>
    );
};

export default render;
