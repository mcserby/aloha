<template>
  <div class="stage-selector">
    Stage Selector
    <div :class="activeStage === stage.name ? 'active-stage': ''" @click="selectStage(stage)" v-for="stage in stages" v-bind:key="stage.id" class="stage">
      <div>
      ({{stage.points || 0}}p) {{stage.name}}
      </div>
      <div>
        <Button class="rnd-btn" @click="deleteStage(stage)" icon="pi pi-times"></Button>
      </div>
    </div>
    <div>
      <div v-if="!newStageEditMode" @click="enableNewStage()">
        <Button label="New Stage" class="rnd-btn"></Button>
      </div>
      <div v-else>
        <Input type="text" placeholder="New Stage..." v-model="newStageName" />
        <Input type="text" v-model="newStagePoints" />
        <Button class="rnd-btn save-new-stage" @click="saveStage()" label="Save"></Button>
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
      activeStage: '',
      newStagePoints: 10,
    }
  },
  components: {},
  computed: {},
  methods: {
    enableNewStage() {
      this.newStageEditMode = true;
      console.log('enableNewStage');
    },
    saveStage(){
      this.$emit('saveNewStage', {
        id: uuidv4(),
        name: this.newStageName,
        points: parseInt(this.newStagePoints),
        questions: []
      });
      this.newStageName = '';
      this.newStageEditMode = false;
    },
    selectStage(stage) {
      this.$emit('selectStage', stage);
      this.activeStage = stage.name;
    },
    deleteStage(stage) {
      this.$emit('deleteStage', stage);
    }
  }
}
</script>

<style scoped lang="scss">
.stage {
  border: 2px solid transparent;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  background-color: #3A3F46;
  align-items: center;
  border-radius: 15px;
  margin: .5em 0;
  padding: 15px;
  cursor: pointer;
  transition: .2s ease;

  &:hover {
    opacity: 0.8;
    transition: .2s ease;
  }
}

.active-stage {
  border: 2px solid #4ECCA3;
}

.stage-selector {
  background-color: #232931;
  padding: 1em;
  border-radius: 15px;
}

.save-new-stage {
  margin-left: 1em;
}
</style>
