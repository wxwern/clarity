const iconStyle = {
    fontFamily: "'Font Awesome 5 Free Solid'",
    paddingRight: "3px"
};
const render = ({ output }) => {
    if (typeof output === "undefined") return null;
    return (
        <div>
            <span style={iconStyle}>clock</span> {output.time}
        </div>
    );
};

export default render;
