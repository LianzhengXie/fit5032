import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../router/auth';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
// import LoginView from '../views/LoginView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
// import RegisterView from '../views/RegisterView.vue';
import RatingView from '../views/RatingView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue';

const { isAuthenticated, userRole } = useAuth();

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const role = userRole.value;
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'AccessDenied' });
  } else if (to.meta.role && to.meta.role !== role) {
    next({ name: 'AccessDenied' });
  } else {
    next();
  }
});

export default router;
