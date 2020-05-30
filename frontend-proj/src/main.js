import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMq from 'vue-mq'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(VueMq, {
  breakpoints: {
    small: 750,
    medium: 1450,
    large: Infinity,
  }
})

const store = new Vuex.Store({
  state: {
    jwt: ''
  },
  mutations: {
    set (state, newJwt) {
      state.jwt = newJwt;
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.jwt) {
      next({ name: 'login', params: {path: to} })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

new Vue({
  store: store,
  router,
  render: h => h(App),
}).$mount('#app')

