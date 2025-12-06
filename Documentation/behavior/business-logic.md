# Business Logic and Component Behavior

## Overview
The MdiIconPicker component implements icon search, filtering, and selection logic. This document describes the business rules, algorithms, and behavioral patterns extracted through static code analysis.

## Core Business Logic

### 1. Icon Search and Filtering Algorithm

#### Filtering Logic
**Location:** `src/MdiIconPicker.vue` (line 54-56)  
**Implementation:** Computed property `filteredIcons`

```typescript
get filteredIcons() {
  return this.icons.filter(i => 
    i.name.includes(this.search) || 
    i.aliases.includes(this.search) || 
    i.tags.includes(this.search)
  );
}
```

#### Business Rules
1. **Multi-field Search:** Search query matches across three fields
   - Icon name (e.g., "home", "account")
   - Aliases array (alternative names)
   - Tags array (descriptive categories)

2. **OR Logic:** Icon displayed if search term found in ANY field
   - NOT AND logic (doesn't require match in all fields)
   - More permissive search experience

3. **Substring Matching:** Uses `.includes()` method
   - Partial matches accepted
   - Case-sensitive (no toLowerCase normalization)
   - Examples:
     - Search "acc" matches "account"
     - Search "set" matches "settings"
     - Search "SET" does NOT match "settings" (case-sensitive)

4. **Empty Search:** Empty string returns all icons
   - `"".includes("")` returns true for all
   - Default state shows complete icon list

#### Algorithm Complexity
- **Time Complexity:** O(n × m) where:
  - n = number of icons in dataset
  - m = average length of search term
- **Space Complexity:** O(k) where k = number of matching icons
- **Performance:** Computed property cached, only recalculates on dependency change

#### Edge Cases
1. **No Icons Provided:** 
   - Behavior: filter operates on undefined
   - Result: Runtime error if icons prop not provided
   - Mitigation: Component should validate icons prop

2. **Empty Icons Array:**
   - Behavior: Returns empty array
   - Result: No icons displayed (valid state)

3. **Search with No Matches:**
   - Behavior: Returns empty array
   - Result: Empty virtual scroll list (valid state)

4. **Special Characters in Search:**
   - Behavior: Treated as literal characters
   - No regex escaping or special handling
   - Example: Search "." matches icons with literal dot

5. **Null/Undefined in Icon Object:**
   - Behavior: `.includes()` on null/undefined throws error
   - Risk: Missing name, aliases, or tags fields cause crash
   - Mitigation: Icons should be validated before passing

### 2. Unique Identifier Generation

#### ID Generation Logic
**Location:** `src/MdiIconPicker.vue` (line 42-44)  
**Implementation:** Lifecycle hook `created()`

```typescript
created() {
  this.id = Math.random().toString(36).replace('0.', 'icon-picker' || '');
}
```

#### Business Rules
1. **Timing:** Generated once during component creation
2. **Format:** `'icon-picker' + random_string`
3. **Purpose:** Unique ID for menu attachment point
4. **Scope:** Component instance-specific

#### Algorithm Analysis
```javascript
Math.random()              // Generate 0.xxx number
  .toString(36)            // Convert to base-36 string (0-9, a-z)
  .replace('0.', 'icon-picker' || '')  // Replace '0.' prefix
```

**Example Outputs:**
- `'icon-picker8k3d9s'`
- `'icon-pickerb2x7q1'`
- `'icon-pickera5c8n4'`

#### Edge Cases
1. **Collision Probability:**
   - Extremely low for reasonable component counts
   - base-36 provides ~60 million combinations for 6 chars
   - No collision detection implemented

2. **Empty String Fallback:**
   - `|| ''` fallback never triggered
   - `replace()` always returns string
   - Fallback is redundant code

3. **ID Uniqueness:**
   - Not guaranteed unique across multiple instances
   - Sufficient for typical use cases (< 100 instances)
   - Not suitable for server-side rendering (needs deterministic IDs)

### 3. Icon Selection Workflow

#### Selection Logic
**Location:** `src/MdiIconPicker.vue` (line 46-48)  
**Implementation:** Method `selectedIcon(icon: string)`

```typescript
selectedIcon(icon: string) {
  this.$emit('select', `mdi-${icon}`);
}
```

#### Business Rules
1. **Input Format:** Icon name without 'mdi-' prefix
   - Parameter: `"home"`, `"account"`, etc.
   - Source: `item.name` from filteredIcons array

2. **Output Format:** Icon name WITH 'mdi-' prefix
   - Emitted: `"mdi-home"`, `"mdi-account"`, etc.
   - Reason: Standard Material Design Icon naming convention

3. **Event Emission:** Emits 'select' event to parent
   - Event name: `'select'`
   - Payload: Formatted icon name
   - Parent responsibility: Update v-model or handle selection

4. **No State Change:** Method doesn't update component state
   - Doesn't modify `this.search`
   - Doesn't modify `this.value`
   - Relies on parent to update via v-model

5. **Menu Behavior:** Menu stays open after selection
   - VMenu prop: `:close-on-content-click="false"`
   - User can select multiple icons sequentially
   - User must manually close menu

#### Event Flow
```
User clicks icon
  ↓
@click="selectedIcon(item.name)"
  ↓
Method adds 'mdi-' prefix
  ↓
$emit('select', 'mdi-home')
  ↓
Parent @select handler
  ↓
Parent updates v-model value
  ↓
Component receives new value prop
  ↓
Activator icon updates to display new value
```

### 4. Search Input Update Logic

#### Update Logic
**Location:** `src/MdiIconPicker.vue` (line 50-52)  
**Implementation:** Method `updateSearch(e: string)`

```typescript
updateSearch(e: string) {
  this.search = e;
}
```

#### Business Rules
1. **Input Source:** VTextField @input event
   - Event parameter: Current input value
   - Triggered on every keystroke

2. **State Update:** Assigns directly to `this.search`
   - No validation or sanitization
   - No debouncing or throttling
   - Immediate update triggers filteredIcons recomputation

3. **Reactivity Chain:**
   ```
   User types → @input event → updateSearch(value)
   ↓
   this.search = value
   ↓
   filteredIcons computed property invalidated
   ↓
   Vue recalculates filteredIcons
   ↓
   VVirtualScroll :items updates
   ↓
   Icon list re-renders with filtered results
   ```

4. **Performance Considerations:**
   - No debouncing: Filter runs on every keystroke
   - For small datasets (< 1000 icons): Acceptable
   - For large datasets (> 10000 icons): May cause lag
   - Mitigation: Virtual scrolling reduces render cost

### 5. ID Query Generation

#### Query Logic
**Location:** `src/MdiIconPicker.vue` (line 58-60)  
**Implementation:** Computed property `idQuery`

```typescript
get idQuery() {
  return `#${this.id}`;
}
```

#### Business Rules
1. **Purpose:** Generate CSS selector for VMenu attachment
2. **Format:** `#icon-picker8k3d9s` (ID selector)
3. **Usage:** Passed to VMenu `:attach` prop
4. **Behavior:** Menu attaches to element with matching ID

#### Menu Attachment Pattern
```html
<!-- Activator with generated ID -->
<v-icon :id="id">{{value}}</v-icon>

<!-- Menu attaches to activator -->
<v-menu :attach="idQuery">
  <!-- Menu content -->
</v-menu>
```

**Effect:** Menu positioned relative to activator icon

## Component Lifecycle Behavior

### Creation Phase
**Hook:** `created()`

**Actions:**
1. Generate unique component ID
2. Initialize data properties (search = "", id = "")
3. Props received from parent
4. Computed properties initialized

**State After Creation:**
```javascript
{
  value: props.value || undefined,
  icons: props.icons || undefined,
  search: "",
  id: "icon-picker[random]"
}
```

### Mounting Phase
**No explicit beforeMount or mounted hooks**

**Implicit Behavior:**
1. Template rendered with current state
2. VMenu initially closed
3. Activator icon displays props.value
4. filteredIcons computed (returns all icons if search empty)

### Update Phase
**Reactive Updates:**

1. **Props Change (value):**
   - Activator icon updates display
   - No other side effects

2. **Props Change (icons):**
   - filteredIcons recomputes
   - VVirtualScroll updates list
   - Current search term applied to new icons

3. **Data Change (search):**
   - updateSearch method triggers
   - filteredIcons recomputes
   - VVirtualScroll updates list

4. **User Interaction (icon click):**
   - selectedIcon method triggers
   - Event emitted to parent
   - Parent may update value prop
   - Cycle back to props change

### Destruction Phase
**No explicit beforeDestroy or destroyed hooks**

**Implicit Cleanup:**
- Vue automatically removes event listeners
- Component removed from DOM
- Generated ID becomes available for reuse (no cleanup needed)

## State Management

### Internal State
```typescript
{
  search: string,  // Current search query
  id: string       // Unique component identifier
}
```

**State Characteristics:**
- **Mutable:** Changed by user interactions
- **Local:** Not exposed to parent
- **Transient:** Lost on component destruction

### Props State (External)
```typescript
{
  value: string,        // Current icon selection
  icons: Array<Object>  // Available icons dataset
}
```

**State Characteristics:**
- **Immutable:** Component shouldn't modify
- **Controlled:** Managed by parent
- **Persistent:** Maintained by parent

### Computed State (Derived)
```typescript
{
  filteredIcons: Array<Object>,  // Filtered icon list
  idQuery: string                // CSS selector
}
```

**State Characteristics:**
- **Derived:** Calculated from other state
- **Cached:** Recalculates only on dependency change
- **Read-only:** Cannot be directly assigned

## Event Handling Patterns

### User Interaction Events

#### 1. Menu Activation
**Trigger:** Click on activator icon  
**Handler:** Vuetify VMenu internal logic  
**Effect:** Menu opens, displays search and icons

#### 2. Search Input
**Trigger:** User types in search field  
**Handler:** `@input="updateSearch"`  
**Effect:** Updates search state, triggers filtering

#### 3. Icon Selection
**Trigger:** Click on icon in list  
**Handler:** `@click="selectedIcon(item.name)"`  
**Effect:** Emits select event with formatted icon name

#### 4. Search Field Click
**Trigger:** Click inside search field  
**Handler:** `v-on:click.stop`  
**Effect:** Prevents event propagation, keeps menu open

### Event Propagation Control

**Stop Propagation on Search Field:**
```html
<v-text-field v-on:click.stop />
```

**Reason:** Prevent VMenu from closing when interacting with search field

**Effect:** 
- Click events on search field don't bubble
- Menu remains open during typing
- User can interact with search without reopening menu

## Business Rules Summary

### Icon Display Rules
1. Show all icons when search is empty
2. Filter icons by substring match in name, aliases, or tags
3. Use OR logic (match any field, not all)
4. Apply case-sensitive matching
5. Display icons in virtual scroll for performance

### Icon Selection Rules
1. Allow icon selection while menu is open
2. Keep menu open after selection (user can select multiple)
3. Format icon name with 'mdi-' prefix before emitting
4. Emit selection event to parent (don't update internal state)
5. Rely on parent to update value prop via v-model

### Search Behavior Rules
1. Update filter on every keystroke (no debouncing)
2. Accept any string input (no validation)
3. Treat empty string as "show all"
4. Maintain search state while menu is open
5. Clear search behavior undefined (no explicit clear button)

### Component Initialization Rules
1. Generate unique ID on creation
2. Use random base-36 string for uniqueness
3. Prefix ID with 'icon-picker'
4. Initialize search to empty string
5. Accept undefined props (no required validation)

## Error Handling

### Explicit Error Handling
**None present in the code**

### Implicit Error Scenarios

#### 1. Missing Icons Prop
**Scenario:** Component used without :icons prop  
**Behavior:** `this.icons` is undefined  
**Error:** `Cannot read property 'filter' of undefined`  
**Impact:** Component crashes, cannot render

#### 2. Malformed Icon Objects
**Scenario:** Icon object missing name, aliases, or tags  
**Behavior:** `.includes()` called on undefined  
**Error:** `Cannot read property 'includes' of undefined`  
**Impact:** Filter crashes, no icons displayed

#### 3. Non-Array Icons Prop
**Scenario:** :icons="'not an array'"  
**Behavior:** `.filter()` called on non-array  
**Error:** `'not an array'.filter is not a function`  
**Impact:** Component crashes

#### 4. Duplicate IDs (Multiple Instances)
**Scenario:** Very rare collision in ID generation  
**Behavior:** Menu attaches to wrong component  
**Error:** No JavaScript error, visual bug  
**Impact:** Menu positioning incorrect

### Recommended Validations
```typescript
// Add prop validators
@Prop({ required: true, type: Array })
icons: IconObject[]

// Add safety check in computed
get filteredIcons() {
  if (!Array.isArray(this.icons)) return [];
  return this.icons.filter(i => 
    (i.name || '').includes(this.search) || 
    (i.aliases || []).includes(this.search) || 
    (i.tags || []).includes(this.search)
  );
}
```

## Performance Characteristics

### Search Performance
- **Best Case:** O(1) - Empty search returns full array reference
- **Average Case:** O(n × m) - Linear scan with substring checks
- **Worst Case:** O(n × m) - All icons checked, none match

### Virtual Scrolling Performance
- **Rendered Items:** ~5 icons visible (235px ÷ 50px per item)
- **Total Items:** Potentially thousands (full MDI set ~7000 icons)
- **Performance Gain:** 99%+ reduction in rendered DOM nodes
- **Memory Impact:** Only visible items + bench in memory

### Computed Property Caching
- **Caching:** Vue caches filteredIcons result
- **Invalidation:** Only recalculates when this.icons or this.search changes
- **Benefit:** Multiple template accesses use cached value

## Cross-References
- **Component Structure:** See [../reference/program-structure.md](../reference/program-structure.md)
- **Data Models:** See [../reference/data-models.md](../reference/data-models.md)
- **User Workflows:** See [workflows.md](workflows.md)
- **Decision Logic:** See [decision-logic.md](decision-logic.md)
- **Behavioral Diagrams:** See [../diagrams/behavioral/](../diagrams/behavioral/)

---
**Analysis Source:** src/MdiIconPicker.vue  
**Analysis Type:** Static code analysis and business logic extraction
