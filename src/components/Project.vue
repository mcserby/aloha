<template>
  <div>
    <div>
      This is project page.
      Project id: {{project.id}}
      Project name: {{project.name}}
    </div>
    <div><button @click="deleteProject()">Delete Project</button></div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';

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
      const route =  this.$route.params.projectId;
      console.log('route:', route);
      return route;
    },
    project(){
      const proj = this.$store.state.projects.filter(p => p.id === this.projectId)[0];
      return proj || {id: '', name: ''};
    }
  },
  methods: {
    deleteProject(){
      const projId = this.project.id;
      firebaseService.deleteProject(projId);
      this.$router.push({name: 'Main'});
      this.$store.commit('deleteProject', projId);
    }
  }
}
</script>

<style>
</style>
