import { createStore } from 'vuex'

const dummyProjects =  [
  {id:1, name: "Internship 2021"},
  {id:2, name: "interview John Doe"},
  {id:3, name: "accesa playground"}
]

const store = createStore({
    state () {
       return {
          isLoggedIn: false,
          userName: null,
          projects: dummyProjects
       }
    },
    mutations: {
      loginUser(state, user) {
        state.isLoggedIn = true;
        state.userName = user.displayName;
      },
      logout(state) {
        state.isLoggedIn = false;
        state.userName = null;
      },
      addProject(state, projectName){
        console.log('adding project ', projectName);
        console.log('project ids: ', state.projects.map(p => p.id));
        console.log('max id: ', Math.max(...state.projects.map(p => p.id)));
        const nextId = Math.max(...state.projects.map(p => p.id)) + 1;
        console.log('assigning id ', nextId);
        const project = {id: nextId, name: projectName};
        state.projects.push(project);
      }
    }
  })

export default store;
