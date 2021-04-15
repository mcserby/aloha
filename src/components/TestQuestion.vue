<template>
  <div class="question-container">
    <div class="question-area">
      <h3>Question</h3>
      <p class="test-question"><vue3-markdown-it :source='question.text' /></p>
    </div>
    <div class="answer-area" v-if="questionType === 'text'">
      <h3>Answer</h3>
      <prism-editor class="prism-area" v-model="answer" ignoreTabKey :highlight="highlighter" line-numbers></prism-editor>
    </div>
      <div v-if="questionType === 'checkbox'">
          <CheckboxPreferences :options="question.currentAnswers"  @set-selected-options="setSelectedOptions($event)" />
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
import CheckboxPreferences from './CheckboxPreferences';

export default {
  name: 'TestQuestion',
  props: ['question', 'isEditable'],
  data() {
    return {
      lang: 'java'
    }
  },
  components: {
    PrismEditor,
    CheckboxPreferences
  },
  computed: {
    questionType(){
      return this.question.type || 'text';
    },
    answer: {
      get() {
         return this.question.answer || `answer


         `;
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
      setSelectedOptions(event) {
        this.$emit('update:currentAnswers', event);
      }
  }
}
</script>

<style scoped lang="scss">
  .question-container {
    margin-bottom: 2em;
    background-color: #232931;
    padding: 1em;
    border-radius: 15px;
  }
  .question-area {
    display: flex;
    flex-direction: column;

    h3 {
      margin: 0 0 .5em 0;
      color: #4ECCA3;
    }
  }

  .answer-area {
    margin-top: 2em;

    h3 {
      margin: 0 0 .5em 0;
      color: #4ECCA3;
    }
  }

  .prism-area {
    border-left: 2px solid #4ECCA3;
  }

  .test-question {
    max-width: 100%;
    word-wrap: anywhere;
    border-left: 2px solid #4ECCA3;
    padding-left: .5em;

    div {

      p {
        word-wrap: anywhere;
      }
    }
  }
</style>
