import settings from "./settings.jsx";
import symbols from "./symbols.jsx";

const render = ({ wifiData, ethernetData }) => {
    let etherStyle = {};
    if (!ethernetData.connected) etherStyle.display = "none";

    let showText = false;

    switch (settings?.bar?.status?.details?.network) {
        case "active":
            if (!ethernetData?.connected) {
                break;
            }
        case "ethernet":
        case "all":
        case true:
            showText = true;
            break;
        default:
            break;
    }

    return (
        <div style={etherStyle}>
            {symbols.ethernet} {showText ? "Ethernet" : ""}
        </div>
    );
};

export default render;
