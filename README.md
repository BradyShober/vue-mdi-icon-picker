# mdi-icon-picker

## Installation
```
npm install vue-mdi-icon-picker primevue primeicons @mdi/font
```

## Usage
Import the component in a Vue 3 application and make sure PrimeVue and icon CSS are loaded:

```js
import { createApp } from 'vue';
import App from './App.vue';
import MdiIconPicker from 'vue-mdi-icon-picker';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@mdi/font/css/materialdesignicons.min.css';

const app = createApp(App);
app.component('MdiIconPicker', MdiIconPicker);
app.mount('#app');
```

### Component usage
```html
<MdiIconPicker v-model="icon" :icons="icons" @select="onSelect" />
```

### Local development
```
npm run dev
```

### Props
* `v-model` — Currently selected icon value
* `icons` — JSON metadata from the Templarian MaterialDesign SVG icon set

### Notes
- This component now targets Vue 3.
- PrimeVue CSS and MDI icon font CSS must be included in the consuming app.
