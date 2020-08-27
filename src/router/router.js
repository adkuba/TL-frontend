// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Timeline from '../views/Timeline.vue'
import Login from '../views/Login.vue'
import Creator from '../views/Creator.vue'
import Settings from '../views/Settings.vue'
import EmailChange from '../views/EmailChange.vue'
import NameChange from '../views/NameChange.vue'
import PasswordChange from '../views/PasswordChange.vue'
import EditorLoader from '../views/EditorLoader.vue'
import Admin from '../views/Admin.vue'
import Profile from '../views/Profile.vue'
import Subscription from '../views/Subscription.vue'
import Review from '../views/Review.vue'
import About from '../views/About.vue'
import PasswordReset from '../views/PasswordReset.vue'
import Statistics from '../views/Statistics.vue'
import Business from '../views/Business.vue'
import Ola from '../views/Ola.vue'

/*
UWAGA
Code splitting nie dziala, musialbym wywalic style w komponentach do osobnego pliku!
*/

Vue.use(Router);

/*
UWAGA
Globalnie zastepuje funkcje router push tak aby wylapywala bledy.
Mialem problem z errorem UnhandledPromiseRejectionWarning: Error: Redirected when going from "/"
Jest to chyba zwiazane z beforeEach, blad pojawia sie tylko gdy ladowalem z linku strone np settings
Prawdopodobnie jakis blad ze dwa razy robi redirect bo mam ssr?
I dodatkowo jesli jest to pierwsze zaladowanie strony to nie moglem znalezc pierwszego router push bo go nie ma
Wiec zastapilem to globalnie.

UWAGA moze byc problem jak kiedys zrobie await router.push()
https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
*/
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export function createRouter () {
    return new Router({
        mode: 'history',
        base: '/',
        routes: [
            { path: '/', redirect: '/home'},
            { path: '/home', name: "home", component: Home },
            { path: '/timeline/:id', name: "timeline", component: Timeline },
            { path: '/login', name: 'login', component: Login, props: true },
            { path: '/creator', name: 'creator', component: Creator, meta: { requiresAuth: true } },
            { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } },
            { path: '/emailChange', name: 'emailChange', component: EmailChange, meta: { requiresAuth: true } },
            { path: '/nameChange', name: 'nameChange', component: NameChange, meta: { requiresAuth: true } },
            { path: '/passwordChange', name: 'passwordChange', component: PasswordChange, meta: { requiresAuth: true } },
            { path: '/editorLoader/:id', name: 'editorLoader', component: EditorLoader, meta: { requiresAuth: true } },
            { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true } },
            { path: '/profile/:id', name: 'profile', component: Profile },
            { path: '/subscription', name: 'subscription', component: Subscription, meta: { requiresAuth: true } },
            { path: '/review', name: 'review', component: Review, meta: { requiresAuth: true } },
            { path: '/about', name: 'about', component: About },
            { path: '/passwordReset/:id', name: 'passwordReset', component: PasswordReset },
            { path: '/statistics/:id', name: 'statistics', component: Statistics, meta: { requiresAuth: true } },
            { path: '/business', name: 'business', component: Business },
            { path: '/ola', name: 'ola', component: Ola },
        ]
    });
}