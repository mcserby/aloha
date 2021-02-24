<template>
  <Header />
  <router-view />
</template>

<script>

import Header from './components/Header';
import firebaseConfig from './services/firebase';

export default {
  name: 'App',
  components: {
    Header
  },
  mounted() {
    firebaseConfig.init();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}
</style>
