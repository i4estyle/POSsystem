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
    path: '/dashboard',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard-page.vue'),
        meta: { requiresAuth: true },
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
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'orders-kanban',
        component: () => import('@/pages/orders-kanban-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/orders/manage',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'orders-management',
        component: () => import('@/pages/orders-management-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/menu',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'menu-management',
        component: () => import('@/pages/menu-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/stock',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'stock-management',
        component: () => import('@/pages/stock-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/staff',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'employee-management',
        component: () => import('@/pages/employee-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/attendance',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'attendance',
        component: () => import('@/pages/attendance-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/payroll',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'salary-management',
        component: () => import('@/pages/salary-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/feedback',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'feedback-management',
        component: () => import('@/pages/feedback-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/promotions',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'promotions-management',
        component: () => import('@/pages/promotions-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/members',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'members-management',
        component: () => import('@/pages/members-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/tables',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'tables-management',
        component: () => import('@/pages/tables-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/settings',
    component: () => import('@/layouts/pos-layout.vue'),
    children: [
      {
        path: '',
        name: 'settings',
        component: () => import('@/pages/settings-page.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
