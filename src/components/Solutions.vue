<template>
  <div class="base-container">
    <PageHeader :title="'Solutions for ' + projectId"></PageHeader>
    <div v-if="solutions.length === 0">
      No solution has been submitted yet
    </div>
    <div v-else class="solution-wrapper">
      <div class="submission" v-for="solution in solutions" v-bind:key="solution.id" :class="solution.evaluated ? 'evaluated-submission' : ''">
          <router-link class="submited-by" :to="{ name: 'Solution', params: { solutionId: solution.id }}">Solution:
            {{ solution.firstName }} {{ solution.secondName }} <i class="pi pi-arrow-right"></i>
          </router-link>
          <p>{{ percentageOfCompletedQuestions(solution) }}% completed</p>
        </div>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import PageHeader from "@/components/PageHeader";

export default {
  name: 'Solutions',
  data() {
    return {}
  },
  mounted() {
    this.loadSolutions(this.projectId);
  },
  components: {PageHeader},
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    solutions() {
      console.log(this.$store.state.solutions);
      return this.$store.state.solutions;
    }
  },
  methods: {
    async loadSolutions(projectId) {
      if (this.solutions.length === 0) {
        console.log('loading solutions...');
        const solutions = await firebaseService.loadSolutions(projectId);
        this.$store.commit('updateSolutions', solutions);
      }
    },
    percentageOfCompletedQuestions(solution) {
      const questions = solution.questions || [];
      if (questions.length === 0) {
        return 0;
      }
      return parseFloat(100 * questions.filter(q => q.score > -1).length / questions.length).toFixed(2);
    }
  }
}
</script>

<style scoped lang="scss">
.solution-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;


  .submission {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #232931;
    margin-bottom: 1em;
    padding: 1em 2em;
    border-radius: 15px;

    .submited-by {
      display: flex;
      align-items: center;
      color: #4ECCA3;
      padding: 1em 0;
      transition: .2s ease;

      i {
        margin-left: 1em;
        position: relative;
        top: 1px;
      }

      &:hover {
        padding: 1em 2em;
        background: #3A3F46;
        border-radius: 15px;
        transition: .2s ease;
      }
    }
  }

  .evaluated-submission {
    box-shadow: 0 0 2px #4ECCA3;

    .submited-by:before {
      content: 'Evaluated';
      margin-right: 10px;
      background-color: #4ECCA3;
      color: #fff;
      padding: 3px 10px;
      border-radius: 10px;
    }
  }
}
</style>
