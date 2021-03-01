<template>
  <div>
    Stage Editor: {{stage.name}}
    <div>
        <div v-for="question in stage.questions" v-bind:key="question.id">
          <Question :question="question" @update-question="updateQuestion"/>
        </div>
        <div>
          <button @click="$emit('addNewQuestion')">New Question</button>
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
    }
  }
}
</script>

<style>
</style>
