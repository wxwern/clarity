import settings from "./settings.jsx";
import styles from "./styles.jsx";
import symbols from "./symbols.jsx";

const render = ({ powerData }) => {
    const batteryPercentage = powerData.battery.percentage || 0;
    const noBattery = batteryPercentage < 0 || batteryPercentage > 100;
    const isCharging = powerData.battery.charging;
    const isWired = powerData.wired;
    const isLowPowerMode = powerData.lowPowerMode;
    const timeRemaining = powerData.timeRemaining;

    const batterySymbol = noBattery || (isWired && !isCharging) ?
        "" : symbols.battery[Math.round(0.01*batteryPercentage*(symbols.battery.length-1))];
    const chargingSymbol = isCharging ? symbols.power : "";
    const wiredSymbol = isWired ? symbols.powerPassthrough : "";
    const lowPowerModeSymbol = isLowPowerMode ? symbols.powerSaving : "";
    let batteryText = noBattery ? "" : (batteryPercentage + "%");
    let timeRemainingText =
        (batteryPercentage == 100 && isWired) || timeRemaining == "-:--" ?
        "" : timeRemaining;

    const powerIn_mW  = powerData.detailed["SystemPowerIn"] || 0;
    const powerUse_mW = powerData.detailed["SystemLoad"] || 0;
    const netPowerIn_mW =
        powerData.detailed.hasOwnProperty("SystemLoad") &&
        powerData.detailed.hasOwnProperty("SystemPowerIn") ?
        (powerIn_mW - powerUse_mW) : 0;
    const netPowerIn_W = Math.round(netPowerIn_mW / 1000);

    let netPowerInText = Object.keys(powerData.detailed).length > 0 ?
        ((netPowerIn_W >= 0 ? ("+" + netPowerIn_W) : netPowerIn_W) + "W") : "";

    if (netPowerIn_mW > -500 && netPowerIn_mW < 2000) {
        netPowerInText = "";
    }

    const baseSpanChildStyle = {
        verticalAlign: "middle"
    };

    let batteryStyle = {}
    let chargeSymStyle = {}
    if (batteryPercentage <= 20 && !isCharging) {
        batteryStyle.color = styles.colors.red;
    } else if (isCharging) {
        batteryStyle.color = styles.colors.green;
        chargeSymStyle.color = styles.colors.orange;
    }

    const advanced = settings.bar.status?.advanced?.power ?? {};

    if (!advanced.showTimeRemaining) timeRemainingText = "";
    if (!advanced.showPercentage) batteryText = "";
    if (!advanced.showNetPower) netPowerInText = "";

    let suppBlockStyle = {
        display: "inline-block",
        fontSize: "70%",
        fontWeight: "bold",
        lineHeight: "normal",
        verticalAlign: "middle",
    }
    if (!netPowerInText && !timeRemainingText) suppBlockStyle.display = "none";

    return (
        <div>
            <span style={{...baseSpanChildStyle, ...batteryStyle}}>{batterySymbol}</span>&nbsp;
            <span style={{...baseSpanChildStyle, ...chargeSymStyle}}>{chargingSymbol || wiredSymbol}</span>&nbsp;
            <span style={baseSpanChildStyle}>{lowPowerModeSymbol}</span>&nbsp;
            <span style={baseSpanChildStyle}>{batteryText}</span>&nbsp;
            <span style={suppBlockStyle}>{netPowerInText ? timeRemainingText : ""}<br />{netPowerInText || timeRemainingText}</span>
        </div>
    );
}
export default render;
