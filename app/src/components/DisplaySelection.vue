<template lang="pug">
    div
        h1 Your selection
        |Productname: {{product.name}}
        br
        |Size: {{product.size}}
        br
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "vuex-class";
import ProductModel from "../models/ProductModel";

@Component
export default class DisplaySelection extends Vue {
  @State product!: ProductModel;
}
</script>
