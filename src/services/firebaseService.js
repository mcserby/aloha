import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export default {
  init: function(){
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_API_KEY,
      authDomain: process.env.VUE_APP_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_PROJECT_ID,
      storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGE_ID_SENDER,
      appId: process.env.VUE_APP_ID,
      measurementId: process.env.VUE_APP_MEASUREMENT_ID
    };
    firebase.initializeApp(firebaseConfig);
  },

   loginWithGoogle: async function(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const result  = await firebase.auth().signInWithPopup(provider);
    var credential = result.credential;
    var token = credential.accessToken;
    var user = result.user;
    return {token: token, user: user};
  },

  signOut: async function(){
    return await firebase.auth().signOut();
  },

  setOnAuthStateChage: function(onAuthStateChange){
    firebase.auth().onAuthStateChanged(onAuthStateChange);
  },

  loadUserProjects: async function(){
    const db = firebase.firestore();
    const projects = await db.collection("projects")
      .where("owners", "array-contains", firebase.auth().currentUser.email)
      .get();
    const results = [];
    projects.forEach(p => results.push({id: p.id, ...p.data()}));
    return results;
  },

  addProject: async function(projectName, topics){
    try {
      const db = firebase.firestore();
      const docRef = await db.collection("projects").add({
        name: projectName,
        topics: topics,
        stages: [{id: uuidv4(), name:'default', questions: []}],
        owners: [firebase.auth().currentUser.email]
      });
      const project = await db.collection("projects").doc(docRef.id).get()
      return {id: project.id, ...project.data()};
    } catch(e){
      console.error(e);
    }
  },

  deleteProject: async function(projectId){
    try {
      const db = firebase.firestore();
      await db.collection("projects").doc(projectId).delete();
    } catch(e){
      console.error(e);
    }
  },

  updateStages: async function(projectId, stages){
    const db = firebase.firestore();
    await db.collection("projects").doc(projectId).update({
        stages: stages
    });
    const project = await db.collection("projects").doc(projectId).get()
    return {id: project.id, ...project.data()};
  },

  updateContributors: async function(projectId, contributors){
    const db = firebase.firestore();
    await db.collection("projects").doc(projectId).update({
        owners: contributors
    });
    const project = await db.collection("projects").doc(projectId).get()
    return {id: project.id, ...project.data()};
  },

  updateTopics: async function(projectId, topics) {
    const db = firebase.firestore();
    await db.collection("projects").doc(projectId).update({
      topics: topics
    });
    const project = await db.collection("projects").doc(projectId).get()
    return {id: project.id, ...project.data()};
  },

  updateTestDuration: async function(projectId, testDuration){
    const db = firebase.firestore();
    await db.collection("projects").doc(projectId).update({
        testDuration: testDuration
    });
    const project = await db.collection("projects").doc(projectId).get();
    return {id: project.id, ...project.data()};
  },

  storeTests: async function(tests){
    var db = firebase.firestore();
    var batch = db.batch();

    tests.forEach((test) => {
      batch.set(db.collection('tests').doc(), test);
    });
    await batch.commit();
  },

  loadTestIds: async function(projectId){
    try {
      const db = firebase.firestore();
      const tests = await db.collection("tests")
        .where("projectId", "==", projectId)
        .get();
      const results = [];
      tests.forEach(t => results.push(t.id));
      return results;
    } catch(e){
      console.error(e);
    }
  },

  loadTest: async function(testId){
      const db = firebase.firestore();
      const test = await db.collection("tests").doc(testId).get();
      return {id: test.id, ...test.data()};
  },

  clearTestsAndSolutionsForProject: async function(projectId){
    const db = firebase.firestore();
    const tests = await db.collection("tests")
      .where("projectId", "==", projectId)
      .get();
    const testIds = [];
    tests.forEach(t => testIds.push(t.id));
    testIds.forEach((id) => {
      db.collection("tests").doc(id).delete();
    });
    const solutions = await db.collection("solutions")
      .where("projectId", "==", projectId)
      .get();
    const solutionIds = [];
    solutions.forEach(s => solutionIds.push(s.id));
    solutionIds.forEach((id) => {
      db.collection("solutions").doc(id).delete();
    });
  },

  startTest: async function(startTest){
    try {
      const db = firebase.firestore();
      await db.collection("solutions").doc(startTest.testId).set(startTest);
    } catch(e){
      console.error(e);
    }
  },

  updateTestTopicPreferences: async function(testId, topics){
    const db = firebase.firestore();
    await db.collection("tests").doc(testId).update({
      topics: topics
    });
  },

  saveProgress: async function(solution){
    try {
      const db = firebase.firestore();
      await db.collection("solutions").doc(solution.testId).update({
        questions: solution.questions
      });
    } catch(e){
      console.error(e);
    }
  },

  updateTestOutOfFocus: async function(outOfFocus){
    try {
      const db = firebase.firestore();
      await db.collection("solutions").doc(outOfFocus.testId).update({
        outOfFocus: firebase.firestore.FieldValue.arrayUnion({time: outOfFocus.time, timeGone: outOfFocus.timeGone})
      });
    } catch(e){
      console.error(e);
    }
  },

  loadSolution: async function(solutionId){
    try {
      const db = firebase.firestore();
      const solution = await db.collection("solutions").doc(solutionId).get();
      if (solution.exists) {
        return {id: solution.id, ...solution.data()};
      }
      return null;
    } catch(e){
      console.error(e);
    }
  },

  loadSolutions: async function(projectId){
    try {
      const db = firebase.firestore();
      const tests = await db.collection("solutions")
        .where("projectId", "==", projectId)
        .get();
        const results = [];
        tests.forEach(t => results.push({id: t.id, ...t.data()}));
        return results;
    } catch(e){
      console.error(e);
    }
  },

  submitSolution: async function(solution){
    try {
      const db = firebase.firestore();
      await db.collection("solutions").doc(solution.testId).update({
        questions: solution.questions,
        completed: true,
        evaluated: false
      });
    } catch(e){
      console.error(e);
    }
  },

  completeSolutionEvaluation: async function(solution) {
    try {
      const db = firebase.firestore();
      await db.collection("solutions").doc(solution.testId).update({
        evaluated: true
      })
    } catch(e) {
      console.error(e);
    }
  }

}
