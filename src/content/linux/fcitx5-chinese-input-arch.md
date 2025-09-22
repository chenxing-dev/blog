---
title: "Multilingual Input on Arch Linux with Fcitx5"
category: "config"
description: "Guide to setting up Fcitx5 input method for Chinese input on Arch Linux."
tags: ["fcitx5", "arch linux", "input methods", "chinese", "localization"]
date: 2025-05-14
---


```bash
sudo pacman -S fcitx5 fcitx5-configtool fcitx5-chinese-addons
```

## **Basic Configuration**

### 1. Environment Setup
Add to `/etc/environment`:
```bash
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
SDL_IM_MODULE=fcitx
GLFW_IM_MODULE=ibus # Neccesary for fcitx to work in kitty
```

### 2. Autostart Configuration
Add to `~/.config/qtile/autostart.sh`:
```bash
fcitx5 &
```

### 3. Input Method Setup
```bash
fcitx5-configtool  # GUI configuration
```
1. Add **Pinyin** (Simplified)
2. Remove the **Enumerate Input Method Group Forward/Backward** keybinds
3. Change **Trigger Input Method** key (Recommend: Super+Space)
4. Enable and configure cloud input (optional)

## **Essential Font Packages**

### 1. Comprehensive CJK Fonts
```bash
# Noto Sans CJK (Google's Open Source Font)
sudo pacman -S noto-fonts-cjk  # Simplified & Traditional support
```

### 2. Monospace Coding Fonts
```bash
# Sarasa Gothic (CJK + Ligatures)
sudo pacman -S ttf-sarasa-gothic
```

### 3. Missing Glyph Fallback
```bash
# Install symbol fonts
sudo pacman -S noto-fonts-emoji
```

## **Advanced Customization**

### Material Design Theme
```bash
sudo pacman -S fcitx5-material-color
# Select in fcitx5-configtool → Addons → Classic UI → Fonts & Themes
```

*Contribute to Fcitx5 development: [fcitx/fcitx5](https://github.com/fcitx/fcitx5)*
