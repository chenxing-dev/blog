---
title: "Getting Started with Raspberry Pi 4B: Minimal Setup Guide"
slug: raspberry-pi-4b-minimal-setup
description: "Step-by-step guide to installing Raspberry Pi OS Lite, configuring terminal appearance, and optimizing for headless use"
tags: ["raspberry pi", "linux", "terminal", "configuration"]
category: "hardware"
date: 2025-07-11
---

![Raspberry Pi 4B with cables connected](/pi4b-setup.jpg)  
<figcaption>Raspberry Pi 4B - perfect for headless server applications</figcaption>

## Hardware Requirements
- Raspberry Pi 4B (4GB+ RAM recommended)
- MicroSD card (32GB+ Class 10)
- USB-C power supply (5V/3A)
- Ethernet cable or WiFi connection
- HDMI cable for initial setup

## Step 1: Install Raspberry Pi OS Lite

### Using Raspberry Pi Imager (Recommended)
1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Insert SD card into your computer
3. Open Imager and select:
   - **OS**: Raspberry Pi OS (other) → Raspberry Pi OS Lite (32-bit)
   - **Storage**: Your SD card
4. Click the gear icon ⚙️ to enable headless settings:
   - Enable SSH with password authentication
   - Configure WiFi credentials
5. Click "Write" and wait for completion

> **Official Documentation**: [Installing the Operating System](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system)


## Step 2: First Boot Configuration

### Connect and Login
1. Insert SD card into Pi
2. Connect power, mouse, keyboard

#### Method 1: Connect HDMI

#### Method 2: Connect via SSH

- `ssh pi@192.168.1.xx`  
- Default credentials: `pi/raspberry` 

### Initial Setup Commands
```bash
# Update system
sudo apt update && sudo apt full-upgrade -y
```

## Step 3: Terminal Optimization

### Increase Font Size for 1440p
```bash
# List available fonts
ls /usr/share/consolefonts/

# Edit console setup
sudo nano /etc/default/console-setup
```
```ini
# Modify these lines:
FONTFACE="Uni2-Terminus32x16"
FONTSIZE="16x32"
```
```bash
# Apply changes
sudo setupcon
```

## Essential Post-Install Configuration

### Install Neofetch
```bash
sudo apt install -y neofetch

# Confirm system info
neofetch
```

### Change Default Neofetch Logo
```bash
# Edit config file
nano ~/.config/neofetch/config.conf
```

```bash
# ~/.config/neofetch/config.conf
print_info() {
    info title
    info underline

    info "OS" distro
    info "Host" model
    info "Kernel" kernel
    info "Terminal" term
    info "CPU" cpu
    info "GPU" gpu
    info "Memory" memory
}

ascii_distro="raspbian_small"
```

### Add to .bashrc
```bash
echo "echo && neofetch" >> ~/.bashrc
```
## Ensuring Raspberry Pi Readiness for Backend Hosting  

#### **1. Essential Service Installation**  
**Objective:** Install core hosting dependencies  
```bash  
# Install Python/NodeJS runtimes  
sudo apt install python3-pip nodejs npm  
```  

#### **2. Production Testing**  
**Objective:** Validate deployment with test project  

**A. Sample NodeJS App:**  
```javascript  
// ~/projects/test-app/server.js  
const http = require('http');  
const port = 8000;  

const server = http.createServer((req, res) => {  
  res.end(` Server operational | ${process.platform}`);  
});  

server.listen(port);  
```  

**B. PM2 Process Manager:**  
```bash  
sudo npm install pm2 -g  
pm2 start server.js --name "test-app"  
pm2 save  
pm2 startup  # Auto-start on boot  
```  

**Access Test:**  
```  
curl http://localhost:8000  
# Should return: " Server operational | linux"  
```  
