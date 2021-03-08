<template>
  <div>
    <div>
      This is the test with id {{testId}}
    </div>
    <div class="test-header-container">
      <div>
        First Name: <input type="text" v-model="firstName" />   Second Name: <input type="text" v-model="secondName" />
      </div>
      <div>
          <span><button :disabled="!nameFilled" @click="startTest()">Start Test</button></span>
          <span>{{remainingTime}}</span>
      </div>
    </div>
    <div>
      <div v-for="question in questions" v-bind:key="question.id">
        <TestQuestion :question="question" :isEditable="testIsEditable" @update:answer="question.answer = $event"/>
      </div>
    </div>
    <div>
      <button :disabled="!testStarted" @click="submitSolution()">Submit Solution</button>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import TestQuestion from './TestQuestion';

export default {
  name: 'Test',
  data() {
    return {
      test: {},
      firstName: '',
      secondName: '',
      initialTotalTime: 600,
      totalTimeInSeconds: 600,
      timerInterval: null,
      testCompleted: false,
      startTime: null,
      questions: [],
    }
  },
  mounted() {
    this.loadTest(this.testId);
    this.attachCtrlSave();
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._keyListener);
  },
  components: {
    TestQuestion
  },
  computed: {
    nameFilled(){
      return this.firstName && this.secondName;
    },
    testIsEditable(){
      console.log('testIsEditable', !this.testCompleted || this.testStarted);
      return this.testStarted && !this.testCompleted;
    },
    testStarted(){
      console.log('testStarted: ',  this.startTime || false);
      return this.startTime || false;
    },
    testId(){
      return this.$route.params.testId;
    },
    remainingTime(){
      return this.remainingHours + ':' + this.remainingMinutes + ':' + this.remainingSeconds;
    },
    remainingHours(){
      return Math.floor(this.totalTimeInSeconds / 3600).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    },
    remainingMinutes(){
      return Math.floor((this.totalTimeInSeconds % 3600) / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    },
    remainingSeconds(){
      return Math.floor(this.totalTimeInSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    },
  },
  methods: {
    attachCtrlSave(){
      this._keyListener = function(e) {
        if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.saveProgress();
        }
       };
       document.addEventListener('keydown', this._keyListener.bind(this));
    },

    async loadTest(testId){
      try {
          this.test = await firebaseService.loadTest(testId);
          const solution = await firebaseService.loadSolution(testId);
          this.questions = this.test.questions;
          if(solution){
            console.log('solution', solution);
            this.testCompleted = solution.completed || false;
            this.firstName = solution.firstName;
            if(this.testCompleted){
                this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
                return;
            }
            this.secondName = solution.secondName;
            this.startTime = solution.startTime;
            if(solution.questions){
                this.questions = solution.questions;
            }
            this.totalTimeInSeconds = this.initialTotalTime - (new Date().getTime() - new Date(solution.startTime).getTime())/1000;
            this.triggerCountdownTimer();
          }
      } catch(e){
        console.error(e);
      }
    },
    async startTest(){
      this.startTime = new Date().getTime();
      const startTest = new Object({
        testId: this.test.id,
        startTime: this.startTime,
        projectId: this.test.projectId,
        firstName: this.firstName,
        secondName: this.secondName
      });
      await firebaseService.startTest(startTest);
      this.triggerCountdownTimer();
    },
    triggerCountdownTimer(){
      this.timerInterval = setInterval(this.updateTimer, 1000);
    },
    updateTimer(){
      this.totalTimeInSeconds = this.totalTimeInSeconds - 1;
      if(this.totalTimeInSeconds < 1){
        console.log('time is out. Solution will be submitted automatically');
        this.submitSolution();
      }
    },
    constructSolution(){
      const questionsCopy = JSON.parse(JSON.stringify(this.questions));
      const newQuestions = questionsCopy.map(q => new Object({
        id: q.id,
        text: q.text,
        answer: q.answer,
        score: -1
      }));
      return new Object({
        testId: this.test.id,
        questions: newQuestions
      });
    },
    async saveProgress(){
      if(!this.testStarted){
        console.log('before saving, test has to be started.');
      } else {
        console.log('saving progress...');
        const solution = this.constructSolution();
        await firebaseService.saveProgress(solution);
      }
    },
    async submitSolution(){
      console.log('submitting solution...');
      const solution = this.constructSolution();
      await firebaseService.submitSolution(solution);
      clearInterval(this.timerInterval);
      this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
    }
  }
}
</script>

<style>
.test-header-container {
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: 2fr 1fr;
}
</style>
