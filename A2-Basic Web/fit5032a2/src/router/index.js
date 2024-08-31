import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
import RegisterView from '../views/RegisterView.vue';

export const isAuthenticated = ref(!!localStorage.getItem('userLoggedIn')); // Global authentication status
export const userRole = ref(localStorage.getItem('userRole'));

export const users = ref([
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'user'
  },
  {
    username: 'AdminUser',
    email: 'admin@example.com',
    password: 'AdminPassword!',
    role: 'admin'
  }
]);

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
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
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

export const login = (role) => {
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userRole', role);
  isAuthenticated.value = true;
  userRole.value = role;
};

export const logout = () => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userRole');
  isAuthenticated.value = false;
  userRole.value = null;
  router.push({ name: 'Login' });  
};

export default router;
