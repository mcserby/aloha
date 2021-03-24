<template>
  <div class="radio-card">
    <p>{{ forTechnology }}</p>
    <div class="options">
      <div class="radio-group">
        <label>1</label>
        <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="1" v-model="preferenceValue" />
      </div>
      <div class="radio-group">
        <label>2</label>
        <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="2" v-model="preferenceValue" />
      </div>
      <div class="radio-group">
        <label>3</label>
        <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="3" v-model="preferenceValue" />
      </div>
      <div class="radio-group">
        <label>4</label>
        <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="4" v-model="preferenceValue" />
      </div>
      <div class="radio-group">
        <label>5</label>
        <Radio v-on:focus="changePreference()" class="radio" name="preferenceValue" value="5" v-model="preferenceValue" />
      </div>
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
      preferenceValue: "5",
    }
  },
  mounted() {
    this.preferenceValue = this.value.toString();
  },
  methods: {
    changePreference() {
      this.$emit('changePreference', {
        technology: this.forTechnology,
        value: parseInt(this.preferenceValue)
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

    p {
      text-transform: capitalize;
      margin-bottom: .5em;
    }
  }
  .radio-group {
    display: flex;
    align-items: center;
    margin-right: 7px;

    label {
      margin-right: 2px;
    }
  }
  .options {
    display: flex;
    justify-content: space-between;
  }
</style>
