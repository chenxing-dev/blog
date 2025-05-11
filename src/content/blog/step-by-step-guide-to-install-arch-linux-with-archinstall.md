---
title: "Step-by-Step Guide to Install Arch Linux with archinstall"
tags: ["linux"]
date: 2025-05-11
---

![Arch Linux Logo](https://archlinux.org/static/logos/archlinux-logo-dark-90dpi.ebdee92a15b3.png)
*The `archinstall` script simplifies Arch Linux setup without sacrificing its core philosophy. Here's how to use it.*

## **Prerequisites**
- A bootable USB drive with the [Arch Linux ISO](https://archlinux.org/download/)
- Internet connection (Ethernet recommended for stability)
  - Run `ping archlinux.org` to confirm connectivity.  
  - *Note*: For Wi-Fi, use `iwctl` to connect before proceeding.

## **Step 1: Boot the Arch ISO**
1. Boot from the USB (usually via `F12`, `F2`, or `Esc` during startup).
2. Select **"Arch Linux install medium"** from the boot menu.

## **Step 2: Connect to the Internet**

### **Wi-Fi**  
Use `iwctl`:
```bash
iwctl
station wlan0 scan
station wlan0 get-networks
station wlan0 connect <SSID>
# Enter password when prompted
exit
```

## **Step 3: Launch `archinstall`**
Start the installer:
```bash
archinstall
```
## **Step 4: Configure Installation**

### **1. Configure Basic Settings**  
   - **Language**: Select your preferred language (e.g., `English`).  
   - **Locale**: Choose your locale (e.g., `en_US.UTF-8`).  
   - **Keyboard Layout**: Pick your keyboard (e.g., `us`).

### **2. Disk Configuration**  
- **Automatic Partitioning**: Let `archinstall` handle it (recommended for beginners).  
   - Select **"Use a best-effort default partition layout"** for automatic partitioning (or manually partition if preferred).  
   - Confirm the disk and filesystem 
     - Choose `ext4` (simple) or `btrfs` (advanced with snapshots).

### 3. Set Hostname:  
   Name your machine (e.g., `my-arch-pc`).

### 4. Set Password for Root User**  
Create a secure root password.

### **5. Create a Standard User**  
Add a non-root user with sudo privileges.
- Set the username (e.g., `jen`).  
- Set the user password.

### 6. Select Desktop Profile:
Under **"Desktop"**, there are a few tiling WM options:
- **i3** (classic)
- **Hyprland** (eye candy)
- **Qtile** (Python-powered)

Choose **`Qtile`**. This installs Qtile and necessary dependencies.

### 7. Audio Configuration

Select `pipewire` (modern default) or `pulseaudio` (legacy).

### 10. Network Configuration:  
- **Select "Copy ISO network configuration"**

### 11. Timezone and NTP:  

- Select your timezone (e.g., `UTC` or region-specific).  
- Enable NTP (Network Time Protocol) for automatic time synchronization.

### 12.  Review and Install:  
Double-check your choices.  

## **Step 5: Start Installation**
Confirm installation by selecting **"Install"**. 

Grab a coffee ☕ – this takes 5-15 minutes depending on your choices.

## **Step 6: Reboot into Arch**
After installation completes, reboot:
```bash
reboot
```

If the BIOS loop back to the Arch ISO, try **removing the USB drive.**

##  Post-Installation:  

1. **Log in**: Use your user credentials. Qtile should start automatically.  
2. Verify network connectivity (e.g., `ping archlinux.org`).
3. **Update the system**:
   ```bash
   sudo pacman -Syu
   ```
Read more: [Boost Arch Linux Download Speeds with Reflector](./reflector-arch-linux-mirror-optimization)

4. **Install Additional Packages**:  
     ```bash
     pacman -S firefox kitty neovim fish starship
     ```
5. **Configure Qtile**:  
     Edit the config file to customize Qtile themes or keybindings:  
     ```bash
     nano ~/.config/qtile/config.py
     ```
Read more: [Qtile: Customizing Themes and Keybindings](./qtile-customize-themes-keybindings)

6. Set up personal dotfiles.  

Read more: [Dotfile Management with GNU Stow](./stow-dotfiles-management)

7. **More Customization**
    ```bash
    # Cute terminal tools
    yay -S cute-fish-shell-theme pastel-grub

    # Non-binary friendly dotfiles
    git clone https://github.com/queer-coding-collective/dotfiles
    ```
    Install [Catppuccin](https://github.com/catppuccin) themes for soft pastel colors. Now go forth and code in style! 💅

    ```bash
    yay -S catppuccin-gtk-theme-mocha catppuccin-cursors
    ```
