const autosub = {
    "Chrome": "Google Chrome",
    "iTerm2": "iTerm",
    "Word": "Microsoft Word",
    "Excel": "Microsoft Excel",
    "PowerPoint": "Microsoft PowerPoint",
    "OneNote": "Microsoft OneNote",
    "Outlook": "Microsoft Outlook",
    "Code": "Visual Studio Code",
    "IntelliJ IDEA": "IntelliJ IDEA CE",
    "PS Remote Play": "RemotePlay",
    "MuseScore Studio": "MuseScore 4",
}


const getAppIconName = (appName) => {
    appName = appName.trim().replace(/[\u200b-\u200f\u2028-\u202f\u205f-\u206f]/g, "") // remove certain zero-width characters
    if (autosub[appName] != null) {
        appName = autosub[appName];
    }
    return appName;
}
const getAppIconPath = (appName) => {
    return "/clarity/appIcons/" + encodeURIComponent(getAppIconName(appName) + ".png")
}
export { getAppIconPath, getAppIconName };
