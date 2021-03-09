<template>
  <div>
    <div>
      Q: {{question.text}}
    </div>
    <div>
      A: <textarea v-model="answer" :readonly="!isEditable" />
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

<style>
</style>
