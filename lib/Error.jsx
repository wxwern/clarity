import styles from "./styles.jsx"

const style = {
  color: styles.colors.red
};

const render = ({ msg }) => {
  if (typeof msg === "undefined") return null;
  return <div style={style}>{msg}</div>;
};

export default render;
