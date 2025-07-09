---
title: "Secure Credential Management: Safeguarding Passwords & Service Keys on Linux"
category: "security"
description: "Store and manage sensitive credentials securely using encryption."
tags: ["security", "passwords", "linux", "encryption"]
date: 2025-05-10
---


## **Encrypted Files**

### **GPG-Encrypted Credential Store**
```bash
# Create credentials file
echo "API_KEY=sup3rs3cr3t" > secrets.env
# Encrypt
gpg -c secrets.env
# Remove plaintext
shred -u secrets.env
# Decrypt when needed
gpg -d secrets.env.gpg
```
