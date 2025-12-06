# Data Models and Type Definitions

## Component Data Model

### MdiIconPicker Component Data Structure

#### Props (Input Data)
```typescript
class MdiIconPicker extends Vue {
  // Prop 1: Current Icon Value
  @Prop()
  value: string;
  
  // Prop 2: Icon Dataset
  @Prop()
  icons: Array<any>;
}
```

#### Internal State (Reactive Data)
```typescript
class MdiIconPicker extends Vue {
  // Search query state
  search: string = "";
  
  // Unique component identifier
  id: string = "";
}
```

## Type Definitions

### IconObject Interface
**Description:** Structure of each icon object in the icons array prop  
**Source:** Inferred from component usage and filter logic  
**File Reference:** src/MdiIconPicker.vue (line 54-56)

```typescript
interface IconObject {
  /**
   * Icon name without 'mdi-' prefix
   * Used for display and search
   * @example "home", "account", "settings"
   */
  name: string;
  
  /**
   * Array of alternative names for the icon
   * Used in search filtering
   * @example ["house", "residence"] for "home" icon
   */
  aliases: string[];
  
  /**
   * Array of descriptive tags for categorization
   * Used in search filtering
   * @example ["building", "place"] for "home" icon
   */
  tags: string[];
}
```

**Usage in Code:**
```typescript
// Filter logic in computed property
get filteredIcons() {
  return this.icons.filter(i => 
    i.name.includes(this.search) ||      // name field
    i.aliases.includes(this.search) ||   // aliases array
    i.tags.includes(this.search)         // tags array
  );
}
```

### Component Props Interface
```typescript
interface MdiIconPickerProps {
  /**
   * Currently selected icon name
   * Can include or exclude 'mdi-' prefix
   * Used for v-model binding
   */
  value?: string;
  
  /**
   * Array of icon objects to display
   * Each object must contain name, aliases, and tags
   */
  icons?: IconObject[];
}
```

### Component Events Interface
```typescript
interface MdiIconPickerEvents {
  /**
   * Emitted when user selects an icon
   * @param iconName - Selected icon with 'mdi-' prefix
   */
  select: (iconName: string) => void;
}
```

### Component Instance Data Interface
```typescript
interface MdiIconPickerData {
  /**
   * Current search query
   * Updated by user input in search field
   * Drives filteredIcons computation
   */
  search: string;
  
  /**
   * Unique identifier for this component instance
   * Generated randomly in created() hook
   * Format: 'icon-picker' + random string
   * Used for menu attachment
   */
  id: string;
}
```

## TypeScript Shims and Declarations

### Vue Module Declaration
**File:** `src/shims-vue.d.ts`

```typescript
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```

**Purpose:** Allows TypeScript to recognize .vue file imports  
**Effect:** Makes `import Component from './Component.vue'` type-safe

### JSX/TSX Support
**File:** `src/shims-tsx.d.ts`

```typescript
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // JSX elements return VNode
    interface Element extends VNode {}
    
    // JSX element classes extend Vue
    interface ElementClass extends Vue {}
    
    // Allow any intrinsic elements
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
```

**Purpose:** Enable JSX/TSX syntax in Vue components (though not used in this codebase)  
**Effect:** Provides type definitions for JSX rendering

### Vuetify Module Declaration
**File:** `src/shims-vuetify.d.ts`

```typescript
declare module 'vuetify/lib/framework' {
  import Vuetify from 'vuetify'
  export default Vuetify
}
```

**Purpose:** Allow TypeScript to resolve Vuetify framework imports  
**Effect:** Makes `import Vuetify from 'vuetify/lib/framework'` type-safe

## Vuetify Component Types

### Imported Vuetify Components
**File:** `src/MdiIconPicker.vue` (line 21)

```typescript
import {
  VMenu,          // Menu overlay component
  VRow,           // Grid row component
  VIcon,          // Icon display component
  VTextField,     // Text input component
  VVirtualScroll  // Virtual scrolling list component
} from 'vuetify/lib';
```

### VMenu Component Props (Used)
```typescript
interface VMenuProps {
  offsetY: boolean;           // Position menu below activator
  closeOnContentClick: boolean; // Keep menu open on interaction
  attach: string | Element;   // CSS selector for attachment point
}
```

### VIcon Component Props (Used)
```typescript
interface VIconProps {
  xLarge?: boolean;  // Size variant (activator icon)
  large?: boolean;   // Size variant (list icons)
  id?: string;       // HTML ID attribute
  title?: string;    // Tooltip text
}
```

### VTextField Component Props (Used)
```typescript
interface VTextFieldProps {
  placeholder?: string;  // Placeholder text
  outlined?: boolean;    // Visual variant
  // Also receives @input event handler
}
```

### VVirtualScroll Component Props (Used)
```typescript
interface VVirtualScrollProps {
  items: any[];         // Data array to render
  itemHeight: number;   // Fixed height per item (50)
  bench: number;        // Extra items to render (0)
  height: number;       // Container height (235)
}
```

## Data Flow Model

### Input Data Flow
```
Parent Component
    ↓ (prop binding)
value: string → MdiIconPicker.value (prop)
icons: IconObject[] → MdiIconPicker.icons (prop)
```

### Internal Data Flow
```
User Input (search field)
    ↓ (@input event)
updateSearch(e: string)
    ↓ (updates)
this.search: string
    ↓ (dependency)
computed: filteredIcons
    ↓ (filters)
this.icons.filter(...)
    ↓ (renders)
VVirtualScroll :items
    ↓ (displays)
Icon List
```

### Output Data Flow
```
User Click (icon selection)
    ↓ (@click event)
selectedIcon(icon: string)
    ↓ (emits)
$emit('select', 'mdi-${icon}')
    ↓ (received by parent)
@select handler
    ↓ (updates parent state)
Parent component data
```

### v-model Data Flow
```
Parent: v-model="selectedIcon"
    ↓ (expands to)
:value="selectedIcon" + @select="selectedIcon = $event"
    ↓ (flows into component)
MdiIconPicker.value (prop)
    ↓ (displays in)
Activator VIcon
    ↓ (user selects new icon)
@click → selectedIcon(icon)
    ↓ (emits)
$emit('select', newIcon)
    ↓ (updates parent)
selectedIcon = newIcon
```

## Computed Property Dependencies

### filteredIcons Computed Property
**Dependencies:**
```typescript
dependencies: [
  this.icons,   // Icons array prop
  this.search   // Internal search state
]
```

**Recomputation Triggers:**
- Change to `icons` prop (parent updates icon list)
- Change to `search` data (user types in search field)

**Caching Behavior:**
- Vue caches result when dependencies unchanged
- Recalculates only when dependencies change
- Returns cached value on subsequent accesses

### idQuery Computed Property
**Dependencies:**
```typescript
dependencies: [
  this.id  // Internal ID state
]
```

**Recomputation Triggers:**
- Change to `id` data (only happens once in created() hook)

## Type Safety Analysis

### TypeScript Configuration
**File:** `tsconfig.json`

**Key Settings Affecting Types:**
```json
{
  "strict": true,                      // Enable all strict type checks
  "experimentalDecorators": true,      // Required for @Prop, @Component
  "esModuleInterop": true,            // Better import compatibility
  "allowSyntheticDefaultImports": true // Allow default imports
}
```

### Decorator Type Annotations

#### @Prop() Decorator
```typescript
@Prop()
value: string
```
**Type Safety:**
- TypeScript type: `string`
- Runtime validation: Vue prop type checking
- Optional: No `required: true` specified
- Default: `undefined` when not provided

```typescript
@Prop()
icons: Array<any>
```
**Type Safety:**
- TypeScript type: `Array<any>` (weak typing)
- Runtime validation: Array type check only
- **Note:** `any` type reduces type safety, but needed for flexibility
- **Improvement Opportunity:** Could use `Array<IconObject>` for stronger typing

### Method Type Signatures

#### selectedIcon Method
```typescript
selectedIcon(icon: string): void
```
**Parameters:** `icon: string` - Icon name without prefix  
**Return:** `void` - Emits event, doesn't return value  
**Type Safety:** Full type checking on parameter

#### updateSearch Method
```typescript
updateSearch(e: string): void
```
**Parameters:** `e: string` - Search query  
**Return:** `void` - Updates state, doesn't return value  
**Type Safety:** Full type checking on parameter

### Computed Property Return Types

```typescript
get filteredIcons(): Array<any>
```
**Return Type:** Inferred as `Array<any>` from `this.icons` type  
**Type Safety:** Maintains same type as input

```typescript
get idQuery(): string
```
**Return Type:** Explicitly `string` (template literal)  
**Type Safety:** Guaranteed to return string

## Data Validation

### Runtime Validation
Vue provides runtime type checking for props:

```javascript
// Equivalent runtime validation (not explicitly in code but enforced by Vue)
props: {
  value: {
    type: String,
    required: false,
    default: undefined
  },
  icons: {
    type: Array,
    required: false,
    default: undefined
  }
}
```

### Search Input Validation
**No explicit validation present:**
- Search accepts any string input
- Empty string shows all icons
- No sanitization of search input (relies on Vue's XSS protection)

### Icon Object Validation
**No explicit validation present:**
- Assumes icon objects have correct structure
- Filter logic expects `name`, `aliases`, `tags` properties
- **Potential Issue:** Missing properties cause runtime errors
- **Recommendation:** Add runtime validation or stronger TypeScript types

## Memory Footprint

### Component Instance Memory
```
Per Component Instance:
- Props: ~8 bytes (2 references)
- Data: ~16 bytes (2 strings)
- Computed: ~16 bytes (2 cached values)
- Methods: ~8 bytes (2 function references)
- Template: ~varies (Vue VDOM)
Total: ~48+ bytes + VDOM + icons array
```

### Icons Array Memory
```
Per Icon Object:
{
  name: string     (~50 bytes)
  aliases: array   (~100 bytes avg)
  tags: array      (~150 bytes avg)
}
Total per icon: ~300 bytes

For 1000 icons: ~300 KB
For 10000 icons: ~3 MB
```

## Cross-References
- **Program Structure:** See [program-structure.md](program-structure.md) for class hierarchy
- **API Interface:** See [interfaces.md](interfaces.md) for props/events usage
- **Behavioral Logic:** See [../behavior/business-logic.md](../behavior/business-logic.md) for data transformations
- **Architecture:** See [../architecture/dependencies.md](../architecture/dependencies.md) for type system dependencies
- **TypeScript Patterns:** See [../specialized/typescript-patterns/](../specialized/typescript-patterns/) for decorator usage

---
**Type System:** TypeScript 4.1.5  
**Framework:** Vue 2.6.11 with vue-property-decorator 9.1.2  
**Analysis Source:** src/MdiIconPicker.vue, src/shims-*.d.ts
