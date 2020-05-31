import Home from '../components/Home.vue';
import Timeline from '../components/Timeline.vue';
import Login from '../components/Login.vue';
import Creator from '../components/Creator.vue';
import Settings from '../components/Settings.vue';
import EmailChange from '../components/EmailChange.vue';
import NameChange from '../components/NameChange.vue';

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
    }
];

export default routes;
