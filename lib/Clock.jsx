import symbols from "./symbols.jsx";
import { run } from "uebersicht";

const render = () => {
    const date = new Date();
    const timeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: false };

    const timeStr = symbols.clock + " " + date.toLocaleTimeString("en-SG", timeFormatOptions);

    return (<div onClick={() => run("open /System/Applications/Clock.app")}>{timeStr}</div>);
}
export default render;
