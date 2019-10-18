import Vue from "vue";
import Vuex from "vuex";
import ProductModel from "./models/ProductModel";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: "",
    product: new ProductModel()
  },
  mutations: {
    setProduct(state, p: ProductModel) {
      state.product = p;
    },
    setEMail(state, email: string) {
      state.email = email;
    }
  },
  actions: {
    setProduct(context, product: ProductModel) {
      context.commit("setProduct", product);
    },
    setEMail(context, email: string) {
      context.commit("setEMail", email);
    }
  }
});
