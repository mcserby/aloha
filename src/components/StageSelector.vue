<template>
  <div class="stage-selector">
    Stage Selector
    <div v-for="stage in stages" v-bind:key="stage.id" class="stage">
      <div @click="this.$emit('selectStage', stage)">
      {{stage.name}}
      </div>
      <div>
        <Button class="rnd-btn" @click="this.$emit('deleteStage', stage)" icon="pi pi-times"></Button>
      </div>
    </div>
    <div>
      <div v-if="!newStageEditMode" @click="enableNewStage()">
        <Button label="New Stage" class="rnd-btn"></Button>
      </div>
      <div v-else>
        <Input type="text" placeholder="new stage..." v-model="newStageName" />
        <Button class="rnd-btn" @click="saveStage()" label="Save"></Button>
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

<style scoped lang="scss">
.stage {
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  background-color: #3A3F46;
  align-items: center;
  border-radius: 15px;
  margin: .5em 0;
  padding: 15px;
}

.stage-selector {
  background-color: #232931;
  padding: 1em;
  border-radius: 15px;
}
</style>
