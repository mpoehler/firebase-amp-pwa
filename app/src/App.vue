<template lang="pug">
  v-app
    v-navigation-drawer(app, v-model="drawer", temporary)
      v-list-item
        v-list-item-content
          v-list-item-title.title Application
          v-list-item-subtitle subtext
      v-divider
      v-list(dense, nav)
        v-list-item(link, to="/")
          v-list-item-icon
            v-icon {{ mdiHome }}
          v-list-item-content
            v-list-item-title Home
        v-list-item(link, to="/about")
          v-list-item-icon
            v-icon {{ mdiAccount }}
          v-list-item-content
            v-list-item-title About
        v-list-item(link,@click="logout")
          v-list-item-icon
            v-icon {{ mdiLogout }}
          v-list-item-content
            v-list-item-title Logout

    v-app-bar(app)
      v-icon(@click.stop="drawer = !drawer") {{ mdiMenu }}
      v-toolbar-title
        span.font-weight-light AMP-PWA Demo
      v-spacer
      v-icon {{ mdiAccount }}
    v-content
      router-view
    v-footer(app) &copy; Company
</template>

<style lang="scss">
.v-toolbar__title {
  width: 100%;
  text-align: center;
}
</style>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import firebase from "firebase/app";
import { mdiAccount, mdiMenu, mdiHome, mdiLogout } from "@mdi/js";

@Component
export default class App extends Vue {
  drawer = null;
  mdiAccount = mdiAccount;
  mdiMenu = mdiMenu;
  mdiHome = mdiHome;
  mdiLogout = mdiLogout;
  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.replace("signin");
      });
  }
}
</script>
