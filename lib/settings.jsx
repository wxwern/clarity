export default {
  // General bar settings
  bar: {
    backgroundTint: '#110011', // The tint colour for the bar. Must be a 6 char hex color code.
    alignBottom: true,         // true = align bottom (default); false = align top
  },
  // Status indicator settings
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
  bottomRightClickToShowDesktop: true
}

