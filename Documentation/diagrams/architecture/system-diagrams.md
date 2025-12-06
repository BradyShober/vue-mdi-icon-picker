# Architecture Diagrams

## Diagram 1: System Context

```
┌─────────────────────────────────────────────────────────────┐
│                    End User's Browser                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Consuming Vue Application                     │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │  Application Component (Parent)                  │   │ │
│  │  │  - Manages state (selectedIcon)                  │   │ │
│  │  │  - Provides icon dataset                         │   │ │
│  │  │  - Handles selection events                      │   │ │
│  │  └──────────────┬──────────────────────────────────┘   │ │
│  │                 │                                        │ │
│  │                 │ Props (:value, :icons)                 │ │
│  │                 │ Events (@select)                       │ │
│  │                 ↓                                        │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │  MdiIconPicker Component                         │   │ │
│  │  │  (vue-mdi-icon-picker library)                   │   │ │
│  │  │  - Search/filter logic                           │   │ │
│  │  │  - UI rendering                                  │   │ │
│  │  │  - Event emission                                │   │ │
│  │  └──────────────┬──────────────────────────────────┘   │ │
│  │                 │                                        │ │
│  │                 │ Uses                                   │ │
│  │                 ↓                                        │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │  Vuetify UI Components                           │   │ │
│  │  │  - VMenu, VIcon, VTextField, VVirtualScroll     │   │ │
│  │  └──────────────┬──────────────────────────────────┘   │ │
│  │                 │                                        │ │
│  └─────────────────┼────────────────────────────────────────┘ │
│                    │                                        │
│                    ↓ Renders to                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                DOM (HTML/CSS)                        │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Diagram 2: Deployment Architecture (npm Package)

```
Developer Machine
    │
    │ npm publish
    ↓
┌─────────────────────────┐
│  npm Registry           │
│  (npmjs.com)            │
│  - Package metadata     │
│  - Distribution files   │
└────────────┬────────────┘
             │
             │ npm install
             ↓
Consumer's Project
├── node_modules/
│   └── vue-mdi-icon-picker/
│       ├── dist/
│       │   └── vue-mdi-icon-picker.min.js (UMD)
│       ├── src/ (optional)
│       └── package.json
│
│ Build Process (Webpack/Vite)
│
└── dist/
    └── app.bundle.js (includes vue-mdi-icon-picker)
        │
        │ HTTP
        ↓
    End User's Browser
```

## Diagram 3: Component Dependency Tree

```
MdiIconPicker Component
│
├── Vue Framework (2.6.11)
│   ├── Reactivity System
│   ├── Component System
│   ├── Event System
│   └── Template Compiler
│
├── TypeScript Decorators
│   ├── vue-class-component (7.2.3)
│   └── vue-property-decorator (9.1.2)
│       ├── @Component
│       ├── @Prop
│       └── Vue (class import)
│
└── Vuetify Components (2.6.10)
    ├── VMenu
    │   └── Overlay positioning
    ├── VIcon
    │   └── Material Design Icons
    ├── VTextField
    │   └── Input handling
    ├── VVirtualScroll
    │   └── Performance optimization
    └── VRow
        └── Layout structure
```

## Diagram 4: Module Dependency Graph

```
index.js (Entry Point)
    │
    │ imports
    ↓
MdiIconPicker.vue (Main Component)
    │
    ├── imports
    │   ├── vue-property-decorator
    │   │   ├── Component
    │   │   ├── Vue
    │   │   └── Prop
    │   └── vuetify/lib
    │       ├── VMenu
    │       ├── VRow
    │       ├── VIcon
    │       ├── VTextField
    │       └── VVirtualScroll
    │
    └── (optional in dev)
        plugins/vuetify.ts
            ├── imports Vue
            └── imports Vuetify
```

## Diagram 5: Build Pipeline Architecture

```
Source Files
├── src/MdiIconPicker.vue (SFC)
├── src/index.js (Plugin)
└── src/plugins/vuetify.ts (Config)
    │
    │ Processing
    ↓
┌─────────────────────────────────┐
│  Vue CLI / Webpack Build        │
│                                 │
│  1. TypeScript Compilation      │
│     tsc (4.1.5)                 │
│                                 │
│  2. Vue SFC Compilation         │
│     vue-loader (15.9.6)         │
│     vue-template-compiler       │
│                                 │
│  3. Babel Transpilation         │
│     @vue/cli-plugin-babel       │
│                                 │
│  4. Webpack Bundling            │
│     webpack (5.94.0)            │
│     - Entry: src/index.js      │
│     - Output: UMD format        │
│     - Externals: vue, vuetify  │
│                                 │
│  5. Minification (production)   │
│     webpack optimization        │
└─────────────┬───────────────────┘
              │
              ↓
dist/vue-mdi-icon-picker.min.js (UMD Bundle)
├── Library name: MdiIconPicker
├── Externals: vue, vuetify
└── Source map: .js.map
```

## Diagram 6: Runtime Architecture

```
Browser Runtime
│
├── Global Scope
│   ├── Vue (provided by app)
│   ├── Vuetify (provided by app)
│   └── MdiIconPicker (this library)
│
├── Application Vue Instance
│   └── Root Component
│       └── MdiIconPicker Component Instances
│           ├── Instance 1
│           │   ├── Props: {value, icons}
│           │   ├── Data: {search, id}
│           │   ├── Computed: {filteredIcons, idQuery}
│           │   └── Methods: {selectedIcon, updateSearch}
│           │
│           └── Instance 2 (if multiple on page)
│               ├── Props: {value, icons}
│               └── ... (independent state)
│
└── DOM
    ├── App Root
    └── MdiIconPicker UI
        ├── VMenu (dropdown)
        ├── VIcon (activator)
        ├── VTextField (search)
        └── VVirtualScroll (icons)
```

## Diagram 7: Data Flow Architecture

```
┌──────────────────────────────────────┐
│  Parent Component State              │
│  - selectedIcon: "mdi-home"          │
│  - icons: [{name, aliases, tags}]    │
└────────────┬─────────────────────────┘
             │
             │ Props Down
             │ :value="selectedIcon"
             │ :icons="icons"
             ↓
┌──────────────────────────────────────┐
│  MdiIconPicker Component             │
│                                      │
│  Receives:                           │
│  - this.value = "mdi-home"           │
│  - this.icons = [...]                │
│                                      │
│  Internal State:                     │
│  - this.search = ""                  │
│  - this.id = "icon-picker8k3d9s"    │
│                                      │
│  Computed:                           │
│  - filteredIcons (derived)           │
│  - idQuery (derived)                 │
│                                      │
│  User Interaction:                   │
│  - Types search → updateSearch()     │
│  - Clicks icon → selectedIcon()      │
└────────────┬─────────────────────────┘
             │
             │ Events Up
             │ $emit('select', "mdi-account")
             ↓
┌──────────────────────────────────────┐
│  Parent Component                    │
│  @select handler                     │
│  selectedIcon = $event               │
│  → State updates                     │
└──────────────────────────────────────┘
             │
             │ Props Down (cycle)
             ↓
       (repeat)
```

## Diagram 8: Integration Patterns

### Pattern A: Global Plugin
```
main.js
├── import Vue from 'vue'
├── import MdiIconPicker from 'vue-mdi-icon-picker'
└── Vue.use(MdiIconPicker)
    │
    └── Registers globally
        │
        └── Available in all components
            <MdiIconPicker v-model="icon" :icons="icons" />
```

### Pattern B: Local Import
```
MyComponent.vue
├── import MdiIconPicker from 'vue-mdi-icon-picker'
└── components: { MdiIconPicker }
    │
    └── Available in this component only
        <MdiIconPicker v-model="icon" :icons="icons" />
```

### Pattern C: Browser Global
```
index.html
├── <script src="vue.js"></script>
├── <script src="vuetify.js"></script>
└── <script src="vue-mdi-icon-picker.min.js"></script>
    │
    └── window.MdiIconPicker available
        │
        └── Auto-registered if window.Vue exists
```

## Diagram 9: State Management Flow

```
Initial State
───────────────────────────────────────────────
Parent: selectedIcon = "mdi-home"
Component: Receives via props
Activator: Displays "mdi-home"


User Opens Menu
───────────────────────────────────────────────
Click activator → VMenu opens
Search field rendered
Icons rendered (virtual scroll)


User Searches "account"
───────────────────────────────────────────────
Type 'a' → updateSearch("a")
    ↓
this.search = "a"
    ↓
filteredIcons recomputes
    ↓
VVirtualScroll updates
    ↓
Icons filtered


User Selects Icon
───────────────────────────────────────────────
Click "account" icon
    ↓
selectedIcon("account")
    ↓
$emit('select', "mdi-account")
    ↓
Parent @select handler
    ↓
Parent: selectedIcon = "mdi-account"
    ↓
Props update to component
    ↓
Activator displays "mdi-account"
```

## Diagram 10: Performance Architecture

```
Large Dataset (7000 icons)
    │
    ↓
Virtual Scrolling Strategy
    │
    ├─→ DOM: Only 5 visible icons rendered
    │   Memory: ~1KB (5 × 200 bytes)
    │
    ├─→ Scroll Event
    │   ├─→ Calculate visible range
    │   ├─→ Remove old items from DOM
    │   └─→ Render new visible items
    │
    └─→ Search Filter
        ├─→ O(n) complexity
        │   (7000 items × substring check)
        ├─→ Computed property caching
        │   (only recalculate on search change)
        └─→ Result: Filtered subset
            └─→ VVirtualScroll renders subset
                (still only 5 items in DOM)

Performance Metrics:
- Initial Render: ~50ms (7000 items filtered)
- Scroll Performance: 60 FPS (constant rendering)
- Memory: O(1) - constant ~5 items
- Search: ~10-50ms per keystroke (acceptable)
```

## Cross-References
- **System Overview:** [../architecture/system-overview.md](../architecture/system-overview.md)
- **Components:** [../architecture/components.md](../architecture/components.md)
- **Dependencies:** [../architecture/dependencies.md](../architecture/dependencies.md)
- **Patterns:** [../architecture/patterns.md](../architecture/patterns.md)

---
**Diagram Format:** ASCII art for universal readability  
**Diagrams Count:** 10 comprehensive architecture diagrams
