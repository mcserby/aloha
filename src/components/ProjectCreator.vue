<template>
  <div>
    This is project creator page.
    Enter project name: <input type="text" placeholder="enter project name" v-model="newProjectName">
    <button @click="create()"> Create </button>
  </div>
</template>

<script>

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
      this.$store.commit('addProject', this.newProjectName);
      const projectId = this.$store.state.projects.filter(p => p.name === this.newProjectName)[0].id;
      this.$router.push({name: 'Project', params: {'projectId': projectId}})
    }
  }
}
</script>

<style>
</style>
