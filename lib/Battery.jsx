import styles from "./styles.jsx";

const batteryIcon = function (charging, status, percentage) {
    if (charging && status != "AC attached") { 
        return status == "charged" ? "" : ""; 
    }

    if (percentage >= 90) return "";
    if (percentage >= 70) return "";
    if (percentage >= 45) return "";
    if (percentage >= 20) return "";
    return "";
}

const iconStyle = {
    fontFamily: "'Font Awesome 5 Free Solid'"
};

const render = ({ output }) => {
    let charging = output.charging;
    let percentage = output.percentage;
    let remaining = output.remaining;
    let status = output.status;
    return (
        <div>
            <div
                style={
                    percentage < 10 && charging == false
                        ? { color: styles.colors.red }
                        : null
                }
            >
                <span><span style={iconStyle}>{batteryIcon(charging, status, percentage)}</span> {percentage}% {remaining == "0:00" ? null : ("(" + remaining + ")")}</span>
            </div>
        </div>
    );
};

export default render;
