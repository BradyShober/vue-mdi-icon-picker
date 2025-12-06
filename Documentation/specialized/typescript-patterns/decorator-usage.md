# TypeScript Decorator Usage

## Decorators Used

### @Component
**Source:** vue-class-component  
**Purpose:** Register class as Vue component

**Usage:**
```typescript
@Component({
  components: {
    VMenu, VRow, VIcon, VTextField, VVirtualScroll
  }
})
export default class MdiIconPicker extends Vue { }
```

**Configuration:**
- `components`: Register child components

### @Prop
**Source:** vue-property-decorator  
**Purpose:** Declare component props

**Usage:**
```typescript
@Prop()
value: string

@Prop()
icons: Array<any>
```

**Features:**
- TypeScript type checking
- Runtime type validation
- Optional by default

## TypeScript Configuration

**tsconfig.json Settings:**
```json
{
  "experimentalDecorators": true,  // Required
  "emitDecoratorMetadata": true    // For reflection
}
```

## Type Definitions

### Shims Files
1. **shims-vue.d.ts** - Vue module declarations
2. **shims-tsx.d.ts** - JSX support  
3. **shims-vuetify.d.ts** - Vuetify types

### Type Safety
- Props: Type-checked by TypeScript
- Methods: Parameter and return types
- Computed: Return type inference

## Migration Note
Decorators deprecated in Vue 3. See [Technical Debt Remediation Plan](../../technical-debt/remediation-plan.md) for Composition API migration.

## Cross-References
- **Program Structure:** [../../reference/program-structure.md](../../reference/program-structure.md)
- **Data Models:** [../../reference/data-models.md](../../reference/data-models.md)
