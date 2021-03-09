<template>
  <div class="evaluations-view">
    <div class="evaluations-header">
      <h2>Evaluations</h2>
    </div>
    <div class="project-cards">
      <div
        class="project-card"
        v-for="project in projects"
        v-bind:key="project.name">
        <Button @click="selectProject(project.id)" label="Start Now" class="start-button"></Button>
        {{ project.name }}

      </div>
      <div @click="addNewProject()" class="project-card new-project">
        <i class="pi pi-plus-circle"></i>
        New Project...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  props: ["projects"],
  components: {},
  computed: {},
  methods: {
    selectProject(projectId) {
      this.$router.push({ name: "Project", params: { projectId: projectId } });
    },
    addNewProject() {
      this.$router.push({ path: "/project/new" });
    },
  },
};
</script>

<style lang="scss">
.evaluations-view {
  padding: 0 5em;
  display: flex;
  flex-direction: column;

  .evaluations-header {
    margin: 4em 0;
    background-color: #232931;
    padding: 0 3em;
    border-radius: 20px 20px 0 0;
    border-bottom: 5px solid #4ECCA3;
    color: #eee;
  }
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  color: white;
  font-size: 2em;
}

.project-card {
  background-color: #232931;
  padding: 3rem;
  cursor: pointer;
  position: relative;
  border-radius: 15px;

  .start-button {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: #eee;
    position: absolute;
    right: 2em;
    border-radius: 15px;
    height: 50px;
    width: 200px;
    background: linear-gradient(to bottom right, #4ECCA3, #00C2FF);
    bottom: -25px;
    border: none;
    transition: .3s ease;

    &:hover {
      color: #eee !important;
      border: none;
      background: linear-gradient(to bottom left, #4ECCA3, #00C2FF) !important;
      transition: .3s ease;
    }
  }
}

.new-project {
  background: linear-gradient(to bottom right, #4ECCA3, #00C2FF);
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  font-weight: 500;
  transition: .3s ease;

  &:hover {
    opacity: 0.7;
    transition: .3s ease;
  }

  i {
    font-size: 40px;
  }
}

</style>
