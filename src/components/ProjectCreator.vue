<template>
  <div>
    This is project creator page.
    Enter project name: <input type="text" placeholder="enter project name" v-model="newProjectName">
    <button @click="create()"> Create </button>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';

export default {
  name: 'ProjectCreator',
  data() {
    return {
      newProjectName: ''
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    async create(){
      const project = await firebaseService.addProject(this.newProjectName);
      console.log('project', project);
      this.$store.commit('addProject', project);
      this.$router.push({name: 'Project', params: {'projectId': project.id}})
    }
  }
}
</script>

<style>
</style>
