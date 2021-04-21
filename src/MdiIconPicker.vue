<template>
    <v-menu v-if="id !== ''" offset-y :close-on-content-click="false" :attach="idQuery">
        <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" x-large :id="id">{{value}}</v-icon>
        </template>
        <v-row dense>
            <v-text-field placeholder="Search" outlined class="pb-2" @input="updateSearch" v-on:click.stop />
        </v-row>
        <v-row dense style="max-height: 200px; max-width: 300px;">
            <v-col cols="4" v-for="icon in filteredIcons" :key="icon.name">
                <v-icon v-on="on" @click="selectedIcon(icon.name)" large :title="icon.name">mdi-{{icon.name}}</v-icon>
            </v-col>
        </v-row>
    </v-menu>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class MdiIconPicker extends Vue {
        @Prop()
        value: string

        @Prop()
        icons: Array<any>

        search = ""

        id = ""

        created() {
            this.id = Math.random().toString(36).replace('0.', 'icon-picker' || '')
        }

        selectedIcon(icon: string) {
            this.$emit('select', `mdi-${icon}`);
        }

        updateSearch(e: string) {
            this.search = e;
        }

        get filteredIcons() {
            return this.icons.filter(i => i.name.includes(this.search) || i.aliases.includes(this.search) || i.tags.includes(this.search));
        }

        get idQuery() {
            return `#${this.id}`;
        }
    }
</script>
<style scoped>
    .v-menu__content {
        min-width: 300px !important;
        background-color: white;
    }
</style>
