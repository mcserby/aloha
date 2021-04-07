<template>
    <div class="checkboxes-container" v-for="(item,index) in options" v-bind:key="index">
        <Checkbox
                  :id="item.name"
                  :name="options"
                  v-on:focus="setSelectedOptions()"
                  :value="item.name"
                  v-model="selectedOptions" />
        <label class="checkbox-label" v-bind:for="item.name">{{item.name}}</label>
    </div>
</template>

<script>
    export default {
        name: 'CheckboxPreferences',
        props: {
            options: Array
        },
        data() {
            return {
                selectedOptions: []
            }
        },
        mounted() {
            this.selectedOptions = [];
        },
        methods: {
            setSelectedOptions() {
                this.$emit('setSelectedOptions', {selectedOptions: this.selectedOptions})
            }
        }
        }
</script>
<style scoped lang="scss">
    .checkboxes-container {
        display: inline;
    }

    .checkbox-label {
        margin-right: 7px;
    }
</style>
