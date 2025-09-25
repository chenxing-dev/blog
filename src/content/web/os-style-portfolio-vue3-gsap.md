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

<script setup lang="ts">
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

```typescript
// Enhanced window management
const closeWindow = (windowId: string) => {
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
Integrating GSAP animations with Vue's lifecycle hooks:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWindowAnimations } from '../composables/useWindowAnimations'

const props = defineProps(['window'])
const windowElement = ref<HTMLElement | null>(null)
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

For optimal performance with `vue-draggable-resizable`, I configured it to ignore certain elements during drag operations:

```typescript
const dragConfig = {
  resizable: false,
  filters: ['.window-content', 'button', 'a'], // Ignore these elements for drag
  preventDeactivation: true,
  activeClass: 'window-active'
}
```

### Efficient Reactivity
Using Vue's reactivity system effectively prevented unnecessary re-renders:

```typescript
import { shallowRef, computed } from 'vue'

// Using shallowRef for better performance with object arrays
const windows = shallowRef([])

// Computed properties for efficient updates
const windowStack = computed(() => 
  windows.value.slice().sort((a, b) => a.zIndex - b.zIndex)
)
```

## Challenges Encountered

### Z-index Management
Ensuring the active window always stayed on top:

```typescript
const ensureTopWindow = (windowId: string) => {
  const maxZIndex = Math.max(...windows.value.map(w => w.zIndex), 1000)
  windows.value = windows.value.map(window => 
    window.id === windowId 
      ? { ...window, zIndex: maxZIndex + 1 }
      : window
  )
}
```

## Lessons Learned

### Vue 3 Composition API Insights
- Compared to React hooks, I found Vue's refs more straightforward for state management
- I appreciated the component-based structure that Vue enforces
- Single-file components made organizing code easier

### GSAP Thoughts
- Timeline controls provided precise animation sequencing
- The learning curve was pretty steep. Only basic animations were implemented. 
- I struggled with reactivity integration but learned to trigger animations in lifecycle hooks

## Final Implementation

The completed portfolio features a clean desktop interface where visitors can open different applications showcasing my work. Each window is draggable with smooth opening/closing animations, creating an engaging browsing experience that demonstrates both my projects and technical skills.

*Live demo: [chenxing-dev.github.io](https://chenxing-dev.github.io) | Source code: [GitHub Repository](https://github.com/chenxing-dev/chenxing-dev.github.io)*
