<template>
    <v-menu offset-y :close-on-content-click="false" eager>
        <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" x-large>{{value}}</v-icon>
        </template>
        <v-row dense>
            <v-text-field placeholder="Search" outlined class="pb-2" @input="updateSearch" />
        </v-row>
        <v-row dense style="max-height: 200px; max-width: 300px">
            <v-col cols="4" v-for="icon in filteredIcons" :key="icon.name">
                <v-tooltip top>
                    <template v-slot:activator="{on}">   
                        <v-icon v-on="on" @click="selectedIcon(icon.name)" large>mdi-{{icon.name}}</v-icon>
                    </template>
                    <span>{{icon.name}}</span>
                </v-tooltip>
            </v-col>
        </v-row>
    </v-menu>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class MdiIconPicker extends Vue {
        @Prop()
        value: string

        @Prop()
        icons: Array<any>

        search = ""

        selectedIcon(icon: string){
            this.$emit('select', `mdi-${icon}`);
        }

        updateSearch(e: string){
            this.search = e;
        }

        get filteredIcons(){
            return this.icons.filter(i => i.name.includes(this.search) || i.aliases.includes(this.search) || i.tags.includes(this.search));
        }
    }
</script>