import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ cpuData }) => {
    const cpuLoadAvg = cpuData.loadAverage;
    const cpuCoreCount = cpuData.coreCount;
    const hasSignificantLoad = cpuLoadAvg > (cpuCoreCount*0.5 || 4);
    const hasLoad = hasSignificantLoad || cpuLoadAvg > 2;
    const isThermalLimited = cpuData.thermalLimited;
    const cpuStatus = isThermalLimited ? "HOT" : (hasLoad ? "WIP" : "OK");
    const cpuStyle = {
        color: isThermalLimited ? styles.colors.red : (hasSignificantLoad ? styles.colors.orange : "inherit")
    }
    return (
        <div style={cpuStyle}>
            {symbols.cpu} {isThermalLimited ? symbols.overheat : ""} {cpuStatus}
        </div>
    );
};

export default render;
