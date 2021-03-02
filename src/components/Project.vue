<template>
  <div>
    <div>
      This is project page.
      Project id: {{project.id}}
      Project name: {{project.name}}
    </div>
    <div><button @click="deleteProject()">Delete Project</button></div>
    <div class="stage-container">
      <div class="stage-selector-container">
        <StageSelector :stages="stages" @select-stage="selectStage" @save-new-stage="saveNewStage" @delete-stage="deleteStage"/>
      </div>
      <div class="stage-editor-container">
        <StageEditor v-if="selectedStage" :stage="selectedStage" @add-new-question="addNewQuestion" @update-question="updatedQuestion"/>
      </div>
    </div>
    <div>
      <TestGenerator :project="project" />
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import StageSelector from './StageSelector';
import StageEditor from './StageEditor';
import TestGenerator from './TestGenerator';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Project',
  data() {
    return {
      newProjectName: '',
    }
  },
  mounted() {
  },
  components: {
    StageSelector,
    StageEditor,
    TestGenerator
  },
  computed: {
    projectId(){
      const route =  this.$route.params.projectId;
      console.log('route:', route);
      return route;
    },
    project(){
      return this.$store.state.projects.filter(p => p.id === this.projectId)[0] || {stages: []};
    },
    stages(){
      return this.project.stages;
    },
    selectedStage(){
      const selectedStageId = this.$store.state.selectedStageId;
      const selectedStageIndex = Math.max(0, this.stages.findIndex(s => s.id == selectedStageId));
      return this.stages[selectedStageIndex]
    }
  },
  methods: {
    deleteProject(){
      const projId = this.project.id;
      firebaseService.deleteProject(projId);
      this.$router.push({name: 'Main'});
      this.$store.commit('deleteProject', projId);
    },
    selectStage(stage){
      console.log('selectStage', stage);
      this.$store.commit('selectStage', stage.id);
    },
    async saveNewStage(stage){
      const newStages = JSON.parse(JSON.stringify(this.stages));
      newStages.push(stage);
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
      this.selectedStage = updatedProject.stages? updatedProject.stages[0] : 'unknown';
    },
    async deleteStage(stage){
      const newStages = JSON.parse(JSON.stringify(this.stages));
      const index = newStages.findIndex(s => s.id == stage.id);
      if(index !== -1){
        newStages.splice(index, 1);
      }
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
    },
    async updateStages(currentStageCopy){
      const newStages = JSON.parse(JSON.stringify(this.stages));
      const index = newStages.findIndex(s => s.id == currentStageCopy.id);
      if(index !== -1){
        newStages.splice(index, 1, currentStageCopy);
      }
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
    },
    async addNewQuestion(){
      const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
      currentStageCopy.questions.push({id: uuidv4(), text: 'question', answer: 'answer'});
      await this.updateStages(currentStageCopy);
    },
    async updatedQuestion(question){
      console.log('updateQuestion', question);
      const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
      const questionIndex = currentStageCopy.questions.findIndex(q => q.id == question.id);
      if(questionIndex >= 0){
        currentStageCopy.questions.splice(questionIndex, 1, question);
      }
      await this.updateStages(currentStageCopy);
    },
  }
}
</script>

<style>
.stage-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: 1fr 2fr;
}

.stage-selector-container {
  background-color: #b94c8d66
}

.stage-editor-container {
  background-color: #bda5b787
}

</style>
