# Dependency Analysis and Mapping

## Dependency Overview

### Dependency Categories
1. **Production Dependencies (5)** - Required at runtime
2. **Development Dependencies (19)** - Required for build/development
3. **Internal Dependencies (6 files)** - Project source files
4. **External Framework Dependencies** - Vue, Vuetify ecosystems

## Production Dependencies

### Core Framework Dependencies

#### vue (^2.6.11)
- **Type:** Core framework
- **Version:** 2.6.11 (caret allows 2.6.x - 2.x.x)
- **Purpose:** Base Vue.js framework for component system
- **Usage:** 
  - Extended by MdiIconPicker class
  - Imported in plugins/vuetify.ts
  - Type definitions in shims-vue.d.ts
- **Critical:** Yes - entire component built on Vue
- **Imported By:**
  - src/plugins/vuetify.ts (line 1)
  - src/MdiIconPicker.vue (via vue-property-decorator)
  - src/shims-tsx.d.ts (line 1)

#### vuetify (~2.6.10)
- **Type:** UI Component Framework
- **Version:** 2.6.10 (tilde allows 2.6.x only)
- **Purpose:** Material Design component library
- **Usage:**
  - VMenu, VRow, VIcon, VTextField, VVirtualScroll components
  - Vuetify instance configuration
- **Critical:** Yes - all UI components depend on Vuetify
- **Imported By:**
  - src/MdiIconPicker.vue (line 21): specific components
  - src/plugins/vuetify.ts (line 2): framework initialization
  - src/shims-vuetify.d.ts (line 2): type definitions

**Specific Component Dependencies:**
```typescript
import {
  VMenu,          // Dropdown menu container
  VRow,           // Grid layout (2 instances)
  VIcon,          // Icon display (activator + list items)
  VTextField,     // Search input
  VVirtualScroll  // Virtualized list for performance
} from 'vuetify/lib';
```

#### vue-class-component (^7.2.3)
- **Type:** Vue Extension Library
- **Version:** 7.2.3 (caret allows 7.2.x - 7.x.x)
- **Purpose:** Enable class-style Vue components
- **Usage:** Base for TypeScript class components
- **Critical:** Yes - component uses class syntax
- **Imported By:** vue-property-decorator (dependency of dependency)
- **Note:** **DEPRECATED** - Vue 3 doesn't use this pattern

#### vue-property-decorator (^9.1.2)
- **Type:** TypeScript Decorator Library
- **Version:** 9.1.2 (caret allows 9.1.x - 9.x.x)
- **Purpose:** Provide TypeScript decorators for Vue
- **Usage:**
  - @Component decorator
  - @Prop decorator
  - Vue class import
- **Critical:** Yes - component uses decorator syntax
- **Imported By:**
  - src/MdiIconPicker.vue (line 20)
- **Dependencies:** vue-class-component (peer dependency)
- **Note:** **DEPRECATED** - Vue 3 uses Composition API

#### core-js (^3.6.5)
- **Type:** Polyfill Library
- **Version:** 3.6.5 (caret allows 3.6.x - 3.x.x)
- **Purpose:** JavaScript feature polyfills for older browsers
- **Usage:** Automatic polyfilling via Babel
- **Critical:** Medium - needed for broad browser support
- **Imported By:** Babel transformation pipeline (automatic)

## Development Dependencies

### Build Tools

#### webpack (^5.94.0)
- **Type:** Module Bundler
- **Version:** 5.94.0
- **Purpose:** Bundle source files into distributable UMD library
- **Configuration:** webpack.config.js
- **Critical:** Yes - required for building distribution

#### webpack-cli (^4.6.0)
- **Type:** CLI Tool
- **Version:** 4.6.0
- **Purpose:** Command-line interface for webpack
- **Usage:** `webpack --progress` command in build script

#### webpack-dev-server (^4.11.1)
- **Type:** Development Server
- **Version:** 4.11.1
- **Purpose:** Live development server with hot reload
- **Usage:** Development mode only

### Vue CLI and Plugins

#### @vue/cli-service (~5.0.8)
- **Type:** Build Tool
- **Version:** 5.0.8 (tilde allows 5.0.x only)
- **Purpose:** Vue CLI build system
- **Note:** Version mismatch - CLI 5.x typically for Vue 3

#### @vue/cli-plugin-babel (~5.0.8)
- **Type:** Build Plugin
- **Purpose:** Babel integration for Vue CLI
- **Configuration:** babel.config.js

#### @vue/cli-plugin-typescript (~5.0.8)
- **Type:** Build Plugin
- **Purpose:** TypeScript support for Vue CLI

#### @vue/cli-plugin-eslint (~5.0.8)
- **Type:** Build Plugin
- **Purpose:** ESLint integration for Vue CLI

#### vue-cli-plugin-vuetify (^2.5.8)
- **Type:** Build Plugin
- **Version:** 2.5.8
- **Purpose:** Vuetify integration for Vue CLI

### Loaders

#### vue-loader (^15.9.6)
- **Type:** Webpack Loader
- **Version:** 15.9.6
- **Purpose:** Load and compile .vue Single File Components
- **Configuration:** webpack.config.js (lines 28-34)
- **Plugin:** VueLoaderPlugin (required companion)

#### babel-loader (^8.2.2)
- **Type:** Webpack Loader
- **Version:** 8.2.2
- **Purpose:** Transpile JavaScript with Babel
- **Configuration:** webpack.config.js (lines 37-40)

#### sass-loader (^10.0.0)
- **Type:** Webpack Loader
- **Version:** 10.0.0
- **Purpose:** Compile SASS/SCSS to CSS
- **Dependency:** sass (peer)

#### file-loader (^6.2.0)
- **Type:** Webpack Loader
- **Version:** 6.2.0
- **Purpose:** Handle file imports (images, fonts)

#### url-loader (^4.1.1)
- **Type:** Webpack Loader
- **Version:** 4.1.1
- **Purpose:** Inline small files as data URLs

#### vuetify-loader (^1.7.0)
- **Type:** Webpack Loader
- **Version:** 1.7.0
- **Purpose:** Automatic Vuetify component imports

### Compilers and Processors

#### typescript (~4.1.5)
- **Type:** Compiler
- **Version:** 4.1.5 (tilde allows 4.1.x only)
- **Purpose:** TypeScript to JavaScript compilation
- **Configuration:** tsconfig.json
- **Note:** Outdated - current version is 5.x

#### vue-template-compiler (^2.6.11)
- **Type:** Compiler
- **Version:** 2.6.11
- **Purpose:** Compile Vue templates to render functions
- **Critical:** Yes - must match Vue version exactly
- **Version Match:** ✓ Matches vue 2.6.11

#### sass (^1.32.0)
- **Type:** CSS Preprocessor
- **Version:** 1.32.0
- **Purpose:** Process SASS/SCSS syntax
- **Usage:** Scoped styles in .vue components

### Code Quality Tools

#### eslint (^6.7.2)
- **Type:** Linter
- **Version:** 6.7.2
- **Purpose:** JavaScript/TypeScript code linting
- **Configuration:** .eslintrc.js
- **Note:** Outdated - current version is 8.x

#### @typescript-eslint/eslint-plugin (^4.18.0)
- **Type:** ESLint Plugin
- **Version:** 4.18.0
- **Purpose:** TypeScript-specific linting rules

#### @typescript-eslint/parser (^4.18.0)
- **Type:** ESLint Parser
- **Version:** 4.18.0
- **Purpose:** Parse TypeScript for ESLint

#### eslint-plugin-vue (^6.2.2)
- **Type:** ESLint Plugin
- **Version:** 6.2.2
- **Purpose:** Vue-specific linting rules
- **Note:** Version 6 for Vue 2 (Vue 3 uses version 8+)

#### @vue/eslint-config-typescript (^7.0.0)
- **Type:** ESLint Configuration
- **Version:** 7.0.0
- **Purpose:** Shared ESLint config for Vue + TypeScript

### Utility Tools

#### cross-env (^7.0.3)
- **Type:** Environment Tool
- **Version:** 7.0.3
- **Purpose:** Set environment variables cross-platform
- **Usage:** `cross-env NODE_ENV=production` in build script

## Internal File Dependencies

### Dependency Graph
```
index.js (entry point)
├── imports: MdiIconPicker.vue
└── registers component globally

MdiIconPicker.vue
├── imports: vue-property-decorator
│   ├── Component decorator
│   ├── Vue class
│   └── Prop decorator
├── imports: vuetify/lib
│   ├── VMenu
│   ├── VRow
│   ├── VIcon
│   ├── VTextField
│   └── VVirtualScroll
└── depends on: Vue 2.6.11 runtime

plugins/vuetify.ts
├── imports: vue
└── imports: vuetify/lib/framework

shims-vue.d.ts
└── declares: *.vue module type

shims-tsx.d.ts
├── imports: vue
└── declares: JSX global namespace

shims-vuetify.d.ts
└── declares: vuetify/lib/framework module
```

## Dependency Tree (npm)

```
vue-mdi-icon-picker
├─┬ vue@2.6.11
├─┬ vuetify@2.6.10
│ └── vue@2.6.11 (peer)
├─┬ vue-class-component@7.2.3
│ └── vue@2.6.11 (peer)
├─┬ vue-property-decorator@9.1.2
│ ├── vue@2.6.11 (peer)
│ └── vue-class-component@7.2.3
└── core-js@3.6.5

Development:
├─┬ webpack@5.94.0
├─┬ @vue/cli-service@5.0.8
│ ├── webpack@5.x
│ └── vue-loader@15.9.6
├── vue-template-compiler@2.6.11
├─┬ typescript@4.1.5
├─┬ eslint@6.7.2
└── [16 other dev dependencies]
```

## External API Dependencies

### Vue Framework APIs
- **Component System:** Class component pattern
- **Reactivity System:** Props, data, computed properties
- **Event System:** $emit for parent communication
- **Lifecycle Hooks:** created()
- **Template Directives:** v-if, v-bind, v-on, v-slot

### Vuetify Component APIs
- **VMenu:** offset-y, close-on-content-click, attach props
- **VIcon:** size props (x-large, large), event handlers
- **VTextField:** placeholder, outlined, @input event
- **VVirtualScroll:** items, item-height, bench, height props
- **VRow:** dense layout variant

## Version Compatibility Matrix

| Dependency | Current Version | Latest Stable | Compatible | Notes |
|------------|----------------|---------------|------------|-------|
| vue | 2.6.11 | 3.4.x | ⚠️ | Vue 2 EOL (Dec 2023) |
| vuetify | 2.6.10 | 3.5.x | ⚠️ | Vuetify 2 for Vue 2 |
| typescript | 4.1.5 | 5.3.x | ⚠️ | Several major versions behind |
| webpack | 5.94.0 | 5.94.x | ✓ | Up to date |
| eslint | 6.7.2 | 8.56.x | ⚠️ | Two major versions behind |
| vue-class-component | 7.2.3 | 8.0.0 | ⚠️ | Deprecated pattern |
| vue-property-decorator | 9.1.2 | 10.0.0 | ⚠️ | Deprecated pattern |
| @vue/cli-service | 5.0.8 | 5.0.8 | ⚠️ | Version 5 for Vue 3 |

## Dependency Risk Analysis

### Critical Risks

#### 🔴 Vue 2 End-of-Life
- **Risk Level:** CRITICAL
- **Issue:** Vue 2 reached EOL December 31, 2023
- **Impact:** No security updates, bug fixes, or support
- **Affected:** Entire component (built on Vue 2)
- **Mitigation:** Migrate to Vue 3

#### 🔴 Deprecated Decorator Pattern
- **Risk Level:** HIGH
- **Issue:** vue-class-component and vue-property-decorator deprecated
- **Impact:** Pattern not supported in Vue 3
- **Affected:** Component class structure, all decorators
- **Mitigation:** Migrate to Composition API or Options API

### Medium Risks

#### 🟡 Vuetify 2.x
- **Risk Level:** MEDIUM
- **Issue:** Vuetify 3 is current stable version
- **Impact:** Missing new features, potential security issues
- **Affected:** All UI components
- **Dependency:** Requires Vue 2
- **Mitigation:** Migrate to Vuetify 3 (requires Vue 3 first)

#### 🟡 TypeScript 4.1.5
- **Risk Level:** MEDIUM
- **Issue:** Several major versions behind (current: 5.3.x)
- **Impact:** Missing language features, type improvements
- **Affected:** All TypeScript files
- **Mitigation:** Update to TypeScript 5.x

#### 🟡 ESLint 6.7.2
- **Risk Level:** MEDIUM
- **Issue:** Two major versions behind
- **Impact:** Missing lint rules, potential security issues
- **Affected:** Code quality checks
- **Mitigation:** Update to ESLint 8.x

### Low Risks

#### 🟢 Webpack 5.94.0
- **Risk Level:** LOW
- **Status:** Up to date
- **No action required**

## Peer Dependency Requirements

### vue-property-decorator Requirements
```json
{
  "peerDependencies": {
    "vue": "^2.0.0",
    "vue-class-component": "^7.0.0"
  }
}
```
**Status:** ✓ Satisfied (vue@2.6.11, vue-class-component@7.2.3)

### vuetify Requirements
```json
{
  "peerDependencies": {
    "vue": "^2.6.0"
  }
}
```
**Status:** ✓ Satisfied (vue@2.6.11)

### vue-loader Requirements
```json
{
  "peerDependencies": {
    "vue-template-compiler": "^2.0.0"
  }
}
```
**Status:** ✓ Satisfied (vue-template-compiler@2.6.11)

## Build-time vs Runtime Dependencies

### Runtime (Production)
**Required in production bundle:**
- vue (externalized in UMD build)
- vuetify (externalized in UMD build)
- core-js (bundled for polyfills)

**Note:** The UMD build expects Vue and Vuetify to be available globally:
```javascript
library: 'MdiIconPicker',
libraryTarget: 'umd'
// Assumes window.Vue and window.Vuetify exist
```

### Build-time Only
**Not included in production bundle:**
- All webpack loaders
- TypeScript compiler
- vue-template-compiler
- ESLint tools
- Development server

## Transitive Dependencies

### High-Level Transitive Dependencies
- **vue-class-component** brings: reflect-metadata concepts
- **vuetify** brings: Vue peer dependency requirement
- **@vue/cli-service** brings: webpack, babel, entire build chain
- **eslint** brings: Multiple parser and plugin dependencies

### Potential Conflicts
- **Vue CLI 5.x** designed for Vue 3, but project uses Vue 2
  - Risk: Configuration mismatches
  - Status: Working but not optimal setup

## Dependency Update Strategy

### Immediate Actions
1. Document Vue 2 EOL risk
2. Plan Vue 3 migration
3. Update TypeScript to 5.x (low risk)
4. Update ESLint to 8.x (low risk)

### Migration Path
1. **Phase 1:** Update low-risk dependencies (TypeScript, ESLint)
2. **Phase 2:** Migrate to Vue 3 + Composition API
3. **Phase 3:** Migrate to Vuetify 3
4. **Phase 4:** Remove deprecated decorators

## Cross-References
- **Technical Debt:** See [../technical-debt/outdated-components.md](../technical-debt/outdated-components.md)
- **Program Structure:** See [../reference/program-structure.md](../reference/program-structure.md)
- **Migration Plan:** See [../migration/component-order.md](../migration/component-order.md)
- **Security Analysis:** See [../analysis/security-patterns.md](../analysis/security-patterns.md)

---
**Dependency Analysis Date:** Static analysis via package.json  
**Package Manager:** npm  
**Lock File:** package-lock.json present
