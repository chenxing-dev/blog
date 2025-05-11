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
    "primary":      "#0969da",  # blue
    "secondary":    "#1a7f37",  # green
    "accent":       "#8250df",  # purple
    "alert":        "#cf222e"   # red
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
                active=colors["primary"],
                inactive=colors["foreground"],
                block_highlight_text_color=colors["background"],
                margin_y=3
            ),
            widget.Prompt(),
            widget.WindowName(
                max_chars=40
            ),
            widget.Systray(
                icon_size=18,
                padding=5
            ),
            widget.Clock(
                format="%Y-%m-%d %H:%M", 
                foreground=colors["secondary"]
            ),
            widget.QuickExit(
                foreground=colors["alert"],
                default_text=" ⏻ "
            ),
        ], 30, background=colors["background"]),
    ),
]
```

### System Tray

#### Install Applications
```bash
# Volume Control
sudo pacman -S volumeicon
volumeicon &
```

### Font

```python
# Font configuration example
widget_defaults = dict(
    font="FiraCode Nerd Font",
    fontsize=12,
    foreground=colors["foreground"]
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

