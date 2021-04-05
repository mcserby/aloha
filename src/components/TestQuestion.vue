<template>
  <div class="question-container">
    <div class="question-area">
      <h3>Q({{question.points}}p): </h3>
      <p><vue3-markdown-it :source='question.text' /></p>
    </div>
    <div>
      <Textarea :autoResize="true" class="answer-area" placeholder="Answer" v-model="answer" :readonly="!isEditable" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'TestQuestion',
  props: ['question', 'isEditable'],
  data() {
    return {
    }
  },
  components: {
  },
  computed: {
    answer: {
      get() {
         return this.question.answer;
       },
       set(value) {
         this.$emit('update:answer', value);
       }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .question-container {
    margin-bottom: 1.5em;
  }
  .question-area {
    display: flex;
    align-items: center;

    h3 {
      margin: 0 .7em 0 0;
      color: #4ECCA3;
    }
  }
  .answer-area {
    border-radius: 15px;
    width: 100%;
  }
</style>
