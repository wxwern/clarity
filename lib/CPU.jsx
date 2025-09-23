import settings from "./settings.jsx";
import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ cpuData, powerData }) => {
    let cpuStyle = {};

    const cpuLoadAvg = cpuData.loadAverage;
    const cpuCoreCount = cpuData.coreCount;
    const hasLoad = cpuLoadAvg >
        (settings.bar.status?.advanced?.cpu?.visibleSysloadThreshold || 0);
    const hasSignificantLoad = cpuLoadAvg >
        (settings.bar.status?.advanced?.cpu?.visibleSysloadThreshold || 0) * 2;
    const isSpeedLimited = cpuData.speedLimited;
    const isPowerLimited = cpuData.powerLimited;
    const isThermalLimited = isSpeedLimited && !isPowerLimited;

    const powerUse_mW = (powerData.detailed["SystemLoad"] || 0); // - (powerData.detailed["SystemPowerIn"] || 0);
        // AppleSmartBattery power use reporting appears to be bugged in macOS 15.?
        // and power in is double counted into system load

    let powerUse_W = Math.round(powerUse_mW / 1000);

    if (powerUse_mW > 10 * 1000 * 1000) { // 10 kW
        powerUse_W = Infinity;
    }

    const hasPowerUse = !powerData.detailed.hasOwnProperty("SystemLoad") ||
        powerUse_mW/1000 >= (settings.bar.status?.advanced?.cpu?.visibleSyspowerThreshold || 999999);

    if (isThermalLimited && settings.bar.status?.advanced?.cpu?.showThermalThrottle) {
        cpuStyle.color = styles.colors.red;
        cpuStyle.fontWeight = "bold";
    } else if (hasSignificantLoad) {
        cpuStyle.color = styles.colors.orange;
    }

    if (!hasLoad && !isThermalLimited && !hasPowerUse) cpuStyle.display = "none";

    const symbol = isThermalLimited ? symbols.overheat : symbols.cpu;
    const text = isThermalLimited ? "HOT": "";

    const sysLoadStr = settings.bar.status?.advanced?.cpu?.showSysload ?
        (Math.round(cpuLoadAvg*10)/10).toLocaleString("en-US", {minimumFractionDigits: 1}) + "L" : "";
    let powerUseStr = settings.bar.status?.advanced?.cpu?.showSyspower && powerUse_W > 0 ? powerUse_W + "W" : "";
    if (!isFinite(powerUse_W)) {
        powerUseStr = "? W";
    }

    let suppBlockStyle = {
        display: "inline-block",
        fontSize: "70%",
        fontWeight: "bold",
        lineHeight: "normal",
        verticalAlign: "middle",
    }
    if (!powerUseStr && !sysLoadStr) suppBlockStyle.display = "none";

    return (
        <div style={cpuStyle}>
            <span style={{verticalAlign: "middle"}}>{symbol} {text}</span> <span style={suppBlockStyle}>{powerUseStr ? sysLoadStr : ""}<br />{powerUseStr || sysLoadStr}</span>
        </div>
    );
};

export default render;
