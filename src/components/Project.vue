<template>
  <div>
    <div>
      This is project page.
      Project id: {{project.id}}
      Project name: {{project.name}}
    </div>
    <div><button @click="deleteProject()">Delete Project</button></div>
    <div class="stage">
      <div class="stage-selector-container">
        <StageSelector />
      </div>
      <div class="stage-editor-container">
        <StageEditor />
      </div>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import StageSelector from './StageSelector';
import StageEditor from './StageEditor';

export default {
  name: 'Project',
  data() {
    return {
      newProjectName: ''
    }
  },
  components: {
    StageSelector,
    StageEditor
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
.stage {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: repeat(2, 1fr);
}

.stage-selector-container {
  background-color: #b94c8d66
}

.stage-editor-container {
  background-color: #bda5b787
}

</style>
