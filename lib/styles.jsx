// Import styles
import defaultStyles from "../config/styles.example.jsx";
import userStyles from "../config/styles.jsx";

const styles = {
    ...defaultStyles,
    ...userStyles,
};



// Patch legacy styles formats
const patchLegacyStyles = () => {
    // For future use...
}
patchLegacyStyles();



// Export result
export default styles;
