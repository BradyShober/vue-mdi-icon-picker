# Component Interfaces and Public API

## MdiIconPicker Component API

### Component Registration
**Component Name:** `MdiIconPicker`  
**Usage Tags:** `<MdiIconPicker>` or `<mdi-icon-picker>` (kebab-case in templates)

### Installation Methods

#### Method 1: Plugin Installation (Global)
```javascript
import Vue from 'vue';
import MdiIconPicker from 'vue-mdi-icon-picker';

Vue.use(MdiIconPicker);

// Component now available globally as <MdiIconPicker>
```

#### Method 2: Direct Component Import (Local)
```javascript
import MdiIconPicker from 'vue-mdi-icon-picker';

export default {
  components: {
    MdiIconPicker
  }
}
```

#### Method 3: Browser Global (CDN)
```html
<script src="vue.js"></script>
<script src="vue-mdi-icon-picker.min.js"></script>
<!-- Component auto-registered globally -->
```

## Props API

### value
**Type:** `String`  
**Required:** No  
**Default:** `undefined`  
**Description:** The currently selected icon name (with or without 'mdi-' prefix)  
**v-model Support:** Yes - use v-model for two-way binding  
**Reactivity:** Changes to this prop update the displayed icon in the activator

**Usage Examples:**
```vue
<!-- Direct prop binding -->
<MdiIconPicker :value="currentIcon" />

<!-- v-model binding (recommended) -->
<MdiIconPicker v-model="currentIcon" />
```

**Expected Format:**
- With prefix: `"mdi-account"`
- Without prefix: `"account"`
- Both formats are accepted and displayed

### icons
**Type:** `Array<Object>`  
**Required:** No  
**Default:** `undefined`  
**Description:** Array of icon objects to display in the picker  
**Reactivity:** Changes to this array update the available icons immediately

**Object Structure:**
Each object in the array must have the following structure:
```typescript
{
  name: string,      // Icon name (without 'mdi-' prefix)
  aliases: string[], // Alternative names for search
  tags: string[]     // Descriptive tags for categorization
}
```

**Usage Example:**
```vue
<template>
  <MdiIconPicker :icons="iconList" v-model="selectedIcon" />
</template>

<script>
export default {
  data() {
    return {
      selectedIcon: 'mdi-home',
      iconList: [
        {
          name: 'home',
          aliases: ['house', 'main'],
          tags: ['building', 'residence']
        },
        {
          name: 'account',
          aliases: ['user', 'person'],
          tags: ['profile', 'avatar']
        },
        {
          name: 'cog',
          aliases: ['settings', 'gear'],
          tags: ['configuration', 'options']
        }
      ]
    }
  }
}
</script>
```

**Search Behavior:**
The component searches across all three fields (name, aliases, tags) using substring matching:
- Searches `name` field: `'home'.includes(searchTerm)`
- Searches `aliases` array: `['house', 'main'].includes(searchTerm)`
- Searches `tags` array: `['building', 'residence'].includes(searchTerm)`
- Uses OR logic: matches if found in ANY field

## Events API

### select
**Event Name:** `'select'`  
**Payload Type:** `String`  
**Payload Format:** Icon name with 'mdi-' prefix (e.g., `'mdi-home'`)  
**Trigger:** Emitted when user clicks an icon in the picker menu  
**Description:** Notifies parent component of icon selection

**Usage Example:**
```vue
<template>
  <MdiIconPicker 
    :icons="iconList" 
    :value="currentIcon"
    @select="handleIconSelect" 
  />
</template>

<script>
export default {
  data() {
    return {
      currentIcon: 'mdi-home',
      iconList: [/* ... */]
    }
  },
  methods: {
    handleIconSelect(iconName) {
      // iconName will be 'mdi-home', 'mdi-account', etc.
      console.log('Selected icon:', iconName);
      this.currentIcon = iconName;
    }
  }
}
</script>
```

## v-model Support

### Two-Way Binding
The component supports v-model for convenient two-way data binding:

**v-model Behavior:**
- **Prop:** Maps to `value` prop
- **Event:** Responds to `select` event
- **Automatic Sync:** Parent data automatically updates on selection

**Example:**
```vue
<template>
  <div>
    <MdiIconPicker v-model="selectedIcon" :icons="iconList" />
    <p>Current selection: {{ selectedIcon }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIcon: 'mdi-star',
      iconList: [/* icon objects */]
    }
  }
}
</script>
```

**Equivalent Explicit Binding:**
```vue
<MdiIconPicker 
  :value="selectedIcon" 
  @select="selectedIcon = $event"
  :icons="iconList" 
/>
```

## Template Slots

### activator (Vuetify VMenu slot)
**Type:** Scoped slot  
**Provided by:** VMenu component  
**Scope:** `{ on, attrs }`  
**Usage:** Internal to component (not exposed to consumers)  
**Description:** Renders the icon button that opens the picker menu

**Internal Implementation:**
```vue
<template v-slot:activator="{ on, attrs }">
  <v-icon v-bind="attrs" v-on="on" x-large :id="id">{{value}}</v-icon>
</template>
```

## Component Methods (Internal)

These methods are not part of the public API but are documented for understanding component behavior:

### selectedIcon(icon: string)
**Visibility:** Internal  
**Purpose:** Handles icon selection  
**Behavior:** Emits `select` event with formatted icon name

### updateSearch(e: string)
**Visibility:** Internal  
**Purpose:** Updates internal search state  
**Behavior:** Triggers filteredIcons recomputation

## Computed Properties (Public Behavior)

### filteredIcons
**Type:** Computed property (internal)  
**Public Behavior:** Automatically filters displayed icons based on search input  
**Algorithm:** Substring matching across name, aliases, and tags  
**Performance:** O(n) where n is number of icons

### idQuery
**Type:** Computed property (internal)  
**Public Behavior:** N/A (used for menu attachment)

## Component State

### Internal State (Not Exposed)
- **search:** Current search query string
- **id:** Unique component instance identifier

**Note:** These are internal implementation details and not accessible from parent components.

## Complete Usage Example

```vue
<template>
  <div class="icon-picker-demo">
    <h2>Select an Icon</h2>
    
    <!-- Component usage with v-model -->
    <MdiIconPicker 
      v-model="selectedIcon" 
      :icons="mdiIcons"
      class="my-picker"
    />
    
    <!-- Display current selection -->
    <div class="selection-display">
      <v-icon>{{ selectedIcon }}</v-icon>
      <p>Current Icon: {{ selectedIcon }}</p>
    </div>
  </div>
</template>

<script>
import MdiIconPicker from 'vue-mdi-icon-picker';
import mdiIconsData from '@mdi/js/mdi.json';

export default {
  name: 'IconPickerDemo',
  
  components: {
    MdiIconPicker
  },
  
  data() {
    return {
      selectedIcon: 'mdi-heart',
      mdiIcons: Object.keys(mdiIconsData).map(key => ({
        name: key,
        aliases: mdiIconsData[key].aliases || [],
        tags: mdiIconsData[key].tags || []
      }))
    }
  },
  
  watch: {
    selectedIcon(newIcon) {
      console.log('Icon changed to:', newIcon);
    }
  }
}
</script>
```

## Type Definitions (TypeScript)

### Component Props Interface
```typescript
interface MdiIconPickerProps {
  value?: string;                    // Current icon value
  icons?: IconObject[];              // Array of icon objects
}

interface IconObject {
  name: string;                      // Icon name (without 'mdi-' prefix)
  aliases: string[];                 // Alternative search terms
  tags: string[];                    // Categorization tags
}
```

### Component Events Interface
```typescript
interface MdiIconPickerEvents {
  select: (iconName: string) => void;  // Emitted on icon selection
}
```

### TypeScript Usage
```typescript
import MdiIconPicker from 'vue-mdi-icon-picker';
import { Component, Vue } from 'vue-property-decorator';

interface IconData {
  name: string;
  aliases: string[];
  tags: string[];
}

@Component({
  components: { MdiIconPicker }
})
export default class MyComponent extends Vue {
  selectedIcon: string = 'mdi-home';
  iconList: IconData[] = [
    { name: 'home', aliases: ['house'], tags: ['building'] }
  ];
  
  handleIconSelect(icon: string): void {
    this.selectedIcon = icon;
  }
}
```

## Browser Compatibility
- **Supported Browsers:** Modern browsers supporting ES6+
- **Vue Version:** 2.6.x
- **Vuetify Version:** 2.6.x
- **TypeScript:** Optional (component works with plain JavaScript)

## Accessibility Considerations

### ARIA Attributes
The component relies on Vuetify's built-in accessibility:
- **VIcon:** Renders as `<i>` with icon content
- **VMenu:** Keyboard navigation support
- **VTextField:** Standard input accessibility

### Keyboard Support
- **Menu Activation:** Click on icon
- **Search Field:** Standard text input
- **Icon Selection:** Click event (not keyboard navigable in current implementation)

## Performance Characteristics

### Virtual Scrolling
- **Technology:** VVirtualScroll (Vuetify component)
- **Benefit:** Only renders visible icons
- **Recommended:** For icon sets > 100 items
- **Configuration:** 
  - Item height: 50px
  - Container height: 235px
  - Bench: 0 (no extra rendering)

### Search Performance
- **Algorithm:** Linear scan with substring matching
- **Complexity:** O(n × m) where n=icons, m=search term length
- **Optimization:** Computed property caching (only recalculates on dependency change)

## Styling and Customization

### Scoped Styles
The component includes minimal scoped styling:
```css
.v-menu__content {
  min-width: 300px !important;
  background-color: white;
}
```

### Customization Points
1. **Activator Icon Size:** `x-large` (can be overridden with CSS)
2. **Menu Dimensions:** `max-width: 300px, max-height: 200px`
3. **Virtual Scroll Height:** `height: 235px`
4. **Icon Display Size:** `large`

### Theme Integration
The component uses Vuetify theming automatically:
- Respects global Vuetify theme
- Uses Vuetify's color system
- Inherits typography settings

## Cross-References
- **Program Structure:** See [program-structure.md](program-structure.md)
- **Data Models:** See [data-models.md](data-models.md)
- **Behavioral Logic:** See [../behavior/business-logic.md](../behavior/business-logic.md)
- **Usage Examples:** See [../specialized/vue-component/](../specialized/vue-component/)
- **Migration Guide:** See [../migration/component-order.md](../migration/component-order.md)

---
**API Version:** 1.1.2  
**Last Updated:** Static analysis of src/MdiIconPicker.vue
