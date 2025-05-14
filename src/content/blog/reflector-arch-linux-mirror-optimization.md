
---
title: "Boost Arch Linux Download Speeds with Reflector: A Mirror Optimization Guide"
description: "Learn how to dramatically improve pacman download speeds by automating optimal mirror selection with Reflector on Arch Linux."
tags: ["arch linux", "reflector", "optimization", "system administration", "pacman"]
date: 2025-05-10
---


## **Why Reflector Matters**
Without proper mirror management, you might be stuck with:
- Slow download speeds from distant mirrors
- Out-of-date repositories causing failed updates
- Inconsistent connection quality

**Reflector** solves this by automatically:
1. Fetching latest mirror status
2. Testing connection speeds
3. Generating an optimized `/etc/pacman.d/mirrorlist`


## **Installation**
```bash
sudo pacman -S reflector
```

## **Basic Setup: Generate Optimized Mirrorlist**

### 1. Backup current mirrors
```bash
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup
```

### 2. Generate new mirrorlist
```bash
sudo reflector --protocol https --latest 40 --sort rate --save /etc/pacman.d/mirrorlist
```

**Flag Breakdown**:
- `--protocol https`: Secure connections only
- `--latest 20`: Use 20 most recently synced mirrors
- `--save`: Write to mirrorlist


## **Verification & Testing**

### Check Mirror Performance

Install the `rankmirros` AUR package. Read more: [Manual AUR Package Install](./aur-package-manual-install)

```bash
rankmirrors -n 0 /etc/pacman.d/mirrorlist
```

