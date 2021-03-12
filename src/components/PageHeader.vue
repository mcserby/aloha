<template>
  <div class="page-header">
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    title: String
  }
}
</script>

<style scoped>
.page-header {
  width: 100%;
  background-color: #232931;
  border-radius: 15px 15px 0 0;
  border-bottom: 5px solid #4ECCA3;
  padding: 0 2em;
  margin: 4em 0;
}
</style>
