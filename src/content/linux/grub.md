---
title: Minimal GRUB Customization Without grub-customizer
description: "Customize your GRUB bootloader by editing configuration files directly."
category: "config"
date: 2025-10-01
tags: ["grub", "bootloader", "configuration", "customization", "arch linux", "linux", "minimalism"]
---

## Introduction

GRUB is highly configurable without third‑party tools. By editing a few files and generating the final config, you get predictable results that are easy to track in dotfiles. 

Here's my minimal, reproducible GRUB setup using only config files:

# Customization Options

### 1) Essential Files to Edit

```bash
/etc/default/grub          # Main configuration
/etc/grub.d/00_header      # Header customization
```

### 2) Install Requirements

```bash
sudo pacman -S grub os-prober ttf-dejavu
```

The `os-prober` package detects other OSes like Windows. The `ttf-dejavu` package provides a clean monospace font for GRUB.

### 3) Configure /etc/default/grub

```ini
GRUB_TIMEOUT_STYLE=menu
GRUB_GFXMODE=1920x1080x32
GRUB_THEME="/boot/grub/themes/minimal/theme.txt"
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_DISABLE_OS_PROBER=false
```

### 4) Create a Minimal Theme

Create the directory and theme file:

```bash
# Create theme directory
sudo mkdir -p /boot/grub/themes/minimal

# Create theme.txt
sudo nano /boot/grub/themes/minimal/theme.txt
```

Example `theme.txt`:

```ini
desktop-color: "#000000"
title-color: "#EEEEEE"
message-color: "#AAAAAA"
message-bg-color: "#111111"
terminal-font: "DejaVu Sans Mono"

+ boot_menu {
    left = 30%
    top = 30%
    width = 40%
    height = 40%
    item_font = "DejaVu Sans Mono 14"
    item_height = 30
    item_padding = 5
    item_color = "#111111"
    selected_item_color = "#888888"
}
```

### 5) Generate a Font File

```bash
sudo grub-mkfont -s 18 -o /boot/grub/fonts/DejaVuSansMono18.pf2 \
/usr/share/fonts/TTF/DejaVuSansMono.ttf
```

### 6) Create a Custom Menu Entry

Add to `40_custom`:

```bash
sudo nano /etc/grub.d/40_custom
```

Sample entry for Windows 11 (replace `YOUR_WINDOWS_UUID` with actual UUID):

```bash
#!/bin/sh
exec tail -n +3 $0

menuentry "Windows 11" {
    search --no-floppy --fs-uuid --set=root YOUR_WINDOWS_UUID
    chainloader (${root})/EFI/Microsoft/Boot/bootmgfw.efi
}
```

Find Partition UUIDs:

```bash
# For Windows EFI partition
sudo blkid /dev/nvme1n1p1
```

### 7) Generate the Final Config

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Verify entries
grep menuentry /boot/grub/grub.cfg
```

### Troubleshooting: Emergency Shell Recovery

If you see **"You are now being dropped into an emergency shell"**, this means initramfs failed to mount your root filesystem. Fix it quickly by following these steps:

#### 1. Identify Root Partition
```bash
# List available block devices
lsblk -f

# If lsblk isn't available:
# Try mounting likely candidates:
# NVMe drives: /dev/nvme0n1p2, /dev/nvme1n1p1
# SATA drives: /dev/sda2, /dev/sdb1
```

#### 2. Mount Root Partition
```bash
# Mount your Linux root partition to /new_root
mount /dev/nvme0n1p2 /new_root

# If you have separate boot partition:
mount /dev/nvme0n1p1 /new_root/boot
```

#### 3. Exit to Continue Boot
```bash
exit
```

#### 4. Fix After Boot
```bash
# Verify root parameter in GRUB config
grep GRUB_CMDLINE_LINUX /etc/default/grub

# Should include root parameter like:
# GRUB_CMDLINE_LINUX="root=/dev/nvme0n1p2"

# Regenerate GRUB config
sudo grub-mkconfig -o /boot/grub/grub.cfg
```
