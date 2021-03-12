<template>
  <div class="stage-editor-container">
    Stage Editor: {{stage.name}}
    <div>
        <div class="question-container" v-for="question in stage.questions" v-bind:key="question.id">
          <Question :question="question" @update-question="updateQuestion" @delete-question="deleteQuestion" :showSolution="true"/>
        </div>
        <div>
          <Button class="rnd-btn primary-btn" @click="$emit('addNewQuestion')">New Question</Button>
        </div>
    </div>
  </div>
</template>

<script>

import Question from './Question';

export default {
  name: 'StageEditor',
  props: ['stage'],
  components: {
    Question
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    updateQuestion(q){
      this.$emit('updateQuestion', q);
    },
    deleteQuestion(id){
      this.$emit('deleteQuestion', id);
    }
  }
}
</script>

<style scoped lang="scss">
.question-container {
  margin: 1em 0;
  padding-bottom: .5em;
  border-bottom: 1px solid #eee;
}
.stage-editor-container {
  padding: 1em;
  background-color: #232931;
  border-radius: 15px;
  height: 100%;
}
</style>
