---
title: "USB Sticks on Arch Linux"
tags: ["linux", "usb", "storage", "troubleshooting"]
date: 2025-06-19
---


## **Step 1: Identifying Your USB Device**

### **Terminal Detection Methods**
```bash
# Method 1: lsblk - List block devices
lsblk -f

# Method 2: dmesg - View kernel messages
sudo dmesg | tail -20

# Method 3: fdisk - Detailed partition info
sudo fdisk -l
```

Key indicators:
- `/dev/sdX` (X = letter assignment)
- Filesystem type (vfat)

## **Step 2: Mounting & Accessing Files**

### **Manual Mounting**
```bash
# Create mount point
mkdir ~/usb-drive

# Mount device (example for NTFS)
sudo mount -t ntfs /dev/sdX1 ~/usb-drive

# Access files
cd ~/usb-drive && ls
```

### **Unmounting Safely**
```bash
# Unmount before removal
sudo umount ~/usb-drive

# Force unmount if busy
sudo umount -l ~/usb-drive  # Lazy unmount
```
