import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase/app";
import Home from "./views/Home.vue";
import SignIn from "./views/SignIn.vue";
import SignUp from "./views/SignUp.vue";
import store from "@/store";
import ProductModel from "./models/ProductModel";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/signin"
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

// push query parameter in store
router.beforeEach((to, from, next) => {
  if (to.query.name && to.query.size) {
    let pm = new ProductModel();
    pm.populateFromQuery(to.query);
    store.dispatch("setProduct", pm);
  }
  next();
});

// filter auth
router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("signin");
  else if (!requiresAuth && currentUser) next("/");
  else next();
});

export default router;
