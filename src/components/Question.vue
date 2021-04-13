<template>
  <div>
    <div>
      Question:  <Textarea :autoResize="true" v-model="currentText" />
    </div>
    <div>
      Answer template: <Textarea :autoResize="true" v-model="currentAnswer" />
    </div>
    <div v-if="showSolution">
      Solution: <Textarea :autoResize="true" v-model="currentSolution" />
    </div>
    <div>
      <Button class="rnd-btn question-button" @click="updateQuestion()">Update Question</Button>
      <Button class="rnd-btn question-button" @click="$emit('deleteQuestion', question.id)">Delete Question</Button>
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
        answer: this.currentAnswer + `


        `,
        solution: this.currentSolution
      });
    }
  }
}
</script>

<style scoped lang="scss">
textarea {
  border-radius: 15px;
  width: 100%;
}

.question-button {
  margin-right: .5em;
}
</style>
