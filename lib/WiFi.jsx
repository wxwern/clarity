import settings from "./settings.jsx";
import symbols from "./symbols.jsx";

const render = ({ wifiData, ethernetData }) => {
    let wifiStyle = {};
    if (!wifiData.connected) wifiStyle.display = "none";

    let ssid = wifiData.ssid;
    if (ssid.length > 20) {
        ssid = ssid.substring(0, 17) + "...";
    }

    let showSSID = false;

    switch (settings?.bar?.status?.details?.network) {
        case "active":
            if (ethernetData?.connected) {
                break;
            }
        case "wifi":
        case "all":
        case true:
            showSSID = true;
            break;
        default:
            break;
    }

    return (
        <div style={wifiStyle}>
            {symbols.wifi} {showSSID ? ssid : ""}
        </div>
    );
};

export default render;
