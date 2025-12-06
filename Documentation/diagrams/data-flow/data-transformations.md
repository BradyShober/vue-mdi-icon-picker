# Data Flow Diagrams

## Props Flow (Input)

```
Parent Component
    │
    │ Props Binding
    ↓
:value="selectedIcon" → MdiIconPicker.value
:icons="iconDataset" → MdiIconPicker.icons
    │
    │ Internal Use
    ↓
value → Activator VIcon ({{value}})
icons → filteredIcons computed → VVirtualScroll
```

## Search Data Transformation

```
User Types in Search Field
    │
    ↓ @input event
VTextField emits input value
    │
    ↓ "home"
updateSearch(e: string)
    │
    ↓ assignment
this.search = "home"
    │
    ↓ Vue reactivity detects change
filteredIcons computed property invalidated
    │
    ↓ recalculation
this.icons.filter(i =>
  i.name.includes("home") ||
  i.aliases.includes("home") ||
  i.tags.includes("home")
)
    │
    ↓ result: [ {name: "home", ...}, {name: "home-outline", ...} ]
filteredIcons = [matched icons]
    │
    ↓ Vue template reactivity
VVirtualScroll :items updates
    │
    ↓ render
Icon list displays filtered results
```

## Icon Selection Data Flow

```
User Clicks Icon in List
    │
    ↓ @click="selectedIcon('home')"
selectedIcon method called
    │
    ↓ string formatting
iconName = 'mdi-' + 'home'
    │
    ↓ 'mdi-home'
this.$emit('select', 'mdi-home')
    │
    ↓ Vue event system
Parent @select handler
    │
    ↓ event payload
Parent receives 'mdi-home'
    │
    ↓ parent updates state
selectedIcon = 'mdi-home'
    │
    ↓ props update
:value="selectedIcon" → MdiIconPicker.value = 'mdi-home'
    │
    ↓ Vue reactivity
Activator VIcon updates display
    │
    ↓ render
Activator shows new icon
```

## Computed Property Dependency Graph

```
filteredIcons (computed)
    ├── depends on: this.icons (prop)
    └── depends on: this.search (data)

Recomputes when:
- this.icons changes (parent updates prop)
- this.search changes (user types)

Does NOT recompute when:
- this.value changes (not a dependency)
- this.id changes (not a dependency)

idQuery (computed)
    └── depends on: this.id (data)

Recomputes when:
- this.id changes (only once in created())
```

## Complete Data Cycle

```
┌─────────────────────────────────────────────────┐
│           Parent Component State                 │
│  selectedIcon: "mdi-home"                        │
│  icons: [ {name, aliases, tags}, ... ]           │
└──────────────┬──────────────────────────────────┘
               │
               │ Props Down
               ↓
┌─────────────────────────────────────────────────┐
│           MdiIconPicker Component                │
│  Receives:                                       │
│    this.value = "mdi-home"                       │
│    this.icons = [...]                            │
│                                                  │
│  Internal State:                                 │
│    this.search = ""  ───┐                        │
│    this.id = "icon-picker8k3d9s"                 │
│                         │                        │
│  Computed:              │                        │
│    filteredIcons ←──────┴─← depends on search    │
│    idQuery                                       │
└──────────────┬──────────────────────────────────┘
               │
               │ User Interaction
               │ (Types "account")
               │
               ↓
        updateSearch("account")
               │
               ↓
        this.search = "account"
               │
               ↓
    filteredIcons recomputes
               │
               │ User Interaction
               │ (Clicks icon)
               │
               ↓
     selectedIcon("account")
               │
               ↓
  $emit('select', 'mdi-account')
               │
               │ Events Up
               ↓
┌─────────────────────────────────────────────────┐
│           Parent Component                       │
│  @select handler                                 │
│  selectedIcon = 'mdi-account'  ← Update State    │
└──────────────┬──────────────────────────────────┘
               │
               │ Props Down (cycle repeats)
               ↓
        :value="selectedIcon"
```

## Virtual Scroll Data Flow

```
filteredIcons: [ 7000 icon objects ]
    │
    ↓ passed to VVirtualScroll
VVirtualScroll
    │
    ├─→ Calculates visible range
    │   scroll_position = 500px
    │   item_height = 50px
    │   visible_start = 500 / 50 = 10
    │   visible_end = (500 + 235) / 50 = 15
    │
    ├─→ Extracts visible items
    │   visible_items = filteredIcons.slice(10, 15)
    │   = [ icon10, icon11, icon12, icon13, icon14 ]
    │
    └─→ Renders only visible items
        DOM Nodes: 5 VIcon components
        Memory: ~1KB (vs 7000 icons = ~2MB)
```

## ID Generation Flow

```
Component Created
    │
    ↓ created() lifecycle hook
Generate Random ID
    │
    ↓
Math.random()
    │  0.8k3d9s742jq (example)
    ↓
.toString(36)
    │  "0.8k3d9s"
    ↓
.replace('0.', 'icon-picker')
    │  "icon-picker8k3d9s"
    ↓
this.id = "icon-picker8k3d9s"
    │
    ↓ used in computed
idQuery = "#icon-picker8k3d9s"
    │
    ↓ passed to VMenu
:attach="idQuery"
    │
    ↓ VMenu uses for positioning
Menu attaches to element with this ID
```

## Event Emission Data Transformation

```
Internal Icon Name: "home" (no prefix)
    │
    ↓ selectedIcon method
Add 'mdi-' prefix
    │
    ↓
Formatted: "mdi-home"
    │
    ↓ $emit
Event: { name: 'select', payload: 'mdi-home' }
    │
    ↓ Vue event system
Parent @select="handleSelect"
    │
    ↓ $event
handleSelect receives: "mdi-home"
    │
    ↓ parent logic
Parent processes string with prefix
```

## Cross-References
- **Business Logic:** [../../behavior/business-logic.md](../../behavior/business-logic.md)
- **Decision Logic:** [../../behavior/decision-logic.md](../../behavior/decision-logic.md)
- **Workflows:** [../../behavior/workflows.md](../../behavior/workflows.md)
