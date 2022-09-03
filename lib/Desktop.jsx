import symbols from "./symbols.jsx";
import styles from "./styles.jsx";
import getAppIcon from "./getAppIcon.jsx";
import { run } from "uebersicht";

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
    margin: "2px 4px",
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


const renderSpace = (display_index, index, focused, visible, nativeFullscreen, windows) => {
    let contentStyle = desktopBaseStyle;
    if (focused == 1) {
        contentStyle = {...contentStyle, ...selectedStyle};
    } else if (visible == 1) {
        contentStyle = {...contentStyle, ...selectedStyleInactiveDisplay};
    } else {
        contentStyle = {...contentStyle, ...unselectedStyle};
    }

    let nonStickyWindows = windows.filter(w => !w["is-sticky"])

    let str = "" + index;
    if (nativeFullscreen) {
        str += " ";
        if (windows.length > 1) {
            str += symbols.splitScreen;
        } else {
            str += symbols.fullscreen;
        }
    } else if (nonStickyWindows.length > 0) {
        str += " ";
        for (let i = 0; i < nonStickyWindows.length; i++) {
            str += symbols.app;
        }
    }



    return (
        <div style={contentStyle} onClick={async () => {
                await run('/usr/local/bin/yabai -m space --focus ' + index)
            }}>
            {str}{
                /*nonStickyWindows.map(w => (
                    <img style={appIconStyle} src={getAppIcon(w["app"])} alt={w["app"]}></img>
                ))*/
            }
        </div>
    );
};

const render = ({ displayData, spaceData, windowData }) => {
    if (typeof spaceData === "undefined") return null;

    const spaces = [];

    spaceData.forEach(function(space) {
        spaces.push(renderSpace(
            space.display,
            space.index,
            space["has-focus"],
            space["is-visible"],
            space["is-native-fullscreen"],
            windowData.filter(w => w.space === space.index)
        ));
    });

    let stickyWindows = windowData.filter(w => w["is-sticky"]);
    let stickyWindowSymbols = [];
    stickyWindows.forEach(stickyWindow => {
        let W = displayData.frame.w;
        let H = displayData.frame.h;
        let xMid = stickyWindow.frame.x + stickyWindow.frame.w/2;
        let yMid = stickyWindow.frame.y + stickyWindow.frame.h/2;
        if (xMid <= W/2) {
            if (yMid <= H/2) {
                stickyWindowSymbols.push(symbols.pipTopLeft);
            } else {
                stickyWindowSymbols.push(symbols.pipTopRight);
            }
        } else {
            if (yMid <= H/2) {
                stickyWindowSymbols.push(symbols.pipBottomLeft);
            } else {
                stickyWindowSymbols.push(symbols.pipBottomRight);
            }
        }
    });

    return (
        <div style={containerStyle}>
            {stickyWindowSymbols.join(" ")}
            {spaces}
        </div>
    );
};

export default render;
