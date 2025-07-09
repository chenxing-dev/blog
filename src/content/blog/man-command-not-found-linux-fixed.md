---
title: 'Solving "bash: man: command not found"'
description: "Fix missing manual pages in your terminal"
category: "terminal"
tags: ["linux", "bash", "troubleshooting", "man-pages", "command-line"]
date: 2025-06-19
---

## **Distro-Specific Fixes**

### **Debian/Ubuntu**
```bash
sudo apt update
sudo apt install man-db manpages manpages-dev
```

### **Red Hat/CentOS/Fedora**
```bash
sudo dnf install man-db man-pages
```

### **Arch Linux**
```bash
sudo pacman -S man-db man-pages
```

### **Alpine Linux**
```bash
apk add man man-pages mandoc
```

---

## **Verifying the Fix**
```bash
# Check man installation
man --version    # Show installed version

# Test manual access
man man          # Should display manual for man
man ls           # Test core utility
```
