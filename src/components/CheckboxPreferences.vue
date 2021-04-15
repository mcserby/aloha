<template>
    <div class="checkboxes-container" v-for="(item,index) in options" v-bind:key="index">
        <Checkbox
                  :id="item"
                  :name="options"
                  v-on:focus="setSelectedOptions()"
                  :value="item"
                  v-model="selectedOptions"
                  />
        <label class="checkbox-label" v-bind:for="item">{{item}}</label>
    </div>
</template>

<script>
    export default {
        name: 'CheckboxPreferences',
        emits: ['setSelectedOptions'],
        props: {
            options: Array,
            selected: Array
        },
        data() {
            return {
                selectedOptions: []
            }
        },
        mounted() {
            this.selectedOptions = this.selected;
        },
        methods: {
            setSelectedOptions() {
                this.$emit('setSelectedOptions',this.selectedOptions);
            }
        }
        }
</script>
<style scoped lang="scss">
    .checkboxes-container {
        display: block;
    }

    .checkbox-label {
        margin-right: 10px;
        margin-left: 5px;
    }
</style>
