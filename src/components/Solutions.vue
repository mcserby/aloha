<template>
  <div>
    <div>
      welcome to solutions page for projectId {{projectId}}
    </div>
    <div v-if="solutions.length == 0">
      No solution has been submitted yet
    </div>
    <div v-else>
      <div class="project-card" v-for="solution in solutions" v-bind:key="solution.id">
        <router-link :to="{ name: 'Solution', params: { solutionId: solution.id }}">Solution: {{solution.firstName}}_{{solution.secondName}}</router-link>
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
      const solutions = await firebaseService.loadSolutions(projectId);
      this.$store.commit('updateSolutions', solutions);
    }
  }
}
</script>

<style>
</style>
