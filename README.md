# mdi-icon-picker

## Installation
```
npm install vue-mdi-icon-picker
```

### Usage
```
import MdiIconPicker from 'vue-mdi-icon-picker'
```
```
<MdiIconPicker v-model="icon" :icons="icons" @select="onSelect">
```

### Props
* v-model: Currently selected icon
* icons: JSON of the meta.json from the version of https://github.com/Templarian/MaterialDesign-SVG being used
