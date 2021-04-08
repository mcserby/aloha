<template>
  <PopUp></PopUp>
  <Toast></Toast>
  <ContextMenu :global="false" ref="menu"/>
  <Dialog :style="{width: '600px'}"
          :dismissableMask="false"
          :modal="true"
          v-model:visible="privacyModalVisible"
          :closable="false"
          :closeOnEscape="false"
          header="Privacy Policy">
    <p>Text goes here</p>
    <template #footer>
      <Button label="Okay" icon="pi pi-check-circle" @click="hidePrivacyModal" class="p-button-text"/>
    </template>
  </Dialog>
  <div class="base-container test-container" @contextmenu="handleContextMenu" oncopy="return false" onpaste="return false">
    <div class="header-container">
      <PageHeader :title="'Test'" :remaining-time="remainingTime"></PageHeader>
      <p id="hint-display">.</p>
    </div>
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
          <label>Email</label>
          <Input type="text" v-model="email"/>
        </div>
      </div>
      <div class="radio-preferences">
        <h2 class="preferences-title">Technology Preferences</h2>
        <p class="faded-description">
          1: Least Desirable <i class="pi pi-minus"></i> 5: Most Desirable
        </p>
        <div class="preference-cards">
          <RadioPreference v-for="topic in topics" v-bind:key="topic" v-on:changePreference="updatePreference($event)" :value="topic.value" :for-technology="topic.technology" :disableEditing="false"/>
        </div>
      </div>
    </div>
    <div v-if="testStarted" class="questions">
      <div v-for="question in questions" v-bind:key="question.id">
        <TestQuestion :question="question" :isEditable="testIsEditable" @update:answer="question.answer = $event"/>
      </div>
    </div>
    <Button v-if="!startTestDisabled" :disabled="startTestDisabled" @click="startTest()" class="primary-btn rnd-btn start-test" label="Start Test"></Button>
    <Button class="rnd-btn primary-btn submit-test" v-if="testStarted" @click="submitSolution()">Submit Solution</Button>
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
      email: '',
      initialTotalTime: 600,
      totalTimeInSeconds: 600,
      timerInterval: null,
      testCompleted: false,
      startTime: null,
      questions: [],
      topics: [],
      leaveTime: null,
      privacyModalVisible: false
    }
  },
  mounted() {
    this.loadTest(this.testId);
    this.attachCtrlSave();
    this.displayPrivacyModal();
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
    startTestDisabled(){
      return this.testStarted || !this.mandatoryDataFilled;
    },
    mandatoryDataFilled() {
      return this.firstName && this.secondName && this.email;
    },
    testIsEditable() {
      return this.testStarted && !this.testCompleted;
    },
    testStarted() {
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
    isTestRoute() {
      return this.$route.name === 'Test';
    }
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
        this.kickOffDate = this.test.kickOffDate || new Date().getTime() - 1000;
        if(this.kickOffDate > new Date().getTime()){
          this.$router.push({name: 'BeforeKickOffDate',  params: {'kickOffDate': this.kickOffDate}});
        }
        if(this.expirationDateMissingOrIsExpired(this.test.expirationDate)){
          this.$router.push({name: 'EvaluationOver'});
          return;
        }
        const solution = await firebaseService.loadSolution(testId);
        this.questions = this.test.questions;
        this.initialTotalTime = this.test.testDuration * 60;
        this.totalTimeInSeconds = this.initialTotalTime;
        this.topics = this.test.topics;
        if (solution) {
          this.testCompleted = solution.completed || false;
          this.firstName = solution.firstName;
          if (this.testCompleted) {
            this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
            return;
          }
          this.secondName = solution.secondName;
          this.email = solution.email;
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
    expirationDateMissingOrIsExpired(expirationDate){
      return !expirationDate || expirationDate <= new Date().getTime();
    },
    async startTest() {
      this.startTime = new Date().getTime();
      const solution = new Object({
        testId: this.test.id,
        startTime: this.startTime,
        projectId: this.test.projectId,
        firstName: this.firstName,
        secondName: this.secondName,
        email: this.email,
        topics: this.test.topics
      });
      await firebaseService.startTest(solution);
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
        this.$toast.add({severity:'success', summary: 'Success', detail:'Progress Saved', life: 1000})
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
    },
    displayPrivacyModal() {
      this.privacyModalVisible = true;
    },
    hidePrivacyModal() {
      setTimeout(() => {
        this.displayHints();
      }, 1000);
      this.privacyModalVisible = false;
    },
    displayHints() {
      if (this.isTestRoute) {
        this.$confirm.require({
          target: document.getElementById('hint-display'),
          message: `➡ Save your progress by using CTRL+S \n➡ The test is submitted automatically if your time is up ‏ ‏ ‏ ‏ ‏ ‎ ‎ ‏ ‏ ‎ ‎ ‏ ‏ ‎ ‎   ‏ ‏ ‎ ‎‏  ‏     ‎ ‎  ‏ ‎ ‎ ‏ ‏ ‎ ‎  ‎ ‎ ‏ ‏   ‎ ‎  ‏ ‏ ‎ ‎ ➡ You can start your test after you fill in your name and your email  ‏ ‏ ‎ ‎ ‏ ‏ ‎ ‎ ‏ ‏ ‎ ‎‏ ‏  ‎ ‎ ‏ ‏  ‎ ‎   ‏ ‎ ‎ ‏ ‏ ‎‎ ➡ Make sure to choose your favourite technology (5 - most desirable, 1 - least desirable).`,
          acceptLabel: 'Got It',
          rejectClass: 'disabled-reject',
          acceptClass: 'primary-btn'
        })
      }
    },
    handleContextMenu(event) {
      this.$refs.menu.show(event)
    }
  }
}
</script>

<style scoped lang="scss">
  .name-inputs {
    background-color: #232931;
    padding: 1em;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    box-shadow: 0 5px 30px rgba(0,0,0,0.15);

    .form-group {
      display: flex;
      flex-direction: column;
      margin-right: 2em;

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
    margin: 2em 0;
    width: 100%;
    background-color: #232931;
    padding: 1em;
    border-radius: 15px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.15);
  }

  .test-header-container {
    width: 100%;
  }

  .test-container {
    user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    -webkit-user-select: none !important;
  }

  .start-test {
    width: 200px;
    height: 50px;
    transition: .2s ease;

    &:hover {
      width: 220px;
      transition: .2s ease;
    }
  }

  .header-container {
    position: relative;
    width: 100%;

    #hint-display {
      color: red;
      position: absolute;
      right: 1.5em;
      opacity: 0;
      top: 43%;
    }
  }

  .preference-cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 3em;
  }

  .preferences-title {
    margin-top: 0;
    margin-bottom: 0;
  }
  .faded-description {
    margin-bottom: 1em;
    opacity: 0.5;
  }
</style>
