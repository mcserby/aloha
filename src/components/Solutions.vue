<template>
  <div>
    <div>
      welcome to solutions page for projectId {{projectId}}
    </div>
    <div v-if="solutions.length == 0">
      No solution has been submitted yet
    </div>
    <div v-else>
      <div v-for="solution in solutions" v-bind:key="solution.id">
        <div class="solution-wrapper">
          <div><router-link :to="{ name: 'Solution', params: { solutionId: solution.id }}">Solution: {{solution.firstName}}_{{solution.secondName}}</router-link></div>
          <div>{{percentageOfCompletedQuestions(solution)}}% completed</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';

export default {
  name: 'Solutions',
  data() {
    return {
    }
  },
  mounted() {
    this.loadSolutions(this.projectId);
  },
  components: {
  },
  computed: {
    projectId(){
      return this.$route.params.projectId;
    },
    solutions(){
      return this.$store.state.solutions;
    }
  },
  methods: {
    async loadSolutions(projectId){
      if(this.solutions.length === 0){
        console.log('loading solutions...');
        const solutions = await firebaseService.loadSolutions(projectId);
        this.$store.commit('updateSolutions', solutions);
      }
    },
    percentageOfCompletedQuestions(solution){
      const questions = solution.questions || [];
      if(questions.length == 0){
        return 0;
      }
      return parseFloat(100 * questions.filter(q => q.score > -1).length / questions.length).toFixed(2);
    }
  }
}
</script>

<style>
.solution-wrapper {
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: 2fr 1fr;
}
</style>
