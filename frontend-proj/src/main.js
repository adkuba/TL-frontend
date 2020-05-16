import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMq from 'vue-mq'

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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
