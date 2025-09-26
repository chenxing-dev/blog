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
As someone new to Vue 3's Composition API, I wanted to understand its reactivity system through a practical project.

Different from other frameworks, Vue's Composition API uses `ref` to create reactive state variables. The following example illustrates how I managed the desktop state:

```typescript
// useDesktop.ts
import { ref } from 'vue'

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

  const focusWindow = (id: number) => {
    activeWindow.value = id
    // Bring to front by increasing z-index
    windows.value.forEach(w => {
      if (w.id === id) {
        w.zIndex = zIndexCounter.value++
        activeWindow.value = id
      }
    })
  }
  
  return {
    windows,
    activeWindow,
    openWindow,
    focusWindow
  }
}
```

#### Understanding Vue's Reactivity System

The `ref` function creates reactive references. Like React's `useState`, it allows Vue to track changes and update the DOM efficiently.

The `reactive` function is used to create a reactive object. Like React's `useReducer`, it provides a way to manage complex state objects.

The `computed` function creates computed properties that automatically update when their dependencies change. Like React's `useMemo`, it optimizes performance by caching values.

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

For the closing animation, at first, I tried calling the animation on the `onBeforeUnmount` lifecycle hook, but it didn't work as expected because the component was already being destroyed. Then I realized I needed to play the closing animation before actually removing the window (i.e., intercepting the close action).

So I called the `closeAnimation` function from the close button handler, and only after the animation completes do I remove the window from the state.

### vue-draggable-resizable: Draggable Window Implementation
I used `vue-draggable-resizable` specifically for its draggable capabilities. It allowed me to create movable windows with minimal setup. Here's how I integrated it:

```vue
// Window.vue
<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
import "vue-draggable-resizable/style.css";

const {
  windowRef,
  position,
  title,
  contentComponent,
  onDrag,
  onDragStop,
  onMousedown,
  handleClose,
  focus
} = useWindowInstance(props.window, emit);
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
      @drag-stop="onDragStop"
      @activated="focus"
    >
      <div ref="windowRef" :class="settings.theme">
        <!-- Title Bar -->
        <div
        class="title-bar drag-handle flex items-center justify-between md:cursor-grab border-2 border-b-0 border-accent h-6 bg-title-bar">
          <div class="flex items-center mx-auto">
            <span class="text-sm font-medium truncate max-w-[200px]">{{ title }}</span>
          </div>
          <div class="flex items-center border-l-2 border-accent h-full">
            <button :class="settings.theme"
              class="close-btn w-5 h-5 flex items-center justify-center hover:bg-zinc-100/80 cursor-pointer"
              @click.stop="handleClose">
              <div class="w-3 h-0.5 bg-accent rotate-45 absolute"></div>
              <div class="w-3 h-0.5 bg-accent -rotate-45 absolute"></div>
            </button>
          </div>
        </div>
        <!-- Window Content -->
        <div class="window-content flex-1 overflow-auto border-2 border-accent">
          <component :is="contentComponent" v-if="contentComponent" :type="window.app.type" />
          <div v-else class="h-full flex items-center justify-center text-zinc-400">Window content not available</div>
        </div>
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

> What is a composable?
> "Composables" are just reusable functions (typically starting with `use`) that encapsulate specific reactive logic or behavior.
> For example, `useDesktop.ts` manages the state and behavior of the desktop environment, while `useWindowAnimations.ts` handles the animation logic for opening and closing windows. This modular approach enhances code maintainability and readability.

### Application Registry Pattern

A centralized app registry made adding new applications straightforward:

```typescript
// apps-registry.ts
export const APPS = {
  {
    id: "about_me",
    label: "About Me",
    title: "About Me",
    component: defineAsyncComponent(() => import("@/components/apps/AboutMe.vue")),
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatWomanTechnologistLight.vue")),
    width: 720,
    height: 600,
    showOnDesktop: true,
  },
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
}
```

### Desktop Component Implementation

The main desktop component tied everything together:

```vue
// Desktop.vue
<template>
    <div :class="settings.theme" class="relative w-screen h-dvh overflow-hidden select-none text-secondary">
        <!-- Desktop background and icons -->
        <Wallpaper />
        <!-- Memorize icons grid: it won't update unless availableApps ref changes -->
        <div v-memo="{ availableApps }" class="absolute w-full min-w-72
            justify-items-center 
            p-2 md:p-12 
            grid gap-2 md:gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14">
            <DesktopIcon v-for="app in availableApps" :key="app.id" :id="app.id" :label="app.label"
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

## Performance Considerations

### Efficient Reactivity

We can optimize performance by using `markRaw` or `shallowRef` for large objects or arrays that don't require deep reactivity. Here, I kept the icons grid static using `markRaw` to prevent unnecessary re-renders:

```typescript
import { markRaw } from "vue";

// Make the apps list non-reactive
// as it doesn't change during runtime
// and to avoid unnecessary re-renders
const availableApps = markRaw(getDesktopApps());

<!-- Memorize icons grid: it won't update unless availableApps ref changes -->
<div v-memo="{ availableApps }" class="absolute w-full min-w-72
    justify-items-center 
    p-2 md:p-12 
    grid gap-2 md:gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14">
    <DesktopIcon v-for="app in availableApps" :key="app.id" :id="app.id" :label="app.label"
        @open="openWindow" />
</div>
```

## Challenges Encountered

### Window positioning and viewport safety

When opening new windows, I wanted them to appear at random positions. However, random positions can spawn off-screen on small displays. To address this, I calculated safe boundaries based on the window size and viewport dimensions:

```typescript
const position = {
  x: Math.random() * (window.innerWidth - (app.width || DEFAULT_WIDTH)),
  y: Math.random() * (window.innerHeight - (app.height || DEFAULT_HEIGHT))
}
```

Considering mobile responsiveness, I disabled dragging on smaller screens to ensure usability. 

### Persisted state pitfalls

Using `useStorage` from `@vueuse/core` to persist open windows was convenient, but I had to clean up invalid states when apps were removed from the registry. I sanitized the stored windows on load:

```typescript
// useDesktop.ts

import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { APPS } from '@/config/apps-registry'
import type { AppItem, WindowItem } from '@/types'

// Persistent storage for open windows
const windows = useStorage<WindowItem[]>("os-windows", []);

// Convert persisted window to full window object
export const sanitizeAndRehydrate = (stored: StoredWindow[] | unknown): WindowItem[] => {
  const list = Array.isArray(stored) ? stored : [];

  const mapped: WindowItem[] = [];
  for (const item of list) {
    const app = getAppById(item.appId);
    if (!app) continue; // Clean out invalid apps

    // Sanitize position
    const position = {
      x: clamp(item.position.x, 0, window.innerWidth - (app.width || DEFAULT_WIDTH)),
      y: clamp(item.position.y, 0, window.innerHeight - (app.height || DEFAULT_HEIGHT))
    };

    mapped.push({
      id: item.id,
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
      position,
      zIndex: item.zIndex
    });
  }

  mapped.sort((a, b) => a.zIndex - b.zIndex);
  return mapped;
}
```

## Lessons Learned

### Vue 3 Composition API Insights
- Compared to React hooks, I found Vue's refs more straightforward to use for simple state
- I appreciated the component-based structure that Vue enforces
- Single-file components made organizing code easier
- I still need to get more comfortable with Vue's reactivity system

### GSAP Thoughts
- Timeline controls provided precise animation sequencing
- The learning curve was pretty steep. Only basic animations were implemented. 
- I struggled with reactivity integration but learned to trigger animations in lifecycle hooks

## Final Implementation

The completed portfolio features a clean desktop interface where visitors can open different applications showcasing my work. Each window is draggable with smooth opening/closing animations, and the state persists across sessions. 

I hope this deep dive into my development process inspires you to explore building interactive web experiences using Vue 3 and GSAP!

*Live demo: [chenxing-dev.github.io](https://chenxing-dev.github.io) | Source code: [GitHub Repository](https://github.com/chenxing-dev/chenxing-dev.github.io)*
