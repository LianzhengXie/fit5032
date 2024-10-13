import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
import AdminView from '../views/AdminView.vue';
import RatingView from '../views/RatingView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue';
import SendEmailView from '@/views/EmailForm.vue';
import DataTableView from '@/views/DataTableView.vue';
import MapView from '@/views/MapView.vue';
import store from '@/store'; // Import the store directly
import SendBulkEmail from '@/views/SendBulkEmail.vue';
import AiView from '@/views/AiView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'Login',
    component: FirebaseSigninView
  },
  {
    path: '/register',
    name: 'Register',
    component: FirebaseRegisterView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView 
  },
  {
    path: '/datatable',
    name: 'datatable',
    component: DataTableView 
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/rating',
    name: 'Rating',
    component: RatingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sendemail',
    name: 'SendEmail',
    component: SendEmailView
  },
  {
    path: '/sendbulkbmail',
    name: 'SendBulkEmail',
    component: SendBulkEmail,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/mapview',
    name: 'MapView',
    component: MapView
  },
  {
    path: '/aiview',
    name: 'AiView',
    component: AiView
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated; // Access Vuex store directly
  const userRole = store.getters.userRole;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'AccessDenied' });
  } else if (to.meta.role && to.meta.role !== userRole) {
    next({ name: 'AccessDenied' });
  } else {
    next();
  }
});

export default router;
