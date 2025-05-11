---
title: "Take Screenshots on Arch Linux with scrot"
description: "Learn how to capture, edit, and automate screenshots using the scrot command-line tool on Arch Linux."
tags: ["arch linux", "scrot", "screenshot", "cli", "productivity"]
date: 2025-05-11
---

*Why use GUI tools when the terminal can do it faster?*


```bash
sudo pacman -S scrot  # Installation
mkdir ~/Pictures/
scrot ~/Pictures/screenshot_%Y-%m-%d_$wx$h.png
```


## **Basic Usage Cheat Sheet**

| Command                               | Action                                |
| ------------------------------------- | ------------------------------------- |
| `scrot`                               | Full screen → `YYYY-MM-DD-HHMMSS.png` |
| `scrot -s`                            | Interactive region selection          |
| `scrot -d 5`                          | 5-second delay                        |
| `scrot -u`                            | Current focused window                |
| `scrot ~/Pictures/%Y-%m-%d_$wx$h.png` | Custom filename pattern               |


## **Advanced Capture Techniques**

### Thumbnail Generation
```bash
scrot -t 50  # 50% size thumbnail
```

## **Post-Processing Pipeline**

### Immediate Image Optimization
```bash
scrot -e 'mogrify -trim -border 10 -bordercolor "#2e3440" $f'
```

### OCR Capture Workflow
```bash
scrot -s /tmp/ocr-area.png && tesseract /tmp/ocr-area.png - | xclip -selection clipboard
```


## **Window Manager Integration**

### Qtile Keybindings
```python
# ~/.config/qtile/config.py
Key([], "Print", lazy.spawn("scrot -e 'mv $f ~/Pictures/'")),
```

### System-Wide Shortcuts
```bash
# Using sxhkd (~/.config/sxhkd/sxhkdrc)
Print
    scrot -e 'mv $f ~/Pictures/'
```
