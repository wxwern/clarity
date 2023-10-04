import settings from "./settings.jsx";
import symbols from "./symbols.jsx";

const render = ({ wifiData, ethernetData }) => {
    let etherStyle = {};
    if (!ethernetData.connected) etherStyle.display = "none";

    let showText = false;

    let advanced = settings.bar.status?.advanced?.network ?? {};

    if (advanced.alwaysShowEthernetText || (advanced.showActiveText && ethernetData.connected)) {
        showText = true;
    }

    return (
        <div style={etherStyle}>
            <span style={{verticalAlign: "middle"}}>{symbols.ethernet} {showText ? "Ethernet" : ""}</span>
        </div>
    );
};

export default render;
