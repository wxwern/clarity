import symbols from "./symbols.jsx";
import styles from "./styles.jsx";

const render = ({ secureInputData }) => {
    let siStyle = {
        color: styles.colors.red
    };
    if (!secureInputData.enabled) siStyle.display = "none";
    return (
        <div style={siStyle}>
            <span style={{verticalAlign: "middle"}}>{symbols.secureInput}</span>
        </div>
    );
};

export default render;
