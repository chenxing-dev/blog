---
title: "How to Set Up and Use Bluetooth on Arch Linux"
category: "hardware"
description: "While Arch Linux provides robust support for Bluetooth, it requires manual setup. This guide walks you through the process of enabling Bluetooth, and pairing devices."
tags: ["bluez", "bluetooth", "linux", "arch linux"]
date: 2025-05-10
---


## **1. Installing Bluetooth Packages**

First, install the necessary packages using `pacman`:

```bash
sudo pacman -S bluez bluez-utils
```

- `bluez`: The Bluetooth protocol stack
- `bluez-utils`: Utilities like `bluetoothctl` for managing devices

## **2. Enabling the Bluetooth Service**

Start and enable the `bluetooth.service`:

```bash
sudo systemctl enable bluetooth.service
sudo systemctl start bluetooth.service
```

## **3. Checking Your Bluetooth Adapter**

Verify your adapter is recognized:
```bash
sudo dmesg | grep -i bluetooth
```

## **4. Pairing Devices with `bluetoothctl`**

Use the interactive `bluetoothctl` tool:
```bash
bluetoothctl
```

### Step-by-Step Pairing:
1. **Power on the controller**:
   ```
   power on
   ```

2. **Enable agent for authentication**:
   ```
   agent on
   default-agent
   ```

3. **Scan for devices**:
   ```
   scan on
   ```

4. **Pair and connect** (replace `XX:XX:XX:XX:XX:XX` with your device's MAC address):
   ```
   pair XX:XX:XX:XX:XX:XX
   connect XX:XX:XX:XX:XX:XX
   ```

5. **Trust the device for auto-connection**:
   ```
   trust XX:XX:XX:XX:XX:XX
   ```

6. Exit `bluetoothctl`:
   ```
   exit
   ```

Happy wireless computing! 🎧
