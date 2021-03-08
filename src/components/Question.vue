<template>
  <div>
    <div>
      Q: <textarea v-model="currentText" />
    </div>
    <div>
      A: <textarea v-model="currentAnswer" />
    </div>
    <div v-if="showSolution">
      S: <textarea v-model="currentSolution" />
    </div>
    <div>
      <button @click="updateQuestion()">Update Question</button> <button @click="$emit('deleteQuestion', question.id)">Delete Question</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Question',
  props: ['question', 'showSolution'],
  data() {
    return {
      currentText: '',
      currentAnswer: '',
      currentSolution: ''
    }
  },
  mounted(){
    this.currentText = this.question.text;
    this.currentAnswer = this.question.answer;
    this.currentSolution = this.question.solution;
  },
  components: {
  },
  computed: {
  },
  methods: {
    updateQuestion(){
      this.$emit('updateQuestion', {
        id: this.question.id,
        text: this.currentText,
        answer: this.currentAnswer,
        solution: this.currentSolution
      });
    }
  }
}
</script>

<style>
textarea {
  width: 90%;
  height: 100%;
}
</style>
