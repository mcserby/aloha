<template>
  <div class="base-container thank-you">
    <h3 class="message">
      🎉 Thank you {{firstName}}! Test was submitted. Have a nice day! 🎉
    </h3>
  </div>
</template>

<script>

export default {
  name: 'ThankYou',
  computed: {
    firstName(){
      return this.$route.params.firstName;
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
