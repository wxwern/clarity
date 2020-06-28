# clarity

A simple [Übersicht](https://github.com/felixhageloh/uebersicht) widget status bar with [yabai](https://github.com/koekeishiya/yabai) support, using [nibar](https://github.com/kkga/nibar) as a base.

`nibar` provided a great launchpad to jump right into custom status bars. It was utilised as a starting point, then overhauled to satisfy my taste.

## Screenshot

![](screenshot.png)

## Installation

Clone this repo to your Übersicht widgets directory.

```bash
$ git clone https://github.com/wernjie/clarity $HOME/Library/Application\ Support/Übersicht/widgets/clarity
```

## Dependencies

- [jq](https://github.com/stedolan/jq) — used for parsing json output and displaying the workspaces widget
    - install with homebrew: `brew install jq`
- [Font Awesome 5 Free Solid](https://fontawesome.com/) — used for symbols in the statusbar widget

## Usage

### Yabai workspaces and title widgets

There are 2 widgets for displaying workspaces: `spaces-primary` and `spaces-secondary`, and 2 widgets for displaying window titles: `title-primary` and `title-secondary`.

All `*-secondary` widgets are used when working with dual displays.

If you're using a single display, disable the secondary display widgets in the Übersicht's menu. If you're working with dual displays, configure them accordingly.

### Refreshing yabai workspaces widget

The widgets for displaying yabai workspaces and window titles don't refresh automatically (to preserve battery). To refresh them, you can add these lines utilizing [yabai's signals](https://github.com/koekeishiya/yabai/wiki/Commands#automation-with-rules-and-signals) at the end of `.yabairc`:

#### When using a single display

```sh
yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-spaces-primary-jsx\"'"
yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"
```

#### When using dual displays

```sh
yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-spaces-primary-jsx\"'"
yabai -m signal --add event=display_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-spaces-primary-jsx\"'"

yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-spaces-secondary-jsx\"'"
yabai -m signal --add event=display_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-spaces-secondary-jsx\"'"

yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-primary-jsx\"'"

yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-secondary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-secondary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"clarity-title-secondary-jsx\"'"
```

### Caveats

- Ethernet and VPN detection is customised to work only on my system. Please change up the relevant modules to suit your needs. If you've a better way, feel free to open an issue!
- Your wallpaper should not be too busy or too bright, as this status bar has no background.


