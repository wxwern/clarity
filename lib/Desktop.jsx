import styles from "./styles.jsx";
import run from "uebersicht";

const containerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "14px",
    fontSize: "8px",
    fontFamily: "'Font Awesome 5 Free Solid'"
};

const desktopStyle = {
    width: "24px",
    height: "16px",
    textAlign: "center"
};

const symbols = ["terminal", "globe", "code", "comment", "list", "desktop", "gamepad", "couch", "brush"];

const renderSpace = (display_index, index, focused, visible, windows) => {
    let contentStyle = JSON.parse(JSON.stringify(desktopStyle));
    let hasWindows = windows.length > 0;
    let shouldUseSymbols = display_index == 1 && index - 1 < symbols.length;
    if (focused == 1) {
        contentStyle.color = "#ffffff88";
        contentStyle.borderTop = '3px solid #ffffffbb';
        contentStyle.backgroundImage = "linear-gradient(#ffffff66, #fff0)";
    } else {
        contentStyle.color = "#ffffff22";
        contentStyle.borderTop = '3px solid #ffffff22';
        contentStyle.backgroundImage = "linear-gradient(#ffffff05, #fff0)";
    }
    if (!shouldUseSymbols) {
        contentStyle.fontFamily = "monospace";
    }
    return (
        <div style={contentStyle}>
            {shouldUseSymbols ? symbols[index - 1] : (index)}
        </div>
    );
};

const render = ({ output }) => {
    if (typeof output === "undefined") return null;

    const spaces = [];

    output.forEach(function(space) {
        spaces.push(renderSpace(space.display, space.index, space["has-focus"], space["is-visible"], space.windows));
    });

    return (
        <div style={containerStyle}>
            {spaces}
        </div>
    );
};

export default render;
