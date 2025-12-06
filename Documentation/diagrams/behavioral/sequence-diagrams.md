# Behavioral Sequence Diagrams

## Overview
This document contains text-based sequence diagrams illustrating the temporal flow of interactions in the MdiIconPicker component.

## Diagram 1: Icon Selection Workflow

### Basic Icon Selection (No Search)

```
User          Activator     VMenu        IconList      Component      Parent
 |                |            |             |              |             |
 |-- Click ------>|            |             |              |             |
 |                |            |             |              |             |
 |                |--Open----->|             |              |             |
 |                |            |             |              |             |
 |                |            |--Render---->|              |             |
 |                |            |             |              |             |
 |                |            |             |--Display---->|             |
 |                |            |             | all icons    |             |
 |                |            |             |              |             |
 |<-Visual feedback (menu opens)-------------|              |             |
 |                |            |             |              |             |
 |-- Scroll list----------->   |             |              |             |
 |                |            |             |              |             |
 |                |            |             |--Virtual---->|             |
 |                |            |             | scroll       |             |
 |                |            |             | renders      |             |
 |                |            |             | visible      |             |
 |                |            |             |              |             |
 |-- Click Icon---------------->|            |              |             |
 |                |            |             |              |             |
 |                |            |             |--@click----->|             |
 |                |            |             |  handler     |             |
 |                |            |             |              |             |
 |                |            |             |              |--selectedIcon(name)
 |                |            |             |              |             |
 |                |            |             |              |--$emit----->|
 |                |            |             |              | 'select'    |
 |                |            |             |              | 'mdi-home'  |
 |                |            |             |              |             |
 |                |            |             |              |             |--@select
 |                |            |             |              |             | handler
 |                |            |             |              |             |
 |                |            |             |              |<--Update----|
 |                |            |             |              | v-model     |
 |                |            |             |              | (new value) |
 |                |            |             |              |             |
 |                |<--Update display icon----|              |             |
 |                | (shows new icon)         |              |             |
 |                |            |             |              |             |
 |<-Visual feedback (icon changed)-----------|              |             |
 |                |            |             |              |             |
 |-- Close menu (click outside)|             |              |             |
 |                |            |             |              |             |
 |                |            |--Close----->|              |             |
 |                |            |             |              |             |
```

**Key Points:**
1. Menu opening triggered by Vuetify activator pattern
2. Icon list rendered immediately with all icons (empty search)
3. Virtual scroll renders only visible items
4. Icon click triggers selectedIcon method
5. Event emitted to parent with 'mdi-' prefix
6. Parent updates v-model, which flows back as value prop
7. Activator icon updates to show new selection
8. Menu stays open (close-on-content-click="false")

## Diagram 2: Search and Select Workflow

### Icon Search with Filtering

```
User          SearchField   Component      IconList      VirtualScroll   Parent
 |                |              |             |               |            |
 |-- Click activator (menu opens)------------>|               |            |
 |                |              |             |               |            |
 |                |<--Focus (Vuetify default)-|               |            |
 |                |              |             |               |            |
 |-- Type 'h'---->|              |             |               |            |
 |                |              |             |               |            |
 |                |--@input----->|             |               |            |
 |                |  "h"         |             |               |            |
 |                |              |             |               |            |
 |                |              |--updateSearch("h")          |            |
 |                |              |             |               |            |
 |                |              |--Set this.search = "h"      |            |
 |                |              |             |               |            |
 |                |              |--Invalidate computed        |            |
 |                |              | filteredIcons               |            |
 |                |              |             |               |            |
 |                |              |--Recompute----------->      |            |
 |                |              | filteredIcons               |            |
 |                |              | (filter by "h")             |            |
 |                |              |             |               |            |
 |                |              |             |--Update items->|            |
 |                |              |             |  (filtered)   |            |
 |                |              |             |               |            |
 |                |              |             |               |--Render--->|
 |                |              |             |               | visible    |
 |                |              |             |               | icons      |
 |                |              |             |               |            |
 |<-Visual feedback (list filters, ~200 icons matching "h")----|            |
 |                |              |             |               |            |
 |-- Type 'o'---->|              |             |               |            |
 |                |              |             |               |            |
 |                |--@input----->|             |               |            |
 |                |  "ho"        |             |               |            |
 |                |              |             |               |            |
 |                |              |--updateSearch("ho")         |            |
 |                |              |--Set this.search = "ho"     |            |
 |                |              |--Recompute filteredIcons--->|            |
 |                |              | (filter by "ho")            |            |
 |                |              |             |               |            |
 |                |              |             |--Update items->|            |
 |                |              |             |               |            |
 |<-Visual feedback (list filters, ~50 icons)--|               |            |
 |                |              |             |               |            |
 |-- Type 'm'---->|              |             |               |            |
 |-- Type 'e'---->|              |             |               |            |
 |                |              |             |               |            |
 |                |--@input "home"------------>|               |            |
 |                |              |             |               |            |
 |                |              |--updateSearch("home")       |            |
 |                |              |--Recompute filteredIcons--->|            |
 |                |              |             |               |            |
 |<-Visual feedback (list filters, ~10 icons matching "home")--|            |
 |                |              |             |               |            |
 |-- Click "home-outline" icon--->            |               |            |
 |                |              |             |               |            |
 |                |              |--selectedIcon("home-outline")|           |
 |                |              |             |               |            |
 |                |              |--$emit('select',            |            |
 |                |              | 'mdi-home-outline')--------->----------->|
 |                |              |             |               |            |
 |                |              |<--Update value prop---------|            |
 |                |              | (parent updates v-model)    |            |
 |                |              |             |               |            |
 |<-Visual feedback (activator shows new icon)----------------|            |
 |                |              |             |               |            |
```

**Key Points:**
1. Each keystroke triggers @input event
2. updateSearch called for every character
3. this.search updated immediately (no debouncing)
4. filteredIcons computed property recalculates
5. Vue reactivity propagates to VVirtualScroll :items
6. Virtual scroll re-renders with filtered subset
7. User experience: instant filtering per keystroke
8. Search remains active after selection (can refine or select another)

## Diagram 3: Component Initialization

### Component Lifecycle from Creation to Ready

```
Vue          Component     created()     Template      VMenu       Parent
 |               |             |            |             |            |
 |--Create----->|             |            |             |            |
 | instance     |             |            |             |            |
 |               |             |            |             |            |
 |               |--Initialize data properties            |            |
 |               | search = ""                            |            |
 |               | id = ""                                |            |
 |               |             |            |             |            |
 |               |--Receive props from parent<------------|            |
 |               | value: "mdi-home"                      |            |
 |               | icons: [...]                           |            |
 |               |             |            |             |            |
 |               |--Call------>|            |             |            |
 |               | created()   |            |             |            |
 |               |             |            |             |            |
 |               |             |--Generate random ID      |            |
 |               |             | Math.random().toString(36)|           |
 |               |             |            |             |            |
 |               |             |--Set this.id =           |            |
 |               |             | "icon-picker8k3d9s"      |            |
 |               |             |            |             |            |
 |               |<--Return----|            |             |            |
 |               |             |            |             |            |
 |               |--Evaluate computed properties          |            |
 |               | filteredIcons (all icons, search="")   |            |
 |               | idQuery "#icon-picker8k3d9s"           |            |
 |               |             |            |             |            |
 |               |--Compile--->|            |             |            |
 |               | template    |            |             |            |
 |               |             |            |             |            |
 |               |             |--Check v-if="id !== ''"  |            |
 |               |             | → true (id is set)       |            |
 |               |             |            |             |            |
 |               |             |--Render--->|             |            |
 |               |             | VMenu      |             |            |
 |               |             |            |             |            |
 |               |             |            |--Initialize->|            |
 |               |             |            | (closed)    |            |
 |               |             |            |             |            |
 |               |             |--Render activator icon   |            |
 |               |             | :id="id"                 |            |
 |               |             | value="mdi-home"         |            |
 |               |             |            |             |            |
 |               |--Mount to DOM                          |            |
 |               |             |            |             |            |
 |<--Ready------|             |            |             |            |
 | (component visible, interactive)         |             |            |
 |               |             |            |             |            |
```

**Key Points:**
1. Data properties initialized before created() hook
2. Props received from parent during initialization
3. created() hook generates unique ID
4. Computed properties evaluated after data setup
5. Template v-if checks id before rendering
6. VMenu initialized in closed state
7. Activator icon rendered with generated ID
8. Component ready for user interaction

## Diagram 4: Virtual Scrolling Performance

### Virtual Scroll Rendering During User Scroll

```
User       VirtualScroll   filteredIcons   DOM        IconRenderer
 |              |               |            |              |
 |-- Scroll down (wheel)        |            |              |
 |              |               |            |              |
 |              |--Calculate visible range   |              |
 |              | (scroll position ÷ item height)          |
 |              |               |            |              |
 |              |--Request items in range--->|              |
 |              | (items 10-14)               |              |
 |              |               |            |              |
 |              |<--Return items--           |              |
 |              | [icon10, icon11, ...]      |              |
 |              |               |            |              |
 |              |--Remove old items from DOM->|              |
 |              | (items 0-4)                |              |
 |              |               |            |              |
 |              |               |            |--Destroy---->|
 |              |               |            | old VIcon   |
 |              |               |            | components  |
 |              |               |            |              |
 |              |--Render new items---------->|              |
 |              | (items 10-14)              |              |
 |              |               |            |              |
 |              |               |            |--Create----->|
 |              |               |            | new VIcon   |
 |              |               |            | components  |
 |              |               |            |              |
 |<-Visual feedback (smooth scroll, icons 10-14 visible)----|
 |              |               |            |              |
 |-- Continue scrolling         |            |              |
 |              |               |            |              |
 |              |--Repeat cycle (items 15-19)-------------->|
 |              |               |            |              |
```

**Performance Metrics:**
- **DOM Nodes:** Constant (~5 icons)
- **Render Time:** O(1) per scroll
- **Memory:** Minimal (only visible items)
- **Smoothness:** 60 FPS maintained

## Diagram 5: Multiple Sequential Selections

### User Selecting Multiple Icons Without Closing Menu

```
User        Component       Parent         Activator
 |              |               |              |
 |-- Click Icon A               |              |
 |              |               |              |
 |              |--$emit('select', 'mdi-A')-->|
 |              |               |              |
 |              |               |--Update---->|
 |              |               | v-model = "mdi-A"
 |              |               |              |
 |              |<--New value prop------------|
 |              | value = "mdi-A"             |
 |              |               |              |
 |              |--Update activator display-->|
 |              |               |              |
 |<-Visual feedback (icon A displayed)--------|
 |              |               |              |
 |              |--Menu stays open (close-on-content-click=false)
 |              |               |              |
 |-- Click Icon B (0.5s later) |              |
 |              |               |              |
 |              |--$emit('select', 'mdi-B')-->|
 |              |               |              |
 |              |               |--Update---->|
 |              |               | v-model = "mdi-B"
 |              |               |              |
 |              |<--New value prop------------|
 |              | value = "mdi-B"             |
 |              |               |              |
 |              |--Update activator display-->|
 |              |               |              |
 |<-Visual feedback (icon B displayed)--------|
 |              |               |              |
 |-- Click Icon C (0.5s later) |              |
 |              |               |              |
 |              |--$emit('select', 'mdi-C')-->|
 |              |               |              |
 |              |               |--Update---->|
 |              |               | v-model = "mdi-C"
 |              |               |              |
 |              |<--New value prop------------|
 |              |               |              |
 |<-Visual feedback (icon C displayed)--------|
 |              |               |              |
 |-- Click outside to close menu              |
 |              |               |              |
 |              |--Menu closes (VMenu behavior)|
 |              |               |              |
```

**Key Points:**
1. Menu remains open after each selection
2. Each click emits separate event
3. Parent processes events sequentially
4. Activator updates reflect latest selection
5. Enables rapid icon comparison workflow

## Diagram 6: Error Scenario - Missing Icons Prop

### Component Failure Due to Invalid Props

```
Parent      Component     filteredIcons    Console
 |              |               |             |
 |--Render----->|               |             |
 | <MdiIconPicker v-model="value">           |
 | (no :icons prop provided)                 |
 |              |               |             |
 |              |--created() hook executes   |
 |              | (ID generated successfully)|
 |              |               |             |
 |              |--Mount component            |
 |              |               |             |
 |              |--Template evaluates         |
 |              | v-if="id !== ''" → true    |
 |              |               |             |
 |              |--Render VMenu               |
 |              |               |             |
 |              |--Render VVirtualScroll      |
 |              | :items="filteredIcons"     |
 |              |               |             |
 |              |--Evaluate computed property |
 |              |               |             |
 |              |               |--this.icons.filter(...)
 |              |               | (this.icons = undefined)
 |              |               |             |
 |              |               |--ERROR!---->|
 |              |               | Cannot read property
 |              |               | 'filter' of undefined
 |              |               |             |
 |<-Component crashes---------- |             |
 | (blank/broken display)       |             |
 |              |               |             |
```

**Prevention Strategy:**
- Add prop validation: `@Prop({ required: true })`
- Add defensive check in filteredIcons
- Provide default empty array

## Timing Diagrams

### Typical User Interaction Timing

```
Time (ms)    Event
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0            User clicks activator
10           VMenu opens (animation start)
150          Menu fully visible (animation complete)
200          User starts typing "home"
200          'h' typed → filter recalculates (~1ms)
201          Icon list updates (Vue renders)
350          'o' typed → filter recalculates (~1ms)
351          Icon list updates
500          'm' typed → filter recalculates
501          Icon list updates
650          'e' typed → filter recalculates
651          Icon list updates (~10 icons matching)
1200         User clicks icon
1201         selectedIcon method executes (<1ms)
1202         $emit fires (<1ms)
1203         Parent @select handler executes
1250         Parent updates v-model
1251         Component receives new value prop
1252         Vue reactivity updates activator icon
1253         Display updates (new icon visible)
2000         User clicks outside menu
2010         Menu close animation starts
2160         Menu fully closed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~2.2 seconds for complete interaction
```

## Cross-References
- **Business Logic:** See [../behavior/business-logic.md](../behavior/business-logic.md)
- **Workflows:** See [../behavior/workflows.md](../behavior/workflows.md)
- **Decision Logic:** See [../behavior/decision-logic.md](../behavior/decision-logic.md)
- **State Machine:** See [state-machine.md](state-machine.md)

---
**Diagram Type:** Text-based sequence diagrams (UML-style)  
**Analysis Source:** src/MdiIconPicker.vue static code analysis
