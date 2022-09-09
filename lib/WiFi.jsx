import symbols from "./symbols.jsx";

const render = ({ wifiData }) => {
    let wifiStyle = {};
    if (!wifiData.connected) wifiStyle.display = "none";
    return (
        <div style={wifiStyle}>
            {symbols.wifi}
        </div>
    );
};

export default render;
