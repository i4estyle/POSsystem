import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default defineRouter(() => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('auth_token');
    const isAuthenticated = !!token;

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({ name: 'login' });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.guestOnly)) {
      if (isAuthenticated) {
        next({ name: 'system-selection' });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
