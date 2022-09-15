# Clarity

A simple [Übersicht](https://github.com/felixhageloh/uebersicht) widget status bar via [yabai](https://github.com/koekeishiya/yabai) support.
This status bar is designed to clearly show important details for virtual desktop management within a minimal amount of space, putting focus onto the task you're doing. Plus, it's updated to complement modern macOS design.

This uses [nibar](https://github.com/kkga/nibar) as a base and with some inspiration by [simplebar](https://github.com/Jean-Tinland/simple-bar)'s design and feature set.

Note that as a result of this being primarily for personal use, the design of this status bar may have changes over time.


## Screenshots

### Clarity v3

By default, it gives workspace indicators on the left, yabai status at the center and some other miscellaneous status items at the right. App icons are extracted from the .app bundle automatically and shown when opened. Your wallpaper is automatically blurred when you have any window open in the current space.

![](showcase/screenshot_v3.png)

You can perform some basic customisation of its style via the `lib/settings.jsx` file, while preserving its design language. For example, you can choose a minimal design mode, adjust the sizes and toggle between top and bottom alignment:

![](showcase/screenshot_v3_2.png)

Or by simply reducing the height value, you can shrink it down to a space-only indicator, which can be used and remain visible with yabai paddings alongside the macOS menu bar. Inspired by [@rosenpin's fork of this repo](https://github.com/rosenpin/clarity/tree/ba5ab5fcaab811a295a174baf83f6f37c369bb06).

![](showcase/screenshot_v3_3.png)

<details markdown="1">
<summary>
[Click for extra config notes]
</summary>

- If used with Übersicht interaction enabled, it might be best to set `bar.jsx` to the background, while `status.jsx` and `spaces.jsx` are set to the foreground.
- Some app icons may not load correctly if they're not in a standard location (can't locate `.icns` file or asset in `Assets.car`, can't find icon name from `Info.plist`, etc.) - You can manually create a 32x32 `.png` file in the auto-generated `appIcons` folder to supplement any missing app icons.

</details>

### Legacy Versions and Designs

Designs from legacy versions can now be achieved with similar results with only minor editing of config and styles of the current one, so there's no need to use code I no longer maintain.

If you still prefer to use them directly, you may find them in the legacy forks or tags, but note that the old codebase is also significantly more messy and harder to edit.

## Installation

Clone this repo to your Übersicht widgets directory.
```bash
$ git clone https://github.com/wernjie/clarity $HOME/Library/Application\ Support/Übersicht/widgets/clarity
```

## Dependencies

- [SF Pro](https://developer.apple.com/fonts/) and [SF Symbols](https://developer.apple.com/sf-symbols/) - Apple's San Francisco font and symbols.
- [acextract](https://github.com/bartoszj/acextract) - Assets.car extracter for extracting app icons if needed. Though, [acextract v2.2](https://github.com/bartoszj/acextract/releases/tag/2.2) is included in the `scripts/` directory and is automatically used.

## Usage

### Widgets available

There are three widgets total:
- `spaces.jsx` for displaying workspaces (left). It has multi-display support.
- `bar.jsx` with yabai state indicators and provides a background blur.
- `status.jsx` for displaying selected status items (right).

### Refreshing yabai widgets

The widgets for displaying yabai workspaces and status don't refresh automatically (to preserve battery). To refresh them, you can add these lines utilizing [yabai's signals](https://github.com/koekeishiya/yabai/wiki/Commands#automation-with-rules-and-signals) at the end of `.yabairc`:

```sh
REL_SPACES_IND="osascript -e 'tell application id \"tracesof.Uebersicht\" to refresh widget id \"clarity-spaces-jsx\"'"
REL_BAR_IND="osascript -e 'tell application id \"tracesof.Uebersicht\" to refresh widget id \"clarity-bar-jsx\"'"
yabai -m signal --add event=space_changed   action="$REL_SPACES_IND"
yabai -m signal --add event=display_changed action="$REL_SPACES_IND"
yabai -m signal --add event=window_created   action="$REL_SPACES_IND"
yabai -m signal --add event=window_moved     action="$REL_SPACES_IND"
yabai -m signal --add event=window_resized   action="$REL_SPACES_IND"
yabai -m signal --add event=window_destroyed action="$REL_SPACES_IND"
yabai -m signal --add event=window_minimized   action="$REL_SPACES_IND"
yabai -m signal --add event=window_deminimized action="$REL_SPACES_IND"
yabai -m signal --add event=application_hidden action="$REL_SPACES_IND"
yabai -m signal --add event=application_visible action="$REL_SPACES_IND"
yabai -m signal --add event=mission_control_exit action="$REL_SPACES_IND"

yabai -m signal --add event=space_changed    action="$REL_BAR_IND"
yabai -m signal --add event=display_changed  action="$REL_BAR_IND"
yabai -m signal --add event=window_created   action="$REL_BAR_IND"
yabai -m signal --add event=window_moved     action="$REL_BAR_IND"
yabai -m signal --add event=window_resized   action="$REL_BAR_IND"
yabai -m signal --add event=window_destroyed action="$REL_BAR_IND"
yabai -m signal --add event=window_minimized   action="$REL_BAR_IND"
yabai -m signal --add event=window_deminimized action="$REL_BAR_IND"
yabai -m signal --add event=application_hidden action="$REL_BAR_IND"
yabai -m signal --add event=application_visible action="$REL_BAR_IND"
yabai -m signal --add event=mission_control_exit action="$REL_BAR_IND"

# Refresh immediately on yabai load
osascript -e "$REL_SPACES_IND"
osascript -e "$REL_BAR_IND"
```

### Caveats

- Your wallpaper should not be too busy or too bright, as this status bar is only designed with a dark background in mind.


