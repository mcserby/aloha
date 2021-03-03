<template>
  <div>
    <div>
      This is the test with id {{testId}}
    </div>
    <div>
      First Name: <input type="text" v-model="firstName" />   Second Name: <input type="text" v-model="secondName" />
    </div>
    <div>
      <div v-for="question in questions" v-bind:key="question.id">
        <TestQuestion :question="question" @update:answer="question.answer = $event"/>
      </div>
    </div>
    <div>
      <button @click="submitSolution()">Submit Solution</button>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import TestQuestion from './TestQuestion';

export default {
  name: 'Project',
  data() {
    return {
      test: {},
      firstName: '',
      secondName: '',
    }
  },
  mounted() {
    this.loadTest(this.testId);
  },
  components: {
    TestQuestion
  },
  computed: {
    testId(){
      return this.$route.params.testId;
    },
    questions(){
      return this.test.questions;
    }
  },
  methods: {
    async loadTest(testId){
      try {
          this.test = await firebaseService.loadTest(testId);
      } catch(e){
        console.error(e);
      }
    },
    updateQuestion(q){
      console.log('updateQuestion', q);
    },
    submitSolution(){
      console.log('solution:', JSON.stringify({
        firstName: this.firstName,
        secondName: this.secondName,
        questions: this.test.questions
      }));
    }
  }
}
</script>

<style>
</style>
