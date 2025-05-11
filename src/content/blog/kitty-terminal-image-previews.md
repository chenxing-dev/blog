---
title: "Image Previews in Kitty"
tags: ["kitty", "terminal", "images", "CLI", "productivity"]
date: 2025-05-11
---

*Why switch to GUI file managers when your terminal can show thumbnails?*


## **Basic Image Preview**

### 1. Preview Single Image
```bash
kitty +kitten icat image.jpg
```

### 2. Clear Preview
```bash
kitty +kitten icat --clear
```


## **Advanced Workflows**

### **Yazi File Manager Previews**

```bash
sudo pacman -S yazi  # installation
```


## **Configuration Reference**

| Command             | Action            |
| ------------------- | ----------------- |
| `icat --align left` | Left-align images |


## **Integration with Common Tools**


### **PDF Thumbnails**
```bash
pdftoppm -jpeg -f 1 -singlefile doc.pdf | kitty +kitten icat
```
#### **Components**:
1. **`pdftoppm`**: PDF to image converter (part of Poppler utils)
2. **`-jpeg`**: Output JPEG
3. **`-f 1`**: Start at first page
4. **`-singlefile`**: Output only the first page

#### **Installation Requirements**
```bash
sudo pacman -S poppler  # pdftoppm
```

### **Web Images**
```bash
curl -s https://example.com/image.jpg | kitty +kitten icat
```
