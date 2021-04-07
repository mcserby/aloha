<template>
  <div class="page-header">
    <h2>{{ title }}</h2>
    <div class="timer-hints">
      <p class="remaining-time">{{remainingTime}}</p>
      <i v-if="isTestRoute" id="timer-popup" @click="displayHints" class="pi pi-info-circle"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    title: String,
    remainingTime: String
  },
  computed: {
    isTestRoute() {
      return this.$route.name === 'Test';
    }
  },
  methods: {
    displayHints() {
      if (this.isTestRoute) {
          this.$confirm.require({
            target: document.getElementById('timer-popup'),
            message: `➡ Save your progress by using CTRL+S \n➡ The test is submitted automatically if your time is up \n➡ You can start your test after you fill in your name and your email ➡ Make sure to choose your favourite technologies`,
            rejectClass: 'disabled-reject',
            acceptLabel: 'Got It',
            acceptClass: 'primary-btn'
          })
      }
    },
  }
}
</script>

<style>
.page-header {
  width: 100%;
  background-color: #232931;
  border-radius: 15px 15px 0 0;
  border-bottom: 5px solid #4ECCA3;
  padding: 0 2em;
  margin: 4em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  word-break: break-word;
}

.timer-hints {
  display: flex;
  align-items: center;
}

.remaining-time {
  color: #4ECCA3;
  font-size: 18px;
}

.timer-hints i {
  margin-left: 15px;
  cursor: pointer;
  font-size: 20px;
  opacity: 0.7;
}

.disabled-reject {
  display: none !important;
}
</style>
