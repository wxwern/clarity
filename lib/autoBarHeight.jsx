import settings from './settings.jsx';

const getAutoBarHeight = (screenWidth, screenHeight, screenUUID) => {
    const DEFAULT_HEIGHT = settings?.bar?.height ?? 28 /* macOS Big Sur+ default height */;

    if ((!settings.bar.notchScreenUUID || screenUUID !== settings.bar.notchScreenUUID) && settings.bar.notchScreenUUID !== "auto") {
        return DEFAULT_HEIGHT;
    }

    const notchScreenAspectRatio = settings.bar.notchScreenAspectRatio;
    const notchHeight = screenHeight - screenWidth / notchScreenAspectRatio;

    if (isNaN(notchHeight)) return DEFAULT_HEIGHT;
    if (notchHeight < 20) return DEFAULT_HEIGHT;
    if (notchHeight > 60) return DEFAULT_HEIGHT;

    return Math.round(notchHeight);
}

const applyBarHeight = (screenWidth, screenHeight, screenUUID) => {
    const barHeight = getAutoBarHeight(screenWidth, screenHeight, screenUUID);

    return (opt = {}, delta = 0) => {
        opt.height = (barHeight + delta) + "px";
        opt.lineHeight = (barHeight + delta) + "px";
        return opt;
    };
}

export {
    getAutoBarHeight,
    applyBarHeight
};
