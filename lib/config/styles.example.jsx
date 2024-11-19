import settings from '../settings.jsx'; // Use the complete lib/settings.jsx, not the settings.jsx in the config folder

function formatTransparency(hex, defaultTransparency) {
    if (hex?.[0] !== "#" || defaultTransparency?.length !== 2) {
        return hex;
    }
    if (hex.length === 9 || hex.length === 5) {
        return hex;
    }
    if (hex.length === 7) {
        return hex + defaultTransparency;
    }
    if (hex.length === 4) {
        return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + defaultTransparency;
    }
    return hex;
}

export default {
    colors: {
        fg:  "#ffffffcc",
        dim: "#ffffff33",
        bg:     !!settings.bar.backgroundTint ? "#11111144" : "#11111100",
        bgTint: !!settings.bar.backgroundTint ? formatTransparency(settings.bar.backgroundTint, "44") : "#00000000",
        minimalFg:  "#ffffff88",
        minimalDim: "#ffffff33",
        minimalBg:  "#ffffff0a",
        red:    "#ff4020",
        orange: "#ff8700",
        green:  "#0aaa1a",
        button: {
            bg:        "#ffffff44",
            halfDimBg: "#ffffff1a",
            dimBg:     "#ffffff0a",
            fg:        "#ffffffee",
            halfDimFg: "#ffffff88",
            dimFg:     "#ffffff33",
        }
    },
    height: settings.bar.height,
    padding: settings.bar.paddingVertical,
    heightWithoutPadding: settings.bar.height - settings.bar.paddingVertical*2,
    fontSize: Math.max(8, Math.min(
        settings.bar.fontSize || 12,
        Math.round(settings.bar.height-settings.bar.paddingVertical-10)
    )) + "px",
    fontWeight: 400,
    fontFamily: "SF Pro",
}

