export default {
    // General bar settings
    //
    // These configure the general appearance of the status bar
    // while maintaining the same design language.
    //
    // For modifying colours and other design elements, modify the `styles.jsx` file.
    bar: {
        height: 28,                // Height of the bar in points. (default=28)
        paddingHorizontal: 16,     // Horizontal padding of the bar in points. (default=16, matches macOS Big Sur+ menu bar)
        paddingVertical  : 4,      // Vertical padding of the bar in points. (default=4)
        backgroundTint: '#110011', // The tint colour for the bar. Must be a 6 char hex color code or null.
        fontSize: 12,              // Font size of the bar in points. May auto shrink if less space is available. (default=12)
        alignBottom: true,         // Whether to align the bar to the bottom if true, or otherwise align to the top. (default=true)

        space: {
            minWidth: 12,              // Minimum width of a space element in points. (default=12)
            roundedCornersFactor: 0.8, // Amount of rounded corners (0 - 1) (default=0.8)
            paddingHorizontal   : 11,  // Horizontal padding of a space indicator in points. (default=11)

            icons: [],                 // List of icons (as unicode text) to use for spaces instead of indices. (default=[] i.e. none)
            minimal  : false,          // Whether to use a more minimal design for showing space info. (default=false)
            showApps : true,           // Whether to show app windows in a space. Will not be shown if too little space available. (default=true)
            showIndex: true,           // Whether to show the space index. Will not be shown if too little vertical space available. (default=true)
        },
    },

    // Status indicator settings
    //
    // You can either configure individual indicators here,
    // or set `status: false` or `status: {}` to disable all of it.
    //
    // These status indicators refresh at 30s intervals.
    // The clock is synchronised to refresh at the :00 second mark.
    status: {
        wifi: false,               // whether to show wifi indicator while it's connected
        ethernet: false,           // whether show ethernet indicator while it's connected
        timeMachine: true,         // whether to show time machine indicator while it's running
        cpu: true,                 // whether to show indicator for high cpu usage or thermal throttling
        power: true,               // whether to show battery & power mode indicators
        clock: true,               // whether to show date and time
        yabai: true,               // whether to show yabai current display, space and arrangement mode
    },

    // Emulation of Windows bottom right click for showing desktop.
    // This simply adds an invisible clickable area at the bottom right.
    //
    // Requires skhd, and F11 to be bound to "Show Desktop" in
    // System Preferences > Keyboard > Shortcuts > Mission Control.
    // This binding should already be present by default.
    bottomRightClickToShowDesktop: true,

    // Whether to darken and blur your desktop wallpaper when a window is open.
    backgroundBlurOnWindowOpen: true,
}

