# Design Patterns

## Overview
The vue-mdi-icon-picker implements several well-established design patterns. This document identifies each pattern, explains its purpose, and provides implementation examples.

## Architectural Patterns

### 1. Component Pattern (Vue Single File Component)

**Description:** Encapsulate template, logic, and styles in a single file

**Implementation:**
```vue
<template>
  <!-- UI structure -->
</template>

<script lang="ts">
  // Component logic
</script>

<style scoped>
  /* Component-specific styles */
</style>
```

**Benefits:**
- Cohesion: Related code in one place
- Maintainability: Easy to locate and modify
- Reusability: Self-contained component

**Location:** `src/MdiIconPicker.vue`

---

### 2. Plugin Pattern (Vue.use)

**Description:** Extend Vue with custom functionality via plugin system

**Implementation:**
```javascript
// src/index.js
MdiIconPicker.install = function(Vue) {
  Vue.component(MdiIconPicker.name, MdiIconPicker);
};

// Usage
Vue.use(MdiIconPicker);
```

**Benefits:**
- Global registration
- Consistent installation API
- Framework integration

**Use Case:** Allow users to install component globally

---

### 3. Observer Pattern (Vue Reactivity)

**Description:** Automatic updates when data changes

**Implementation:**
```typescript
// Data (observable)
search = "";

// Computed (observer)
get filteredIcons() {
  return this.icons.filter(i => 
    i.name.includes(this.search)  // Depends on this.search
  );
}
```

**Flow:**
```
this.search changes
    ↓ (Vue reactivity detects)
filteredIcons invalidated
    ↓ (recomputes)
Template updates automatically
```

**Benefits:**
- Automatic updates
- No manual DOM manipulation
- Declarative programming

---

### 4. Decorator Pattern (TypeScript Decorators)

**Description:** Add metadata and functionality using decorators

**Implementation:**
```typescript
@Component({  // Class decorator
  components: { VMenu, VRow, VIcon, VTextField, VVirtualScroll }
})
export default class MdiIconPicker extends Vue {
  @Prop()  // Property decorator
  value: string
  
  @Prop()  // Property decorator
  icons: Array<any>
}
```

**Decorators Used:**
- `@Component`: Register component with Vue
- `@Prop`: Declare component props

**Benefits:**
- Cleaner syntax (vs Options API)
- TypeScript integration
- Metadata declaration

**Note:** Deprecated in Vue 3, replaced by Composition API

---

### 5. Virtual Scrolling Pattern (Performance)

**Description:** Render only visible items in large lists

**Implementation:**
```vue
<v-virtual-scroll 
  :items="filteredIcons"  <!-- 7000 items -->
  :item-height="50"
  height="235"
>
  <!-- Only ~5 items rendered at any time -->
</v-virtual-scroll>
```

**How It Works:**
```
Total Items: 7000
Viewport: 235px
Item Height: 50px
Visible: 235 ÷ 50 = ~5 items
Rendered: 5 items (constant)
Performance: O(1) rendering regardless of dataset size
```

**Benefits:**
- Constant memory usage
- Fast rendering
- Smooth scrolling

**Use Case:** Handle large icon datasets (MDI has 7000+ icons)

---

### 6. Controlled Component Pattern

**Description:** Parent controls component state via props and events

**Implementation:**
```vue
<!-- Parent controls state -->
<MdiIconPicker 
  :value="selectedIcon"    <!-- Props down -->
  @select="selectedIcon = $event"  <!-- Events up -->
  :icons="icons"
/>
```

**Data Flow:**
```
Parent State (selectedIcon)
    ↓ (props)
Component (receives value)
    ↓ (user interaction)
Component (emits select event)
    ↓ (event handler)
Parent State (updates selectedIcon)
    ↓ (props)
Component (receives new value)
```

**Benefits:**
- Single source of truth (parent)
- Predictable state management
- Easy debugging

---

### 7. Composition Pattern

**Description:** Build complex UI from simple components

**Implementation:**
```
MdiIconPicker (complex)
  └── Composed of:
      ├── VMenu (container)
      ├── VIcon (display)
      ├── VTextField (input)
      └── VVirtualScroll (list)
```

**Benefits:**
- Reusability (use existing Vuetify components)
- Separation of concerns
- Easier testing

---

### 8. Computed Property Pattern (Memoization)

**Description:** Cache derived values, recompute only when dependencies change

**Implementation:**
```typescript
get filteredIcons() {
  // Expensive operation (filter 7000 items)
  return this.icons.filter(i => 
    i.name.includes(this.search) ||
    i.aliases.includes(this.search) ||
    i.tags.includes(this.search)
  );
}
```

**Caching Behavior:**
```
First Access:
  - Compute filteredIcons (e.g., 50ms)
  - Cache result

Subsequent Accesses (dependencies unchanged):
  - Return cached result (< 1ms)

Dependency Change (this.search or this.icons):
  - Invalidate cache
  - Recompute on next access
```

**Benefits:**
- Performance optimization
- Automatic dependency tracking
- No manual cache management

---

### 9. Event Bus Pattern (Vue Event System)

**Description:** Parent-child communication via events

**Implementation:**
```typescript
// Component emits
selectedIcon(icon: string) {
  this.$emit('select', `mdi-${icon}`);
}

// Parent listens
<MdiIconPicker @select="handleSelection" />
```

**Event Flow:**
```
Child Component
    ↓ $emit('select', data)
Vue Event System
    ↓
Parent Component
    ↓ @select handler
Parent Logic
```

**Benefits:**
- Decoupling (child doesn't know about parent)
- Flexible (any parent can listen)
- Vue-native

---

### 10. Lazy Initialization Pattern

**Description:** Defer expensive operations until needed

**Implementation:**
```typescript
created() {
  // Generate ID only when component created
  this.id = Math.random().toString(36).replace('0.', 'icon-picker');
}
```

**Timing:**
```
Component Instantiation
    ↓ (constructor)
Data Initialized (search="", id="")
    ↓ (created hook)
ID Generated
    ↓ (mounting)
Component Ready
```

**Benefits:**
- Avoid unnecessary work
- Faster initialization
- Generate unique values at runtime

---

## Anti-Patterns Avoided

### ✓ No Direct DOM Manipulation
```typescript
// ✗ BAD (not used)
document.getElementById('icon').innerHTML = icon;

// ✓ GOOD (used)
<v-icon>{{value}}</v-icon>  // Vue handles DOM
```

### ✓ No Global State
```typescript
// ✗ BAD (not used)
window.selectedIcon = 'mdi-home';

// ✓ GOOD (used)
Props and events for state management
```

### ✓ No String-based Event Names (TypeScript)
```typescript
// ✓ Type-safe event emission
this.$emit('select', iconName);
```

## Pattern Summary Matrix

| Pattern | Purpose | Location | Complexity | Benefit |
|---------|---------|----------|------------|---------|
| SFC | Encapsulation | MdiIconPicker.vue | Low | Cohesion |
| Plugin | Installation | index.js | Low | Global registration |
| Observer | Reactivity | Computed properties | Medium | Auto-updates |
| Decorator | Metadata | Class annotations | Medium | Clean syntax |
| Virtual Scroll | Performance | VVirtualScroll | High | Scalability |
| Controlled | State management | Props/events | Low | Predictable |
| Composition | UI building | Component tree | Low | Reusability |
| Computed | Caching | filteredIcons | Medium | Performance |
| Event Bus | Communication | $emit/@select | Low | Decoupling |
| Lazy Init | Optimization | created() hook | Low | Efficiency |

## Pattern Evolution (Vue 2 → Vue 3)

### Deprecated Patterns
**Decorator Pattern:**
```typescript
// Vue 2 (Current - Deprecated)
@Component({})
export default class MdiIconPicker extends Vue {
  @Prop() value: string
}

// Vue 3 (Target - Composition API)
<script setup lang="ts">
const props = defineProps<{
  value: string
}>();
</script>
```

**Class Component → Composition API:**
- More functional, less object-oriented
- Better TypeScript integration
- Tree-shaking friendly
- Simpler mental model

### Maintained Patterns
- SFC (still primary pattern)
- Plugin (adapted for Vue 3)
- Observer (improved in Vue 3)
- Computed (same concept)
- Virtual Scrolling (same concept)

## Cross-References
- **System Architecture:** [system-overview.md](system-overview.md)
- **Component Structure:** [components.md](components.md)
- **Dependencies:** [dependencies.md](dependencies.md)
- **Code Examples:** [../reference/program-structure.md](../reference/program-structure.md)

---
**Patterns Identified:** 10 primary patterns  
**Anti-patterns Avoided:** 3  
**Pattern Quality:** Good (follows Vue best practices)
