<template lang="pug">
  v-row(justify="center")
    v-col(cols="12",sm="10",md="8",lg="6")
      v-card(ref="form")
        v-card-text
          .login
            h3 Sign Up
            v-text-field(
              ref="email"
              v-model="email"
              label="Email"
              placeholder="your@email.com"
              outlined
              autocomplete="email"
              name="email"
              :error-messages="emailError"
            )
            v-text-field(
              ref="password"
              v-model="password"
              :append-icon="showPassword ? mdiEye : mdiEyeOff"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              label="Password"
              counter
              @click:append="showPassword = !showPassword"
              outlined
              :error-messages="passwordError"
              @change="signup"
            )
        v-card-actions
           v-btn(text,to="/signin") Back to Login
           div.flex-grow-1
           v-btn(large,color="primary",@click="signup") Sign Up
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
import firebase from "firebase/app";
import Component from "vue-class-component";
import { mdiEye, mdiEyeOff } from "@mdi/js";

@Component
export default class SignUp extends Vue {
  mdiEye = mdiEye;
  mdiEyeOff = mdiEyeOff;
  password: string = "";
  passwordError: string = "";
  email: string = "";
  emailError: string = "";
  showPassword = false;
  rules = {
    required: (value: String) => !!value || "Required.",
    min: (v: String) => {
      return v.length >= 8 || "Min 8 characters";
    }
  };
  signup() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(
        user => {
          // signup successfull, send verification email
          this.$router.replace("/");
        },
        err => {
          switch (err.code) {
            case "auth/invalid-email":
              this.emailError = "Email format invalid";
              break;
            case "auth/weak-password":
              this.passwordError = "Password is too weak!";
              break;
            default:
              alert("Oops. " + err.message + " code: " + err.code);
          }
        }
      );
  }
  mounted() {
    if (this.$store.state.email) {
      this.email = this.$store.state.email;
      (this.$refs["password"] as HTMLElement).focus();
    } else {
      (this.$refs["email"] as HTMLElement).focus();
    }
  }
}
</script>
