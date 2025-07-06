---
title: "USB Sticks on Arch Linux"
tags: ["linux", "usb", "storage", "troubleshooting"]
date: 2025-06-19
---


## **Step 1: Identifying Your USB Device**

### **Terminal Detection Methods**
```bash
# Method 1: lsblk - Check partitions / List block devices
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

**Important:** Always unmount before removal:
```bash
sudo umount ~/usb-drive

# Force unmount if busy
sudo umount -l ~/usb-drive  # Lazy unmount
```

## Troublesheeting

If you are getting a mounting error, follow these steps:

### Step 1: Identify Correct Partition
Are you're trying to mount the entire device (`/dev/sdb`) instead of a partition? Check partitions:
```bash
# Identify card
$ lsblk -f
NAME        FSTYPE 
sdb
└─sdb1      vfat      # <-- This is our partition
```
Look for your device (usually `sdb` or `mmcblk0`) and note the partition number (e.g., `sdb1`).

### Step 2: Mount Correct Partition
```bash
# Mount partition
sudo mount -t vfat /dev/sdb1 ~/usb-drive

# Verify
ls ~/sdcard
```

