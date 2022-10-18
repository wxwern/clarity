export default {
    // General bar settings
    //
    // These configure the general appearance of the status bar
    // while maintaining the same design language.
    //
    // For modifying colours and other design elements, modify the `styles.jsx` file.
    //
    // Note: Many elements require yabai, and configuration on yabai's end, to work. Particularly:
    // - Spaces and center info indicators require yabai signals to trigger updates.
    // - Yabai mode updates don't have signals. Thus, you may need triggers linked to the yabai mode switch call.
    //
    bar: {
        height: 28,                // Height of the bar in points. (default=28)
        paddingHorizontal: 16,     // Horizontal padding of the bar in points. (default=16, matches macOS Big Sur+ menu bar)
        paddingVertical  : 4,      // Vertical padding of the bar in points. (default=4)
        backgroundTint: '#110011', // The tint colour for the bar. Must be a 6 char hex color code or null.
        fontSize: 12,              // Font size of the bar in points. May auto shrink if less space is available. (default=12)
        alignBottom: true,         // Whether to align the bar to the bottom if true, or otherwise align to the top. (default=true)

        // Settings for space elements at the left.
        space: {
            minWidth: 12,              // Minimum width of a space element in points. (default=12)
            roundedCornersFactor: 0.8, // Amount of rounded corners (0 - 1) (default=0.8)
            paddingHorizontal   : 11,  // Horizontal padding of a space indicator in points. (default=11)

            icons: [],                 // List of icons (as unicode text) to use for spaces instead of indices. (default=[] i.e. none)
            minimal  : false,          // Whether to use a more minimal design for showing space info. (default=false)
            showApps : true,           // Whether to show app windows in a space. Will not be shown if too little space available. (default=true)
            showIndex: true,           // Whether to show the space index. Will not be shown if too little vertical space available. (default=true)
        },

        // Status indicator settings at the right.
        //
        // You can either configure individual indicators here,
        // or set `status: false` to disable all of it.
        //
        // These status indicators refresh at 30s intervals.
        // The clock is synchronised to refresh at the :00 second mark.
        status: {
            wifi: true,                // whether to show wifi indicator while it's connected
            ethernet: true,            // whether show ethernet indicator while it's connected
            timeMachine: true,         // whether to show time machine indicator while it's running
            cpu: true,                 // whether to show indicator for high cpu usage or thermal throttling
            power: true,               // whether to show battery & power mode indicators
            clock: true,               // whether to show date and time
        },

        // Information indicator settings at the center.
        //
        // You can either configure individual indicators here,
        // or set `status: false` to disable all of it.
        //
        // Configure the center indicators here.
        // This represents the current space state and shows focused app info.
        info: {
            display: true,             // whether to show yabai current display index, if there's more than one display
            space  : true,             // whether to show yabai current space index. This is a separate indicator from the space list.
            yabaiMode   : true,        // whether to show yabai current mode (bsp, float, stack)  (bool, or "icon" or "full")
            appName     : false,       // whether to show the name of the current focused app     (bool, or int representing max char length)
            windowTitle : false,       // whether to show the title of the current focused window (bool, or int representing max char length)
        },
    },

    // Emulation of Windows bottom right click for showing desktop.
    // This simply adds an invisible clickable area at the bottom right.
    bottomRightClickToShowDesktop: true,

    // Whether to darken and blur your desktop wallpaper when a window is open.
    backgroundBlurOnWindowOpen: true,
}

