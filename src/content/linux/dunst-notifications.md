---
title: "Dunst: Linux Notification Setup"
category: "desktop"
tags: [ "linux", "dunst", "notifications", "customization", "dotfiles" ]
date: 2025-06-16
---


## **Installation**

```bash
# Arch Linux
sudo pacman -S dunst

# autostart.sh
dunst &
```

---

## **Minimal Viable Configuration**
Create `~/.config/dunst/dunstrc` with:

```ini
[global]
    frame_width = 1
    frame_color = "#666666"
    font = FiraCode Nerd Font Mono 10
    corner_radius = 12

[urgency_low]
    background = "#ffffff"
    foreground = "#888888"

[urgency_normal]
    background = "#ffffff"
    foreground = "#000000"

[urgency_critical]
    background = "#a0111f"
    foreground = "#ffffff"
```

Restart `dunst` with:  
`killall dunst && dunst &`


## **Debugging & Advanced Control**

### **Test Notifications**
```bash
notify-send -u normal "Test Title" "Everything working!"
notify-send -u critical "ALERT" "System overheating!"
```
