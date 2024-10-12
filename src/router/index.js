import { createRouter, createWebHistory } from 'vue-router';
// import { useAuth } from '../router/auth';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
// import LoginView from '../views/LoginView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
// import RegisterView from '../views/RegisterView.vue';
import RatingView from '../views/RatingView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue';
import { useStore } from 'vuex';
import SendEmailView from '@/views/EmailForm.vue';
import DataTableView from '@/views/DataTableView.vue';
import MapView from '@/views/MapView.vue';

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
    component: () => import('../views/AdminView.vue'),
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
    path: '/mapview',
    name: 'MapView',
    component: MapView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isAuthenticated = store.getters.isAuthenticated;
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
