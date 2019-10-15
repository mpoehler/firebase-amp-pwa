import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase/app";
import "firebase/auth";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

// Check that service workers are supported
if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

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

let app: Vue | null = null;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
