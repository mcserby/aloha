<template>
  <div>
    Stage Selector
    <div v-for="stage in stages" v-bind:key="stage.id" class="stage">
      <div @click="this.$emit('selectStage', stage)">
      {{stage.name}}
      </div>
      <div>
        <button @click="this.$emit('deleteStage', stage)">delete</button>
      </div>
    </div>
    <div>
      <div v-if="!newStageEditMode" @click="enableNewStage()">
        new stage...
      </div>
      <div v-else>
        <input type="text" placeholder="new stage..." v-model="newStageName">
        <button @click="saveStage()"> Save </button>
      </div>
    </div>
  </div>
</template>

<script>

import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'StageSelector',
  props: ['stages'],
  data() {
    return {
      newStageEditMode: false,
      newStageName: '',
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    enableNewStage(){
      this.newStageEditMode = true;
      console.log('enableNewStage');
    },
    saveStage(){
      this.$emit('saveNewStage', {id: uuidv4(), name: this.newStageName, questions: []});
      this.newStageName = '';
      this.newStageEditMode = false;
    }
  }
}
</script>

<style>
.stage {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  font-size:1em;
  grid-template-columns: repeat(2, 1fr);
}

</style>
