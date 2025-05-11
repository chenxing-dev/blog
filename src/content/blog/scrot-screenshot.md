---
title: "Take Screenshots on Arch Linux with Scrot"
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

### Screenshot Post-Processing

```bash
# Quick install for image tools
sudo pacman -S imagemagick
```

#### Watermark

```bash
scrot -e \
'mogrify -pointsize 24 -fill "rgba(255,255,255,0.5)" \
-draw "text 20,30 Watermark" \
-gravity southeast $f'
```

- `pointsize 24`: Text size
- `fill rgba(255,255,255,0.5)`: Semi-transparent white
- `draw text`: Draw text at position
- `gravity southeast`: Text position

### OCR Capture: From Screenshot to Clipboard
```bash
scrot -s /tmp/ocr-area.png && \
tesseract /tmp/ocr-area.png - | xclip -selection clipboard
```
**Components:**

1. `tesseract`: OCR engine extracting text from images. 
   - Install with:
    ```bash
    sudo pacman -S tesseract tesseract-data-eng  # English language data
    ```
2. `xclip`: Clipboard management tool
   - Installation requirement:
    ```bash
    sudo pacman -S xclip
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
