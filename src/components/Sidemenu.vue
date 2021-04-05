<template>
  <div class="sidemenu-container">
    <div class="sidemenu-logo">
      <img class="logo" src="../assets/accesaig.svg" alt="logo" />
    </div>
    <div class="sidemenu-items">
      <div class="tools">
        <p class="mini-title">Tools</p>
        <p v-if="isLoggedIn" class="nav-item"><i class="pi pi-th-large"></i>Internships</p>
        <p v-if="isLoggedIn" class="nav-item" @click=" $router.push({name: 'Main'})"><i class="pi pi-book"></i>Evaluations</p>
      </div>
      <div class="user-details">
        <p class="mini-title">Other</p>
        <p class="nav-item username">{{userName}}</p>
        <p v-if="isLoggedIn" @click="logout()" class="nav-item other-item"><i class="pi pi-sign-out"></i>Log Out</p>
        <p v-else @click="login()" class="nav-item other-item"><i class="pi pi-sign-in"></i>Log In</p>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseService from '../services/firebaseService';

export default {
  name: "Sidemenu",
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    userName() {
      return this.$store.state.userName;
    },
  },
  methods: {
    async login() {
      const loginResult = await firebaseService.loginWithGoogle();
      this.$store.commit("loginUser", loginResult.user);
    },
    async logout() {
      await firebaseService.signOut();
      this.$store.commit("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
.sidemenu-container {
  position: fixed;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .sidemenu-logo {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 150px;
    background-color: #232931;
    border-radius: 0 0 50px 50px;

    .logo {
      width: 150px;
      position: relative;
      bottom: 10px;
      height: auto;
    }
  }

  .sidemenu-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 35px;
    padding-right: 35px;
    padding-top: 2em;
    width: 100%;
    height: calc(100% - 200px);
    background-color: #232931;
    border-radius: 50px 50px 0 0;

    .mini-title {
      color: #eee;
      opacity: 0.5;
      font-weight: 600;
      font-size: 12px;
    }

    .user-details {
      width: 100%;
    }

    .tools {
      width: 100%;
    }

    .nav-item {
      padding: 10px 15px;
      color: #eee;
      margin: 1em 0;
      width: 100%;
      border-radius: 12px;
      display: flex;
      align-items: center;

      i {
        margin-right: 10px;
      }

      &:hover {
        cursor: pointer;
        background-color: #3a3f46;
      }
    }
    .other-item {
      text-align: center;
      justify-content: center;
    }

    .username {
        padding: 0;
        margin: 0;
        opacity: 0.5;
        text-align: center;
        font-weight: 600;

        &:hover {
            background-color: transparent;
        }
    }
  }
}
</style>
