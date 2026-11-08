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
        return;
      }

      // Check role permissions if specified
      const recordWithRoles = to.matched.find((record) => record.meta.allowedRoles);
      if (recordWithRoles) {
        const allowedRoles = recordWithRoles.meta.allowedRoles as Array<string | number>;
        const rawUser = localStorage.getItem('auth_user');
        let roleId: number | undefined;
        let roleName: string | undefined;
        if (rawUser) {
          try {
            const parsed = JSON.parse(rawUser);
            roleId = parsed.roleId;
            roleName = parsed.roleName;
          } catch {
            // ignore parse error
          }
        }
        const hasAccess =
          (roleId !== undefined && allowedRoles.includes(roleId)) ||
          (roleName !== undefined && allowedRoles.includes(roleName));

        if (!hasAccess) {
          next({ name: 'pos-sales' });
          return;
        }
      }

      next();
    } else if (to.matched.some((record) => record.meta.guestOnly)) {
      if (isAuthenticated) {
        next({ name: 'pos-sales' });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
