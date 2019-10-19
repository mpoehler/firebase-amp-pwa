<template lang="pug">
  v-row(justify="center")
    v-col(cols="12",sm="10",md="8",lg="6")
      v-card(ref="form")
        v-card-text
          .login
            h3 {{teaserText}}
            v-text-field(ref="email",v-model="email",label="Email",placeholder="your@email.com",outlined,autocomplete="email",name="email",:error-messages="emailError")
            v-text-field(ref="password",v-model="password",:append-icon="showPassword ? mdiEye : mdiEyeOff",:rules="[rules.required, rules.min]",:type="showPassword ? 'text' : 'password'",name="password",label="Password",counter,@click:append="showPassword = !showPassword",outlined,:error-messages="passwordError",@change="login")
            v-btn(ref="passwordReset",small,text,@click="resetPassword") Reset Password
            v-btn(ref="sendPasswordLink",small,text,@click="sendPasswordLink") Send Password Link
            v-btn(ref="signInWithGoogle",small,text,@click="signInWithGoogle") SignIn with Google
  
        v-card-actions
           v-btn(text,to="/signup") No Account? SignUp!
           div.flex-grow-1
           v-btn(large,color="primary",@click="login") Login

    v-dialog(v-model="accountLockedDialog",max-width="290")
      v-card
        v-card-title(class="headline") Account locked
        v-card-text Your account has been locked. Please contact us. 
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="accountLockedDialog = false") Close
    v-dialog(v-model="userUnknownDialog",max-width="290")
      v-card
        v-card-title(class="headline") User unknown
        v-card-text A user with this email could not be found. Would you like to create one?
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="userUnknownDialog = false") Close
          div.flex-grow-1
          v-btn(color="green darken-1",text,to="/signup") Create
    v-dialog(v-model="signInLinkDialog",max-width="290")
      v-card
        v-card-title(class="headline") Magic Link sent!
        v-card-text The magic link has been sent to the email address you entered - Just click on the link and you are logged in.
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="signInLinkDialog = false") Close
    v-dialog(v-model="signInLinkExpiredDialog",max-width="290")
      v-card
        v-card-title(class="headline") Magic Link expired!
        v-card-text The magic link has expired, please try again.
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="signInLinkExpiredDialog = false") Close
    v-dialog(v-model="socialSignInProblemDialog",max-width="290")
      v-card
        v-card-title(class="headline") Login failed / Popup failed
        v-card-text Please make sure that this page can open a popup!
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="socialSignInProblemDialog = false") Close
    v-dialog(v-model="signInMethodsDialog",max-width="290")
      v-card
        v-card-title(class="headline") Another sign in method exists for your eMail
        v-card-text {{signinMethodText}}
        v-card-actions
          v-spacer
          v-btn(color="green darken-1",text,@click="signInMethodsDialog = false") Close
</template>

<style lang="scss" scoped>
h3 {
  text-align: center;
  text-transform: uppercase;
  margin: 20px 0 40px 0;
  font-size: 25px;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import firebase from "firebase/app";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import remoteConfig from "../remoteConfig";

@Component
export default class SignIn extends Vue {
  mdiEye = mdiEye;
  mdiEyeOff = mdiEyeOff;
  password: string = "";
  passwordError: string = "";
  email: string = "";
  emailError: string = "";
  showPassword = false;
  accountLockedDialog = false;
  userUnknownDialog = false;
  signInLinkDialog = false;
  signInLinkExpiredDialog = false;
  socialSignInProblemDialog = false;
  signInMethodsDialog = false;
  signinMethodText = "";
  teaserText = remoteConfig.getString("welcome_message");
  // teaserText = "huh";
  rules = {
    required: (value: String) => !!value || "Required.",
    min: (v: String) => {
      return v.length >= 8 || "Min 8 characters";
    },
    emailMatch: () => "The email and password you entered don't match"
  };

  async login() {
    let user = null;
    try {
      user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);
      this.$router.replace("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-disabled":
          this.accountLockedDialog = true;
          break;
        case "auth/user-not-found":
          this.userUnknownDialog = true;
          this.$store.dispatch("setEMail", this.email);
          break;
        case "auth/invalid-email":
          this.emailError = "Email format invalid";
          break;
        case "auth/wrong-password":
          this.passwordError = "Wrong password";
          break;
        default:
          console.error("Unknown error code: " + error.code);
      }
    }
  }

  resetPassword() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.email, {
        url: window.location.href
      })
      .catch(error => {
        switch (error.code) {
          case "auth/invalid-email":
            this.emailError = "Please provide an email first";
            break;
          case "auth/user-not-found":
            this.userUnknownDialog = true;
            break;
          default:
            console.error(
              `Unexpected error ${error.code} occured: ${error.message}`
            );
        }
      });
  }

  sendPasswordLink() {
    firebase
      .auth()
      .sendSignInLinkToEmail(this.email, {
        url: `${window.location.href}/?email=${this.email}`,
        handleCodeInApp: true
      })
      .then(() => {
        this.signInLinkDialog = true;
      })
      .catch(error => {
        switch (error.code) {
          case "auth/invalid-email":
            this.emailError = "Please provide a valid email first";
            break;
          default:
            console.error(`unknown error ${error.code}, ${error.message}`);
        }
      });
  }

  signInWithGoogle() {
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        this.$router.replace("/");
      })
      .catch(error => {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            firebase
              .auth()
              .fetchSignInMethodsForEmail(error.email)
              .then(methods => {
                const signInMethods = methods.join(",");
                this.signinMethodText = `Your email ${error.email} is registered for the following sign-In methos: ${signInMethods}`;
                this.signInMethodsDialog = true;
              });
            break;
          case "auth/popup-blocked":
          case "auth/popup-closed-by-user":
            this.socialSignInProblemDialog = true;
            break;
          default:
            console.error(`unknown error ${error.code}, ${error.message}`);
        }
      });
  }

  mounted() {
    (this.$refs["email"] as HTMLElement).focus();

    // check if an signin from email is in progress
    const url = new URL(window.location.href);
    if (
      firebase.auth().isSignInWithEmailLink(window.location.href) && // is signinlink
      url.searchParams.has("email") // and contains email parameter
    ) {
      const email = url.searchParams.get("email");
      if (email) {
        firebase
          .auth()
          .signInWithEmailLink(email)
          .then(() => {
            this.$router.replace("/");
          })
          .catch(error => {
            switch (error.code) {
              case "auth/expired-action-code":
                this.signInLinkExpiredDialog = true;
                break;
              case "auth/user-disabled":
                this.accountLockedDialog = true;
                break;
              default:
                console.error(`unkown error ${error.code}: ${error.message}`);
            }
          });
      } else {
        console.error("no email provided in link!");
      }
    }
  }
}
</script>
