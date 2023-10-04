import symbols from "./symbols.jsx";

const render = ({ tmData }) => {
    let tmStyle = {};
    if (!tmData.running) tmStyle.display = "none";
    return (
        <div style={tmStyle}>
            <span style={{verticalAlign: "middle"}}>{symbols.timeMachineAlt}</span>
        </div>
    );
};

export default render;
