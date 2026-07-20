import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/system-selection',
    component: () => import('@/layouts/blank-layout.vue'),
    children: [
      {
        path: '',
        name: 'system-selection',
        component: () => import('@/pages/system-selection-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/blank-layout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/auth-page.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/register',
    component: () => import('@/layouts/blank-layout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('@/pages/auth-page.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/pos',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'pos-sales',
        component: () => import('@/pages/pos-sales-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/orders',
    redirect: '/pos',
  },
  {
    path: '/menu',
    redirect: '/pos',
  },
  {
    path: '/tables',
    redirect: '/pos',
  },
  {
    path: '/analytics',
    redirect: '/pos',
  },
  {
    path: '/settings',
    redirect: '/pos',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
