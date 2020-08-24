import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router/index.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMeta from 'vue-meta'
import { createStore } from './store/store'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueMeta)

export function createApp() {

  const router = createRouter()
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

  const store = createStore()
  sync(store, router)
  
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  })

  return { app, router, store };
}