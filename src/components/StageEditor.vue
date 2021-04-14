<template>
  <div class="stage-editor-container">
    <div class="stage-editor-header">
      <p>Editing Stage: <span class="stage-name">{{ stage.name }}</span></p>
      <Button class="rnd-btn primary-btn" @click="$emit('addNewQuestion')">New Question</Button>
      <Button class="rnd-btn primary-btn" @click="$emit('addCheckboxQuestion')">Add checkbox Question</Button>
    </div>
    <div class="question-container" v-for="question in stage.questions" v-bind:key="question.id">
      <Question :question="question" @update-question="updateQuestion" @delete-question="deleteQuestion"
                :showSolution="true"/>
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
    return {}
  },
  computed: {},
  methods: {
    updateQuestion(q) {
      this.$emit('updateQuestion', q);
    },
    deleteQuestion(id) {
      this.$emit('deleteQuestion', id);
    }
  }
}
</script>

<style scoped lang="scss">
.stage-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.question-container {
  margin: 1em 0;
  padding-bottom: 1.5em;
  border-bottom: 1px solid #eee;
}

.stage-name {
  color: #4ECCA3;
}

.stage-editor-container {
  max-height: 500px;
  border: 1px solid #232931;
  overflow-y: auto;
  padding: 1em;
  background-color: #232931;
  border-radius: 15px;
  height: 100%;
}
</style>
