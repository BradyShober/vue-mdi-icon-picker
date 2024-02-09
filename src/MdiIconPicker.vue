<template>
  <v-menu
    v-if="id !== ''"
    :close-on-content-click="false"
    :attach="idQuery"
  >
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        :id="id"
        size="x-large"
      >
        {{ value }}
      </v-icon>
    </template>
    <v-row dense>
      <v-text-field
        placeholder="Search"
        variant="outlined"
        class="pb-2"
        @update:model-value="updateSearch"
        @click.stop
      />
    </v-row>
    <v-row
      dense
      style="max-height: 200px; max-width: 300px;"
    >
      <v-virtual-scroll
        :items="filteredIcons"
        :item-height="50"
        :bench="0"
        height="235"
        style="top: -35px;"
      >
        <template #default="{ item }">
          <v-icon
            size="large"
            :title="item.name"
            @click="selectedIcon(item.name)"
          >
            mdi-{{ item.name }}
          </v-icon>
        </template>
      </v-virtual-scroll>
    </v-row>
  </v-menu>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

    export default defineComponent({
        props: {
            value: {
                type: String
            },
            icons: {
                type: Object as PropType<Array<any>>
            }
        },
        data() {
            return {
                search: "",
                id: ""
            };
        },
        computed: {
            filteredIcons() {
                return this.icons.filter(i => i.name.includes(this.search) || i.aliases.includes(this.search) || i.tags.includes(this.search));
            },
            idQuery() {
                return `#${this.id}`;
            }
        },
        created() {
            this.id = Math.random().toString(36).replace('0.', 'icon-picker' || '')
        },
        methods: {
            selectedIcon(icon: string) {
                this.$emit('select', `mdi-${icon}`);
            },
            updateSearch(e: string) {
                this.search = e;
            }
        }
    })

</script>
<style scoped>
    .v-menu__content {
        min-width: 300px !important;
        background-color: white;
    }
</style>
