<template>
  <div>
    <div>
      Question:  <Textarea :autoResize="true" v-model="currentText" />
    </div>
    <div v-if="type === 'text'">
      Answer template: <Textarea :autoResize="true" v-model="currentAnswer" />
    </div>
      <div v-if="type === 'checkbox'">
          Possible answers:
          <div class="question-container" v-for="(answer,index) in currentAnswers" v-bind:key="index">
          <Textarea :autoResize="true" v-model="currentAnswers[index]" />
          </div>
          <div>
          <Button class="rnd-btn primary-btn" @click="addAnswer()">Add another answer</Button>
          </div>
      </div>
      <div v-if="showSolution && type === 'checkbox'" class="margin-bottom-10">
          Solutions:
          <div>
              <CheckboxPreferences :options="currentAnswers" :selected="currentSolutions" @set-selected-options="setSelectedOptions($event)" />
          </div>
      </div>
    <div v-if="showSolution && type === 'text'">
      Solution: <Textarea :autoResize="true" v-model="currentSolution" />
    </div>
    <div>
      <Button class="rnd-btn question-button" @click="updateQuestion()">Update Question</Button>
      <Button class="rnd-btn question-button" @click="$emit('deleteQuestion', question.id)">Delete Question</Button>
    </div>
  </div>
</template>

<script>

import CheckboxPreferences from './CheckboxPreferences';

const defaultAnswer =  'answer';
export default {
  name: 'Question',
  props: ['question', 'showSolution'],
  data() {
    return {
      currentText: '',
      currentAnswer: '',
      currentSolution: '',
      currentAnswers: [defaultAnswer],
      currentSolutions: [defaultAnswer],
      type: 'text'
    }
  },
  mounted(){
    this.currentText = this.question.text;
    this.currentAnswer = this.question.answer;
    this.currentSolution = this.question.solution;
    this.type = this.question.type || 'text';
    this.currentAnswers = this.question.currentAnswers || [defaultAnswer];
    this.currentSolutions = this.question.currentSolutions || [defaultAnswer];
  },
  components: {
      CheckboxPreferences
  },
  computed: {
  },
  methods: {
    updateQuestion(){
        let question = {
            id: this.question.id,
            text: this.currentText,
            type: this.type || 'text'
        }
        if (question.type === 'text' || !question.type) {
            question = {
                ...question,
                answer: this.currentAnswer,
                solution: this.currentSolution,
            }
        } else {
            question = {
                ...question,
                type: 'checkbox',
                currentAnswers: this.currentAnswers,
                currentSolutions: this.currentSolutions,
            }
        }
      this.$emit('updateQuestion', {...question
      });
    },
      addAnswer() {
        this.currentAnswers.push(defaultAnswer);
          this.currentSolutions.push(defaultAnswer);
      },
      setSelectedOptions(val) {
        this.currentSolutions = val;
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
.margin-bottom-10 {
    margin-bottom: 10px;
}
</style>
