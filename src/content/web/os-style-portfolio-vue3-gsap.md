---
title: Building my OS-style portfolio site with Vue 3 and GSAP
description: A technical deep dive into creating an operating system-inspired portfolio website using Vue 3 composition API and GSAP animations
tags: [vue3, gsap, portfolio, web-development, animation, frontend, vue-draggable-resizable]
category: web-development
date: 2025-09-25
---

## Discovering the World of Web Desktops

My journey began when I found [this curated gallery of awesome web desktops](https://github.com/syxanash/awesome-web-desktops). Projects like [itisasifyouweredoingwork](https://github.com/pippinbarr/itisasifyouweredoingwork) and [Yahya J. Aifit's portfolio](https://yja.me) take inspiration from traditional desktop environments, creating a nostalgic and engaging user experience. The creativity and interactivity of these projects sparked my interest in building a similar OS-style portfolio site. 

I was learning Vue 3 and wanted to explore its Composition API, so I decided to combine this with GSAP for animations to create a dynamic and visually appealing portfolio.

## Technology Choices

### Vue 3 Composition API: Learning Modern Reactivity
As someone new to Vue 3's Composition API, I wanted to understand its reactivity system through a practical project. Different from other frameworks, Vue's Composition API uses `ref` to create reactive state variables. The following example illustrates how I managed the desktop state:

```typescript
// useDesktop.ts
import { ref, reactive } from 'vue'

export function useDesktop() {
  const windows = ref([])
  const activeWindow = ref(null)
  
  const openWindow = (app) => {
    const newWindow = {
      id: `window_${Date.now()}`,
      app,
      position: { x: 50 + windows.value.length * 30, y: 50 + windows.value.length * 30 },
      zIndex: 1000 + windows.value.length
    }
    
    windows.value.push(newWindow)
    activateWindow(newWindow.id)
  }
  
  const activateWindow = (windowId) => {
    activeWindow.value = windowId
    // Bring to front by increasing z-index
    windows.value.forEach(window => {
      if (window.id === windowId) {
        window.zIndex = Math.max(...windows.value.map(w => w.zIndex)) + 1
      }
    })
  }
  
  return {
    windows,
    activeWindow,
    openWindow,
    activateWindow
  }
}
```

### GSAP: Smooth Animations for Desktop Interactions
GSAP provided the animation capabilities needed to make window interactions feel natural. I focused on learning timeline controls and easing functions. With GSAP, I created opening and closing animations for windows:

```typescript
import { gsap } from 'gsap'

export function useWindowAnimations() {
  const openAnimation = (element) => {
    return gsap.fromTo(element, 
      { 
        scale: 0.8, 
        opacity: 0, 
        rotationX: 10 
      },
      { 
        scale: 1, 
        opacity: 1, 
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out"
      }
    )
  }
  
  const closeAnimation = (element, onComplete) => {
    return gsap.to(element, {
      scale: 0.8,
      opacity: 0,
      rotationX: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete
    })
  }
  
  return {
    openAnimation,
    closeAnimation
  }
}
```

### vue-draggable-resizable: Draggable Window Implementation
I used `vue-draggable-resizable` specifically for its draggable capabilities, disabling resizing to maintain consistent window sizes.

```vue
<template>
  <div 
    v-for="window in windows" 
    :key="window.id"
    class="window-wrapper"
    :style="{ zIndex: window.zIndex }"
  >
    <VueDraggableResizable
      :x="window.position.x"
      :y="window.position.y"
      :w="600"
      :h="400"
      :resizable="false"
      @drag-stop="(x, y) => updateWindowPosition(window.id, x, y)"
      @activated="() => activateWindow(window.id)"
    >
      <div class="window">
        <div class="window-header" @mousedown="activateWindow(window.id)">
          <h3>{{ window.app.title }}</h3>
          <button class="close-btn" @click="closeWindow(window.id)">×</button>
        </div>
        <div class="window-content">
          <component :is="window.app.component" />
        </div>
      </div>
    </VueDraggableResizable>
  </div>
</template>

<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
import { useDesktop } from '../composables/useDesktop'

const { windows, activateWindow, updateWindowPosition, closeWindow } = useDesktop()
</script>
```

## Project Architecture

### Application Structure
I organized the project around composables and components:

```
src/
├── composables/
│   ├── useDesktop.ts
│   ├── useWindowAnimations.ts
│   └── useApps.ts
├── components/
│   ├── Desktop.vue
│   ├── Window.vue
│   └── apps/
│       ├── AboutApp.vue
│       ├── ProjectsApp.vue
│       └── ContactApp.vue
└── App.vue
```

> What is a composable?
> Composables are reusable functions that encapsulate specific logic or state management, allowing you to share functionality across multiple components without duplicating code. 
> For example, `useDesktop.ts` manages the state and behavior of the desktop environment, while `useWindowAnimations.ts` handles the animation logic for opening and closing windows. This modular approach enhances code maintainability and readability.

> Why is it called a composable?
> The term "composable" reflects the idea that these functions can be composed together to build complex functionality from simpler, reusable pieces. This aligns with the principles of functional programming and promotes a clean separation of concerns within your application.

### Application Registry Pattern
A central registry managed available applications:

```typescript
// apps-registry.ts
export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    component: 'AboutApp',
    icon: '👤',
    defaultPosition: { x: 100, y: 100 }
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    component: 'ProjectsApp',
    icon: '💼',
    defaultPosition: { x: 150, y: 150 }
  },
  music: {
    id: 'music',
    title: 'Music Player',
    component: 'MusicApp',
    icon: '🎵',
    defaultPosition: { x: 200, y: 200 }
  },
}
```

### Desktop Component Implementation
The main desktop component tied everything together:

```vue
<template>
  <div class="desktop">
    <!-- Desktop background and icons -->
    <div class="desktop-icons">
      <div 
        v-for="app in availableApps" 
        :key="app.id"
        class="desktop-icon"
        @dblclick="openApp(app)"
      >
        <span class="icon">{{ app.icon }}</span>
        <span class="label">{{ app.title }}</span>
      </div>
    </div>
    
    <!-- Windows -->
    <Window 
      v-for="window in windows" 
      :key="window.id"
      :window="window"
    />
  </div>
</template>

<script setup>
import { useDesktop } from '../composables/useDesktop'
import { APPS } from '../data/apps-registry'
import Window from './Window.vue'

const { windows, openWindow } = useDesktop()
const availableApps = Object.values(APPS)

const openApp = (appConfig) => {
  openWindow(appConfig)
}
</script>
```

## Key Implementation Details

### Window Management System
The core challenge was managing multiple windows with proper z-index stacking:

```javascript
// Enhanced window management
const closeWindow = (windowId) => {
  const windowIndex = windows.value.findIndex(w => w.id === windowId)
  if (windowIndex > -1) {
    const windowElement = document.querySelector(`[data-window="${windowId}"]`)
    
    if (windowElement) {
      closeAnimation(windowElement, () => {
        windows.value.splice(windowIndex, 1)
        if (activeWindow.value === windowId) {
          activeWindow.value = windows.value.length > 0 
            ? windows.value[windows.value.length - 1].id 
            : null
        }
      })
    } else {
      windows.value.splice(windowIndex, 1)
    }
  }
}
```

### Animation Integration
Integrating GSAP animations with Vue's lifecycle required careful timing:

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { useWindowAnimations } from '../composables/useWindowAnimations'

const props = defineProps(['window'])
const windowElement = ref(null)
const { openAnimation } = useWindowAnimations()

onMounted(() => {
  if (windowElement.value) {
    openAnimation(windowElement.value)
  }
})
</script>

<template>
  <div ref="windowElement" :data-window="window.id" class="window-container">
    <!-- Window content -->
  </div>
</template>
```

## Performance Considerations

### Optimizing Draggable Performance
Since windows are draggable but not resizable, I optimized the drag operations:

```javascript
// Optimized drag configuration
const dragConfig = {
  resizable: false,
  filters: ['.window-content', 'button', 'a'], // Ignore these elements for drag
  preventDeactivation: true,
  activeClass: 'window-active'
}
```

### Efficient Reactivity
Using Vue's reactivity system effectively prevented unnecessary re-renders:

```javascript
// Using shallowRef for better performance with object arrays
const windows = shallowRef([])

// Computed properties for efficient updates
const windowStack = computed(() => 
  windows.value.slice().sort((a, b) => a.zIndex - b.zIndex)
)
```

## Challenges Encountered

### Z-index Management
Managing window stacking order proved complex:

```javascript
const ensureTopWindow = (windowId) => {
  const maxZIndex = Math.max(...windows.value.map(w => w.zIndex), 1000)
  windows.value = windows.value.map(window => 
    window.id === windowId 
      ? { ...window, zIndex: maxZIndex + 1 }
      : window
  )
}
```

### Animation Coordination
Preventing animation conflicts when opening/closing multiple windows:

```javascript
const openWindow = async (app) => {
  // Close any existing instance of the same app
  const existingWindow = windows.value.find(w => w.app.id === app.id)
  if (existingWindow) {
    await closeWindow(existingWindow.id)
  }
  
  // Then open new window
  const newWindow = createWindow(app)
  windows.value.push(newWindow)
}
```

## Lessons Learned

### Vue 3 Composition API Insights
- The Composition API's flexibility made complex state management manageable
- Composable functions encouraged reusable logic across components
- Reactivity system handled window state changes efficiently

### GSAP Animation Discoveries
- Timeline controls provided precise animation sequencing
- Easing functions dramatically improved the natural feel of interactions
- GPU-accelerated properties ensured smooth performance

### Project Structure Benefits
- Separating concerns into composables improved maintainability
- Centralized app registry made adding new applications straightforward
- Component-based architecture allowed for easy testing and iteration

## Final Implementation

The completed portfolio features a clean desktop interface where visitors can open different applications showcasing my work. Each window is draggable with smooth opening/closing animations, creating an engaging browsing experience that demonstrates both my projects and technical skills.

*Live demo: [chenxing-dev.github.io](https://chenxing-dev.github.io) | Source code: [GitHub Repository](https://github.com/chenxing-dev/chenxing-dev.github.io)*
