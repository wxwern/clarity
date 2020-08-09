import styles from "./styles.jsx";
import run from "uebersicht";

const containerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: "12px",
    fontFamily: "'Font Awesome 5 Free Solid'"
};

const desktopStyle = {
    width: "16px",
    height: "20px",
    textAlign: "center"
};

const symbols = ["terminal", "globe", "code", "comment", "list", "desktop", "gamepad", "couch", "brush"];

const renderSpace = (display_index, index, focused, visible, windows) => {
    let contentStyle = JSON.parse(JSON.stringify(desktopStyle));
    let hasWindows = windows.length > 0;
    let shouldUseSymbols = display_index == 1 && index - 1 < symbols.length;
    if (focused == 1) {
        contentStyle.color = styles.colors.fg;
        contentStyle.borderBottom = '1px solid white';
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

    const display = output;
    const spaces = [];

    display.spaces.forEach(function(space) {
        spaces.push(renderSpace(display.index, space.index, space.focused, space.visible, space.windows));
    });

    return (
        <div style={containerStyle}>
            {spaces}
        </div>
    );
};

export default render;
