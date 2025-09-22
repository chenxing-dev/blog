---
title: "Picom: Enhance Your Linux Desktop with Smooth Visual Effects"
category: "desktop"
description: "Learn how to configure Picom.."
tags: ["picom", "linux", "customization", "compositor"]
date: 2025-05-13
---


```bash
sudo pacman -S picom  # Arch installation
```

## **Basic Configuration**

### 1. Create Config File
```bash
mkdir -p ~/.config/picom
nvim ~/.config/picom/picom.conf
```

### 2. Essential Settings
```ini
# ~/.config/picom/picom.conf
backend = "glx";
vsync = true;

# Shadow configuration
shadow = true;
```

## **Advanced Effects**


### **Rounded Corners**
```ini
corner-radius = 12;
```

### **Window Rules**
```ini
# Rule-based per-window options.
#
# See WINDOW RULES section in the man page for how these work.
rules: ({
  match = "window_type = 'tooltip'";
  fade = false;
  shadow = true;
  opacity = 0.75;
  full-shadow = false;
}, {
  match = "window_type = 'dock'    || "
          "window_type = 'desktop' || "
          "_GTK_FRAME_EXTENTS@";
  blur-background = false;
}, {
  match = "window_type != 'dock'";
  # shader = "my_shader.frag";
}, {
  match = "! name~='' || " # exclude windows with no name such as qtile's bar
          "window_type = 'dock' || "
          "window_type = 'desktop'";
  corner-radius = 0;
}, {
  match = "name = 'Notification'   || "
          "class_g = 'Conky'       || "
          "class_g ?= 'Notify-osd' || "
          "class_g = 'Cairo-clock' || "
          "_GTK_FRAME_EXTENTS@";
  shadow = false;
})
```


**Final Touch**: Add picom to auto-start script
```bash
# .config/qtile/autostart.sh
picom &
```
