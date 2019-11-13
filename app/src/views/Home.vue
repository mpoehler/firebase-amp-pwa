<template lang="pug">
  DisplaySelection
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DisplaySelection from "../components/DisplaySelection.vue";

@Component({
  components: {
    DisplaySelection
  }
})
export default class Home extends Vue {}
</script>
