const autosub = {
    "iTerm2": "iTerm",
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
