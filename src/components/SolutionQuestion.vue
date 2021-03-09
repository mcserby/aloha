<template>
  <div class="solution-wrapper">
    <div>
      <div>
        Q: {{question.text}}
      </div>
      <div>
        A: {{question.answer}}
      </div>
    </div>
    <div>
      score: <input type="text" v-model="score" @change="$emit('updateQuestion', {score: score, id: question.id, text: question.text, answer: question.answer})">
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

<style>
.solution-wrapper {
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: 3fr 1fr;
}
</style>
