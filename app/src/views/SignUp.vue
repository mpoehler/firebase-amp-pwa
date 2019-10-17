<template lang="pug">
  v-row(justify="center")
    v-col(cols="12",sm="10",md="8",lg="6")
      v-card(ref="form")
        v-card-text
          .login
            h3 Sign Up
            v-text-field(ref="email",v-model="email",label="Email",placeholder="your@email.com",outlined,autocomplete="email",name="email")
            v-text-field(ref="password",v-model="password",:append-icon="showPassword ? mdiEye : mdiEyeOff",:rules="[rules.required, rules.min]",:type="showPassword ? 'text' : 'password'",name="password",label="Password",counter,@click:append="showPassword = !showPassword",outlined)
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
  email: string = "";
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
        user => this.$router.replace("/"),
        err => alert("Oops. " + err.message)
      );
  }
  mounted() {
    (this.$refs["email"] as HTMLElement).focus();
  }
}
</script>
