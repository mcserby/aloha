<template>
  <div class="base-container">
    <PageHeader :title="'Applicant: ' + solution.firstName + ' ' + solution.secondName">
      Aplicant: {{ solution.firstName }} {{ solution.secondName }}
    </PageHeader>
    <div v-for="interval in outOfTestIntervals" v-bind:key="interval.timeSinceStart">
      minute: {{interval.timeSinceStart}}, duration: {{interval.duration}} seconds
    </div>
    <div class="solution-questions" v-for="question in questions" v-bind:key="question.id">
      <SolutionQuestion :question="question" @update-question="updateQuestion"/>
    </div>
    <p class="q-percentage">{{ percentageOfCompletedQuestions }}% of questions completed</p>
    <Button class="rnd-btn complete-eval" :disabled="percentageOfCompletedQuestions !== 100"
            @click="completeEvaluation()">Complete evaluation
    </Button>

  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';
import SolutionQuestion from './SolutionQuestion';
import PageHeader from "@/components/PageHeader";

export default {
  name: 'Solution',
  data() {
    return {}
  },
  components: {
    PageHeader,
    SolutionQuestion
  },
  computed: {
    solutionId() {
      return this.$route.params.solutionId;
    },
    solution() {
      return this.$store.state.solutions.filter(s => s.id === this.solutionId)[0];
    },
    questions() {
      return this.solution.questions || [];
    },
    outOfTestIntervals(){
      return (this.solution.outOfFocus || []).map(oof => new Object({
        timeSinceStart: (oof.time - this.solution.startTime)/60000,
        duration: oof.timeGone/1000
      }));
    },
    percentageOfCompletedQuestions() {
      if (this.questions.length === 0) {
        return 0;
      }
      const result = parseFloat(100 * this.questions.filter(q => q.score > -1).length / this.questions.length).toFixed(2);
      return parseInt(result);
    }

  },
  mounted() {
    console.log(this.percentageOfCompletedQuestions)
  },
  methods: {
    async updateQuestion(question) {
      const questionsCopy = JSON.parse(JSON.stringify(this.questions));
      const questionIndex = questionsCopy.findIndex(q => q.id === question.id);
      if (questionIndex >= 0) {
        questionsCopy.splice(questionIndex, 1, question);
      }
      const solution = new Object({
        testId: this.solutionId,
        questions: questionsCopy
      });
      await firebaseService.saveProgress(solution);
      this.$store.commit('updateSolution', solution);
    },
    async completeEvaluation() {
      const solution = new Object({
        testId: this.solutionId,
      });
      await firebaseService.completeSolutionEvaluation(solution);
      await this.$router.push({name: 'Solutions', params: {'projectId': this.solutionId}})
    }
  }
}
</script>

<style scoped lang="scss">
.q-percentage {
  color: #4ECCA3;
}

.solution-questions {
  width: 100%;
}

.complete-eval {
  margin: 1em 0;
}
</style>
