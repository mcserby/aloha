<template>
  <div class="question-container">
    <div class="question-area">
      <h2>Q: </h2>
      <p>{{question.text}}</p>
    </div>
    <div>
      <prism-editor class="answer-area" v-model="answer" ignoreTabKey :highlight="highlighter" line-numbers></prism-editor>
    </div>
  </div>
</template>

<script>
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: 'TestQuestion',
  props: ['question', 'isEditable'],
  data() {
    return {
      lang: 'java'
    }
  },
  components: {
    PrismEditor
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
    highlighter(code) {
      return highlight(code, languages.js);
    },
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

    h2 {
      margin: 0 .5em 0 0;
      color: #4ECCA3;
    }
  }
</style>
