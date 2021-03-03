<template>
  <div>
    Thank you {{firstName}}! Have a nice day!
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

<style>
</style>
