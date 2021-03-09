<template>
  <Sidemenu />
  <div class="routed-view">
    <router-view />
  </div>
</template>

<script>

import Sidemenu from './components/Sidemenu'
import firebaseService from './services/firebaseService';

export default {
  name: 'App',
  components: {
    Sidemenu
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
@import './styles.scss';

.routed-view {
  margin-left: 250px;
  height: 100vh;
}

</style>
