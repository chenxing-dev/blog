---
title: Checking Laptop Battery Status via Sysfs on Arch Linux
description: Exploring how to directly access and interpret battery information through the system filesystem on Arch Linux for power monitoring and scripting
tags: ["arch linux", linux, "system administration", "power management", "bash scripting", sysfs]
category: terminal
date: 2025-10-01
---

## TL;DR

```bash
cat /sys/class/power_supply/BAT0/capacity  # Shows current charge percentage
cat /sys/class/power_supply/BAT0/status    # Shows Charging, Discharging, or Full
```

## Understanding the Sysfs Power Supply Interface

Sysfs is a pseudo-filesystem that provides a structured interface to kernel data structures, particularly hardware information and configuration. For power supplies like batteries, this interface is exposed under `/sys/class/power_supply/`.

Each battery and AC adapter connected to your system appears as a separate directory in this location. The primary battery is typically named `BAT0`, with additional batteries potentially named `BAT1`, etc. You can list all power supplies with:

```bash
ls /sys/class/power_supply/
```

## Locating and Interpreting Key Battery Files

Within each battery directory, numerous files contain specific information about the battery's state and characteristics. Here are the most critical files for battery monitoring:

| **File** | **Purpose** | **Example Values** |
|----------|-------------|-------------------|
| `capacity` | Current charge percentage | `91` (for 91%) |
| `status` | Current charging state | `Charging`, `Discharging`, or `Full` |
| `energy_now` | Current energy in micro-watt hours | `29130000` |
| `energy_full` | Energy when fully charged (current max) | `32000000` |
| `energy_full_design` | Energy when new (design capacity) | `57720000` |
| `voltage_now` | Current voltage in microvolts | `12021000` |
| `manufacturer` | Battery manufacturer | `LGC` |
| `model_name` | Battery model name | `42T4865` |
| `technology` | Battery chemistry | `Li-ion` |

### Reading Basic Battery Status

The most immediate battery information can be obtained by reading simple text files:

```bash
# Check current battery percentage
cat /sys/class/power_supply/BAT0/capacity

# Check charging status
cat /sys/class/power_supply/BAT0/status
```

These commands will return the raw values, making them perfect for scripting and automation.

### Calculating Battery Health

Battery health degradation can be calculated by comparing the current maximum capacity (`energy_full`) with the design capacity (`energy_full_design`):

```bash
# Read the capacity values
current_full=$(cat /sys/class/power_supply/BAT0/energy_full)
design_full=$(cat /sys/class/power_supply/BAT0/energy_full_design)

# Calculate health percentage
health_percentage=$(echo "scale=2; $current_full / $design_full * 100" | bc)
echo "Battery health: $health_percentage%"
```

> **Note:** `bc` is a command-line calculator. If `bc` is not installed, you can install it via your package manager (e.g., `sudo pacman -S bc`).
>
> Here, `scale=2` sets the precision to two decimal places.

Health percentages below 80% typically indicate significant battery wear and may suggest considering a replacement. 

## Practical Monitoring Scripts

### Simple Monitoring with Watch

For real-time battery monitoring, you can combine the `watch` command with file reading:

```bash
watch -n 5 'echo "Battery: $(cat /sys/class/power_supply/BAT0/capacity)% ($(cat /sys/class/power_supply/BAT0/status))"'
```

This command updates the battery percentage and status every 5 seconds.

### Advanced Monitoring Script

For more comprehensive monitoring, create a script that gathers multiple battery metrics:

```bash
#!/bin/bash
# battery_status.sh

# Define battery path
BATTERY_PATH="/sys/class/power_supply/BAT0"

if [ ! -d "$BATTERY_PATH" ]; then
    echo "Battery not found at $BATTERY_PATH"
    exit 1
fi

capacity=$(cat "$BATTERY_PATH/capacity")
status=$(cat "$BATTERY_PATH/status")
energy_now=$(cat "$BATTERY_PATH/energy_now")
energy_full=$(cat "$BATTERY_PATH/energy_full")
energy_full_design=$(cat "$BATTERY_PATH/energy_full_design")
voltage_now=$(cat "$BATTERY_PATH/voltage_now")

# Convert energy from µWh to Wh
energy_now_wh=$(echo "scale=2; $energy_now / 1000000" | bc)
energy_full_wh=$(echo "scale=2; $energy_full / 1000000" | bc)

# Calculate health percentage
health_pct=$(echo "scale=2; $energy_full / $energy_full_design * 100" | bc)

echo "Battery Status: $status"
echo "Capacity: $capacity%"
echo "Current Energy: $energy_now_wh Wh"
echo "Full Charge Energy: $energy_full_wh Wh"
echo "Design Capacity: $(echo "scale=2; $energy_full_design / 1000000" | bc) Wh"
echo "Battery Health: $health_pct%"
echo "Voltage: $(echo "scale=2; $voltage_now / 1000000" | bc) V"
```
