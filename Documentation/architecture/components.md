# Component Structure and Relationships

## Component Overview

The vue-mdi-icon-picker library consists of a single primary component (MdiIconPicker) that composes multiple Vuetify UI components to create the icon picker interface.

## Component Hierarchy

```
MdiIconPicker (Root Component)
├── VMenu (Vuetify) - Dropdown menu container
│   ├── Activator Slot
│   │   └── VIcon (Vuetify) - Current icon display
│   └── Menu Content
│       ├── VRow (Vuetify) - Search row
│       │   └── VTextField (Vuetify) - Search input
│       └── VRow (Vuetify) - Icons row
│           └── VVirtualScroll (Vuetify) - Virtual list
│               └── VIcon (Vuetify) - Individual icons (repeated)
```

## Component Details

### MdiIconPicker (Main Component)
**File:** `src/MdiIconPicker.vue`  
**Type:** Vue Single File Component (SFC)  
**Pattern:** Class Component with TypeScript decorators

**Responsibilities:**
- Search and filtering logic
- State management (search query, component ID)
- Event emission
- Coordinate Vuetify components

**Key Features:**
- Props: `value` (current icon), `icons` (dataset)
- Events: `select` (icon selection)
- Computed: `filteredIcons`, `idQuery`
- Methods: `selectedIcon`, `updateSearch`
- Lifecycle: `created()` (ID generation)

### Vuetify Component Usage

#### VMenu
**Purpose:** Dropdown menu container  
**Props Used:**
- `offset-y`: Position menu below activator
- `:close-on-content-click="false"`: Keep open after clicks
- `:attach="idQuery"`: Attach to specific element

#### VIcon (Activator)
**Purpose:** Display current icon and trigger menu  
**Props Used:**
- `x-large`: Size variant
- `:id="id"`: Unique identifier
- Content: `{{value}}` - Current icon name

#### VTextField
**Purpose:** Search input  
**Props Used:**
- `placeholder="Search"`: Placeholder text
- `outlined`: Visual style
- `class="pb-2"`: Padding bottom
- `@input="updateSearch"`: Event handler
- `v-on:click.stop`: Prevent menu close

#### VVirtualScroll
**Purpose:** Performance-optimized list rendering  
**Props Used:**
- `:items="filteredIcons"`: Data source
- `:item-height="50"`: Fixed item height
- `:bench="0"`: No extra rendering
- `height="235"`: Container height

#### VIcon (List Items)
**Purpose:** Display individual selectable icons  
**Props Used:**
- `large`: Size variant
- `:title="item.name"`: Tooltip
- `@click="selectedIcon(item.name)"`: Selection handler
- Content: `mdi-{{item.name}}` - Icon display

## Component Relationships

### Dependency Graph

```
MdiIconPicker.vue
├── Imports
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
├── Extends
│   └── Vue (base class)
│
└── Registers Components
    ├── VMenu
    ├── VRow
    ├── VIcon
    ├── VTextField
    └── VVirtualScroll
```

### Plugin Registration
**File:** `src/index.js`

```javascript
import MdiIconPicker from "./MdiIconPicker.vue";

// Plugin pattern
MdiIconPicker.install = function(Vue) {
  Vue.component(MdiIconPicker.name, MdiIconPicker);
};

// Browser auto-install
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.component(MdiIconPicker.name, MdiIconPicker);
}
```

## Component Communication

### Props Down
```
Parent Component
    ↓ :value="selectedIcon"
    ↓ :icons="iconDataset"
MdiIconPicker Component
```

### Events Up
```
MdiIconPicker Component
    ↑ @select="iconName"
Parent Component
```

### v-model Pattern
```
Parent: v-model="selectedIcon"

Expands to:
:value="selectedIcon"
@select="selectedIcon = $event"
```

## Component Lifecycle

### Creation Phase
1. Vue creates component instance
2. Props initialized from parent
3. Data properties initialized (`search=""`, `id=""`)
4. `created()` hook executes → generates unique ID
5. Computed properties evaluated

### Mounting Phase
1. Template compiled to render function
2. VMenu and children rendered
3. Activator icon displays `value` prop
4. Component mounted to DOM

### Update Phase
**Trigger:** Props or data changes

**Scenarios:**
- Parent updates `value` → Activator icon updates
- Parent updates `icons` → `filteredIcons` recomputes
- User types search → `updateSearch` → `filteredIcons` recomputes
- User clicks icon → `selectedIcon` → emits event → parent updates

## Template Structure Analysis

### Layout Composition
```vue
<v-menu> (container)
  <template v-slot:activator> (trigger)
    <v-icon> (button)
  
  <v-row dense> (search row)
    <v-text-field> (input)
  
  <v-row dense> (icons row)
    <v-virtual-scroll> (list)
      <template v-slot:default> (item)
        <v-icon> (icon)
```

### Conditional Rendering
- `v-if="id !== ''"` on VMenu → Only render when ID generated

### Event Handling
- Activator: Vuetify's `v-on="on"` pattern
- Search: `@input="updateSearch"`
- Icons: `@click="selectedIcon(item.name)"`
- Search field: `v-on:click.stop` (prevent propagation)

## State Flow

### Internal State
```typescript
{
  search: string,  // User's search query
  id: string       // Unique component identifier
}
```

### Derived State (Computed)
```typescript
{
  filteredIcons: computed from (this.icons, this.search),
  idQuery: computed from (this.id)
}
```

### Props (External State)
```typescript
{
  value: string,        // From parent
  icons: Array<Object>  // From parent
}
```

## Performance Characteristics

### Virtual Scrolling
- **Without:** 7000 DOM nodes (full MDI set)
- **With:** ~5 DOM nodes (visible items only)
- **Improvement:** 99.9% reduction in DOM nodes

### Computed Property Caching
- `filteredIcons` cached based on dependencies
- Only recalculates when `icons` or `search` changes
- Multiple template accesses use cached value

## Cross-References
- **System Overview:** [system-overview.md](system-overview.md)
- **Dependencies:** [dependencies.md](dependencies.md)
- **Design Patterns:** [patterns.md](patterns.md)
- **Program Structure:** [../reference/program-structure.md](../reference/program-structure.md)
- **Component Diagrams:** [../diagrams/structural/](../diagrams/structural/)

---
**Component Count:** 1 primary (MdiIconPicker) + 5 Vuetify  
**Complexity:** Low (single component, clear responsibilities)
