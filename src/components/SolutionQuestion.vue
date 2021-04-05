<template>
  <div class="questions-wrapper">
    <div class="question" :class="score !== -1 ? 'corrected-question': ''">
      <h3>Q: {{question.text}}</h3>
      <p class="answer">A: {{question.answer}}</p>
      <p class="q-score"><span></span><Input v-model="score" @change="$emit('updateQuestion', {score: score, id: question.id, text: question.text, answer: question.answer})"/></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SolutionQuestion',
  props: ['question'],
  data() {
    return {
      score: -1
    }
  },
  mounted(){
    this.score = this.question.score;
  },
  components: {
  },
  computed: {
  },
  methods: {
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
