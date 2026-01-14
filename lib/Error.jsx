import styles from "./styles.jsx"

const style = {
  color: styles.colors.red,
  fontWeight: "bold",
  boxShadow: "0 0 16px #0000",
};

const render = ({ msg }) => {
  if (typeof msg === "undefined") return null;
  return <div style={style}>{msg}</div>;
};

export default render;
