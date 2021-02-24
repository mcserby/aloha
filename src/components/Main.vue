<template>
  <div>
    <div>This is Main module!</div>
    <Projects :projects="projects" />
  </div>
</template>

<script>

import Projects from './Projects';

export default {
  name: 'Main',
  data() {
    return {
    }
  },
  components: {
    Projects

  },
  mounted(){
    this.loadProjects();
  },
  computed: {
    projects(){
       return this.$store.state.projects;
    }
  },
  methods: {
    loadProjects(){
      console.log('TODO: load projects from firebase');
        // TODO
    }
  }
}
</script>

<style>
</style>
