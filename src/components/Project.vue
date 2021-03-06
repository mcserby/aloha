<template>
  <PopUp></PopUp>
  <div class="base-container">
    <div>
      Project Id: {{ project.id }}
    </div>
    <PageHeader :title="'Project: ' + project.name"/>

    <div class="test-duration">
      <div class="form-group">
        <label>Test Duration: (min)</label>
        <Input maxlength="3" size="3" type="text" v-model="testDuration"/>
      </div>
    </div>

    <div class="test-actions">
      <Button class="rnd-btn test-action-button p-button-danger" @click="deleteProject($event)">Delete Project</Button>
      <Button class="rnd-btn test-action-button" @click="displayContributors = !displayContributors">Contributors</Button>
      <Button :disabled="noQuestionsInTest" class="rnd-btn test-action-button" @click="displayTestGenerator = !displayTestGenerator">Test Generator</Button>
      <Button class="rnd-btn test-action-button" @click="displayTopicEditor = !displayTopicEditor">Topic Editor</Button>
      <router-link class="solution-button" :to="{name: 'Solutions', params: {'projectId': this.project.id}}"
                   v-if="projectIsLoaded">
        <Button class="primary-btn" label="Go To Solutions"></Button>
      </router-link>
    </div>
    <div class="stage-container">
      <div class="stage-selector-container">
        <StageSelector :stages="stages" @select-stage="selectStage" @save-new-stage="saveNewStage"
                       @delete-stage="deleteStage" @update-stage-name-and-points="updateStageNameAndPoints"/>
      </div>
      <div class="stage-editor-container">
        <StageEditor v-if="selectedStage" :stage="selectedStage" @add-new-question="addNewQuestion"
                     @add-checkbox-question="addCheckboxQuestion"
                     @update-question="updatedQuestion" @delete-question="deleteQuestion"/>
      </div>
    </div>
    <Dialog :style="{width: '600px'}" :dismissableMask="true" :modal="true" v-model:visible="displayContributors" header="Contributors">
      <div v-if="projectIsLoaded" class="contributors-container">
        <div class="add-contributor-container">
          <div class="add-contributor-input">
            <Input type="text" placeholder="E-mail Address" v-model="newContributor"/>
            <Button class="add-contributor" @click="addContributor()">Add new contributor</Button>
          </div>
          <div>Contributors:</div>
          <div class="contributors-emails">
            <p class="contributor" v-for="email in contributors" v-bind:key="email">{{ email }}</p>
          </div>
        </div>
      </div>
    </Dialog>

    <Dialog :style="{width: '600px'}"
            :dismissableMask="true"
            :modal="true"
            v-model:visible="displayTestGenerator"
            header="Test Generator"
    >
      <div class="test-generator-container">
        <TestGenerator v-if="projectIsLoaded" :project="project"/>
      </div>
    </Dialog>

    <Dialog :style="{width: '600px'}"
            :dismissableMask="true"
            :modal="true"
            v-model:visible="displayTopicEditor"
            header="Topic Editor"
    >
      <Chips @add="handleTopicAdd($event)" @remove="handleTopicRemove()" separator="," v-model="this.project.topics" />
    </Dialog>


  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import StageSelector from './StageSelector';
import StageEditor from './StageEditor';
import TestGenerator from './TestGenerator';
import {v4 as uuidv4} from 'uuid';
import PageHeader from "@/components/PageHeader";

export default {
  name: 'Project',
  data() {
    return {
      displayContributors: false,
      displayTestGenerator: false,
      displayTopicEditor: false,
      newProjectName: '',
      newContributor: '',
      testDuration: 120,
    }
  },
  mounted(){
    this.testDuration = this.projectTestDuration;
    this.loadSolutions(this.project.id);
  },
  components: {
    PageHeader,
    StageSelector,
    StageEditor,
    TestGenerator
  },
  watch: {
    projectIsLoaded(newProjectIsLoaded){
      if(newProjectIsLoaded){
        console.log('project is loaded');
        this.testDuration = this.project.testDuration || 125;
      }
    },
    testDuration(newTestDuration){
      if(this.projectIsLoaded){
        this.updateTestDuration(parseInt(newTestDuration));
      }
    }
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    projectIsLoaded() {
      return this.project.id !== undefined;
    },
    project() {
      return this.$store.state.projects.filter(p => p.id === this.projectId)[0] || {stages: []};
    },
    projectTestDuration(){
      return this.project.testDuration;
    },
    contributors() {
      return this.project.owners;
    },
    stages() {
      return this.project.stages;
    },
    topics() {
      return this.project.topics;
    },
    selectedStage() {
      const selectedStageId = this.$store.state.selectedStageId;
      const selectedStageIndex = Math.max(0, this.stages.findIndex(s => s.id == selectedStageId));
      return this.stages[selectedStageIndex]
    },
    noQuestionsInTest(){
      return this.stages[0]?.questions.length < 1;
    },
  },
  methods: {
    async loadSolutions(projectId) {
      console.log('loading solutions for ' + this.project.name);
      const solutions = await firebaseService.loadSolutions(projectId);
      this.$store.commit('updateSolutions', solutions);
    },
    deleteProject(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'WARNING! This will delete the project, are you sure you want to continue?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Delete',
        acceptClass: 'confirm-delete',
        rejectLabel: 'Cancel',
        accept: () => {
          const projId = this.project.id;
          firebaseService.deleteProject(projId);
          this.$router.push({name: 'Main'});
          this.$store.commit('deleteProject', projId);
        }
      })
    },
    selectStage(stage) {
      this.$store.commit('selectStage', stage.id);
    },
    async saveNewStage(stage) {
      const newStages = JSON.parse(JSON.stringify(this.stages));
      newStages.push(stage);
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
      this.selectedStage = updatedProject.stages ? updatedProject.stages[0] : 'unknown';
    },
    async deleteStage(stage) {
      const newStages = JSON.parse(JSON.stringify(this.stages));
      const index = newStages.findIndex(s => s.id == stage.id);
      if (index !== -1) {
        newStages.splice(index, 1);
      }
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
    },
    async updateStageNameAndPoints(stageNameAndPoints){
      const currentStageCopy = JSON.parse(JSON.stringify(this.stages.filter(s => s.id == stageNameAndPoints.id)[0]));
      currentStageCopy.name = stageNameAndPoints.name;
      currentStageCopy.points = stageNameAndPoints.points;
      await this.updateStages(currentStageCopy);
    },
    async updateStages(currentStageCopy) {
      const newStages = JSON.parse(JSON.stringify(this.stages));
      const index = newStages.findIndex(s => s.id == currentStageCopy.id);
      if (index !== -1) {
        newStages.splice(index, 1, currentStageCopy);
      }
      const updatedProject = await firebaseService.updateStages(this.project.id, newStages);
      this.$store.commit('updateProject', updatedProject);
    },
    async addNewQuestion() {
      const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
      currentStageCopy.questions.push({
        id: uuidv4(),
        text: 'question',
        answer: 'answer',
        type: 'text',
        solution: 'solution'
      });
      await this.updateStages(currentStageCopy);
    },
      async addCheckboxQuestion() {
          const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
          currentStageCopy.questions.push({
              id: uuidv4(),
              text: 'question',
              type: 'checkbox',
              answerOptions: [],
              solutionOptions: []
          });
          await this.updateStages(currentStageCopy);
      },

    async updatedQuestion(question) {
      console.log('updateQuestion', question);
      const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
      const questionIndex = currentStageCopy.questions.findIndex(q => q.id == question.id);
      if (questionIndex >= 0) {
        currentStageCopy.questions.splice(questionIndex, 1, question);
      }
      await this.updateStages(currentStageCopy);
    },
    async deleteQuestion(id) {
      console.log('deleteQuestion with id', id);
      const currentStageCopy = JSON.parse(JSON.stringify(this.selectedStage));
      const questionIndex = currentStageCopy.questions.findIndex(q => q.id == id);
      if (questionIndex >= 0) {
        currentStageCopy.questions.splice(questionIndex, 1);
      }
      await this.updateStages(currentStageCopy);
    },
    async addContributor() {
      const newContributors = JSON.parse(JSON.stringify(this.contributors));
      newContributors.push(this.newContributor.trim());
      const updatedProject = await firebaseService.updateContributors(this.project.id, newContributors);
      this.$store.commit('updateProject', updatedProject);
    },
    async handleTopicAdd(e) {
      const newTopics = e.value;
      const updatedProject = await firebaseService.updateTopics(this.project.id, newTopics);
      this.$store.commit('updateProject', updatedProject);
    },
    async handleTopicRemove() {
      const newTopics = this.topics;
      const updatedProject = await firebaseService.updateTopics(this.project.id, newTopics);
      this.$store.commit('updateProject', updatedProject);
    },
    async updateTestDuration(newTestDuration) {
      const updatedProject = await firebaseService.updateTestDuration(this.project.id, newTestDuration);
      this.$store.commit('updateProject', updatedProject);
    }
  }
}
</script>

<style>

.test-generator-container {
  background-color: #232931;
  border-radius: 15px;
}


.add-contributor-container {
  background-color: #232931;
  border-radius: 15px;
}

.test-action-button {
  margin-right: 1em !important;
  margin-top: .5em !important;
  width: 155px;
  display: flex;
  justify-content: center;
}

.stage-container {
  width: 100%;
  margin-top: 2em;
  display: grid;
  grid-gap: 1rem;
  font-size: 1em;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.test-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.contributors-emails {
  display: flex;
  flex-direction: column;
}

.contributors-container {
  width: 100%;
  border-radius: 15px;
  margin-bottom: 1em;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

}

.contributors-container .add-contributor {
  border-radius: 15px;
  margin-top: 1em;
}

.add-contributor-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
}

.solution-button {
  width: 200px;
  margin-top: .5em;
}

.confirm-delete {
  background: #ff4747 !important;
  border: none !important;
  color: #fff !important;
  font-weight: 600 !important;
}

</style>
