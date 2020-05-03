import styles from "./styles.jsx";

const style = {
    color: styles.colors.orange,
    fontFamily: "'Font Awesome 5 Free Solid'"
}

const render = ({ output }) => {
  if (output === 0) return null;
  return <div style={style}>moon</div>;
};

export default render;
