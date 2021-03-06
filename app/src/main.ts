import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase/app";
import "firebase/auth";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueGtm from "vue-gtm";

Vue.config.productionTip = false;

// Check that service workers are supported
if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

// import config here
import "./firebaseconfig";

let app: Vue | null = null;

// add environment and version to the GTM Datalayer
(<any>window).dataLayer = (<any>window).dataLayer || [];
(<any>window).dataLayer.push({
  environment: process.env.NODE_ENV,
  version: process.env.VUE_APP_VERSION
});

// add GTM
Vue.use(VueGtm, {
  id: process.env.VUE_APP_GTM_ID,
  debug: process.env.NODE_ENV != "production",
  loadScript: true,
  vueRouter: router
});

firebase.auth().onAuthStateChanged(user => {
  // initialize App when firebase auth is ready
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }

  // set a __session cookie with an IdToken, to enable cloud functions to identify the userbundleRenderer.renderToStream
  if (user) {
    user.getIdToken(true).then(token => {
      const date = new Date();
      // Set it expire in 7 days
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `__session=${token}; expires=${date.toUTCString()}; path=/`;
    });
  }

  // send verification email to unverified user after login
  if (user && !user.emailVerified) {
    user
      .sendEmailVerification({
        url: window.location.href
      })
      .catch(error => {
        // problem occured when sending the email
        console.error("Error on sending email: " + error.message);
      });
  }

  // fire event if a user logged in
  if (user) {
    Vue.gtm.trackEvent({
      event: "Login"
    });
  }
});
