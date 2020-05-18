# miniyabar

A simple [Übersicht](https://github.com/felixhageloh/uebersicht) widget status bar with [yabai](https://github.com/koekeishiya/yabai) support, inspired by and is a fork of [nibar](https://github.com/kkga/nibar) (originally a fork of [powerbar](https://github.com/ajdnik/powerbar)). 

`nibar` provides a great launchpad to jump right into custom status bars, and it's then tweaked and touched up to satisfy my taste.

## Installation

Clone this repo to your Übersicht widgets directory.

```bash
$ git clone https://github.com/kkga/nibar $HOME/Library/Application\ Support/Übersicht/widgets/nibar
```

## Dependencies

- [jq](https://github.com/stedolan/jq) — used for parsing json output and displaying the workspaces widget
    - install with homebrew: `brew install jq`
- [Font Awesome 5 Free Solid](https://fontawesome.com/) — used for symbols in the statusbar widget

## Usage

### Yabai workspaces widgets

There are 2 widgets for displaying workspaces: `spaces-primary` and `spaces-secondary`. The `spaces-secondary` is used when working with dual displays.
If you're using a single display, disable it in the Übersicht's menu.

### Refreshing yabai workspaces widget

The widgets for displaying yabai workspaces aren't refreshing automatically (to preserve battery). To refresh them, you can add these lines utilizing [yabai's signals](https://github.com/koekeishiya/yabai/wiki/Commands#automation-with-rules-and-signals) at the end of `.yabairc`:

#### When using a single display

```sh
yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-spaces-primary-jsx\"'"
yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
```

#### When using dual displays

```sh
yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-spaces-primary-jsx\"'"
yabai -m signal --add event=display_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-spaces-primary-jsx\"'"

yabai -m signal --add event=space_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-spaces-secondary-jsx\"'"
yabai -m signal --add event=display_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-spaces-secondary-jsx\"'"
yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-primary-jsx\"'"
yabai -m signal --add event=window_title_changed \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-secondary-jsx\"'"
yabai -m signal --add event=window_focused \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-secondary-jsx\"'"
yabai -m signal --add event=application_front_switched \
    action="osascript -e 'tell application \"Übersicht\" to refresh widget id \"miniyabar-title-secondary-jsx\"'"
```


