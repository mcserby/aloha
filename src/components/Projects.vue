<template>
  <div>
    <div>your projects:</div>
    <div class="project-cards">
      <div @click="selectProject(project.id)" class="project-card" v-for="project in projects" v-bind:key="project.name">
        {{project.name}}
      </div>
      <div @click="addNewProject()" class="project-card new-project">
        new project...
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'Main',
  props: ['projects'],
  components: {
  },
  computed: {
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

<style>
.project-cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  color:white;
  font-size:2em;
}

.project-card {
  background-color: rgba(255, 0, 0, 0.3);
  padding: 3rem;
  cursor: pointer;
}

.project-card.new-project {
  background-color: rgba(0, 0, 0, 0.55);
}

@media (min-width: 600px) {
  .project-cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 900px) {
  .project-cards { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1200px) {
  .project-cards { grid-template-columns: repeat(3, 1fr); }
}

</style>
