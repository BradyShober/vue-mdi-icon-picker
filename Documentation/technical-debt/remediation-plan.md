# Technical Debt Remediation Plan

## Overview
This document provides a comprehensive, step-by-step remediation plan for addressing all identified technical debt in the vue-mdi-icon-picker project. The plan is organized into phases with specific actions, code examples, and validation criteria.

---

## Migration Phases Summary

| Phase | Focus | Duration | Risk | Prerequisites |
|-------|-------|----------|------|---------------|
| **Phase 1** | Low-Risk Updates | 2-4 days | 🟢 Low | None |
| **Phase 2** | Vue 3 Migration | 3-4 weeks | 🔴 High | Phase 1 |
| **Phase 3** | Vuetify 3 Migration | 1-2 weeks | 🟡 Medium | Phase 2 |
| **Phase 4** | Validation | 1 week | 🟡 Medium | Phases 1-3 |

**Total Timeline:** 5-8 weeks

---

## Phase 1: Low-Risk Dependency Updates

**Duration:** 2-4 days  
**Risk Level:** 🟢 LOW  
**Can Start:** Immediately

### Goal
Update TypeScript and ESLint to current versions without breaking changes. These updates provide immediate value with minimal risk.

### Step 1.1: Update TypeScript

#### 1.1.1 Update Package
```bash
npm install --save-dev typescript@^5.3.0
```

#### 1.1.2 Update TypeScript ESLint Packages
```bash
npm install --save-dev \
  @typescript-eslint/eslint-plugin@^6.0.0 \
  @typescript-eslint/parser@^6.0.0
```

#### 1.1.3 Update tsconfig.json (Optional Enhancements)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": ["webpack-env"],
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    
    // New TypeScript 5.x options (optional)
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

#### 1.1.4 Test Build
```bash
npm run build
```

#### 1.1.5 Fix Type Errors (if any)
TypeScript 5.x has stricter checks. Review and fix any new type errors.

**Validation:**
- ✅ Build completes without errors
- ✅ TypeScript version: 5.3.x
- ✅ All source files compile successfully

### Step 1.2: Update ESLint

#### 1.2.1 Update ESLint Core
```bash
npm install --save-dev eslint@^8.56.0
```

#### 1.2.2 Update ESLint Plugins (for Vue 2 initially)
```bash
npm install --save-dev \
  eslint-plugin-vue@^9.0.0 \
  @vue/eslint-config-typescript@^12.0.0
```

#### 1.2.3 Update .eslintrc.js
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-recommended',  // Will update in Phase 2
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'warn'
  }
}
```

#### 1.2.4 Run Linter
```bash
npm run lint
```

#### 1.2.5 Fix Auto-Fixable Issues
```bash
npm run lint -- --fix
```

#### 1.2.6 Manually Fix Remaining Issues
Review and fix remaining lint errors/warnings.

**Validation:**
- ✅ ESLint runs without errors
- ✅ ESLint version: 8.56.x
- ✅ All files pass linting

### Phase 1 Completion Checklist
- [ ] TypeScript updated to 5.3.x
- [ ] ESLint updated to 8.56.x
- [ ] All TypeScript plugins updated
- [ ] All ESLint plugins updated
- [ ] Build successful
- [ ] Lint passes
- [ ] No regression in functionality
- [ ] Commit changes with descriptive message

---

## Phase 2: Vue 3 Migration

**Duration:** 3-4 weeks  
**Risk Level:** 🔴 HIGH  
**Prerequisites:** Phase 1 complete

### Goal
Migrate from Vue 2.6.11 to Vue 3.4.x and rewrite component from class-based to Composition API.

### Step 2.1: Prepare for Migration

#### 2.1.1 Create Feature Branch
```bash
git checkout -b feature/vue3-migration
```

#### 2.1.2 Study Breaking Changes
Required reading:
- Vue 3 Migration Guide: https://v3-migration.vuejs.org/
- Breaking Changes: https://v3-migration.vuejs.org/breaking-changes/
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html

#### 2.1.3 Backup Current Implementation
```bash
cp src/MdiIconPicker.vue src/MdiIconPicker.vue.v2.backup
```

### Step 2.2: Update Dependencies

#### 2.2.1 Remove Vue 2 Dependencies
```bash
npm uninstall \
  vue \
  vue-class-component \
  vue-property-decorator \
  vue-template-compiler \
  vue-loader
```

#### 2.2.2 Install Vue 3 Dependencies
```bash
npm install vue@^3.4.0

npm install --save-dev \
  @vitejs/plugin-vue@^5.0.0 \
  vite@^5.0.0
```

#### 2.2.3 Update package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2.3: Rewrite Component (Composition API)

#### 2.3.1 New MdiIconPicker.vue Implementation

**Complete Vue 3 + Composition API Rewrite:**

```vue
<template>
  <v-menu v-if="id !== ''" offset-y :close-on-content-click="false" :attach="idQuery">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" x-large :id="id">{{ modelValue }}</v-icon>
    </template>
    <v-row dense>
      <v-text-field 
        placeholder="Search" 
        outlined 
        class="pb-2" 
        @update:modelValue="updateSearch" 
        @click.stop 
      />
    </v-row>
    <v-row dense style="max-height: 200px; max-width: 300px;">
      <v-virtual-scroll 
        :items="filteredIcons" 
        :item-height="50" 
        height="235" 
        style="top: -35px;"
      >
        <template v-slot:default="{ item }">
          <v-icon 
            @click="selectIcon(item.name)" 
            large 
            :title="item.name"
          >
            mdi-{{ item.name }}
          </v-icon>
        </template>
      </v-virtual-scroll>
    </v-row>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { VMenu, VRow, VIcon, VTextField, VVirtualScroll } from 'vuetify/components';

// Define props interface
interface IconObject {
  name: string;
  aliases: string[];
  tags: string[];
}

interface Props {
  modelValue?: string;
  icons?: IconObject[];
}

// Define props
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  icons: () => []
});

// Define emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

// Reactive state
const search = ref('');
const id = ref('');

// Lifecycle: Generate ID on mount
onMounted(() => {
  id.value = Math.random().toString(36).replace('0.', 'icon-picker');
});

// Computed: Filter icons based on search
const filteredIcons = computed(() => {
  if (!Array.isArray(props.icons)) return [];
  
  return props.icons.filter((i) => {
    if (!i || typeof i !== 'object') return false;
    
    const searchTerm = search.value.toLowerCase();
    const name = (i.name || '').toLowerCase();
    const aliases = (i.aliases || []).map(a => a.toLowerCase());
    const tags = (i.tags || []).map(t => t.toLowerCase());
    
    return (
      name.includes(searchTerm) ||
      aliases.some(a => a.includes(searchTerm)) ||
      tags.some(t => t.includes(searchTerm))
    );
  });
});

// Computed: ID query selector
const idQuery = computed(() => `#${id.value}`);

// Method: Handle icon selection
function selectIcon(iconName: string) {
  emit('update:modelValue', `mdi-${iconName}`);
}

// Method: Update search state
function updateSearch(value: string) {
  search.value = value;
}
</script>

<style scoped>
.v-menu__content {
  min-width: 300px !important;
  background-color: white;
}
</style>
```

**Key Changes from Vue 2:**
1. ✅ Removed class-based syntax
2. ✅ Using `<script setup>` (Composition API)
3. ✅ Changed `value` prop to `modelValue` (Vue 3 v-model)
4. ✅ Changed `@select` event to `update:modelValue` (Vue 3 v-model)
5. ✅ Updated Vuetify activator syntax (`{ props }` instead of `{ on, attrs }`)
6. ✅ Added proper TypeScript interfaces
7. ✅ Improved filter logic with case-insensitive search
8. ✅ Added defensive checks for malformed data

### Step 2.4: Update Plugin Registration

#### 2.4.1 New src/index.ts
```typescript
import MdiIconPicker from './MdiIconPicker.vue';
import type { App } from 'vue';

export default {
  install(app: App) {
    app.component('MdiIconPicker', MdiIconPicker);
  }
};

export { MdiIconPicker };
```

### Step 2.5: Update Build Configuration

#### 2.5.1 Create vite.config.ts
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MdiIconPicker',
      fileName: (format) => `vue-mdi-icon-picker.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vuetify'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify'
        }
      }
    }
  }
});
```

### Step 2.6: Update Type Definitions

#### 2.6.1 Update shims-vue.d.ts
```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

#### 2.6.2 Remove Deprecated Shims
```bash
rm src/shims-tsx.d.ts  # JSX not used
```

### Step 2.7: Test Vue 3 Migration

#### 2.7.1 Build Test
```bash
npm run build
```

#### 2.7.2 Create Test App
Create `test/test-app.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/vuetify@3.5.0/dist/vuetify.min.css" rel="stylesheet">
</head>
<body>
  <div id="app">
    <v-app>
      <mdi-icon-picker v-model="selectedIcon" :icons="icons"></mdi-icon-picker>
      <p>Selected: {{ selectedIcon }}</p>
    </v-app>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuetify@3.5.0/dist/vuetify.min.js"></script>
  <script src="../dist/vue-mdi-icon-picker.umd.js"></script>
  <script>
    const { createApp } = Vue;
    const { createVuetify } = Vuetify;
    
    const app = createApp({
      data() {
        return {
          selectedIcon: 'mdi-home',
          icons: [
            { name: 'home', aliases: ['house'], tags: ['building'] },
            { name: 'account', aliases: ['user'], tags: ['person'] },
            { name: 'settings', aliases: ['config'], tags: ['gear'] }
          ]
        };
      }
    });
    
    const vuetify = createVuetify();
    app.use(vuetify);
    app.use(MdiIconPicker);
    app.mount('#app');
  </script>
</body>
</html>
```

#### 2.7.3 Manual Testing Checklist
- [ ] Component renders
- [ ] Icon activator displays current icon
- [ ] Menu opens on click
- [ ] Search field works
- [ ] Filtering works (case-insensitive)
- [ ] Icon selection works
- [ ] v-model updates parent
- [ ] Virtual scroll performs well
- [ ] Menu stays open after selection
- [ ] Styles applied correctly

### Phase 2 Completion Checklist
- [ ] Vue 3.4.x installed
- [ ] Component rewritten to Composition API
- [ ] Class-based syntax removed
- [ ] v-model updated (modelValue / update:modelValue)
- [ ] Build successful with Vite
- [ ] All functionality tested
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Commit changes

---

## Phase 3: Vuetify 3 Migration

**Duration:** 1-2 weeks  
**Risk Level:** 🟡 MEDIUM  
**Prerequisites:** Phase 2 complete (Vue 3)

### Goal
Migrate from Vuetify 2.6.10 to Vuetify 3.5.x for latest features and continued support.

### Step 3.1: Update Vuetify

#### 3.1.1 Remove Vuetify 2
```bash
npm uninstall vuetify vuetify-loader vue-cli-plugin-vuetify
```

#### 3.1.2 Install Vuetify 3
```bash
npm install vuetify@^3.5.0
npm install --save-dev vite-plugin-vuetify@^2.0.0
```

### Step 3.2: Update Vuetify Configuration

#### 3.2.1 Update plugins/vuetify.ts
```typescript
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  }
});
```

#### 3.2.2 Update vite.config.ts
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MdiIconPicker',
      fileName: (format) => `vue-mdi-icon-picker.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vuetify'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify'
        }
      }
    }
  }
});
```

### Step 3.3: Update Component for Vuetify 3

#### 3.3.1 Update Template (if needed)

Most Vuetify 3 components are backward compatible, but check:
- VMenu location prop (replaces offset-y)
- Activator slot syntax (use `v-bind` pattern)

```vue
<template>
  <v-menu 
    v-if="id !== ''" 
    location="bottom"
    :close-on-content-click="false" 
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon 
        v-bind="activatorProps" 
        size="x-large" 
        :id="id"
      >
        {{ modelValue }}
      </v-icon>
    </template>
    <!-- Rest of template unchanged -->
  </v-menu>
</template>
```

### Step 3.4: Update Imports

```typescript
// Update Vuetify 3 imports
import {
  VMenu,
  VRow,
  VIcon,
  VTextField,
  VVirtualScroll
} from 'vuetify/components';
```

### Step 3.5: Test Vuetify 3 Migration

#### 3.5.1 Build and Test
```bash
npm run build
npm run dev  # Test in dev environment
```

#### 3.5.2 Visual Regression Testing
- Compare before/after screenshots
- Verify styling consistency
- Check responsive behavior
- Test dark mode (if applicable)

### Phase 3 Completion Checklist
- [ ] Vuetify 3.5.x installed
- [ ] Plugin configuration updated
- [ ] Component imports updated
- [ ] Build successful
- [ ] All UI components render correctly
- [ ] Styling matches original
- [ ] No visual regressions
- [ ] Performance acceptable
- [ ] Commit changes

---

## Phase 4: Validation and Documentation

**Duration:** 1 week  
**Risk Level:** 🟡 MEDIUM  
**Prerequisites:** Phases 1-3 complete

### Goal
Thoroughly test all functionality and update documentation.

### Step 4.1: Comprehensive Testing

#### 4.1.1 Functional Testing
- [ ] Props: value/modelValue, icons
- [ ] Events: update:modelValue emission
- [ ] v-model: Two-way binding works
- [ ] Search: Filtering works correctly
- [ ] Virtual scroll: Performance with large datasets
- [ ] Menu: Opens, closes, positioning
- [ ] Icon selection: Click handling, event emission
- [ ] Edge cases: Empty icons, no search results, malformed data

#### 4.1.2 Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

#### 4.1.3 Performance Testing
```javascript
// Test with large dataset
const largeIconSet = Array.from({ length: 7000 }, (_, i) => ({
  name: `icon-${i}`,
  aliases: [`alias-${i}`],
  tags: [`tag-${i}`]
}));

// Measure search performance
console.time('filter');
// Type search query
console.timeEnd('filter');  // Should be < 50ms
```

### Step 4.2: Update Documentation

#### 4.2.1 Update README.md
```markdown
# vue-mdi-icon-picker

**Vue 3 + Vuetify 3 Icon Picker Component**

## Installation
\`\`\`bash
npm install vue-mdi-icon-picker
\`\`\`

## Usage
\`\`\`vue
<template>
  <MdiIconPicker v-model="selectedIcon" :icons="icons" />
</template>

<script setup>
import { ref } from 'vue';
import MdiIconPicker from 'vue-mdi-icon-picker';

const selectedIcon = ref('mdi-home');
const icons = ref([
  { name: 'home', aliases: ['house'], tags: ['building'] }
]);
</script>
\`\`\`

## Requirements
- Vue 3.x
- Vuetify 3.x
```

#### 4.2.2 Create CHANGELOG.md
```markdown
# Changelog

## [2.0.0] - 2024-XX-XX

### Breaking Changes
- Migrated to Vue 3 (no longer compatible with Vue 2)
- Migrated to Vuetify 3 (requires Vuetify 3.x)
- Changed from class-based to Composition API
- Prop: `value` → `modelValue` (use v-model)
- Event: `select` → `update:modelValue`

### Added
- TypeScript support improved
- Case-insensitive search
- Better error handling
- Composition API pattern

### Fixed
- Security: Updated to Vue 3 (Vue 2 EOL)
- Performance: Optimized filter logic
- Types: Stronger TypeScript definitions
```

### Step 4.3: Update Package Version

#### 4.3.1 Update package.json
```json
{
  "name": "vue-mdi-icon-picker",
  "version": "2.0.0",
  "peerDependencies": {
    "vue": "^3.4.0",
    "vuetify": "^3.5.0"
  }
}
```

### Step 4.4: Create Migration Guide

#### 4.4.1 Create MIGRATION.md
```markdown
# Migration Guide: v1.x to v2.0

## Breaking Changes

### 1. Vue 3 Required
**Before (v1.x):**
```javascript
import Vue from 'vue';
```

**After (v2.0):**
```javascript
import { createApp } from 'vue';
```

### 2. v-model Syntax
**Before (v1.x):**
```vue
<MdiIconPicker :value="icon" @select="icon = $event" :icons="icons" />
```

**After (v2.0):**
```vue
<MdiIconPicker v-model="icon" :icons="icons" />
```

### 3. Plugin Registration
**Before (v1.x):**
```javascript
import MdiIconPicker from 'vue-mdi-icon-picker';
Vue.use(MdiIconPicker);
```

**After (v2.0):**
```javascript
import MdiIconPicker from 'vue-mdi-icon-picker';
app.use(MdiIconPicker);
```
```

### Phase 4 Completion Checklist
- [ ] All tests pass
- [ ] Browser compatibility verified
- [ ] Performance acceptable
- [ ] README.md updated
- [ ] CHANGELOG.md created
- [ ] MIGRATION.md created
- [ ] Package version bumped (2.0.0)
- [ ] Documentation complete
- [ ] Ready for release

---

## Rollback Plan

If issues arise during migration:

### Rollback Step 1: Revert Git Branch
```bash
git checkout main
git branch -D feature/vue3-migration
```

### Rollback Step 2: Restore package.json
```bash
git checkout main -- package.json package-lock.json
npm install
```

### Rollback Step 3: Verify Original Works
```bash
npm run build
# Test original functionality
```

---

## Success Criteria

### Technical Success
- ✅ Vue 3.4.x or higher
- ✅ Vuetify 3.5.x or higher
- ✅ TypeScript 5.3.x or higher
- ✅ ESLint 8.56.x or higher
- ✅ All tests pass
- ✅ Build successful
- ✅ No console errors
- ✅ Performance within 10% of original

### Business Success
- ✅ No breaking changes for users (via migration guide)
- ✅ Security vulnerabilities resolved
- ✅ Future-proof technology stack
- ✅ Improved developer experience

---

## Cross-References
- **Root Report:** [../technical-debt-report.md](../technical-debt-report.md)
- **Outdated Components:** [outdated-components.md](outdated-components.md)
- **Security Vulnerabilities:** [security-vulnerabilities.md](security-vulnerabilities.md)
- **Migration Specifications:** [../migration/component-order.md](../migration/component-order.md)

---
**Plan Version:** 1.0  
**Last Updated:** 2024-12-06  
**Estimated Effort:** 5-8 weeks full-time
