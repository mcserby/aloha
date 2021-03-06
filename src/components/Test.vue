<template>
  <PopUp></PopUp>
  <Toast></Toast>
  <ContextMenu :global="false" ref="menu"/>

  <Dialog :style="{width: '600px'}"
          :dismissableMask="false"
          :modal="true"
          class="privacy-dialog"
          v-model:visible="privacyModalVisible"
          :closable="false"
          :closeOnEscape="false"
          header="Privacy Notice">
    <p>This privacy notice informs you about the information we collect, store and process when you use this website to
      take a knowledge test for our internship program. In collecting, storing and processing this information, we are
      acting as a data controller and, by law, we are required to provide you with information about us, about why and
      how we use your data, and about the rights you have over your data.</p>
    <h3 class="privacy-subsection">Who are we?</h3>
    <p>Accesa IT Systems SRL (Str. Constanta nr. 12, Cluj Napoca)
      <br>
      Accesa IT Consulting SRL (Str. Constanta nr. 12, Cluj Napoca)
      <br>
      Ratiodata Accesa Romania SRL (Str. Constanta nr. 12, Cluj Napoca)
    </p>
    <h3 class="privacy-subsection">What personal data do we collect?</h3>
    <p>As part of the test you are about to undertake, we will collect, store and process the following information:
      <br>
      - Name and surname;
      <br>
      - Your email address;
      <br>
      - Your answers to the questions in the test.
      <br>
      This website does not use, store or collect any cookies.
    </p>
    <h3 class="privacy-subsection">Why do we collect this information?</h3>
    <p>We collect and process this information to assess your technical knowledge, as a mandatory step of the selection
      process for the internship program to which you have applied. </p>
    <h3 class="privacy-subsection">What are the legal bases for collecting this information?</h3>
    <p>The collection and processing of your data in relation to the purpose is based on our legitimate interest in
      selecting the best candidates for the internship program. This does not override your interests or your
      fundamental rights and freedoms.</p>
    <h3 class="privacy-subsection">What do we do with your information?</h3>
    <p>Your information is stored in our internal database. We will not share this information with any third parties,
      and we will not use the information to make any automated decisions that might affect you.</p>
    <h3 class="privacy-subsection">How long do we keep your information for?</h3>
    <p>We will keep your information until all open internship positions are fulfilled, but no longer than the 19th of
      July 2021. After this term, all the data collected through this website will be deleted.</p>
    <h3 class="privacy-subsection">Your rights over your information</h3>
    <p>By law, you can ask us what information we hold about you, and you can ask us to correct it if it is inaccurate.
      You can also ask for it to be erased, under certain conditions, and you can ask for us to give you a copy of the
      information. You can also ask us to stop using your information under certain conditions.</p>
    <h3 class="privacy-subsection">Your right to complain</h3>
    <p>If you have a complaint about our use of your information, you should:
      <br>
      - Firstly, contact our DPO at dpo@accesa.eu, +40 364 115 115
      <br>
      - Secondly, if you are not satisfied with the answer provided or if we haven’t answered your request in due time
      (30 days), contact Agentia Nationala pentru Supravegherea Datelor cu Caracter Personal at
      http://www.dataprotection.ro/?page=Plangeri_RGPD&lang=ro or write to them at anspdcp@dataprotection.ro.
    </p>

    <template #footer>
      <Button label="I have read and understood the terms of the privacy notice" icon="pi pi-check-circle"
              @click="hidePrivacyModal" class="primary-btn rnd-btn privacy-btn"/>
    </template>
  </Dialog>

  <div class="base-container test-container" @contextmenu="handleContextMenu" oncopy="return false"
       onpaste="return false">
    <div class="header-container">
      <PageHeader :title="'Test'" :remaining-time="remainingTime"></PageHeader>
      <p id="hint-display">.</p>
    </div>
    <div class="test-header-container">
      <div class="name-inputs">
        <div class="form-group">
          <label>First Name</label>
          <Input :disabled="testStarted" type="text" v-model="firstName"/>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <Input :disabled="testStarted" type="text" v-model="secondName"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <Input :disabled="testStarted" type="text" v-model="email"/>
        </div>
      </div>
      <div class="radio-preferences">
        <h2 class="preferences-title">Technology Preferences</h2>
        <p class="faded-description">
          1: Least Desirable <i class="pi pi-minus"></i> 5: Most Desirable
        </p>
        <div class="preference-cards">
          <RadioPreference v-for="topic in topics" v-bind:key="topic" v-on:changePreference="updatePreference($event)"
                           :value="topic.value" :for-technology="topic.technology" :disableEditing="false"/>
        </div>
      </div>
    </div>
    <div v-if="testStarted" class="questions">
      <div v-for="question in questions" v-bind:key="question.id">
        <TestQuestion :question="question" :isEditable="testIsEditable" @update:answer="question.answer = $event" @update:currentAnswers="question.answer = $event"/>
      </div>
    </div>
    <Button v-if="!startTestDisabled" :disabled="startTestDisabled" @click="startTest()"
            class="primary-btn rnd-btn start-test" label="Start Test"></Button>
    <Button class="rnd-btn primary-btn submit-test" v-if="testStarted" @click="submitSolution($event)">Submit Solution
    </Button>
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
  async mounted() {
    await this.loadTest(this.testId);
    this.attachCtrlSave();
    this.displayPrivacyModalIfTestNotStarted();
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
    startTestDisabled() {
      return this.testStarted || !this.mandatoryDataFilled;
    },
    mandatoryDataFilled() {
      return this.firstName && this.secondName && this.validateEmail(this.email);
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

    async updatePreference(updatedTopic) {
      const topicIndex = this.topics.findIndex(t => t.technology === updatedTopic.technology)
      this.topics.splice(topicIndex, 1, updatedTopic)
      await firebaseService.updateTestTopicPreferences(this.testId, this.topics);
    },

    async loadTest(testId) {
      try {
        this.test = await firebaseService.loadTest(testId);
        this.kickOffDate = this.test.kickOffDate || new Date().getTime() - 1000;
        if (this.kickOffDate > new Date().getTime()) {
          this.$router.push({name: 'BeforeKickOffDate', params: {'kickOffDate': this.kickOffDate}});
        }
        const solution = await firebaseService.loadSolution(testId);
        if (this.expirationDateMissingOrIsExpired(this.test.expirationDate) && !solution) {
          this.$router.push({name: 'EvaluationOver'});
          return;
        }
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
    expirationDateMissingOrIsExpired(expirationDate) {
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
        this.submitSolutionAutomatically();
      }
    },
    constructSolution() {
      const questionsCopy = JSON.parse(JSON.stringify(this.questions));
      const newQuestions = questionsCopy.map(q => new Object({...q, score: -1}));
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
        this.$toast.add({severity: 'success', summary: 'Success', detail: 'Progress Saved', life: 1000})
      }
    },
    async submitSolution(event) {
      await this.$confirm.require({
        target: event.currentTarget,
        message: 'Once you submit your answers, you cannot access your test again, are you sure?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Submit',
        acceptClass: 'primary-btn',
        rejectLabel: 'Cancel',
        accept: () => {
          this.submitSolutionAutomatically();
        }
      })
    },
    async submitSolutionAutomatically(){
      const solution = this.constructSolution();
      firebaseService.submitSolution(solution);
      clearInterval(this.timerInterval);
      this.stopMonitorOutOfFocusEvent();
      this.$router.push({name: 'ThankYou', params: {'firstName': this.firstName || 'John Doe'}});
    },
    focusHandler() {
      const timeGone = new Date() - this.leaveTime;
      if (timeGone > 2000) {
        const outOfFocus = new Object({
          testId: this.test.id,
          time: new Date().getTime(),
          timeGone: timeGone
        });
        firebaseService.updateTestOutOfFocus(outOfFocus);
      }
    },
    startMonitorOutOfFocusEvent() {
      this._blurHandler = () => {
        this.leaveTime = new Date();
      };
      window.addEventListener('blur', this._blurHandler);
      window.addEventListener('focus', this.focusHandler);
    },
    stopMonitorOutOfFocusEvent() {
      window.removeEventListener('blur', this._blurHandler);
      window.removeEventListener('focus', this.focusHandler);
    },
    displayPrivacyModalIfTestNotStarted() {
      if (!this.testStarted) {
        this.privacyModalVisible = true;
      }
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
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
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
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);

  .form-group {
    display: flex;
    flex-direction: column;
    margin-right: 2em;

  }
}

.privacy-btn {
  margin-top: 1em;
}

.submit-test {
  margin-top: 2em;
  margin-bottom: 12em;
}

.questions {
  width: 100%;
  border-radius: 15px;
  margin-top: 2em;
}

.radio-preferences {
  margin: 2em 0;
  width: 100%;
  background-color: #232931;
  padding: 1em;
  border-radius: 15px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 1em;
}

.privacy-subsection {
  text-align: center;
  margin: 1em 0;
  color: #00C2FF;
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
