import symbols from "./symbols.jsx";

const render = ({ tmData }) => {
    let tmStyle = {};
    if (!tmData.running) tmStyle.display = "none";
    return (
        <div style={tmStyle}>
            {symbols.timeMachineAlt}
        </div>
    );
};

export default render;
