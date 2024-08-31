<script setup>
import { useAuth } from '../router/auth';
import { useRouter } from 'vue-router';

const { isAuthenticated, userRole, logout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout(router);  // router as a parameter
};
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <!-- Home link -->
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home (Week 5)</router-link>
        </li>

        <!-- About link -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <!-- Rating link -->
        <li class="nav-item">
          <router-link to="/rating" class="nav-link" active-class="active">Rate Projects</router-link>
        </li>

        <!-- Conditionally render authentication-related links -->
        <li class="nav-item" v-if="isAuthenticated">
          <button @click="handleLogout" class="nav-link btn btn-link">Logout</button>
        </li>
        <li class="nav-item" v-else>
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/register" class="nav-link" active-class="active">Register</router-link>
        </li>

        <!-- Admin link, only visible to authenticated users -->
        <li class="nav-item" v-if="userRole === 'admin'">
          <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.nav-link.active {
  color: white;
  background-color: #007bff;
}
</style>
