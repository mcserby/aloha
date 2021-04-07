<template>
  <div class="base-container thank-you">
    <h3 class="message">
      🎉 Test will kick off in {{processedTimeUntilKickOff.day}} days, {{processedTimeUntilKickOff.hour}} hours and {{processedTimeUntilKickOff.minute}} minutes. 🎉
    </h3>
  </div>
</template>

<script>

export default {
  name: 'BeforeKickOffDate',
  computed: {
    kickOffDate(){
      return parseInt(this.$route.params.kickOffDate);
    },
    timeUntilKickOff(){
      return this.kickOffDate - new Date().getTime();
    },
    processedTimeUntilKickOff(){
      let d = this.timeUntilKickOff / 1000;
      let r = {};
      const s = {
          day: 86400,
          hour: 3600,
          minute: 60
      };
      Object.keys(s).forEach(function(key){
          r[key] = Math.floor(d / s[key]);
          d -= r[key] * s[key];
      })
      return r;
    }
  }
}
</script>

<style lang="scss" scoped>
  .thank-you {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .message {
      background: #4ECCA3;
      padding: 2em;
      border-radius: 15px;
    }
  }
</style>
