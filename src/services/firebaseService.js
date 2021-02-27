import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

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
  }

}
