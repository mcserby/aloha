<template>
  <div class="projects-container">
    <PageHeader title="Evaluations"/>
    <div class="project-cards">
      <div class="project-card" v-for="project in projects" v-bind:key="project.name">
        <h4>{{project.name}}</h4>
        <Button @click="selectProject(project.id)" class="primary-btn start-button" label="Start Now"></Button>
      </div>
      <div v-if="isLoggedIn" @click="addNewProject()" class="project-card new-project">
        <i class="pi pi-plus-circle"></i>
        New Project
      </div>
    </div>
  </div>
</template>

<script>

import PageHeader from "@/components/PageHeader";
export default {
  name: 'Main',
  props: ['projects'],
  components: {
    PageHeader
  },
  computed: {
    isLoggedIn(){
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    selectProject(projectId){
      this.$router.push({name: 'Project', params: {'projectId': projectId}});
    },
    addNewProject(){
        this.$router.push({path: '/project/new'})
    }
  }
}
</script>

<style lang="scss">

.projects-container {
  padding: 0 4em;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    color:white;
    font-size:2em;

    .project-card {
      border-radius: 15px;
      background-color: #232931;
      padding: 2rem;
      cursor: pointer;
      position: relative;
      margin-bottom: 1em;
    }

    .new-project {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to bottom right, #4ECCA3, #00C2FF);
      transition: .3s ease;
      font-weight: 500;


      &:hover {
        opacity: 0.7;
        transition: .3s ease;
      }

      i {
        font-size: 30px;
      }
    }
  }

  .start-button {
    position: absolute;
    right: 2em;
    height: 50px;
    width: 200px;
    bottom: -25px;
    font-weight: 500;
    transition: .2s ease;

    &:hover {
      transform: scale(1.02);
      transition: .2s ease;
    }
  }



}







</style>
