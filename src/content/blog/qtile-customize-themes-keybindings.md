---
title: "Qtile: Customizing Themes and Keybindings"
tags: ["qtile", "arch linux", "tiling wm", "customization", "theming"]
date: 2025-05-11
---


*Make Qtile truly yours with Python-powered personalization*


## **Qtile Configuration Basics**
Configuration file: `~/.config/qtile/config.py`  

## **Theme Customization**

### **1. Color Scheme Setup**
```python
# Theme Example
colors = {
    "background":   "#ffffff",  # Pure white
    "foreground":   "#0e1116",  # Almost black
    "primary":      "#696969",  # gray
}

# Apply to layouts
layout_theme = {
    "border_width": 2,
    "margin": 6,
    "border_focus": colors["primary"],
    "border_normal": colors["background"]
}

layouts = [
    layout.MonadTall(**layout_theme),
    layout.Max(**layout_theme),
    layout.Matrix(**layout_theme)
]
```

### **2. Bar & Widget Styling**
```python
screens = [
    Screen(
        bottom=bar.Bar([
            widget.CurrentLayout(),
            widget.GroupBox(
                highlight_method="block",
                this_current_screen_border=colors["background"],
                block_highlight_text_color=colors["foreground"],
            ),
            widget.Prompt(),
            widget.WindowName(
                max_chars=40
            ),
            widget.Systray(
                icon_size=18,
                padding=5
            ),
            widget.Wlan(
                format='{essid}',
            ),
            widget.Clock(
                format="%Y-%m-%d %H:%M"
            ),
            widget.QuickExit(
                default_text=" ⏻ "
            ),
        ], 28, background=colors["foreground"]),
    ),
]
```

The `iwlib` python package is required for the `Wlan` widget, install:

```bash
sudo pacman -S python-iwlib
```

### System Tray

#### Install Volume Icon

```bash
# Volume Control
sudo pacman -S volumeicon
volumeicon &
```
Choose **White Gnome** for **Icon Theme**.

### Font

```python
# Font configuration example
widget_defaults = dict(
    font="FiraCode Nerd Font",
    fontsize=12,
    foreground=colors["background"]
)
```

Reboot for the font to take effect.

## **Keybinding Customization**

### **Essential Keybindings**
```python
mod = "mod4"  # Super/Windows key
terminal = "kitty"

keys = [
    # Window control
    Key([mod, "shift"], "b", lazy.hide_show_bar(), desc="Toggle bar"),
    Key([mod, "shift"], "q", lazy.window.kill(), desc="Kill focused window"),
    # Key([mod, "alt"], "q", lazy.shutdown(), desc="Shutdown Qtile")
    
    # Application launchers
    Key([mod], "b", lazy.spawn("firefox"), desc="Launch Firefox"),
    Key([mod], "c", lazy.spawn("code"), desc="Launch Code"),
    Key([mod], "Return", lazy.spawn(terminal), desc="Launch terminal"),
    
    # Custom shortcut
    Key([], "Print", lazy.spawn("scrot -e 'mv $f ~/Pictures/'")),
]
```

Read more: [Take Screenshots on Arch Linux with scrot](./scrot-screenshot)

### **Advanced Binding: Multimedia Keys**
```python
keys.extend([
    Key([], "XF86AudioRaiseVolume", 
        lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ +5%")),
    Key([], "XF86AudioLowerVolume", 
        lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ -5%")),
    Key([], "XF86AudioMute", 
        lazy.spawn("pactl set-sink-mute @DEFAULT_SINK@ toggle"))
])
```

## **Autostart Configuration**

Add to your `~/.config/qtile/config.py`:

```python
import os
import subprocess
from libqtile import hook

@hook.subscribe.startup_once
def autostart():
    script = os.path.expanduser("~/.config/qtile/autostart.sh")
    subprocess.run([script])
```

Create the `~/.config/qtile/autostart.sh` file:

```bash
#!/bin/sh
volumeicon &
```

Make the script executable with `chmod +x ~/.config/qtile/autostart.sh`.

Reboot and the autostart script should run on Qtile startup.

Read more: [Dotfile Management with GNU Stow](./stow-dotfiles-management)

## **Workflow Optimization Tips**

### **Keybinding Cheat Sheet**

| Shortcut                | Action                   |
| ----------------------- | ------------------------ |
| `Super + Ctrl + r`      | Reload Qtile config      |
| `Super + [1-9]`         | Switch workspaces        |
| `Super + Shift + [1-9]` | Move window to workspace |



## **Troubleshooting**


### **Debugging Tools**
```bash
# View Qtile logs
tail -n 30 ~/.local/share/qtile/qtile.log
```


**Final Thought**: Qtile's Python configuration offers limitless possibilities. The [Qtile Documentation](http://docs.qtile.org) is your best friend for advanced features!

