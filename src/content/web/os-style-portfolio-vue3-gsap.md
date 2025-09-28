---
title: Building my OS-style portfolio site with Vue 3 and GSAP
description: A technical deep dive into creating an operating system-inspired portfolio website using Vue 3 composition API and GSAP animations
tags: [vue, gsap, web development, frontend, portfolio]
category: web-development
date: 2025-09-27
---

## TL;DR
- I built an OS-style portfolio with Vue 3 + GSAP and draggable windows.
- Key ideas: composables for state, GSAP timelines for open/close, and persisted windows via VueUse.
- Live demo [here](https://chenxing-dev.github.io) | Source [here](https://github.com/chenxing-dev/chenxing-dev.github.io)

Stack and versions (at time of writing)
```- Node: 24.x
- Vite: 6.x
- Vue: 3.5.x
- TypeScript: 5.x
- GSAP: 3.13.x
- vue-draggable-resizable: 3.x
- @vueuse/core: 13.x
```

Quickstart
```bash
# clone my repo and run locally
git clone https://github.com/chenxing-dev/chenxing-dev.github.io
cd chenxing-dev.github.io
npm install
npm run dev
```

## Discovering the World of Web Desktops

My journey began when I found this curated gallery of [awesome web desktops](https://github.com/syxanash/awesome-web-desktops). Projects like [itisasifyouweredoingwork](https://github.com/pippinbarr/itisasifyouweredoingwork) and [Yahya J. Aifit](https://yja.me)'s portfolio take inspiration from traditional desktop environments, creating a nostalgic and engaging user experience. 

The creativity and interactivity of these projects sparked my interest in building a similar OS-style portfolio site. 

I was learning Vue 3 and wanted to explore its Composition API, so I decided to combine this with GSAP for animations to create a dynamic and visually appealing portfolio.

## Technology Choices

### Vue 3 Composition API: Learning Modern Reactivity
As someone new to Vue 3's Composition API, I wanted to understand its reactivity system through a practical project.

Different from other frameworks, Vue's Composition API uses `ref` to create reactive state variables. The following example illustrates how I managed the desktop state:

```typescript
// useDesktop.ts
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export function useDesktop() {
  // Persistent storage for open windows
  const windows = ref(useStorage<WindowItem[]>("os-windows", []));

  const zIndexCounter = ref(1)
  const activeWindow = ref(null)

  const openWindow = (app: AppItem) => {
    const position = {
      x: Math.random() * (window.innerWidth - (app.width || DEFAULT_WIDTH)),
      y: Math.random() * (window.innerHeight - (app.height || DEFAULT_HEIGHT))
    }
    const newWindow = {
      id: Date.now(),
      app,
      position: position,
      zIndex: zIndexCounter++,
    }
    
    windows.value.push(newWindow)
    activateWindow(newWindow.id)
  }
  
  return {
    windows,
    activeWindow,
    openWindow
  }
}
```

#### Understanding Vue's Reactivity System

- `ref` creates a reactive wrapper around any value (primitive or object). Like React's `useState`, but you access the value via `.value`.
- `reactive` creates a deeply reactive object you mutate directly without `.value`.
- `computed` derives values that update when dependencies change.ted` function creates computed properties that automatically update when their dependencies change. 

### GSAP: Smooth Animations for Desktop Interactions
GSAP provided the animation capabilities needed to make window interactions feel natural. I focused on learning timeline controls and easing functions. With GSAP, I created opening and closing animations for windows:

```typescript
// useWindowAnimations.ts
import { gsap } from 'gsap'
import { Ref } from 'vue'

export function useWindowAnimations(windowRef: Ref<HTMLElement | null>) {
    const openAnimation = () => {
        const el = windowRef.value;
        if (!el) return;
        // Ensure any ongoing animations are killed before starting a new one
        gsap.killTweensOf(el);
        return gsap.from(el, {
            scale: 0.1,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    };
    const closeAnimation = (): Promise<void> => {
        const el = windowRef.value;
        if (!el) return Promise.resolve();
        // Ensure any ongoing animations are killed before starting a new one
        gsap.killTweensOf(el);
        return new Promise((resolve) => {
            gsap.to(el, {
                scale: 0.1,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.7)",
                onComplete: () => resolve()
            });
        })
    };

    return {
        openAnimation,
        closeAnimation,
    };
}
```

For the closing animation, I first tried the `onBeforeUnmount` lifecycle hook, but the element was already being torn down. 

Then I realized I needed to play the closing animation before actually removing the window (i.e., intercepting the close action).

So I called the `closeAnimation` function from the close button handler, and only after the animation completes do I remove the window from the state.

### vue-draggable-resizable: Draggable Window Implementation

Using `vue-draggable-resizable` made windows draggable with minimal setup. Core wiring:

```vue
<!-- Window.vue -->
<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
import "vue-draggable-resizable/style.css";

const { windowRef, position, contentComponent, handleClose, focus } =
  useWindowInstance(props.window, emit)
</script>

<template>
    <VueDraggableResizable
      :x="isMobile ? 0 : position.x" 
      :y="isMobile ? 0 : position.y"
      :w="width" 
      :h="height"
      :draggable="!isMobile"
      :resizable="false"
      :drag-handle="'.drag-handle'"
      @activated="focus"
    >
      <div ref="windowRef">
      <div class="title-bar drag-handle">
        <button class="close-btn" @click.stop="handleClose" />
      </div>
      <component :is="contentComponent" v-if="contentComponent" />
    </div>
    </VueDraggableResizable>
</template>
```

## Project Architecture

### Application Structure
I organized the project around composables and components:

```text
src/
├── components/
│   ├── Window.vue
│   ├── WindowManager.vue
│   └── apps/
│       ├── AboutMe.vue
│       ├── ProjectsApp.vue
│       └── SettingsApp.vue
├── composables/
│   ├── useDesktop.ts
│   ├── useWindowAnimations.ts
│   └── useWindowInstance.ts
└── App.vue
```

#### What is a composable?

"Composables" are just reusable functions (typically starting with `use`) that encapsulate specific reactive logic or behavior.

For example, `useDesktop.ts` manages the state and behavior of the desktop environment, while `useWindowAnimations.ts` handles the animation logic for opening and closing windows. This modular approach enhances code maintainability and readability.

### Application Registry

A centralized app registry made adding new applications straightforward:

```typescript
// apps-registry.ts
import { defineAsyncComponent } from 'vue'

export const APPS: AppConfig[] = [
  {
    id: "projects",
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("@/components/apps/ProjectsApp.vue")),
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatFileFolder.vue")),
    width: 720,
    height: 600,
    showOnDesktop: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("@/components/apps/Terminal.vue")),
    icon: defineAsyncComponent(() => import("@/icons/SimpleIconsGnometerminal.vue")),
    showOnDesktop: true,
  },
]
```

### Desktop Component Implementation

The `Desktop` component manages the overall layout, including the wallpaper, desktop icons, and the window manager. 

```vue
<!-- Desktop.vue -->
<template>
    <div class="desktop">
        <!-- Desktop background and icons -->
        <Wallpaper />
        
        <div v-memo="{ availableApps }" class="icons-grid">
            <DesktopIcon 
              v-for="app in availableApps" 
              :key="app.id" :id="app.id" 
              :label="app.label"
              @open="openWindow" />
        </div>

        <!-- Window Manager -->
        <WindowManager :windows="windows" @close="closeWindow" @focus="focusWindow" />
    </div>
</template>

<script setup lang="ts">
import { useDesktop } from '../composables/useDesktop'
import { getDesktopApps } from "@/config/apps-registry";
import Window from './Window.vue'

const { windows, openWindow, closeWindow, focusWindow } = useDesktop();
const availableApps = markRaw(getDesktopApps());
</script>
```

The `WindowManager` component renders all open windows, passing down necessary props and event handlers.

## Performance Considerations

### Efficient Reactivity

Use `markRaw` or `shallowRef` for large objects/trees that don't need deep reactivity. Here, the icons grid uses `markRaw` to avoid unnecessary re-renders:

```typescript
import { markRaw } from "vue";

// Make the apps list non-reactive
// as it doesn't change during runtime
// and to avoid unnecessary re-renders
const availableApps = markRaw(getDesktopApps());

<!-- Memorize icons grid: it won't update unless availableApps ref changes -->
<div v-memo="{ availableApps }" class="icons-grid">
    <DesktopIcon 
      v-for="app in availableApps" 
      :key="app.id" :id="app.id" 
      :label="app.label"
      @open="openWindow" />
</div>
```

## Challenges Encountered

### Window positioning and viewport safety

When opening new windows, I wanted them at random positions, but small displays can cause windows to overflow off-screen. 

To address this, I calculated safe boundaries based on the window size and viewport dimensions:

```typescript
const position = {
  x: Math.random() * (window.innerWidth - (app.width || DEFAULT_WIDTH)),
  y: Math.random() * (window.innerHeight - (app.height || DEFAULT_HEIGHT))
}
```

Considering mobile responsiveness, I disabled dragging on smaller screens to ensure usability. 

### Persisted state pitfalls

Using `useStorage` from `@vueuse/core` to persist open windows was convenient, but I had to clean up invalid states when the stored data is outdated (e.g., when the architecture changed or apps were removed from the registry). I sanitized the stored windows on load:

```typescript
// useDesktop.ts

import { clamp } from '@/utils/number'
import type { AppItem, StoredWindow, WindowItem } from '@/types'

// Persistent storage for open windows
const windows = useStorage<WindowItem[]>("os-windows", []);

// Convert persisted window to full window object
export const sanitizeAndRehydrate = (stored: StoredWindow[] | unknown): WindowItem[] => {
  const list = Array.isArray(stored) ? stored : [];
  // Validate app exists
  if (!item.app || !item.app.id) {
    return null; // Outdated or invalid entry
  }

  const app = getAppById(item.app.id);
  if (!app) {
    return null; // App not found
  }

  return list.map(item => {
    const app = getAppById(item.app.id);
    if (!app) {
      return null;
    }

    // Clamp position to viewport
    const position = {
      x: clamp(item.position.x, 0, window.innerWidth - (app.width || DEFAULT_WIDTH)),
      y: clamp(item.position.y, 0, window.innerHeight - (app.height || DEFAULT_HEIGHT))
    };

    return {
      ...item,
      app: {
        id: app.id,
        title: app.title,
        icon: app.icon,
        size: {
          width: app.width || DEFAULT_WIDTH,
          height: app.height || DEFAULT_HEIGHT
        },
        mobileSize: app.mobileSize,
      },
      position
    };
  }).filter((w): w is WindowItem => w !== null);
}
```

Keeping the persisted state in sync with the app registry was crucial to avoid broken windows.

## Lessons Learned

### Vue 3 Composition API Insights
- Compared to React hooks, Refs felt more straightforward for simple state.
- Single-file components improved organization with scoped styles.
- I'm continuing to deepen my understanding of reactivity trade-offs. 

### GSAP Thoughts
- Easing and timelines made animations feel polished.
- The learning curve was pretty steep. Only basic animations were implemented. 
- I struggled with reactivity integration but learned to trigger animations in lifecycle hooks

## Final Implementation

The completed portfolio features a clean desktop interface where visitors can open different applications showcasing my work. Each window is draggable with smooth opening/closing animations, and the state persists across sessions. 

I hope this deep dive into my development process inspires you to explore building interactive web experiences using Vue 3 and GSAP!

*Live demo: [chenxing-dev.github.io](https://chenxing-dev.github.io) | Source code: [GitHub Repository](https://github.com/chenxing-dev/chenxing-dev.github.io)*
