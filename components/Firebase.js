import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    //Your Firebase Configuration
}

export default class Firebase {
    static auth;
    static store;
    static database;

    static init()
      {
          firebase.initializeApp(firebaseConfig);
          Firebase.auth = firebase.auth();
          Firebase.store = firebase.firestore();
          Firebase.database = firebase.database();
          
      }  
}