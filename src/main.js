import Vue from 'vue'
import App from './App.vue'
import VueMq from 'vue-mq'
import { createRouter } from './router/router.js'
import { createStore } from './store/store'
import { sync } from 'vuex-router-sync'
import VueAxios from 'vue-axios'
import axios from 'axios'
import VueMeta from 'vue-meta';

Vue.use(VueAxios, axios)
Vue.use(VueMeta);
Vue.use(VueMq, {
    breakpoints: {
        small: 750,
        medium: 1430,
        large: Infinity,
    },
    defaultBreakpoint: 'large'
})

// export a factory function for creating fresh app, router and store
// instances
export function createApp() {
    // create router instance
    const router = createRouter();
    const store = createStore();

    // sync so that route state is available as part of the store
    sync(store, router)

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

    const app = new Vue({
        router,
        store,
        // the root instance simply renders the App component.
        render: h => h(App),
        //metaInfo: {}
    });

    return { app, router };
}