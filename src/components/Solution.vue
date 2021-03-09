<template>
  <div>
    <div>
      Solution: {{solutionId}}
    </div>
    <div>
      Aplicant: {{solution.firstName}} {{solution.secondName}}
    </div>
    <div v-for="question in questions" v-bind:key="question.id">
      <SolutionQuestion :question="question" @update-question="updateQuestion" />
    </div>

    <div>
      {{percentageOfCompletedQuestions}}% of questions completed
    </div>
    <div>
      <button :disabled="percentageOfCompletedQuestions !== 100" @click="completeEvaluation()">Complete evaluation</button>
    </div>

  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import SolutionQuestion from './SolutionQuestion';

export default {
  name: 'Solution',
  data() {
    return {
    }
  },
  components: {
    SolutionQuestion
  },
  computed: {
    solutionId(){
      return this.$route.params.solutionId;
    },
    solution(){
      return this.$store.state.solutions.filter(s => s.id == this.solutionId)[0];
    },
    questions(){
      return this.solution.questions;
    },
    percentageOfCompletedQuestions(){
      return 100 * this.questions.filter(q => q.score > -1).length / this.questions.length
    }

  },
  methods: {
    async updateQuestion(question){
      const questionsCopy = JSON.parse(JSON.stringify(this.questions));
      const questionIndex = questionsCopy.findIndex(q => q.id == question.id);
      if(questionIndex >= 0){
        questionsCopy.splice(questionIndex, 1, question);
      }
      const solution = new Object({
        testId: this.solutionId,
        questions: questionsCopy
      });
      await firebaseService.saveProgress(solution);
      this.$store.commit('updateSolution', solution);
    }
  }
}
</script>

<style>

</style>
