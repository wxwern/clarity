const iconStyle = {
    fontFamily: "'Font Awesome 5 Free Solid'"
};

const render = ({ output }) => {
    if (typeof output === "undefined") return null;
    const status = output.status;
    if (status !== "active") return null;
    return <div><span style={iconStyle}>download</span>&nbsp;&nbsp;Backing Up...</div>;
};

export default render;