# Program Structure Reference

## Component Hierarchy

### MdiIconPicker Component
**File:** `src/MdiIconPicker.vue`  
**Type:** Vue Single File Component (SFC)  
**Language:** TypeScript with Vue Class Component syntax  
**Export:** Default ES6 export with Vue plugin installation

```
MdiIconPicker (extends Vue)
├── Template Structure
│   └── VMenu (Vuetify component)
│       ├── VIcon (activator - displays current icon)
│       ├── VRow (search container)
│       │   └── VTextField (search input)
│       └── VRow (icon list container)
│           └── VVirtualScroll (performance-optimized list)
│               └── VIcon (individual icons, repeated)
├── Script Logic
│   ├── Class Properties
│   │   ├── @Prop value: string (current icon value)
│   │   ├── @Prop icons: Array<any> (icon dataset)
│   │   ├── search: string (search query state)
│   │   └── id: string (unique component identifier)
│   ├── Lifecycle Hooks
│   │   └── created() (generates random ID)
│   ├── Methods
│   │   ├── selectedIcon(icon: string) (handles icon selection)
│   │   └── updateSearch(e: string) (updates search state)
│   └── Computed Properties
│       ├── filteredIcons() (filters icons by search)
│       └── idQuery() (generates CSS selector)
└── Styles
    └── Scoped CSS for v-menu styling
```

## Class Structure Detail

### MdiIconPicker Class
**Inheritance:** `extends Vue`  
**Decorator:** `@Component({ components: {...} })`  
**Source Location:** `src/MdiIconPicker.vue` lines 23-64

#### Class Members

##### Properties
1. **value** (Prop)
   - **Type:** `string`
   - **Decorator:** `@Prop()`
   - **Purpose:** Current selected icon name (v-model support)
   - **Required:** No (default undefined)
   - **Line:** 33

2. **icons** (Prop)
   - **Type:** `Array<any>`
   - **Decorator:** `@Prop()`
   - **Purpose:** Array of icon objects to display
   - **Expected Structure:** `{ name: string, aliases: string[], tags: string[] }`
   - **Required:** No (default undefined)
   - **Line:** 35-36

3. **search** (Data)
   - **Type:** `string`
   - **Initial Value:** `""`
   - **Purpose:** Internal state for search input
   - **Reactivity:** Reactive property
   - **Line:** 38

4. **id** (Data)
   - **Type:** `string`
   - **Initial Value:** `""`
   - **Purpose:** Unique identifier for menu attachment
   - **Generated:** In `created()` lifecycle hook
   - **Line:** 40

##### Lifecycle Hooks

1. **created()**
   - **Type:** Lifecycle hook
   - **Execution:** After component instance creation, before mounting
   - **Purpose:** Generate unique random ID for component instance
   - **Implementation:** `Math.random().toString(36).replace('0.', 'icon-picker' || '')`
   - **Line:** 42-44

##### Methods

1. **selectedIcon(icon: string)**
   - **Type:** Instance method
   - **Parameters:** `icon: string` - Name of selected icon (without 'mdi-' prefix)
   - **Return Type:** `void` (emits event)
   - **Purpose:** Handle icon selection and emit event to parent
   - **Event Emitted:** `'select'` with payload `'mdi-${icon}'`
   - **Line:** 46-48

2. **updateSearch(e: string)**
   - **Type:** Instance method
   - **Parameters:** `e: string` - New search query from input event
   - **Return Type:** `void`
   - **Purpose:** Update internal search state
   - **Side Effects:** Triggers `filteredIcons` recomputation
   - **Line:** 50-52

##### Computed Properties

1. **filteredIcons**
   - **Type:** Getter (computed property)
   - **Return Type:** `Array<any>`
   - **Purpose:** Filter icons array based on search query
   - **Filter Logic:** 
     - Searches in `name` field (includes check)
     - Searches in `aliases` array (includes check)
     - Searches in `tags` array (includes check)
     - Uses OR logic (matches any field)
   - **Caching:** Vue automatically caches based on dependencies
   - **Dependencies:** `this.icons`, `this.search`
   - **Line:** 54-56

2. **idQuery**
   - **Type:** Getter (computed property)
   - **Return Type:** `string`
   - **Purpose:** Generate CSS selector for menu attachment
   - **Format:** `#${this.id}` (ID selector)
   - **Usage:** Passed to VMenu `:attach` prop
   - **Line:** 58-60

## Component Registration

### Plugin Installation Pattern
**File:** `src/index.js`  
**Pattern:** Vue Plugin with install method

```javascript
// Default export for direct import
export default MdiIconPicker;

// Plugin install method
MdiIconPicker.install = function(Vue) {
  Vue.component(MdiIconPicker.name, MdiIconPicker);
};

// Auto-install for browser environments
if(typeof window !== "undefined" && window.Vue) {
  window.Vue.component(MdiIconPicker.name, MdiIconPicker);
}
```

**Component Name:** `MdiIconPicker` (class name used as component tag name)

## TypeScript Decorators

### Decorator Usage Summary
The component uses TypeScript decorators from `vue-property-decorator` package:

1. **@Component(options)**
   - Applied to: Class declaration
   - Purpose: Register component with Vue
   - Options: `{ components: { VMenu, VRow, VIcon, VTextField, VVirtualScroll } }`
   - Imports required Vuetify components

2. **@Prop()**
   - Applied to: `value`, `icons` properties
   - Purpose: Declare component props with TypeScript type checking
   - Runtime validation: Type validation based on TypeScript types

## Template Structure

### Template Hierarchy
```
<v-menu> (root element)
  ├── Conditional: v-if="id !== ''"
  ├── Props:
  │   ├── offset-y (menu positioning)
  │   ├── :close-on-content-click="false" (keep open on interaction)
  │   └── :attach="idQuery" (attach to specific element)
  │
  ├── <template v-slot:activator="{ on, attrs }"> (menu trigger)
  │   └── <v-icon> (displays current icon)
  │       ├── v-bind="attrs"
  │       ├── v-on="on"
  │       ├── x-large (size)
  │       ├── :id="id" (unique identifier)
  │       └── {{value}} (displays icon name)
  │
  ├── <v-row dense> (search row)
  │   └── <v-text-field> (search input)
  │       ├── placeholder="Search"
  │       ├── outlined (style)
  │       ├── class="pb-2" (padding bottom)
  │       ├── @input="updateSearch" (event handler)
  │       └── v-on:click.stop (prevent menu close)
  │
  └── <v-row dense> (icon grid row)
      └── style="max-height: 200px; max-width: 300px;"
      └── <v-virtual-scroll> (virtualized scrolling)
          ├── :items="filteredIcons" (data source)
          ├── :item-height="50" (each item 50px)
          ├── :bench="0" (no extra rendering)
          ├── height="235" (container height)
          └── style="top: -35px;" (position adjustment)
          │
          └── <template v-slot:default="{ item }"> (item template)
              └── <v-icon> (individual icon)
                  ├── @click="selectedIcon(item.name)" (selection handler)
                  ├── large (size)
                  ├── :title="item.name" (tooltip)
                  └── mdi-{{item.name}} (icon display)
```

## Module Dependencies

### Internal Dependencies
- **MdiIconPicker.vue** → imports → **None** (self-contained component)
- **index.js** → imports → **MdiIconPicker.vue**
- **plugins/vuetify.ts** → imports → **Vue, Vuetify** (configuration only, not directly imported by component)

### External Dependencies
**From package.json:**
- `vue` (^2.6.11) - Base framework
- `vuetify` (2.6.10) - UI components
- `vue-class-component` (^7.2.3) - Class component support
- `vue-property-decorator` (^9.1.2) - TypeScript decorators

**Direct Imports in MdiIconPicker.vue:**
```typescript
import { Component, Vue, Prop } from 'vue-property-decorator';
import {VMenu, VRow, VIcon, VTextField, VVirtualScroll} from 'vuetify/lib';
```

## File Structure Summary

### Source Files
1. **MdiIconPicker.vue** (main component)
   - Template: 18 lines
   - Script: 42 lines (TypeScript)
   - Style: 4 lines (scoped CSS)

2. **index.js** (plugin entry point)
   - 10 lines
   - Default export + plugin pattern

3. **plugins/vuetify.ts** (Vuetify config)
   - 7 lines
   - Configures Vuetify instance

4. **shims-vue.d.ts** (Vue type declarations)
   - 4 lines
   - Module declaration for .vue files

5. **shims-tsx.d.ts** (JSX type declarations)
   - 13 lines
   - Global JSX namespace declarations

6. **shims-vuetify.d.ts** (Vuetify type declarations)
   - 4 lines
   - Module declaration for vuetify/lib/framework

## Design Patterns Identified

1. **Single File Component (SFC)** - Vue.js pattern separating template, script, and style
2. **Class Component Pattern** - TypeScript class-based component definition
3. **Decorator Pattern** - TypeScript decorators for metadata
4. **Plugin Pattern** - Vue.use() compatible installation
5. **Composition Pattern** - Component composed of Vuetify sub-components
6. **Virtual Scrolling Pattern** - Performance optimization for large lists
7. **Controlled Component Pattern** - Component state managed via props and events

## Cross-References
- **API Interface:** See [interfaces.md](interfaces.md) for public API details
- **Data Models:** See [data-models.md](data-models.md) for type definitions
- **Dependencies:** See [../architecture/dependencies.md](../architecture/dependencies.md) for dependency graph
- **Behavioral Logic:** See [../behavior/business-logic.md](../behavior/business-logic.md) for filtering algorithm
- **Component Patterns:** See [../architecture/patterns.md](../architecture/patterns.md) for design pattern details

---
**Source Files Analyzed:** src/MdiIconPicker.vue, src/index.js, src/plugins/vuetify.ts, src/shims-*.d.ts
