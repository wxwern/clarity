const autosub = {
    "iTerm2": "iTerm",
}
const getAppIcon = (appName) => {
    if (autosub[appName] != null) {
        appName = autosub[appName];
    }

    return "file:///Applications/" + encodeURIComponent(appName) + ".app/Contents/Resources/AppIcon.icns"
}
export default getAppIcon;
