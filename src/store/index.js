import { createStore } from 'vuex'

const dummyProjects =  [
]

const store = createStore({
    state () {
       return {
          isLoggedIn: false,
          userName: null,
          userId: null,
          projects: dummyProjects
       }
    },
    mutations: {
      loginUser(state, user) {
        state.isLoggedIn = true;
        state.userName = user.displayName;
        state.userId = user.uid;
      },
      logout(state) {
        state.isLoggedIn = false;
        state.userName = null;
        state.userId = null;
      },
      addProject(state, project){
        state.projects.push(project);
      },
      deleteProject(state, projectId){
        const projectIndex = state.projects.findIndex(p => p.id === projectId);
        state.projects.splice(projectIndex, 1);
      }
    }
  })

export default store;
