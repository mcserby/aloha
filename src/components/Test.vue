<template>
  <div class="base-container">
    <PageHeader :title="'Test ' + testId" :remaining-time="remainingTime"></PageHeader>
    <div class="test-header-container">
      <div class="name-inputs">
        <div class="form-group">
          <label>First Name</label>
          <Input type="text" v-model="firstName"/>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <Input type="text" v-model="secondName"/>
        </div>
        <div class="form-group">
          <Button :disabled="testStarted" @click="startTest()" class="primary-btn rnd-btn start-test" label="Start Test"></Button>
        </div>
      </div>
      <div class="radio-preferences">
        <h2 class="preferences-title">Technology Preferences</h2>
        <p class="faded-description">
          1: Least Preferable <i class="pi pi-minus"></i> 5: Most Preferable
        </p>
        <div class="preference-cards">
          <RadioPreference v-for="topic in topics" v-bind:key="topic" v-on:changePreference="updatePreference($event)" :value="topic.value" :for-technology="topic.technology"/>
        </div>
      </div>
    </div>
    <div v-if="testStarted" class="questions">
      <div v-for="question in questions" v-bind:key="question.id">
        <TestQuestion :question="question" :isEditable="testIsEditable" @update:answer="question.answer = $event"/>
      </div>
    </div>
    <Button class="rnd-btn submit-test" :disabled="!testStarted" @click="submitSolution()">Submit Solution</Button>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import TestQuestion from './TestQuestion';
import PageHeader from "@/components/PageHeader";
import RadioPreference from "@/components/RadioPreference";

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
      topics: [],
      leaveTime: null,
    }
  },
  mounted() {
    this.loadTest(this.testId);
    this.attachCtrlSave();
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._keyListener);
    this.stopMonitorOutOfFocusEvent();
  },
  components: {
    PageHeader,
    TestQuestion,
    RadioPreference
  },
  computed: {
    nameFilled() {
      return this.firstName && this.secondName;
    },
    testIsEditable() {
      console.log('testIsEditable', !this.testCompleted || this.testStarted);
      return this.testStarted && !this.testCompleted;
    },
    testStarted() {
      console.log('testStarted: ', this.startTime || false);
      return this.startTime || false;
    },
    testId() {
      return this.$route.params.testId;
    },
    remainingTime() {
      return this.remainingHours + ':' + this.remainingMinutes + ':' + this.remainingSeconds;
    },
    remainingHours() {
      return Math.floor(this.totalTimeInSeconds / 3600).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    },
    remainingMinutes() {
      return Math.floor((this.totalTimeInSeconds % 3600) / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    },
    remainingSeconds() {
      return Math.floor(this.totalTimeInSeconds % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    },
  },
  methods: {
    attachCtrlSave() {
      this._keyListener = function (e) {
        if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.saveProgress();
        }
      };
      document.addEventListener('keydown', this._keyListener.bind(this));
    },

    async updatePreference (updatedTopic) {
      const topicIndex = this.topics.findIndex(t => t.technology === updatedTopic.technology)
      this.topics.splice(topicIndex, 1, updatedTopic)
      await firebaseService.updateTestTopicPreferences(this.testId, this.topics);
    },

    async loadTest(testId) {
      try {
        this.test = await firebaseService.loadTest(testId);
        const solution = await firebaseService.loadSolution(testId);
        this.questions = this.test.questions;
        console.log('this.test.testDuration', this.test.testDuration);
        this.initialTotalTime = this.test.testDuration * 60;
        this.totalTimeInSeconds = this.initialTotalTime;
        this.topics = this.test.topics;
        if (solution) {
          console.log('solution', solution);
          this.testCompleted = solution.completed || false;
          this.firstName = solution.firstName;
          if (this.testCompleted) {
            this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
            return;
          }
          this.secondName = solution.secondName;
          this.startTime = solution.startTime;
          if (solution.questions) {
            this.questions = solution.questions;
          }
          this.totalTimeInSeconds = this.initialTotalTime - (new Date().getTime() - new Date(solution.startTime).getTime()) / 1000;
          this.triggerCountdownTimer();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async startTest() {
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
      this.startMonitorOutOfFocusEvent();// TODO: start monitor out of focus intervals
    },
    triggerCountdownTimer() {
      this.timerInterval = setInterval(this.updateTimer, 1000);
    },
    updateTimer() {
      this.totalTimeInSeconds = this.totalTimeInSeconds - 1;
      if (this.totalTimeInSeconds < 1) {
        console.log('time is out. Solution will be submitted automatically');
        this.submitSolution();
      }
    },
    constructSolution() {
      const questionsCopy = JSON.parse(JSON.stringify(this.questions));
      const newQuestions = questionsCopy.map(q => new Object({
        id: q.id,
        text: q.text,
        answer: q.answer,
        points: q.points,
        score: -1
      }));
      return new Object({
        testId: this.test.id,
        questions: newQuestions
      });
    },
    async saveProgress() {
      if (!this.testStarted) {
        console.log('before saving, test has to be started.');
      } else {
        console.log('saving progress...');
        const solution = this.constructSolution();
        await firebaseService.saveProgress(solution);
      }
    },
    async submitSolution() {
      console.log('submitting solution...');
      const solution = this.constructSolution();
      await firebaseService.submitSolution(solution);
      clearInterval(this.timerInterval);
      this.stopMonitorOutOfFocusEvent();
      this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
    },
    focusHandler(){
      const timeGone = new Date() - this.leaveTime;
      if(timeGone > 2000){
        const outOfFocus = new Object({
          testId: this.test.id,
          time: new Date().getTime(),
          timeGone: timeGone
        });
        firebaseService.updateTestOutOfFocus(outOfFocus);
      }
    },
    startMonitorOutOfFocusEvent(){
      console.log('adding out of focus events');
      this._blurHandler = () => {
        this.leaveTime = new Date();
      };
      window.addEventListener('blur', this._blurHandler);
      window.addEventListener('focus', this.focusHandler);
    },
    stopMonitorOutOfFocusEvent(){
      window.removeEventListener('blur', this._blurHandler);
      window.removeEventListener('focus', this.focusHandler);
    }
  }
}
</script>

<style scoped lang="scss">
  .name-inputs {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;

    .form-group {
      display: flex;
      flex-direction: column;
      margin-right: 2em;

      .start-test {
        margin-top: .5em;
      }
    }
  }

  .submit-test {
    margin-top: 2em;
  }

  .questions {
    width: 100%;
    background-color: #232931;
    border-radius: 15px;
    padding: 1em;
    margin-top: 2em;
  }

  .radio-preferences {
    width: 100%;
  }

  .test-header-container {
    width: 100%;
  }

  .preference-cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 3em;
  }

  .preferences-title {
    margin-bottom: 0;
  }
  .faded-description {
    margin-bottom: 1em;
    opacity: 0.5;
  }
</style>
