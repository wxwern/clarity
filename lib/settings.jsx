// Import settings
import defaultSettings from "./config/settings.example.jsx";
import userSettings from "./config/settings.jsx";

const settings = {
    ...defaultSettings,
    ...userSettings,
};



// Patch legacy settings formats
const patchLegacySettings = () => {

    if (settings.bar.status?.details !== undefined) {
        console.warn(
            "[clarity]",
            "`settings.bar.status.details` property is deprecated, please use `settings.bar.status.advanced`."
        );

        // Auto-translate `details` to `advanced` settings
        if (settings.bar.status.details === true) {
            settings.bar.status.details = {
                network: true,
                power: true,
            }
        }

        if (settings.bar.status.advanced === undefined) {
            settings.bar.status.advanced = {};
        }

        const network = settings.bar.status.details.network;
        const power = settings.bar.status.details.power;

        switch (network) {
            case true:
            case "active":
                settings.bar.status.advanced.network.showActiveText = true;
                break;
            case "wifi":
                settings.bar.status.advanced.network.alwaysShowWiFiSSID = true;
                break;
            case "ethernet":
                settings.bar.status.advanced.network.alwaysShowEthernetText = true;
                break;
        }

        switch (power) {
            case true:
            case "percentage":
                settings.bar.status.advanced.power.showPercentage = true;
                break;
            case "time":
                settings.bar.status.advanced.power.showTimeRemaining = true;
                break;
        }
    }
}
patchLegacySettings();



// Export settings
export default settings;
