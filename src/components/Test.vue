<template>
  <div>
    <div>
      This is the test with id {{testId}}
    </div>
    <div>
      First Name: <input type="text" v-model="firstName" />   Second Name: <input type="text" v-model="secondName" />
    </div>
    <div>
      <div v-for="question in test.questions" v-bind:key="question.id">
        <Question :question="question" @update-question="updateQuestion"/>
      </div>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import Question from './Question';

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
    Question
  },
  computed: {
    testId(){
      return this.$route.params.testId;
    },
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
    }

  }
}
</script>

<style>
</style>
