import styles from "./styles.jsx";
import run from "uebersicht";

const containerStyle = {
  display: "grid",
  gridAutoFlow: "column",
  gridGap: "8px",
  fontFamily: "'Font Awesome 5 Free Solid'"
};

const desktopStyle = {
  width: "20px",
};

const symbols = ["terminal", "globe", "code", "comment", "list", "desktop", "gamepad", "couch"];

const renderSpace = (index, focused, visible, windows) => {
  let contentStyle = JSON.parse(JSON.stringify(desktopStyle));
  let hasWindows = windows.length > 0;
  if (focused == 1) {
    contentStyle.color = styles.colors.fg;
  } else if (visible == 1) {
    contentStyle.color = styles.colors.fg;
  }
  return (
    <div style={contentStyle}>
      {index - 1 < symbols.length ? symbols[index - 1] : "•"}
    </div>
  );
};

const render = ({ output }) => {
  if (typeof output === "undefined") return null;

  const spaces = [];

  output.forEach(function(space) {
      spaces.push(renderSpace(space.index, space.focused, space.visible, space.windows));
      console.log(spaces);
  });

  return (
    <div style={containerStyle}>
      {spaces}
    </div>
  );
};

export default render;
