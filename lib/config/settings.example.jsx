// Clarity-wide settings

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
        height: 28,                // Height of the bar in points. (default=28, matches macOS Big Sur+ menu bar without notch)
        paddingHorizontal: 16,     // Horizontal padding of the bar in points. (default=16, matches macOS Big Sur+ menu bar)
        paddingVertical  : 4,      // Vertical padding of the bar in points. (default=4)
        backgroundTint: '#110011', // The tint colour for the bar. Must be a 6 or 8 char hex color code or null.
        fontSize: 12,              // Font size of the bar in points. May auto shrink if less space is available. (default=12)
        alignBottom: true,         // Whether to align the bar to the bottom if true, or otherwise align to the top. (default=true)

        notchScreenUUID: null,         // The screen UUID where the bar's height will match the notch. (default=null, can be "auto" to auto-detect)
                                       //   - this option may accept: null (disabled), "auto" (auto-detect), or a screen's UUID string.
        notchScreenAspectRatio: 16/10, // The aspect ratio of the available screen area under the notch. Required to detect notch height. (default=16/10)

        // Settings for space elements at the left. Requires yabai with signals set up.
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
        //
        // No requirements unless specified.
        status: {
            wifi: true,                // whether to show wifi indicator while it's connected
                                       //    - requires specifying interface in scripts/status.sh, though en0 should be correct
            ethernet: true,            // whether show ethernet indicator while it's connected
                                       //    - requires specifying interface in scripts/status.sh
            vpn: true,                 // whether to show when vpn is connected
            timeMachine: true,         // whether to show time machine indicator while it's running
            cpu: true,                 // whether to show indicator for cpu usage and related details
            power: true,               // whether to show battery & power mode indicators
            secureInput: true,         // whether to show an when Secure Input is enabled by some app or process
                                       //    - this may be useful to know when you're typing in a sensitive field,
                                       //      or to know when you should try the lock-unlock workaround when macOS is stuck in Secure Input mode,
                                       //      breaking apps monitoring for keyboard shortcuts like skhd, Alfred, etc.
                                       //      (https://apple.stackexchange.com/questions/331557/is-there-a-way-to-fix-or-disable-secure-input)
            clock: true,               // whether to show date and time

            // This picks advanced config options for the indicators.
            advanced: {
                cpu: {
                    showSyspower: true,           // whether to show the system power usage in Watts (requires jq & macOS 13+)
                    showSysload : true,           // whether to show the system load in unix load average format
                    showThermalThrottle: true,    // whether to show the thermal throttling status (may not work for Apple Silicon)

                    visibleSyspowerThreshold: 10, // system power draw before displaying (default=10W, requires jq & macOS 13+ to be used)
                    visibleSysloadThreshold: 4.0, // average system load before displayed (default=4.0 unix load avg)
                },
                network: {
                    showActiveText: false,         // whether to show SSID/Ethernet text for whichever network is in use (assumes Ethernet is priority)

                    alwaysShowWiFiSSID: false,     // whether to show the SSID when connected to a WiFi network
                    alwaysShowEthernetText: false, // whether to show the text "Ethernet" when connected to Ethernet
                },
                power: {
                    showPercentage: true,         // whether to show the battery percentage
                    showTimeRemaining: true,      // whether to show the time remaining to full or to empty
                    showNetPower: true,           // whether to show the net power draw or net charge rate in Watts (requires jq & macOS 13)
                }
            }
        },


        // Information indicator settings at the center.
        //
        // You can either configure individual indicators here,
        // or set `status: false` to disable all of it.
        //
        // Configure the center indicators here.
        // This represents the current space state and shows focused app info.
        //
        // Requires yabai with signals set up.
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
