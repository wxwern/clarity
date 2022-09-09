import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ cpuData }) => {
    let cpuStyle = {};

    const cpuLoadAvg = cpuData.loadAverage;
    const cpuCoreCount = cpuData.coreCount;
    const hasSignificantLoad = cpuLoadAvg > 4;
    const hasLoad = hasSignificantLoad || cpuLoadAvg > 2;
    const isThermalLimited = cpuData.thermalLimited;

    if (isThermalLimited) {
        cpuStyle.color = styles.colors.red;
        cpuStyle.fontWeight = "bold";
    } else if (hasSignificantLoad) {
        cpuStyle.color = styles.colors.orange;
    }

    if (!hasLoad && !isThermalLimited) cpuStyle.display = "none";

    return (
        <div style={cpuStyle}>
            {isThermalLimited ? symbols.overheat : symbols.cpu} {isThermalLimited ? "HOT": ""}
        </div>
    );
};

export default render;
