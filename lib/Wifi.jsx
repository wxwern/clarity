const iconStyle = {
    fontFamily: "'Font Awesome 5 Free Solid'",
    paddingRight: "6px"
};

const render = ({ output }) => {
    if (typeof output === "undefined") return null;
    const status = output.status;
    const ssid = output.ssid;
    if (status !== "active") return null;
    return <div><span style={iconStyle}>wifi</span>{output.ssid}</div>;
};

export default render;
