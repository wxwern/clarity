import symbols from "./symbols.jsx";

const render = ({ vpnData }) => {
    const vpnStyle = {}
    if (!vpnData.connected) vpnStyle.display = "none";

    return (
        <div style={vpnStyle}>
            <span style={{verticalAlign: "middle"}}>{symbols.vpn}</span>
        </div>
    );
};

export default render;
