import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export default {
  init: function(){
    const firebaseConfig = {
      apiKey: "AIzaSyDL9ZtlDKWoMygVX058rWiKsklIb9gFn8U",
      authDomain: "aloha-e6c64.firebaseapp.com",
      projectId: "aloha-e6c64",
      storageBucket: "aloha-e6c64.appspot.com",
      messagingSenderId: "1094724239724",
      appId: "1:1094724239724:web:1b061a5cf4add72829b349"
    };
    firebase.initializeApp(firebaseConfig);
  },

   loginWithGoogle: async function(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const result  = await firebase.auth().signInWithPopup(provider);
    var credential = result.credential;
    var token = credential.accessToken;
    console.log('user token: ', token);
    var user = result.user;
    console.log(JSON.stringify(user));
    return {token: token, user: user};
  },

  signOut: async function(){
    return await firebase.auth().signOut();
  },

  setOnAuthStateChage: function(onAuthStateChange){
    firebase.auth().onAuthStateChanged(onAuthStateChange);
  },

  loadUserProjects: async function(){
    try {
      const db = firebase.firestore();
      const projects = await db.collection("projects")
        .where("owners", "array-contains", firebase.auth().currentUser.uid)
        .get();
      const results = [];
      projects.forEach(p => results.push({id: p.id, ...p.data()}));
      return results;
    } catch(e){
      console.error(e);
    }
  },

  addProject: async function(projectName, userId){
    try {
      const db = firebase.firestore();
      const docRef = await db.collection("projects").add({
        name: projectName,
        stages: [{id: uuidv4(), name:'default', questions: []}],
        owners: [userId]
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
  }




}
