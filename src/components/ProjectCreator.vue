<template>
  <div class="base-container">
    <PageHeader title="Creating A New Project"></PageHeader>

    <div class="base-background project-creator">
      <h4>Enter a project name</h4>
      <Input :class="newProjectName ? '' : 'p-invalid'" type="text" placeholder="Project Name" v-model="newProjectName"/>
      <h4 class="topics-title">Project Topics<span> (comma separated)</span></h4>
      <Chips class="topics-input" separator="," v-model="projectTopics"/>
      <Button :disabled="!newProjectName" class="primary-btn create-test" @click="create()"> Create </Button>
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
      newProjectName: '',
      projectTopics: [],
    }
  },
  components: {
    PageHeader
  },
  computed: {
  },
  methods: {
    async create(){
      const project = await firebaseService.addProject(this.newProjectName, this.projectTopics);
      console.log('project', project);
      this.$store.commit('addProject', project);
      this.$router.push({name: 'Project', params: {'projectId': project.id}})
    }
  }
}
</script>

<style scoped lang="scss">
 h4 {
   margin: 0;

   span {
     font-size: 10px;
     opacity: 0.5;
   }
 }

 .topics-title {
   margin-top: 1em;
 }

 .topics-input {
   margin-bottom: 1em;
   width: 100%;
 }

 .project-creator {
   width: 100%;
   max-width: 100%;
   display: flex;
   flex-direction: column;
 }

 .create-test {
   width: fit-content;
 }

</style>
