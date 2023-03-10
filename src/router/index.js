import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes,
});

export default router;
