<template>
  <div>
    <div>
       Number of tests: <input type="text" v-model="numberOfTests" />
    </div>
    <div>
      <button @click="generateTests()">Generate Tests</button>  <button @click="clearTestsForProject()">Clear all tests</button>
    </div>
    <div>
      <div>Generated Tests:</div>
      <div v-for="testId in testIds" v-bind:key="testId">
        <router-link :to="{ name: 'Test', params: { testId: testId }}">Test: {{testId}}</router-link>
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
    }
  },
  methods: {
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
    async clearTestsForProject(){
      await firebaseService.clearTestsForProject(this.project.id);
      this.$store.commit('updateTestIds', []);
    },
    generateTest(){
      const testQuestions = this.project.stages.map(s => {
        const pos = this.getRandomInt(s.questions.length);
        return JSON.parse(JSON.stringify(s.questions[pos]));
      });
      return {
        projectId: this.project.id,
        projectName: this.project.name,
        questions: testQuestions
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  }
}
</script>

<style>
textarea {
  width: 90%;
  height: 100%;
}
</style>