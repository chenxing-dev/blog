---
title: "GitHub Workflow with GitHub CLI (gh)"
tags: ["GitHub CLI", "GitHub", "productivity", "CLI"]
date: 2025-05-12
---

```bash
sudo pacman -S github-cli  # Arch installation
gh auth login  # Authenticate once
```

---

## **Essential Repository Workflows**

### 1. Create & Clone Repos
```bash
# Create new repo from terminal
gh repo create

# Clone existing repos
gh repo clone user/repo
```

### 2. Issue Management
```bash
# Create issue
gh issue create -t "Bug Fix" -b "Description" -l bug

# List open issues
gh issue list --state open

# Close issue
gh issue close 1 --comment "Its's fixed."
```
