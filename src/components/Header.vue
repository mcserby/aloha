<template>
  <div class="header">
    <div>ALOHA!</div>
    <div class="user-info">
      <span v-if="isLoggedIn">hello {{userName}}! <a @click="logout()">logout</a></span> <span v-else><a @click="login()">Login</a></span>
    </div>
  </div>
</template>

<script>

import firebaseService from '../services/firebaseService';

export default {
  name: 'Header',
  components: {
  },
  computed: {
    isLoggedIn(){
       return this.$store.state.isLoggedIn;
    },
    userName(){
       return this.$store.state.userName;
    }
  },
  methods: {
    async login(){
      const loginResult = await firebaseService.loginWithGoogle();
      this.$store.commit('loginUser', loginResult.user);
    },
    async logout(){
      await firebaseService.signOut();
      this.$store.commit('logout');
    }
  }
}
</script>

<style>
.header {
    background-color: black;
    color: white;
    font-size: 2em;
    text-align: left;
    align-content: center;
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.user-info {
  justify-self: end;
}

.user-info a:hover {
  cursor: pointer;
  color: grey;
}
</style>
