import Home from '../components/Home.vue';
import Timeline from '../components/Timeline.vue';
import Login from '../components/Login.vue';
import Creator from '../components/Creator.vue';

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
        component: Login
    },
    {
        path: '/creator',
        name: 'creator',
        component: Creator
    }
];

export default routes;
