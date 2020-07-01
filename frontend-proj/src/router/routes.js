import Home from '../components/Home.vue';
import Timeline from '../components/Timeline.vue';
import Login from '../components/Login.vue';
import Creator from '../components/Creator.vue';
import Settings from '../components/Settings.vue';
import EmailChange from '../components/EmailChange.vue';
import NameChange from '../components/NameChange.vue';
import PasswordChange from '../components/PasswordChange.vue';
import EditorLoader from '../components/EditorLoader.vue'
import Admin from '../components/Admin.vue'
import Subscription from '../components/Subscription.vue'
import Profile from '../components/Profile.vue'
import Review from '../components/Review.vue'
import About from '../components/About.vue'

// the routes are simply an array of objects
const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/timeline/:id',
        name: 'timeline',
        component: Timeline
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        props: true,
    },
    {
        path: '/creator',
        name: 'creator',
        component: Creator,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/emailChange',
        name: 'emailChange',
        component: EmailChange,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/nameChange',
        name: 'nameChange',
        component: NameChange,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/passwordChange',
        name: 'passwordChange',
        component: PasswordChange,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/editorLoader/:id',
        name: 'editorLoader',
        component: EditorLoader,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/subscription',
        name: 'subscription',
        component: Subscription,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: Profile,
    },
    {
        path: '/review',
        name: 'review',
        component: Review,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/about',
        name: 'about',
        component: About,
    },
];

export default routes;
