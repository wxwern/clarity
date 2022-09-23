const autosub = {
    "Chrome": "Google Chrome",
    "iTerm2": "iTerm",
    "Word": "Microsoft Word",
    "Excel": "Microsoft Excel",
    "PowerPoint": "Microsoft PowerPoint",
    "OneNote": "Microsoft OneNote",
    "Outlook": "Microsoft Outlook",
    "Code": "Visual Studio Code",
}


const getAppIconName = (appName) => {
    if (autosub[appName] != null) {
        appName = autosub[appName];
    }
    return appName;
}
const getAppIconPath = (appName) => {
    return "/clarity/appIcons/" + encodeURIComponent(getAppIconName(appName) + ".png")
}
export { getAppIconPath, getAppIconName };
