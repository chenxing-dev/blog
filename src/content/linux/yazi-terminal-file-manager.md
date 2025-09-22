---
title: "Yazi: The Blazing-Fast Terminal File Manager Built in Rust"
category: "terminal"
tags: ["yazi", "rust", "terminal", "file manager", "productivity"]
date: 2025-05-12
---

```bash
sudo pacman -S yazi# Arch Linux installation
```


## **Essential Yazi Workflow**

### Navigation Shortcuts
| Key     | Action                                |
| ------- | ------------------------------------- |
| `j/k`   | Move down/up                          |
| `h/l`   | Collapse/expand                       |
| `Space` | Multi-select                          |
| `r`     | Rename                                |
| `.`     | Toggle the visibility of hidden files |
| `f`     | Filter files                          |

## **Advanced Features**

### **Custom Themes**
```toml
# ~/.config/yazi/theme.toml

"$schema" = "https://yazi-rs.github.io/schemas/theme.json"

[manager]
cwd = { fg = "black" }

[mode]
normal_main = { bg = "white", bold = true }
normal_alt  = { fg = "black", bg = "gray" }

[filetype]
rules = [
	# Fallback
	{ name = "*/", fg = "gray" }
]
```
