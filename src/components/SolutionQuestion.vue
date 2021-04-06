<template>
  <div class="questions-wrapper">
    <div class="question" :class="score !== -1 ? 'corrected-question': ''">
      <h4>Q ({{question.points}}p): <vue3-markdown-it :source='question.text' /></h4>
      <p class="answer">A: {{question.answer}}</p>
      <p class="q-score"><span></span><Input v-model="score" @change="updateQuestion()"/></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SolutionQuestion',
  props: ['question', 'initialScore'],
  data() {
    return {
      score: -1
    }
  },
  mounted(){
    this.score = this.initialScore;
  },
  watch: {
    initialScore(newval) {
      this.score = newval;
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    updateQuestion(){
      if(this.score > this.question.points){
        this.score = this.question.points;
      }
      if(this.score < -1){
        this.score = -1;
      }
      const question = JSON.parse(JSON.stringify(this.question));
      question.score = parseInt(this.score);
      this.$emit('updateQuestion', question);
    }
  }
}
</script>

<style scoped lang="scss">
  .questions-wrapper {
    display: flex;
    flex-direction: column;
  }
  .question {
    width: 100%;
    padding: 1em;
    background-color: #232931;
    border-radius: 15px;
    margin-bottom: 1em;

    .answer {
      padding: 1em;
      border: 1px solid #3A3F46;
      border-radius: 15px;
      margin: 1em 0;
    }

    .q-score {
      display: flex;
      flex-direction: column;
    }

    h3 {
      margin: 0;
    }
  }

  .corrected-question {
    position: relative;
    box-shadow: 0 0 2px #4ECCA3;

    &:after {
      content: 'Corrected';
      position: absolute;
      right: 1em;
      top: 1.5em;
      background-color: #4ECCA3;
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 12px;
    }
  }
</style>
