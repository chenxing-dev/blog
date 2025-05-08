
---
title: "Boost Arch Linux Download Speeds with Reflector: A Mirror Optimization Guide"
description: "Learn how to dramatically improve pacman download speeds by automating optimal mirror selection with Reflector on Arch Linux."
tags: ["arch linux", "reflector", "optimization", "system administration", "pacman"]
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
sudo reflector --protocol https --latest 20 --sort rate --save /etc/pacman.d/mirrorlist
```

**Flag Breakdown**:
- `--protocol https`: Secure connections only
- `--latest 20`: Use 20 most recently synced mirrors
- `--save`: Write to mirrorlist


## **Verification & Testing**

### Check Mirror Performance
```bash
sudo pacman -S rankmirrors
rankmirrors -n 5 /etc/pacman.d/mirrorlist
```

## **Pro Tips**

1. **Combine with Pacman Hook**  
   Update mirrors before each upgrade:
   ```bash
   sudo nano /etc/pacman.d/hooks/mirrorupgrade.hook
   ```
   ```ini
   [Trigger]
   Operation = Upgrade
   
   [Action]
   Description = Updating mirrorlist...
   When = PreTransaction
   Exec = /usr/bin/reflector --save /etc/pacman.d/mirrorlist
   ```

2. **Country Codes**  
   Find nearby codes:
   ```bash
   reflector --list-countries
   ```
