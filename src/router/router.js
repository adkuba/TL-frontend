// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Timeline from '../views/Timeline.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'

Vue.use(Router);

export function createRouter () {
    return new Router({
        mode: 'history',
        routes: [
            { path: '/', redirect: '/home'},
            { path: '/home', name: "home", component: Home },
            { path: '/timeline/:id', name: "timeline", component: Timeline },
            { path: '/login', name: 'login', component: Login, props: true },
            { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } },
            { path: '/profile/:id', name: 'profile', component: Profile },
        ]
    });
}