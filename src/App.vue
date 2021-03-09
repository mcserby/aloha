<template>
  <Header />
  <router-view />
</template>

<script>

import Header from './components/Header';
import firebaseService from './services/firebaseService';

export default {
  name: 'App',
  components: {
    Header
  },
  mounted() {
    firebaseService.init();
    firebaseService.setOnAuthStateChage(this.onAuthStateChange);
  },
  methods: {
    async loadProjects(){
      try {
        const projects = await firebaseService.loadUserProjects();
        projects.forEach(p => this.$store.commit('addProject', p));
      } catch(e){
        console.error(e);
      }
    },
    onAuthStateChange(user){
        if (user) {
          console.log(user.email);
          this.$store.commit('loginUser', user);
          this.loadProjects();
        } else {
          this.$store.commit('logout');
        }
    }

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
