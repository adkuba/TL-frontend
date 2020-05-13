import Home from '../components/Home.vue';
import Timeline from '../components/Timeline.vue';

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
    }
];

export default routes;
