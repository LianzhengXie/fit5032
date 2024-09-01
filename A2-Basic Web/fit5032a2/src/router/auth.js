import { ref } from 'vue';

const isAuthenticated = ref(!!localStorage.getItem('userLoggedIn'));
const userRole = ref(localStorage.getItem('userRole'));

export const users = ref([
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'user'
  },
  {
    username: 'Admin',
    email: 'admin@example.com',
    password: 'AdminPassword!1',
    role: 'admin'
  }
]);

export const login = (role) => {
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userRole', role);
  isAuthenticated.value = true;
  userRole.value = role;
};

export const logout = (router) => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userRole');
  isAuthenticated.value = false;
  userRole.value = null;
  router.push({ name: 'Login' });
};

export const useAuth = () => {
  return { isAuthenticated, userRole, login, logout, users };
};
