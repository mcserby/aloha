<template>
  <div>
    <div>
      Solution: {{solutionId}}
    </div>
    <div>
      Aplicant: {{solution.firstName}} {{solution.secondName}}
    </div>
  </div>
</template>

<script>

//import firebaseService from '../services/firebaseService';

export default {
  name: 'Solution',
  data() {
    return {
    }
  },
  components: {
  },
  computed: {
    solutionId(){
      return this.$route.params.solutionId;
    },
    solution(){
      return this.$store.state.solutions.filter(s => s.id == this.solutionId)[0];
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
