<template lang="pug">
  v-row(justify="center")
    v-col(cols="12",sm="10",md="8",lg="6")
      v-card(ref="form")
        v-card-text
          .login
            h3 Sign In
            v-text-field(ref="email",v-model="email",label="Email",placeholder="your@email.com",outlined)
            v-text-field(ref="password",v-model="password",:append-icon="showPassword ? mdiEye : mdiEyeOff",:rules="[rules.required, rules.min]",:type="showPassword ? 'text' : 'password'",name="password",label="Password",counter,@click:append="showPassword = !showPassword",outlined)
        v-card-actions
           v-btn(text,to="/signup") No Account? SignUp!
           div.flex-grow-1
           v-btn(large,color="primary",@click="login") Login
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

@Component
export default class SignIn extends Vue {
  mdiEye = mdiEye;
  mdiEyeOff = mdiEyeOff;
  password: string = "";
  email: string = "";
  showPassword = false;
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
      if (user && user.user) {
        let token = await user.user.getIdToken(true);

        const date = new Date();
        // Set it expire in 7 days
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.cookie = `__session=${token}; expires=${date.toUTCString()}; path=/`;

        this.$router.replace("/");
      }
    } catch (error) {
      console.error("Oops. " + error.message);
    }
  }

  mounted() {
    (this.$refs["email"] as HTMLElement).focus();
  }
}
</script>
