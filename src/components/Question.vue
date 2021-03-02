<template>
  <div>
    <div>
      Q: <textarea v-model="currentText" />
    <div>
    </div>
      A: <textarea v-model="currentAnswer" />
    </div>
    <div>
      <button @click="updateQuestion()">Update Question</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Question',
  props: ['question'],
  data() {
    return {
      currentText: '',
      currentAnswer: ''
    }
  },
  mounted(){
    this.currentText = this.question.text;
    this.currentAnswer = this.question.answer;
  },
  components: {
  },
  computed: {
  },
  methods: {
    updateQuestion(){
      this.$emit('updateQuestion', {id: this.question.id, text: this.currentText, answer: this.currentAnswer});
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
