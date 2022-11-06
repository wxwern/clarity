import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ cpuData }) => {
    let cpuStyle = {};

    const cpuLoadAvg = cpuData.loadAverage;
    const cpuCoreCount = cpuData.coreCount;
    const hasSignificantLoad = cpuLoadAvg > 4;
    const hasLoad = hasSignificantLoad || cpuLoadAvg > 2;
    const isSpeedLimited = cpuData.speedLimited;
    const isPowerLimited = cpuData.powerLimited;
    const isThermalLimited = isSpeedLimited && !isPowerLimited;

    if (isThermalLimited) {
        cpuStyle.color = styles.colors.red;
        cpuStyle.fontWeight = "bold";
    } else if (hasSignificantLoad) {
        cpuStyle.color = styles.colors.orange;
    }

    if (!hasLoad && !isThermalLimited) cpuStyle.display = "none";

    const symbol = isThermalLimited ? symbols.overheat : symbols.cpu;
    const text = isThermalLimited ? "HOT": "";

    return (
        <div style={cpuStyle}>
            {symbol} {text}
        </div>
    );
};

export default render;
