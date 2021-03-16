<template>
  <div>
    <Projects :projects="projects" />
  </div>
</template>

<script>

import Projects from './Projects';

export default {
  name: 'Main',
  data() {
    return {}
  },
  components: {
    Projects
  },
  computed: {
    projects(){
       return this.$store.state.projects;
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
