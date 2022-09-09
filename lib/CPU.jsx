import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ cpuData }) => {
    let cpuStyle = {};

    const cpuLoadAvg = cpuData.loadAverage;
    const cpuCoreCount = cpuData.coreCount;
    const hasSignificantLoad = cpuLoadAvg > 4;
    const hasLoad = hasSignificantLoad || cpuLoadAvg > 2;
    const isThermalLimited = cpuData.thermalLimited;
    const cpuStatusText = isThermalLimited ? "HOT" : "";

    if (isThermalLimited) cpuStyle.color = styles.colors.red;
    else if (hasSignificantLoad) cpuStyle.color = styles.colors.orange;

    if (!hasLoad && !isThermalLimited) cpuStyle.display = "none";

    return (
        <div style={cpuStyle}>
            {symbols.cpu} {isThermalLimited ? symbols.overheat : ""} {cpuStatusText}
        </div>
    );
};

export default render;
