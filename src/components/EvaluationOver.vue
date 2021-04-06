<template>
  <div class="base-container thank-you">
    <h3 class="message">
      🎉 Current evaluation phase is over. Keep an eye out for new internships! 🎉
    </h3>
  </div>
</template>

<script>

export default {
  name: 'EvaluationOver',
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
