import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZWCy4ngINS_fWs3tDWyJ23c1pVHETJK0",
  authDomain: "amp-pwa-f89b2.firebaseapp.com",
  databaseURL: "https://amp-pwa-f89b2.firebaseio.com",
  projectId: "amp-pwa-f89b2",
  storageBucket: "amp-pwa-f89b2.appspot.com",
  messagingSenderId: "562014234949",
  appId: "1:562014234949:web:fb262b1dadbed20c25362c",
  measurementId: "G-FGPDCW33Q0"
};

firebase.initializeApp(firebaseConfig);
