const iconStyle = {
    fontFamily: "'Font Awesome 5 Free Solid'"
};

const render = ({ output }) => {
    if (typeof output === "undefined") return null;
    const status = output.status;
    const ssid = output.ssid;
    if (status !== "active") return null;
    return <div><span style={iconStyle}>wifi</span>&nbsp;&nbsp;{output.ssid}</div>;
};

export default render;
