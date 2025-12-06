# Test Specifications

## Overview
Comprehensive test cases for validating MdiIconPicker functionality after migration to Vue 3.

## Props Testing

### Test 1.1: value Prop (becomes modelValue in Vue 3)
**Test:** Component receives and displays icon value  
**Input:** `value="mdi-home"`  
**Expected:** Activator icon displays "mdi-home"

### Test 1.2: icons Prop
**Test:** Component receives icon dataset  
**Input:** `icons=[{name: "home", aliases: [], tags: []}]`  
**Expected:** Icons available for selection

### Test 1.3: Missing Props
**Test:** Component handles undefined props gracefully  
**Input:** No props provided  
**Expected:** No crash, empty state or validation error

## Event Testing

### Test 2.1: select Event (becomes update:modelValue in Vue 3)
**Test:** Component emits event on icon selection  
**Action:** Click icon "account"  
**Expected:** Event emitted with payload "mdi-account"

### Test 2.2: Event Payload Format
**Test:** Event payload includes 'mdi-' prefix  
**Action:** Select icon with name "home"  
**Expected:** Payload is "mdi-home" (not "home")

## v-model Binding

### Test 3.1: Two-way Binding
**Test:** v-model updates parent and component  
**Setup:** `v-model="selectedIcon"` where selectedIcon = "mdi-home"  
**Action:** Select "mdi-account"  
**Expected:** Parent selectedIcon updates to "mdi-account", activator displays "mdi-account"

## Search Filtering

### Test 4.1: Name Match
**Test:** Filter by icon name  
**Input:** Search "home"  
**Expected:** Icons with "home" in name displayed

### Test 4.2: Aliases Match
**Test:** Filter by icon aliases  
**Input:** Icon {name: "account", aliases: ["user"]}  
**Search:** "user"  
**Expected:** "account" icon displayed

### Test 4.3: Tags Match
**Test:** Filter by icon tags  
**Input:** Icon {name: "home", tags: ["building"]}  
**Search:** "building"  
**Expected:** "home" icon displayed

### Test 4.4: No Matches
**Test:** Empty result set  
**Search:** "xyz123"  
**Expected:** Empty icon list (no error)

### Test 4.5: Empty Search
**Test:** All icons displayed  
**Search:** "" (empty string)  
**Expected:** All icons shown

### Test 4.6: Case Sensitivity
**Test:** Search case handling  
**Search:** "HOME" vs "home"  
**Current:** Case-sensitive  
**Expected (Vue 3):** Case-insensitive (enhancement)

## Virtual Scroll Behavior

### Test 5.1: Large Dataset Performance
**Test:** Handle 7000+ icons  
**Input:** Full MDI icon set  
**Expected:** Smooth rendering, no lag, ~5 items in DOM

### Test 5.2: Scroll Performance
**Test:** Smooth scrolling through list  
**Action:** Scroll rapidly through icons  
**Expected:** 60 FPS, no frame drops

## Menu Interaction

### Test 6.1: Menu Open
**Test:** Menu opens on activator click  
**Action:** Click activator icon  
**Expected:** Menu dropdown appears

### Test 6.2: Menu Stays Open
**Test:** Menu remains open after selection  
**Action:** Select icon  
**Expected:** Menu does not close

### Test 6.3: Search Field Click
**Test:** Clicking search field doesn't close menu  
**Action:** Click inside search field  
**Expected:** Menu stays open, can type

### Test 6.4: Menu Close
**Test:** Menu closes on outside click  
**Action:** Click outside menu  
**Expected:** Menu closes

## Edge Cases

### Test 7.1: Malformed Icon Objects
**Test:** Handle missing properties  
**Input:** Icon {name: "home", aliases: null, tags: undefined}  
**Expected:** No crash (should add validation)

### Test 7.2: Empty Icons Array
**Test:** No icons provided  
**Input:** `icons=[]`  
**Expected:** Empty list, no error

### Test 7.3: Non-Array Icons
**Test:** Invalid icons prop type  
**Input:** `icons="not an array"`  
**Expected:** Validation error or graceful handling

### Test 7.4: Very Long Search
**Test:** Search query performance  
**Input:** 1000 character search string  
**Expected:** No performance degradation or error

## Browser Compatibility

### Test 8.1: Chrome
**Test:** Full functionality in Chrome  
**Version:** Latest  
**Expected:** All tests pass

### Test 8.2: Firefox
**Test:** Full functionality in Firefox  
**Version:** Latest  
**Expected:** All tests pass

### Test 8.3: Safari
**Test:** Full functionality in Safari  
**Version:** Latest  
**Expected:** All tests pass

### Test 8.4: Mobile Browsers
**Test:** Touch interactions work  
**Browsers:** iOS Safari, Chrome Mobile  
**Expected:** Touch tap works, virtual keyboard doesn't break layout

## Performance Benchmarks

### Benchmark 1: Initial Render
**Metric:** Time to first render  
**Dataset:** 7000 icons  
**Target:** < 100ms

### Benchmark 2: Search Filter
**Metric:** Time to filter on keystroke  
**Dataset:** 7000 icons  
**Target:** < 50ms per keystroke

### Benchmark 3: Virtual Scroll
**Metric:** Scroll frame rate  
**Dataset:** 7000 icons  
**Target:** 60 FPS constant

### Benchmark 4: Memory Usage
**Metric:** DOM node count  
**Dataset:** 7000 icons  
**Target:** < 10 DOM nodes (only visible)

## Regression Testing

### All existing functionality must work after migration:
- Props reception and display
- Event emission
- v-model binding
- Search filtering (all 3 fields)
- Virtual scrolling
- Menu interactions
- Performance characteristics

## Test Automation

**Recommended Framework:** Vitest + Vue Test Utils

**Example Test:**
```javascript
import { mount } from '@vue/test-utils'
import MdiIconPicker from '@/MdiIconPicker.vue'

describe('MdiIconPicker', () => {
  test('emits select event on icon click', async () => {
    const icons = [{name: 'home', aliases: [], tags: []}]
    const wrapper = mount(MdiIconPicker, {
      props: { icons }
    })
    
    await wrapper.find('.icon-home').trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['mdi-home'])
  })
})
```

## Cross-References
- **Component Order:** [component-order.md](component-order.md)
- **Validation Criteria:** [validation-criteria.md](validation-criteria.md)
- **Remediation Plan:** [../technical-debt/remediation-plan.md](../technical-debt/remediation-plan.md)

---
**Test Count:** 35+ test cases covering all functionality  
**Automation:** Recommended for regression prevention
