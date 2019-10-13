import Vue from "vue";
import Vuex from "vuex";
import ProductModel from "./models/ProductModel";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    product: new ProductModel()
  },
  mutations: {
    setProduct(state, p: ProductModel) {
      state.product = p;
    }
  },
  actions: {
    setProduct(context, product: ProductModel) {
      context.commit("setProduct", product);
    }
  }
});
