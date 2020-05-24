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

new Vue({
  store: store,
  router,
  render: h => h(App),
}).$mount('#app')

