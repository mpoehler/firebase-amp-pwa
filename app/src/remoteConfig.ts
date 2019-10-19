import firebase from "firebase/app";
import "firebase/firebase-remote-config";
import "./firebaseInit";

const remoteConfig = firebase.remoteConfig();

// configure remote config
remoteConfig.settings = {
  fetchTimeoutMillis: 3600000,
  minimumFetchIntervalMillis: 3600000
};

// default values
remoteConfig.defaultConfig = { welcome_message: "Welcome" };

remoteConfig.fetchAndActivate().then(() => {
  // successfully fetched
  console.log("fetched remoteConfig:" + JSON.stringify(remoteConfig.getAll()));
  console.log("getValue: " + remoteConfig.getValue("welcome_message"));
  console.log("getString: " + remoteConfig.getString("welcome_message"));
});

export default remoteConfig;
