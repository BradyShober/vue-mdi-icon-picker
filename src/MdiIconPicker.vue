<template>
  <div class="mdi-icon-picker" v-if="id">
    <span class="mdi-icon-picker-trigger" :id="id" @click="togglePanel">
      <i :class="['mdi', modelValue]" aria-hidden="true"></i>
    </span>
    <OverlayPanel ref="overlay" appendTo="body" :dismissable="true" :style="{ minWidth: '300px', backgroundColor: 'white' }">
      <div class="mdi-icon-picker-panel">
        <div class="p-field p-mb-2">
          <InputText v-model="search" placeholder="Search" @click.stop />
        </div>
        <VirtualScroller :items="filteredIcons" :item-size="50" :bench="0" style="height:235px; overflow-y:auto;">
          <template #default="{ item }">
            <div class="mdi-icon-picker-item" @click="selectedIcon(item.name)">
              <i :class="['mdi', `mdi-${item.name}`]" :title="item.name" aria-hidden="true"></i>
              <span class="mdi-icon-picker-name">{{ item.name }}</span>
            </div>
          </template>
        </VirtualScroller>
      </div>
    </OverlayPanel>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
import VirtualScroller from 'primevue/virtualscroller';

export default defineComponent({
  name: 'MdiIconPicker',
  components: {
    OverlayPanel,
    InputText,
    VirtualScroller
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    icons: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    const search = ref('');
    const id = ref('');
    const overlay = ref(null);

    const filteredIcons = computed(() => {
      const query = search.value.toLowerCase();
      return props.icons.filter(icon => {
        const nameMatch = icon.name && icon.name.toLowerCase().includes(query);
        const aliasMatch = Array.isArray(icon.aliases) && icon.aliases.some(alias => alias.toLowerCase().includes(query));
        const tagMatch = Array.isArray(icon.tags) && icon.tags.some(tag => tag.toLowerCase().includes(query));
        return nameMatch || aliasMatch || tagMatch;
      });
    });

    onMounted(() => {
      id.value = Math.random().toString(36).replace('0.', 'icon-picker');
    });

    const togglePanel = event => {
      if (overlay.value && overlay.value.toggle) {
        overlay.value.toggle(event);
      }
    };

    const selectedIcon = icon => {
      const value = `mdi-${icon}`;
      emit('update:modelValue', value);
      emit('select', value);
      if (overlay.value && overlay.value.hide) {
        overlay.value.hide();
      }
    };

    return {
      search,
      id,
      overlay,
      filteredIcons,
      togglePanel,
      selectedIcon
    };
  }
});
</script>

<style scoped>
.mdi-icon-picker {
  display: inline-block;
}

.mdi-icon-picker-trigger {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mdi-icon-picker-panel {
  min-width: 300px;
}

.mdi-icon-picker-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.mdi-icon-picker-item:last-child {
  border-bottom: none;
}

.mdi-icon-picker-item:hover {
  background: #f5f5f5;
}

.mdi-icon-picker-item i {
  font-size: 1.25rem;
}

.mdi-icon-picker-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
