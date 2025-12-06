# Decision Logic and Conditional Patterns

## Overview
This document details the decision trees, conditional logic, and branching patterns in the MdiIconPicker component, extracted through static code analysis.

## Icon Filtering Decision Tree

### Primary Decision: Icon Inclusion in Results

**Decision Point:** Should icon be included in filtered results?  
**Location:** `src/MdiIconPicker.vue` (line 54-56)  
**Evaluated For:** Each icon in the icons array

```
For each icon in icons array:
├─ Does icon.name include search term?
│  ├─ YES → Include icon in results ✓
│  └─ NO → Continue to next check
│     │
│     ├─ Does icon.aliases include search term?
│     │  ├─ YES → Include icon in results ✓
│     │  └─ NO → Continue to next check
│     │     │
│     │     ├─ Does icon.tags include search term?
│     │     │  ├─ YES → Include icon in results ✓
│     │     │  └─ NO → Exclude icon from results ✗
```

### Decision Logic Breakdown

#### Condition 1: Name Match
```typescript
i.name.includes(this.search)
```

**Decision Criteria:**
- **Input:** icon.name (string), this.search (string)
- **Operation:** Substring check
- **Result:** Boolean (true/false)

**Truth Table:**
| icon.name | this.search | Result | Explanation |
|-----------|-------------|--------|-------------|
| "home" | "home" | TRUE | Exact match |
| "home" | "hom" | TRUE | Partial match |
| "home" | "ome" | TRUE | Partial match (any position) |
| "home" | "" | TRUE | Empty string matches all |
| "home" | "house" | FALSE | No match |
| "home" | "Home" | FALSE | Case mismatch |

**Edge Cases:**
- Empty search: Always true (returns all icons)
- Case sensitivity: "HOME" ≠ "home"
- Special chars: Treated literally, not as regex

#### Condition 2: Aliases Match
```typescript
i.aliases.includes(this.search)
```

**Decision Criteria:**
- **Input:** icon.aliases (array of strings), this.search (string)
- **Operation:** Array membership check
- **Result:** Boolean (true/false)

**Important:** This is EXACT match, not substring!

**Truth Table:**
| icon.aliases | this.search | Result | Explanation |
|--------------|-------------|--------|-------------|
| ["user", "profile"] | "user" | TRUE | Exact match in array |
| ["user", "profile"] | "profile" | TRUE | Exact match in array |
| ["user", "profile"] | "use" | FALSE | Substring doesn't match! |
| ["user", "profile"] | "" | FALSE | Empty string not in array |
| [] | "anything" | FALSE | Empty array |

**Critical Distinction:** Unlike name matching (substring), aliases uses array.includes() which requires EXACT match of a complete array element.

**Potential Bug:** Inconsistent behavior between name and aliases matching.

#### Condition 3: Tags Match
```typescript
i.tags.includes(this.search)
```

**Decision Criteria:**
- **Input:** icon.tags (array of strings), this.search (string)
- **Operation:** Array membership check
- **Result:** Boolean (true/false)

**Same behavior as aliases:** Exact match required, not substring.

**Truth Table:**
| icon.tags | this.search | Result | Explanation |
|-----------|-------------|--------|-------------|
| ["building", "home"] | "building" | TRUE | Exact match |
| ["building", "home"] | "build" | FALSE | Substring doesn't match |
| ["building", "home"] | "home" | TRUE | Exact match |
| [] | "anything" | FALSE | Empty array |

### Logical Operator: OR

**Combination Logic:**
```typescript
condition1 || condition2 || condition3
```

**Truth Table:**
| Name Match | Aliases Match | Tags Match | Include Icon |
|------------|---------------|------------|--------------|
| TRUE | any | any | TRUE |
| FALSE | TRUE | any | TRUE |
| FALSE | FALSE | TRUE | TRUE |
| FALSE | FALSE | FALSE | FALSE |

**Key Insight:** Icon included if ANY condition is true (not all).

### Complete Example: Icon Filtering

**Icon Object:**
```javascript
{
  name: "home-outline",
  aliases: ["house", "residence"],
  tags: ["building", "place"]
}
```

**Test Scenarios:**

**Scenario 1: Search "home"**
```
name.includes("home") → "home-outline".includes("home") → TRUE ✓
Result: Icon included (short-circuit, don't check aliases/tags)
```

**Scenario 2: Search "house"**
```
name.includes("house") → "home-outline".includes("house") → FALSE
aliases.includes("house") → ["house", "residence"].includes("house") → TRUE ✓
Result: Icon included
```

**Scenario 3: Search "building"**
```
name.includes("building") → FALSE
aliases.includes("building") → FALSE
tags.includes("building") → ["building", "place"].includes("building") → TRUE ✓
Result: Icon included
```

**Scenario 4: Search "hous" (partial of "house")**
```
name.includes("hous") → FALSE
aliases.includes("hous") → FALSE (not exact match!)
tags.includes("hous") → FALSE
Result: Icon EXCLUDED ✗
```
**Inconsistency:** "hom" matches "home-outline" but "hous" doesn't match "house" alias.

**Scenario 5: Search "" (empty)**
```
name.includes("") → TRUE ✓ (empty string substring of any string)
Result: Icon included
```

## Component Rendering Decisions

### Decision: Should Component Render?

**Location:** Template (line 2)  
**Condition:** `v-if="id !== ''"`

```
Is id not equal to empty string?
├─ YES (id = "icon-picker8k3d9s") → Render VMenu and all contents
└─ NO (id = "") → Render nothing, component invisible
```

**Decision Purpose:** Ensure component only renders after ID generation in created() hook.

**State Flow:**
```
Component Creation:
  id = "" (initial data)
  v-if="id !== ''" → false → No render

created() Hook Executes:
  id = "icon-picker8k3d9s"
  Vue reactivity triggers re-render
  v-if="id !== ''" → true → Render VMenu

Component Mounted:
  Full component visible
```

**Why This Pattern?**
- Ensures idQuery computed property has valid value
- Prevents VMenu :attach from receiving undefined selector
- Guards against edge case race conditions

**Edge Case:** What if created() hook fails or ID generation errors?
- Component never renders
- No error displayed to user
- Silent failure (not ideal UX)

### Decision: Menu Close Behavior

**Location:** Template (line 2)  
**Condition:** `:close-on-content-click="false"`

```
User clicks inside menu content?
├─ close-on-content-click = true → Close menu
└─ close-on-content-click = false → Keep menu open
```

**Decision Impact:**
- **Value: true** → Click icon = select + close (single selection mode)
- **Value: false** → Click icon = select, menu stays open (multi-selection mode)

**Current Behavior:** Multi-selection mode enabled.

**Use Cases:**
- User comparing different icon options
- User selecting icons for multiple fields sequentially
- User browsing without committing immediately

### Decision: Menu Positioning

**Location:** Template (line 2)  
**Condition:** `offset-y`

```
offset-y present?
├─ YES → Position menu below activator (Y-axis offset)
└─ NO → Position menu at activator location (overlay)
```

**Current Behavior:** Menu appears below icon with vertical offset.

### Decision: Search Field Click Propagation

**Location:** Template (line 7)  
**Condition:** `v-on:click.stop`

```
User clicks search field?
├─ Without .stop modifier → Event bubbles → VMenu closes
└─ With .stop modifier → Event stops → VMenu stays open
```

**Decision Purpose:** Allow search interaction without closing menu.

## Event Handling Decisions

### Decision: When to Update Search State?

**Location:** `updateSearch` method (line 50-52)  
**Trigger:** @input event from VTextField

```
VTextField emits @input event?
├─ YES → Call updateSearch(newValue)
│  └─ Update this.search = newValue
└─ NO → No update (search remains same)
```

**Decision Characteristics:**
- **Frequency:** Every keystroke (no debouncing)
- **Validation:** None (accept any string)
- **Side Effects:** Triggers filteredIcons recomputation

**Alternative Patterns Not Used:**
- Debouncing (wait for user to stop typing)
- Validation (reject invalid characters)
- Sanitization (normalize case, trim whitespace)

### Decision: When to Emit Selection Event?

**Location:** `selectedIcon` method (line 46-48)  
**Trigger:** User clicks icon

```
User clicks icon in list?
├─ YES → Call selectedIcon(iconName)
│  └─ Emit 'select' event with formatted name
└─ NO → No event emission
```

**Decision Characteristics:**
- **Immediate:** No confirmation dialog
- **Format:** Always add 'mdi-' prefix
- **State:** Don't update internal state, emit to parent

### Decision: Icon Name Formatting

**Location:** `selectedIcon` method (line 48)  
**Logic:** `` `mdi-${icon}` ``

```
Icon parameter received?
├─ Input: "home" → Output: "mdi-home"
├─ Input: "account" → Output: "mdi-account"
└─ Input: "mdi-already" → Output: "mdi-mdi-already" (double prefix!)
```

**Assumption:** Icon parameter never includes 'mdi-' prefix.

**Potential Issue:** If icon.name already has 'mdi-' prefix:
- Result: Double prefix "mdi-mdi-home"
- Broken icon reference
- No validation to prevent this

## Computed Property Decisions

### Decision: Recompute filteredIcons?

**Location:** Vue reactivity system  
**Dependencies:** this.icons, this.search

```
Did dependency change?
├─ this.icons changed?
│  ├─ YES → Invalidate cache, recompute
│  └─ NO → Check next dependency
│
├─ this.search changed?
│  ├─ YES → Invalidate cache, recompute
│  └─ NO → Return cached value
```

**Recomputation Triggers:**
1. Parent changes :icons prop
2. User types in search field (updateSearch called)
3. Component receives new icons prop

**No Recomputation:**
- Accessing filteredIcons multiple times without changes
- Other component state changes (id, value)
- Template re-renders without dependency changes

### Decision: Recompute idQuery?

**Location:** Vue reactivity system  
**Dependencies:** this.id

```
Did this.id change?
├─ YES → Invalidate cache, recompute (rare, only in created())
└─ NO → Return cached value "#icon-picker8k3d9s"
```

**Typical Pattern:**
- Computed once after created() hook
- Never recomputed again (id doesn't change)
- Cached value used for all subsequent accesses

## Template Conditional Rendering

### Conditional: Menu Existence

```vue
<v-menu v-if="id !== ''">
```

**Decision Tree:**
```
Evaluate: id !== ''
├─ TRUE → Render VMenu element and all children
│  └─ Creates: Menu, search field, virtual scroll, icons
│
└─ FALSE → Render nothing
   └─ Component invisible, no DOM nodes created
```

### Conditional: Icon Display

**No explicit conditionals on icons**

**Implicit Conditional:** Virtual scroll item template

```vue
<template v-slot:default="{ item }">
  <v-icon>mdi-{{item.name}}</v-icon>
</template>
```

**Decision:** Render for each item in filteredIcons array

```
For each item in filteredIcons:
├─ Render VIcon with item.name
└─ Virtual scroll: Only render if in viewport
```

## Data Flow Decision Points

### Decision Point 1: Accept Props or Use Defaults?

```
Component instantiation
├─ :value provided? → Use provided value
├─ :value not provided? → Use undefined
├─ :icons provided? → Use provided array
└─ :icons not provided? → Use undefined (will cause errors!)
```

**Current Implementation:** No default values, no prop validation.

**Risk:** Component breaks if props not provided.

### Decision Point 2: Update Local State or Emit Event?

```
User action occurred
├─ Search input? → Update local state (this.search)
└─ Icon selection? → Emit event (don't update local state)
```

**Pattern:** 
- **Local state** for internal UI (search)
- **Events** for external state (selection)

### Decision Point 3: Trust Parent or Validate?

```
Props received from parent
├─ Validate structure? → NO (current implementation)
├─ Validate types? → NO (TypeScript types only at compile time)
└─ Handle invalid data? → NO (will crash)
```

**Current Approach:** Trust parent to provide valid data.

**Risk:** Runtime errors if parent provides invalid props.

## Boolean Logic Summary

### Primary Filter Logic (OR Operation)
```
Include Icon = (Name Match) OR (Aliases Match) OR (Tags Match)
```

**JavaScript:**
```typescript
icon.name.includes(search) || 
icon.aliases.includes(search) || 
icon.tags.includes(search)
```

**Boolean Algebra:**
```
Result = A ∨ B ∨ C
where:
  A = name contains substring
  B = aliases contains exact element
  C = tags contains exact element
```

### Component Visibility Logic (AND Operation)
```
Render Component = (id is not empty)
```

**JavaScript:**
```vue
v-if="id !== ''"
```

**Boolean Algebra:**
```
Render = (id ≠ "")
```

### Menu Attachment Logic (AND Operation)
```
Menu Attach Success = (ID exists) AND (Element with ID exists in DOM)
```

**Implicit conditions:**
- ID generated in created()
- Activator element rendered with :id
- VMenu :attach receives valid selector

## Decision Pattern: Short-Circuit Evaluation

### Filter Logic Short-Circuit

**Code:**
```typescript
i.name.includes(this.search) || i.aliases.includes(this.search) || i.tags.includes(this.search)
```

**Evaluation Order:**
```
1. Check name.includes()
   ├─ TRUE → Return true immediately, skip aliases and tags checks
   └─ FALSE → Continue to step 2

2. Check aliases.includes()
   ├─ TRUE → Return true immediately, skip tags check
   └─ FALSE → Continue to step 3

3. Check tags.includes()
   ├─ TRUE → Return true
   └─ FALSE → Return false
```

**Performance Benefit:**
- If name matches, 66% of checks avoided
- If aliases match, 33% of checks avoided
- Common case (name match) is fastest

## Validation and Error Handling Decisions

### Current Approach: No Explicit Validation

**Decision:** Trust input data, handle errors at runtime (if at all)

**Consequences:**
```
Invalid icons prop?
├─ undefined → Crash when calling .filter()
├─ null → Crash when calling .filter()
├─ not an array → Crash when calling .filter()
├─ array with malformed objects → Crash when accessing properties
└─ valid array → Works correctly
```

### Recommended Decision Logic

**Proposed validation:**
```typescript
get filteredIcons() {
  // Decision: Is icons valid?
  if (!Array.isArray(this.icons)) {
    return []; // Safe default
  }
  
  return this.icons.filter(i => {
    // Decision: Does icon have required properties?
    if (!i || typeof i !== 'object') {
      return false; // Skip invalid icon
    }
    
    // Decision: Include icon in results?
    return (
      (i.name || '').includes(this.search) ||
      (i.aliases || []).includes(this.search) ||
      (i.tags || []).includes(this.search)
    );
  });
}
```

## Cross-References
- **Business Logic:** See [business-logic.md](business-logic.md) for algorithm implementation
- **Workflows:** See [workflows.md](workflows.md) for user interaction patterns
- **Data Models:** See [../reference/data-models.md](../reference/data-models.md) for data structures
- **Behavioral Diagrams:** See [../diagrams/behavioral/](../diagrams/behavioral/) for visual decision flows

---
**Analysis Source:** src/MdiIconPicker.vue  
**Analysis Type:** Static code analysis of conditional logic and decision trees
