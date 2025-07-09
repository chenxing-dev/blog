---
title: "Manual AUR: Install & Manage Packages on Arch Linux"
description: "Step-by-step guide to manually installing, updating, and maintaining AUR packages without helpers."
category: "package-management"
tags: ["arch linux", "aur", "makepkg", "pacman", "packaging", "system administration", "linux"]
date: 2025-05-10
---


## **Prerequisites**
Essential build tools:
   ```bash
   sudo pacman -S base-devel git
   ```


## **Step-by-Step Manual Installation**

### 1. Clone Package Repository
```bash
git clone https://aur.archlinux.org/package-name.git
cd package-name
```

### 2. Inspect PKGBUILD (Critical!)
```bash
nano PKGBUILD  # Look for suspicious URLs/commands
```

### 3. Build & Install Package
```bash
makepkg -sric
```
**Flag Breakdown:**
- `-s`: Install missing dependencies (--syncdeps)
- `-i`: Install package after building (--install)
- `-c` to clean build files (--clean)

## **Package Maintenance**

### Check for Updates
```bash
# Inside package directory
git pull origin master
```

### Remove Packages
```bash
sudo pacman -Rns package-name
```
