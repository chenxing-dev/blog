---
title: "LAN Hosting Guide: Access Your Projects Across Home Devices"
tags: [ "networking", "local server", "ssh", "web development", "home networking"]
date: 2025-07-05
---

*Share your local development projects across devices without complex setups or cloud services*


## **What is LAN Hosting?**
LAN Hosting (Local Area Network Hosting) allows you to run a project on one machine and access it from any device on the same WiFi network. 

## **Step-by-Step Implementation**

### 1. Configure Your Backend (Machine A)
#### **Node.js (Express) Example**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Project accessible across network!');
});

// Critical: Bind to 0.0.0.0
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
```

#### **Python Simple Server**
```bash
# Hosts current directory at port 8000
python -m http.server 8000 --bind 0.0.0.0
```

**Key Configuration**:  
Always bind to `0.0.0.0` instead of `localhost` to allow network access.


### 2. Find Your Local IP Address
#### **Windows**
1. Open Command Prompt
2. Execute: `ipconfig`
3. Look for `IPv4 Address` under your WiFi adapter  
   *(Example: `192.168.1.100`)*

#### **Linux/macOS**
1. Launch Terminal
2. Run: `ifconfig` or `ip a`
3. Find `inet` address under `wlan0`/`en0`  
   *(Example: `192.168.1.100`)*


### 3. Access from Another Device (Machine B)
1. Ensure both machines are on the same WiFi
2. On Machine B's browser, visit:  
   `http://<Machine-A-IP>:<PORT>`  
   *(Example: `http://192.168.1.100:3000`)*


## **SSH Access Troubleshooting**
Encountering "Connection refused" when trying to SSH between machines? Follow these steps:

### 1. Verify SSH Service Status
```bash
systemctl status sshd
```

### 2. Start and Enable SSH Service
```bash
sudo systemctl start sshd
sudo systemctl enable sshd  # Enable on boot
```

## **Advanced Techniques**

### Persistent Access with Local DNS
Assign a fixed local domain:
```bash
# On Machine B's /etc/hosts
192.168.1.100   touch.grass
```
Access via: `http://touch.grass:3000`

---

## **Security Considerations**
1. **Temporary Exposure**: Disable network binding when not testing
2. **Firewall Restrictions**: Only open necessary ports
3. **Authentication**: Add basic auth for sensitive projects
   ```javascript
   // Express basic auth
   const basicAuth = require('express-basic-auth')
   app.use(basicAuth({
    users: { username: "password" },
    challenge: true,
   }));
   ```
