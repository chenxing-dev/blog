---
title: "Dotfile Management with GNU Stow"
description: "Learn how to organize and sync your configuration files across systems using GNU Stow."
tags: ["dotfiles", "stow", "linux", "configuration"]
date: 2025-05-12
---

```bash
sudo pacman -S stow  # Arch Linux installation
```

## **Basic Setup Walkthrough**

### 1. Directory Structure
```bash
~/dotfiles
├── .config/
│   ├── kitty/
│   │   ├── current-theme.conf
│   │   └── kitty.conf
│   ├── qtile/
│   │   ├── autostart.sh
│   │   └── config.py
│   └── yazi/theme.toml
└────── wallpapers/
```

### 2. Create Symlinks
```bash
cd ~/dotfiles

mkdir ~/wallpapers/
stow -t ~/wallpapers/ wallpapers

cd .config

mkdir ~/.config/qtile/
stow -t ~/.config/qtile/ qtile

mkdir ~/.config/yazi/
stow -t ~/.config/yazi/ .config/yazi
```

### 3. Manage Configs
```bash
stow -D wallpapers  # Delete wallpapers symlinks
stow -R qtile # Restow (refresh) qtile
```


### Ignore Files
```bash
# ~/dotfiles/nvim/.stow-local-ignore
README.md
```


## **Pro Tips**

**Version Control Integration**  
   ```bash
   cd ~/dotfiles && git init
   gh repo create
   ```
Read more [GitHub Workflow with GitHub CLI (gh)](./gh-github-cli-repo-management)
