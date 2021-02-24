<template>
  <div>
    This is project page.
    Project id: {{project.id}}
    Project name: {{project.name}}
  </div>
</template>

<script>

export default {
  name: 'Project',
  data() {
    return {
      newProjectName: ''
    }
  },
  components: {
  },
  computed: {
    projectId(){
      return parseInt(this.$route.params.projectId);
    },
    project(){
      const project = this.$store.state.projects.filter(p => p.id === this.projectId)[0];
      console.log('project', project);
      return project;
    }
  },
  methods: {

  }
}
</script>

<style>
</style>
