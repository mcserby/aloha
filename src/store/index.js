import { createStore } from 'vuex'

const store = createStore({
    state () {
       return {
          isLoggedIn: false,
          userName: null,
          userId: null,
          projects: [],
          selectedStageId: null,
          testIds: [],
          solutions: [],
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
      },
      updateProject(state, project){
          const projectIndex = state.projects.findIndex(p => p.id === project.id);
          if(projectIndex >= 0){
              state.projects.splice(projectIndex, 1, project);
          } else {
            state.projects.push(project);
          }
      },
      selectStage(state, stageId){
        state.selectedStageId = stageId;
      },
      updateTestIds(state, testIds){
        state.testIds.splice(0, state.testIds.length, ...testIds);
      },
      updateSolutions(state, solutions){
        state.solutions.splice(0, state.solutions.length, ...solutions);
      }

    }
  })

export default store;
