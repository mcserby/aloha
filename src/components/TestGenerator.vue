<template>
  <div>
    <div>
       <h4>Number of tests:</h4>
      <Input class="tests-input" type="text" v-model="numberOfTests" />
    </div>
    <div>
      <h4>Kickoff date:</h4>
      <Calendar v-model="kickOffDate" showTime :minDate="currentTime()" />
    </div>
    <div>
      <h4>Expiration date:</h4>
      <Calendar v-model="expirationDate" showTime :minDate="currentTime()" />
    </div>
    <div class="generator-actions">
      <Button class="test-generator-button" @click="generateTests()">Generate Tests</Button>
      <Button class="test-generator-button" @click="clearTestsAndSolutionsForProject()">Clear all tests and solutions</Button>
      <a class="texts-download" :href="blobUrl" text="Download Tests" download>Download Tests</a>
    </div>
    <div class="generated-tests">
      <div>Generated Tests:</div>
      <div v-for="testId in testIds" v-bind:key="testId">
          <router-link class="generated-link" :to="{ name: 'Test', params: { testId: testId }}">Test: {{testId}}</router-link>
          <router-link class="solution-link" v-if="hasSolution(testId)" :to="{ name: 'Solution', params: { solutionId: testId }}">
            <i class="pi pi-arrow-right"></i> Solution
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';

export default {
  name: 'TestGenerator',
  props: ['project'],
  data() {
    return {
      numberOfTests: 1,
      expirationDate: new Date(new Date().getTime() + 48*60*60000),
      kickOffDate: new Date(),
      blobUrl: null,
    }
  },
  components: {
  },
  mounted(){
    this.loadProjectTestIds();
    this.createTestUrlsBlob();
  },
  computed: {
    testIds(){
      return this.$store.state.testIds;
    },
    solutionIds(){
      return this.$store.state.solutions.map(s => s.id);
    }
  },
  methods: {
    currentTime(){
      return new Date();
    },
    hasSolution(solutionId){
      return this.solutionIds.indexOf(solutionId) >= 0;
    },
    async generateTests(){
      try {
        const tests = [];
        for(let i = 0; i < this.numberOfTests; i++){
          tests.push(this.generateTest());
        }
        await firebaseService.storeTests(tests);
        await this.loadProjectTestIds();
        this.createTestUrlsBlob();
      }catch(e){
        console.error(e);
      }
    },
    createTestUrlsBlob(){
      const urls = this.testIds.map(testId => "https://accesa-internship-portal.web.app/test/" + testId).join("\n");
      const blob = new Blob([urls], {type: 'text/csv'});
      this.blobUrl = URL.createObjectURL(blob);
    },
    async loadProjectTestIds(){
      const testIds = await firebaseService.loadTestIds(this.project.id);
      this.$store.commit('updateTestIds', testIds);
    },
    async clearTestsAndSolutionsForProject(){
      await firebaseService.clearTestsAndSolutionsForProject(this.project.id);
      this.$store.commit('updateTestIds', []);
      this.$store.commit('updateSolutions', []);
    },
    generateTest(){
      const testQuestions = this.project.stages
        .filter(stage => stage.questions.length > 0)
        .map(s => {
          const pos = this.getRandomInt(s.questions.length);
          let testQuestion = JSON.parse(JSON.stringify(s.questions[pos]));
          delete testQuestion.solution;
          testQuestion.points = s.points || 0;
          return testQuestion;
        });
      const topics = [];
      this.project.topics.forEach(topic => {
        topics.push({
          technology: topic,
          value: 5
        })
      })
      return {
        projectId: this.project.id,
        projectName: this.project.name,
        testDuration: this.project.testDuration,
        expirationDate: this.expirationDate.getTime(),
        kickOffDate: this.kickOffDate.getTime(),
        questions: testQuestions,
        topics: topics,
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  }
}
</script>

<style scoped lang="scss">
  .generated-tests {
    max-height: 200px;
    overflow-y: auto;
  }

  .generator-actions {
    margin: 1em 0;
    display: flex;
    align-items: center;
  }

  .test-generator-button {
    margin-right: 1em;
    border-radius: 15px;
  }

  .texts-download {
    color: #fff;
    text-decoration: #4ECCA3 underline;
  }

  .tests-input {
    width: 100%;
    margin-bottom: 1em;
  }

  .generated-link {
    color: #4ECCA3;
    transition: .2s ease;

    &:hover {
      color: #00C2FF;
      transition: .2s ease;
    }
  }

  .solution-link {
    margin-left: 5em;
    color: #4ECCA3;
    transition: .2s ease;

    &:hover {
      color: #00C2FF;
      transition: .2s ease;
    }
  }
</style>
