---
title: Minimal GRUB Customization Without grub-customizer
date: 2025-07-08
tags: ["grub", "bootloader", "customization", "arch linux", "linux", "minimalism"]
---

Here's how to manually customize GRUB for a clean, minimal look:

#### 1. **Essential Files to Edit**
```bash
/etc/default/grub          # Main configuration
/etc/grub.d/00_header      # Header customization
```

#### 2. **Install Requirements**
```bash
sudo pacman -S grub os-prober ttf-dejavu
```

#### 3. **Configure `/etc/default/grub`**
```ini
GRUB_TIMEOUT_STYLE=menu
GRUB_GFXMODE=1920x1080x32
GRUB_THEME="/boot/grub/themes/minimal/theme.txt"
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_DISABLE_OS_PROBER=false
```

#### 4. **Create Minimal Theme**
```bash
# Create theme directory
sudo mkdir -p /boot/grub/themes/minimal

# Create theme.txt
sudo nano /boot/grub/themes/minimal/theme.txt
```
```ini:theme.txt
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

#### 5. **Generate Font File**
```bash
sudo grub-mkfont -s 18 -o /boot/grub/fonts/DejaVuSansMono18.pf2 \
/usr/share/fonts/TTF/DejaVuSansMono.ttf
```

#### 6. **Create custom menu entry**

Add to `40_custom`
```bash
sudo nano /etc/grub.d/40_custom
```

```bash
#!/bin/sh
exec tail -n +3 $0

menuentry "Windows 11" {
    search --no-floppy --fs-uuid --set=root YOUR_WINDOWS_UUID
    chainloader (${root})/EFI/Microsoft/Boot/bootmgfw.efi
}
```

Find Partition UUIDs
```bash
# For Windows EFI partition
sudo blkid /dev/nvme1n1p1
```

#### 7. **Generate Final Config**
```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Verify entries
grep menuentry /boot/grub/grub.cfg
```
