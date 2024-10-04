import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue';
import AddBookView from '../views/AddBookView.vue';
import BookList from '../components/BookList.vue';
import GetBookCountView from '@/views/GetBookCountView.vue';

export const isAuthenticated = ref(!!localStorage.getItem('userLoggedIn')); // Global authentication status
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
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView 
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView 
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/bookList',
    name: 'BookList',
    component: BookList
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCountView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'AccessDenied' });
  } else {
    next();
  }
});

export const login = () => {
  localStorage.setItem('userLoggedIn', 'true');
  isAuthenticated.value = true;
};

export const logout = () => {
  localStorage.removeItem('userLoggedIn');
  isAuthenticated.value = false;
  router.push({ name: 'Login' });  // Redirect to login page after logging out
};

export default router