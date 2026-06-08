<template>
  <div v-if="id !== ''">
    <Popover ref="popoverRef">
      <template #default>
        <div class="flex flex-wrap">
          <InputText
            placeholder="Search"
            class="mb-2! w-full!"
            @update:model-value="updateSearch"
            @click.stop
          />
        </div>
        <div class="max-h-[200px] max-w-[300px] overflow-y-auto">
          <template v-for="item in filteredIcons" :key="item.name">
            <i
              class="mdi cursor-pointer p-1 text-2xl!"
              :class="'mdi-' + item.name"
              :title="item.name"
              @click="selectedIcon(item.name)"
            ></i>
          </template>
        </div>
      </template>
    </Popover>
    <i
      :id="id"
      :class="['mdi', modelValue, 'text-3xl', 'cursor-pointer']"
      @click="togglePopover"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Popover from 'primevue/popover';
import InputText from 'primevue/inputtext';

const props = defineProps<{
  modelValue?: string;
  icons?: Array<any>;
}>();

const emit = defineEmits<{
  (event: 'select', icon: string): void;
}>();

const search = ref('');
const id = ref('');
const popoverRef = ref();

const filteredIcons = computed(() => {
  if (!props.icons) return [];
  return props.icons.filter(
    (i) =>
      i.name.includes(search.value) ||
      i.aliases.includes(search.value) ||
      i.tags.includes(search.value)
  );
});

onMounted(() => {
  id.value = Math.random().toString(36).replace('0.', 'icon-picker');
});

function selectedIcon(icon: string) {
  emit('select', `mdi-${icon}`);
  search.value = '';
  popoverRef.value?.hide();
}

function updateSearch(e: string) {
  search.value = e;
}

function togglePopover(event: Event) {
  popoverRef.value?.toggle(event);
}
</script>
