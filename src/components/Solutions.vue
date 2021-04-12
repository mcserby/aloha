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
          <p> <span :class="percentageOfCompletedQuestions(solution)<100?'solution-not-completed': ''">{{ percentageOfCompletedQuestions(solution) }}% completed </span>, Total Score: <span class="score-number">{{totalScore(solution)}} </span></p>
        </div>
    </div>
  </div>
</template>

<script>

import PageHeader from "@/components/PageHeader";

export default {
  name: 'Solutions',
  data() {
    return {}
  },
  mounted() {
  },
  components: {PageHeader},
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    solutions() {
      return this.$store.state.solutions;
    }
  },
  methods: {
    percentageOfCompletedQuestions(solution) {
      const questions = solution.questions || [];
      if (questions.length === 0) {
        return 0;
      }
      return parseFloat(100 * questions.filter(q => q.score > -1).length / questions.length).toFixed(2);
    },
    totalScore(solution){
      const questions = solution.questions || [];
      if (questions.length === 0) {
        return 0;
      }
      return questions.filter(q => q.score > -1).map(q => q.score).reduce((a, b) => a + b, 0);
    },
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

  .score-number {
    color: #45ff4b;
  }
  .solution-not-completed {
    color: #ab2b2b;
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
