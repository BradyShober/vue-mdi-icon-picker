# Structural Diagrams

## Component Hierarchy

```
MdiIconPicker (Root Component)
├── Template
│   └── VMenu (Vuetify)
│       ├── Activator Slot
│       │   └── VIcon (Vuetify)
│       │       └── Display: {{value}}
│       └── Menu Content
│           ├── VRow (Search Container)
│           │   └── VTextField (Vuetify)
│           │       ├── @input="updateSearch"
│           │       └── v-on:click.stop
│           └── VRow (Icons Container)
│               └── VVirtualScroll (Vuetify)
│                   ├── :items="filteredIcons"
│                   └── Item Template
│                       └── VIcon (Vuetify)
│                           ├── @click="selectedIcon"
│                           └── Display: mdi-{{item.name}}
│
├── Script (TypeScript Class)
│   ├── Decorators
│   │   ├── @Component({ components: {...} })
│   │   └── @Prop() × 2
│   ├── Class: MdiIconPicker extends Vue
│   │   ├── Props
│   │   │   ├── value: string
│   │   │   └── icons: Array<any>
│   │   ├── Data
│   │   │   ├── search: string = ""
│   │   │   └── id: string = ""
│   │   ├── Lifecycle
│   │   │   └── created() { this.id = Math.random()... }
│   │   ├── Methods
│   │   │   ├── selectedIcon(icon: string)
│   │   │   └── updateSearch(e: string)
│   │   └── Computed
│   │       ├── filteredIcons()
│   │       └── idQuery()
│
└── Styles (Scoped CSS)
    └── .v-menu__content { min-width: 300px; }
```

## Type Relationship Diagram

```
Vue (Base Class)
  ↑
  │ extends
  │
MdiIconPicker
  ├── Props (External State)
  │   ├── value: string (optional)
  │   └── icons: IconObject[] (optional)
  │
  ├── Data (Internal State)
  │   ├── search: string
  │   └── id: string
  │
  ├── Computed (Derived State)
  │   ├── filteredIcons: IconObject[]
  │   │   └── depends on: this.icons, this.search
  │   └── idQuery: string
  │       └── depends on: this.id
  │
  ├── Methods (Behavior)
  │   ├── selectedIcon(icon: string): void
  │   │   └── emits: 'select' event
  │   └── updateSearch(e: string): void
  │       └── updates: this.search
  │
  └── Events (Output)
      └── 'select': (iconName: string) => void

IconObject Interface
  ├── name: string
  ├── aliases: string[]
  └── tags: string[]
```

## Vuetify Dependency Tree

```
MdiIconPicker
├── VMenu
│   ├── Props: offset-y, close-on-content-click, attach
│   ├── Slots: activator
│   └── Provides: Dropdown container
│
├── VIcon (2 instances)
│   ├── Instance 1: Activator
│   │   ├── Props: x-large, id
│   │   └── Purpose: Display current icon
│   └── Instance 2: List Items
│       ├── Props: large, title, @click
│       └── Purpose: Display selectable icons
│
├── VTextField
│   ├── Props: placeholder, outlined, @input
│   └── Purpose: Search input
│
├── VVirtualScroll
│   ├── Props: items, item-height, bench, height
│   └── Purpose: Performance optimization
│
└── VRow (2 instances)
    ├── Instance 1: Search row
    └── Instance 2: Icons row
```

## File Structure

```
vue-mdi-icon-picker/
├── src/
│   ├── MdiIconPicker.vue (Main Component)
│   │   ├── <template> (18 lines)
│   │   ├── <script lang="ts"> (42 lines)
│   │   └── <style scoped> (4 lines)
│   ├── index.js (Plugin Entry)
│   │   └── Exports: MdiIconPicker + install method
│   ├── plugins/
│   │   └── vuetify.ts (Vuetify Configuration)
│   └── shims/
│       ├── shims-vue.d.ts
│       ├── shims-tsx.d.ts
│       └── shims-vuetify.d.ts
│
├── Configuration Files
│   ├── package.json (Dependencies)
│   ├── tsconfig.json (TypeScript Config)
│   ├── webpack.config.js (Build Config)
│   ├── babel.config.js (Babel Config)
│   └── .eslintrc.js (ESLint Config)
│
└── dist/ (Build Output)
    └── vue-mdi-icon-picker.min.js (UMD Bundle)
```

## Cross-References
- **Architecture:** [../../architecture/components.md](../../architecture/components.md)
- **Dependencies:** [../../architecture/dependencies.md](../../architecture/dependencies.md)
- **Behavioral Diagrams:** [../behavioral/sequence-diagrams.md](../behavioral/sequence-diagrams.md)
