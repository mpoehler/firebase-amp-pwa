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
import { mdiAccount, mdiMenu, mdiHome } from "@mdi/js";

export default Vue.extend({
  name: "App",
  components: {},
  data: () => ({
    drawer: null,
    mdiAccount: mdiAccount,
    mdiMenu: mdiMenu,
    mdiHome: mdiHome
  })
});
</script>
