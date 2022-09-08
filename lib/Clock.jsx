import symbols from "./symbols.jsx";
const render = () => {
    const dateFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    const dateStr = symbols.clock + " " + new Date(Date.now()+2000).toLocaleString("en-SG", dateFormatOptions);
    return (<div>{dateStr}</div>);
}
export default render;
