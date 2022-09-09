import symbols from "./symbols.jsx";
import { run } from "uebersicht";

const render = () => {
    const date = new Date();
    const dateFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    const dateStr = symbols.calendar + " " + date.toLocaleDateString("en-SG", dateFormatOptions);

    return (<div onClick={() => run("open /System/Applications/Calendar.app")}>{dateStr}</div>);
}
export default render;
