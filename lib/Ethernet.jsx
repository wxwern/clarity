import symbols from "./symbols.jsx";

const render = ({ ethernetData }) => {
    let etherStyle = {};
    if (!ethernetData.connected) etherStyle.display = "none";
    return (
        <div style={etherStyle}>
            {symbols.ethernet}
        </div>
    );
};

export default render;
