<template>
  <div class="radio-card">
    <p>{{ forTechnology }}</p>
    <div class="options">
      <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="1" v-model="preferenceValue" />
      <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="2" v-model="preferenceValue" />
      <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="3" v-model="preferenceValue" />
      <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="4" v-model="preferenceValue" />
      <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="5" v-model="preferenceValue" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioPreference',
  props: {
    forTechnology: String,
    value: Number
  },
  data() {
    return {
      preferenceValue: null,
    }
  },
  methods: {
    changePreference() {
      this.$emit('changePreference', {
        technology: this.forTechnology,
        value: this.preferenceValue
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .radio {
    margin-right: 2px;
  }
  .radio-card {
    background: #232931;
    width: fit-content;
    padding: 1em;
    border-radius: 15px;
  }
</style>
