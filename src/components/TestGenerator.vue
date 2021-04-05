<template>
  <div>
    <div>
       <h4>Number of tests:</h4>
      <Input class="tests-input" type="text" v-model="numberOfTests" />
    </div>
    <div>
      <Button class="test-generator-button" @click="generateTests()">Generate Tests</Button>
      <Button class="test-generator-button" @click="clearTestsAndSolutionsForProject()">Clear all tests and solutions</Button>
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
    }
  },
  components: {
  },
  mounted(){
    this.loadProjectTestIds();
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
      }catch(e){
        console.error(e);
      }
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

  .test-generator-button {
    margin-right: 1em;
    margin-bottom: 1em;
    border-radius: 15px;
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
