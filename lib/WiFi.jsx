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

    let advanced = settings.bar.status?.advanced?.network ?? {};

    if (advanced.alwaysShowWiFiSSID ||
        (advanced.showActiveText && wifiData.connected && !ethernetData.connected)) {
        showSSID = true;
    }

    return (
        <div style={wifiStyle}>
            <span style={{verticalAlign: "middle"}}>{symbols.wifi} {showSSID ? ssid : ""}</span>
        </div>
    );
};

export default render;
