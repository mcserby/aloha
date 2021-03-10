<template>
  <div class="base-container">
    <PageHeader title="Creating A New Project"></PageHeader>

    <div class="base-background">
      <h3>Enter a project name</h3>
      <Input type="text" placeholder="Project Name" v-model="newProjectName" />
      <Button class="primary-btn" @click="create()"> Create </Button>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import PageHeader from "@/components/PageHeader";

export default {
  name: 'ProjectCreator',
  data() {
    return {
      newProjectName: ''
    }
  },
  components: {
    PageHeader
  },
  computed: {
    userId(){
       return this.$store.state.userId;
    }
  },
  methods: {
    async create(){
      const project = await firebaseService.addProject(this.newProjectName, this.userId);
      console.log('project', project);
      this.$store.commit('addProject', project);
      this.$router.push({name: 'Project', params: {'projectId': project.id}})
    }
  }
}
</script>

<style scoped lang="scss">
 h3 {
   margin: 0;
 }
</style>
