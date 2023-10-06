import settings from './settings.jsx';

export default {
    colors: {
        fg:  "#ffffffcc",
        dim: "#ffffff33",
        bg:     !!settings.bar.backgroundTint ? "#11111144" : "#11111100",
        bgTint: !!settings.bar.backgroundTint ? settings.bar.backgroundTint + "44" : "#00000000",
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

