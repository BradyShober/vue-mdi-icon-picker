# User Workflows and Interaction Patterns

## Overview
This document describes the user journeys and interaction patterns for the MdiIconPicker component, extracted through static analysis of the component's template and behavioral logic.

## Primary User Workflows

### Workflow 1: Icon Selection (Basic)

#### User Journey
```
1. User views page with icon picker component
2. User clicks on the current icon (activator)
3. Menu opens showing search field and icon grid
4. User browses available icons (scrolls if needed)
5. User clicks desired icon
6. Icon selection emitted to parent component
7. Current icon updates to show selection
8. Menu remains open (user can select another or close manually)
```

#### User Actions
- **Action 1:** Click activator icon
- **Action 2:** Scroll through icon list
- **Action 3:** Click target icon
- **Action 4:** (Optional) Close menu by clicking outside

#### System Responses
- **Response 1:** Open dropdown menu
- **Response 2:** Scroll virtual list, render visible icons
- **Response 3:** Emit select event, update activator display
- **Response 4:** Close menu

#### State Changes
```
Initial State:
- Menu: Closed
- Search: ""
- Displayed Icon: props.value

After Click Activator:
- Menu: Open
- Search: ""
- Icon List: All icons (filtered by empty search)

After Select Icon:
- Menu: Open (stays open)
- Event: Emitted to parent
- Parent updates props.value
- Displayed Icon: New selection
```

#### Success Criteria
- Icon successfully selected
- Parent receives select event with correct icon name
- Activator updates to show new icon

### Workflow 2: Icon Search and Selection

#### User Journey
```
1. User clicks activator icon to open menu
2. Menu opens with search field focused (Vuetify default)
3. User types search term in text field
4. Icon list filters in real-time as user types
5. User sees matching icons based on name/aliases/tags
6. User clicks desired icon from filtered results
7. Icon selection emitted to parent
8. Activator updates to show selection
```

#### Detailed Steps

**Step 1: Open Menu**
- **User Action:** Click on activator icon
- **Trigger:** VMenu activator click event
- **Effect:** Menu overlay appears below icon
- **Menu State:** Open, showing search field and full icon list

**Step 2: Enter Search Query**
- **User Action:** Type "home" in search field
- **Trigger:** VTextField @input event fires per keystroke
- **Calls:** updateSearch("h"), updateSearch("ho"), updateSearch("hom"), updateSearch("home")
- **Effect:** this.search updated to "home"

**Step 3: View Filtered Results**
- **Trigger:** this.search change invalidates filteredIcons
- **Computation:** filteredIcons recomputes
- **Filter Logic:** 
  ```
  icons.filter(i => 
    "home-outline".includes("home") → true ✓
    "account".includes("home") → false ✗
    ["house"].includes("home") → false ✗
    ["building", "house"].includes("home") → false ✗
  )
  ```
- **Result:** Only icons with "home" in name, aliases, or tags shown
- **Display:** VVirtualScroll updates to show filtered subset

**Step 4: Select from Results**
- **User Action:** Click on "home-outline" icon
- **Trigger:** @click="selectedIcon('home-outline')"
- **Method Call:** selectedIcon("home-outline")
- **Event Emission:** $emit('select', 'mdi-home-outline')
- **Parent Handling:** Receives event, updates v-model
- **Display Update:** Activator icon shows 'mdi-home-outline'

#### Search Behavior Examples

**Example 1: Exact Name Match**
```
User types: "account"
Matches: 
  - name: "account" ✓
  - name: "account-circle" ✓
  - name: "account-settings" ✓
```

**Example 2: Alias Match**
```
User types: "user"
Icon with aliases: ["user", "profile"]
Matches: Icon shown because "user" in aliases ✓
```

**Example 3: Tag Match**
```
User types: "building"
Icon with tags: ["building", "architecture"]
Matches: Icon shown because "building" in tags ✓
```

**Example 4: No Matches**
```
User types: "xyz123"
No icons contain "xyz123" in name, aliases, or tags
Result: Empty list displayed (valid state)
```

**Example 5: Clear Search (Backspace)**
```
User deletes all characters
Search becomes: ""
Result: All icons displayed (empty string matches all)
```

#### State Changes During Search
```
Before Search:
- search: ""
- filteredIcons: [all 7000+ icons]
- Rendered: ~5 visible icons (virtual scroll)

After Typing "home":
- search: "home"
- filteredIcons: [~100 icons matching "home"]
- Rendered: ~5 visible icons from filtered set

After Selection:
- search: "home" (unchanged)
- filteredIcons: [~100 icons] (unchanged)
- Menu: Still open (user can select another)
```

### Workflow 3: Browse Large Icon Set with Virtual Scrolling

#### User Journey
```
1. User opens icon picker menu
2. User sees initial ~5 icons rendered
3. User scrolls down through icon list
4. Virtual scroll dynamically renders visible icons
5. User continues scrolling to browse thousands of icons
6. Performance remains smooth due to virtual scrolling
7. User finds desired icon and selects it
```

#### Virtual Scroll Behavior

**Configuration:**
- **Item Height:** 50px (fixed per icon)
- **Container Height:** 235px
- **Bench:** 0 (no extra rendering)
- **Visible Items:** ~5 icons (235 ÷ 50 = 4.7)

**Rendering Pattern:**
```
Total Icons: 7000 (full MDI set)
Rendered in DOM: 5 icons only
Memory Savings: 99.93% fewer DOM nodes

Scroll Position 0px:
  Rendered: Icons 0-4

Scroll Position 500px:
  Rendered: Icons 10-14

Scroll Position 1000px:
  Rendered: Icons 20-24
```

**Performance Characteristics:**
- **Initial Render:** Fast (only 5 icons)
- **Scroll Performance:** Smooth (constant 5 icons)
- **Memory Usage:** Minimal (5 × icon size)
- **Search Impact:** Linear on data, not rendering

### Workflow 4: Multiple Sequential Selections

#### User Journey
```
1. User opens menu
2. User selects Icon A
3. Menu stays open (close-on-content-click="false")
4. User selects Icon B
5. Menu stays open
6. User selects Icon C
7. Menu stays open
8. User clicks outside menu or presses Esc to close
```

#### Use Case
- **Scenario:** User testing different icon options
- **Benefit:** No need to reopen menu between selections
- **Behavior:** Each selection emits event, parent decides what to do

#### State Flow
```
Selection 1:
  Click "home" → Emit 'mdi-home' → Parent updates value → Activator shows 'mdi-home'

Selection 2:
  Click "account" → Emit 'mdi-account' → Parent updates value → Activator shows 'mdi-account'

Selection 3:
  Click "settings" → Emit 'mdi-settings' → Parent updates value → Activator shows 'mdi-settings'

Final State:
  Activator displays 'mdi-settings' (last selection)
  Menu remains open until user closes
```

## Interaction Patterns

### Pattern 1: Click-to-Open Menu

**Element:** Activator VIcon  
**Interaction:** Click  
**Trigger:** Vuetify VMenu activator slot  
**Behavior:** Menu opens below icon

**Template:**
```vue
<template v-slot:activator="{ on, attrs }">
  <v-icon v-bind="attrs" v-on="on">{{value}}</v-icon>
</template>
```

**Event Flow:**
```
User Click
  ↓
Vuetify activator handlers (v-on="on")
  ↓
VMenu internal state change
  ↓
Menu overlay rendered
  ↓
Menu positioned below activator (offset-y)
```

### Pattern 2: Real-time Search Filtering

**Element:** VTextField search input  
**Interaction:** Keyboard input  
**Trigger:** @input event per keystroke  
**Behavior:** Immediate filter update

**Event Flow:**
```
Keystroke
  ↓
@input event with current value
  ↓
updateSearch(value) method
  ↓
this.search = value
  ↓
Vue reactivity triggers
  ↓
filteredIcons computed recomputes
  ↓
VVirtualScroll :items binding updates
  ↓
Visible icons re-render
```

**Timing:**
- **Delay:** None (no debouncing)
- **Per Character:** Filter recalculates
- **Visual Feedback:** Immediate (sub-frame)

### Pattern 3: Virtual Scroll Navigation

**Element:** VVirtualScroll component  
**Interaction:** Mouse wheel or trackpad scroll  
**Trigger:** Scroll event on container  
**Behavior:** Dynamic icon rendering

**Rendering Behavior:**
```
Scroll Start (position 0):
  - Render icons 0-4
  - Total DOM nodes: 5

Scroll 250px:
  - Render icons 5-9
  - Previous icons 0-4 removed from DOM
  - Total DOM nodes: 5 (constant)

Scroll 500px:
  - Render icons 10-14
  - Previous icons 5-9 removed from DOM
  - Total DOM nodes: 5 (constant)
```

### Pattern 4: Icon Click Selection

**Element:** VIcon in virtual scroll list  
**Interaction:** Click  
**Trigger:** @click handler  
**Behavior:** Emit selection event

**Event Flow:**
```
User Click on Icon
  ↓
@click="selectedIcon(item.name)"
  ↓
selectedIcon method executes
  ↓
String formatting: 'mdi-' + item.name
  ↓
$emit('select', formattedName)
  ↓
Event bubbles to parent
  ↓
Parent @select handler
  ↓
Parent updates data (v-model)
  ↓
Props flow back to component
  ↓
Activator icon updates
```

### Pattern 5: Search Field Click Prevention

**Element:** VTextField  
**Interaction:** Click inside field  
**Trigger:** v-on:click.stop  
**Behavior:** Prevent menu close

**Purpose:**
- Without .stop: Click propagates to VMenu, menu closes
- With .stop: Click contained, menu stays open
- User can interact with search without reopening menu

**Event Flow:**
```
Without .stop modifier:
  Click TextField → Event bubbles → VMenu receives click → Menu closes

With .stop modifier:
  Click TextField → Event stops → VMenu doesn't receive → Menu stays open
```

## User Experience Flows

### UX Flow 1: First-Time User

```
1. User sees unknown icon (mdi-help or similar)
   → Curiosity: "What icon is this? Can I change it?"

2. User hovers over icon
   → No visual feedback (no hover state defined)

3. User clicks icon experimentally
   → Menu opens with search + icons
   → Discovery: "Ah, this is an icon picker!"

4. User sees search field
   → Affordance clear: Can search for icons

5. User types "home"
   → Icons filter immediately
   → Satisfaction: "Fast and responsive!"

6. User clicks desired icon
   → Icon updates in activator
   → Success: "I changed the icon!"

7. Menu stays open
   → Confusion possible: "Do I need to close this?"
   → Or convenience: "I can try another icon!"
```

### UX Flow 2: Power User (Keyboard-Heavy)

```
1. User clicks activator (mouse)
2. Search field automatically focused (Vuetify default)
3. User types search term immediately (no mouse needed)
4. Results filter in real-time
5. User must use mouse to select icon (no keyboard nav)
   → Limitation: No arrow key navigation
   → Limitation: No Enter key to select first result
```

### UX Flow 3: Mobile User

```
1. User taps icon (touch)
   → Menu opens

2. Virtual keyboard appears for search field
   → Screen space reduced

3. User types search term
   → Keyboard autocorrect may interfere
   → Case-sensitive search may frustrate ("Home" vs "home")

4. Icon list visible below keyboard
   → Virtual scroll still works with touch

5. User taps desired icon
   → Selection works (touch event = click)

6. Menu stays open
   → User must tap outside to close
   → Keyboard may still be visible
```

## Edge Case Workflows

### Edge Case 1: Empty Icons Array

**Scenario:** Component rendered with `:icons="[]"`

**User Experience:**
1. User clicks activator
2. Menu opens showing search field
3. No icons displayed (empty list)
4. User types in search
5. Still no icons (filtering empty array)
6. User confused (no feedback about empty state)

**Improvement Needed:** Empty state message

### Edge Case 2: Very Large Dataset (10,000+ Icons)

**Scenario:** Component with entire icon library

**User Experience:**
1. User opens menu
2. Virtual scroll renders quickly (only 5 icons)
3. User scrolls smoothly (virtual scroll optimization)
4. User types search
5. Filter may lag slightly on each keystroke (O(n) algorithm)
6. Results update within frame (acceptable)

**Performance:** Virtual scroll critical for usability

### Edge Case 3: Rapid Selection Changes

**Scenario:** User clicks multiple icons quickly

**Behavior:**
1. Click Icon A → Emit event → Parent updates → Activator updates
2. Click Icon B → Emit event → Parent updates → Activator updates
3. Click Icon C → Emit event → Parent updates → Activator updates

**Result:** All events emitted, parent processes sequentially

**Potential Issue:** If parent has slow @select handler, updates may queue

### Edge Case 4: Search with No Results

**Scenario:** User types "xyz123" (no matches)

**User Experience:**
1. User types search term
2. Icon list becomes empty
3. Blank white space displayed
4. User unsure if broken or no results
5. User backspaces to see icons again

**Improvement Needed:** "No results found" message

## Workflow State Diagrams

### Menu State Machine

```
[Closed]
   │
   │ User clicks activator
   ↓
[Opening]
   │
   │ Animation complete
   ↓
[Open - Showing All Icons]
   │
   │ User types search
   ↓
[Open - Filtered Results]
   │
   │ User selects icon
   ↓
[Open - Selection Emitted]
   │
   │ Still open (close-on-content-click="false")
   ├─→ User selects another → [Open - Selection Emitted]
   │
   │ User clicks outside or presses Esc
   ↓
[Closing]
   │
   │ Animation complete
   ↓
[Closed]
```

### Search State Machine

```
[Empty Search]
   │
   │ User types first character
   ↓
[Active Search - Updating]
   │
   │ Filter computation completes
   ↓
[Active Search - Results Displayed]
   │
   ├─→ User types more → [Active Search - Updating]
   │
   │ User backspaces to empty
   ↓
[Empty Search]
```

### Selection State Machine

```
[No Selection]
   │
   │ Component mounted with props.value
   ↓
[Displaying Current Icon]
   │
   │ User opens menu and clicks icon
   ↓
[Emitting Selection]
   │
   │ Parent receives event
   ↓
[Awaiting Parent Update]
   │
   │ Parent updates props.value
   ↓
[Displaying New Icon]
   │
   │ User selects another icon
   ↓
[Emitting Selection] → (cycle continues)
```

## Accessibility Considerations

### Keyboard Navigation
**Current State:**
- ✗ No keyboard navigation for icon list
- ✗ No arrow key support
- ✗ No Enter key to select
- ✓ Search field accessible via Tab
- ✓ Esc closes menu (Vuetify default)

**Improvement Opportunities:**
- Add arrow key navigation
- Add Enter to select first result
- Add Tab to cycle through visible icons

### Screen Reader Support
**Current State:**
- ✓ VIcon elements have ARIA support (Vuetify)
- ✗ No ARIA labels for icon meanings
- ✗ No live region for search results
- ✗ No announcement of selection

**Improvement Opportunities:**
- Add aria-label to icons with icon names
- Add aria-live region for filtered results count
- Announce selection to screen readers

### Visual Indicators
**Current State:**
- ✓ Clear visual separation (menu overlay)
- ✓ Icons displayed with Material Design style
- ✗ No hover state on icons
- ✗ No focus indicators on icons

## Performance Impact on User Experience

### Instantaneous Actions (< 100ms)
- Opening menu
- Closing menu
- Clicking icon (event emission)
- Search field typing (state update)

### Fast Actions (< 500ms)
- Filtering icons (small datasets < 1000)
- Virtual scroll rendering
- Icon display updates

### Noticeable Actions (> 500ms)
- None in typical usage
- Possible: Filtering 10,000+ icons per keystroke

## Cross-References
- **Business Logic:** See [business-logic.md](business-logic.md) for algorithm details
- **Decision Logic:** See [decision-logic.md](decision-logic.md) for filtering rules
- **Behavioral Diagrams:** See [../diagrams/behavioral/](../diagrams/behavioral/) for sequence diagrams
- **Component Interface:** See [../reference/interfaces.md](../reference/interfaces.md) for API details

---
**Analysis Source:** src/MdiIconPicker.vue template and script  
**Analysis Type:** Static analysis of user interaction patterns
