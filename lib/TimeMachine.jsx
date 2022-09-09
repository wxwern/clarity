import symbols from "./symbols.jsx";

const render = ({ tmData }) => {
    let tmStyle = {};
    if (!tmData.running) etherStyle.display = "none";
    return (
        <div style={tmStyle}>
            {symbols.timeMachineAlt}
        </div>
    );
};

export default render;
