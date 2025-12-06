# Vuetify Component Usage

## Components Used

### VMenu
**Purpose:** Dropdown menu container  
**Version:** 2.6.10

**Props Used:**
- `offset-y`: true - Position below activator
- `:close-on-content-click`: false - Keep open after selection
- `:attach`: idQuery - Attach to specific element

**Slots:**
- `activator`: Trigger element (VIcon showing current icon)

### VIcon
**Purpose:** Display Material Design Icons  
**Usage:** 2 instances

**Instance 1: Activator**
- Size: `x-large`
- ID: Dynamic (for menu attachment)
- Content: Current selected icon

**Instance 2: List Items**
- Size: `large`
- Title: Icon name (tooltip)
- Click handler: Select icon
- Content: mdi-{iconName}

### VTextField
**Purpose:** Search input

**Props:**
- `placeholder`: "Search"
- `outlined`: true (visual style)
- `class`: "pb-2" (padding)

**Events:**
- `@input`: updateSearch method
- `@click.stop`: Prevent menu close

### VVirtualScroll
**Purpose:** Performance-optimized list rendering

**Props:**
- `:items`: filteredIcons (computed)
- `:item-height`: 50 (fixed height)
- `:bench`: 0 (no extra rendering)
- `height`: 235 (container height)

**Performance:**
- Renders only visible items (~5)
- Handles 7000+ icons efficiently

### VRow
**Purpose:** Grid layout  
**Usage:** 2 instances (search row, icons row)

**Props:**
- `dense`: true (compact spacing)

## Theming
No custom theme configuration. Uses default Vuetify theme.

**Menu Styling:**
```css
.v-menu__content {
  min-width: 300px !important;
  background-color: white;
}
```

## Cross-References
- **Component Details:** [../../architecture/components.md](../../architecture/components.md)
- **Dependencies:** [../../architecture/dependencies.md](../../architecture/dependencies.md)
