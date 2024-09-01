<script setup>
  import { ref } from 'vue';
  import { useAuth } from '../router/auth';
  import { useRouter } from 'vue-router';

  const { isAuthenticated, userRole, logout } = useAuth();
  const router = useRouter();

  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const handleLogout = () => {
    router.push({ name: 'Login' });
    logout(router);
  };
</script>


<template>
  <div class="bheader-container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <h1 class="site-title">Mental Health Support</h1>
      
      <button @click="toggleMenu" class="hamburger-btn d-md-none">
        <span class="hamburger-icon">&#9776;</span>
      </button>

      <nav class="breadcrumb-nav" :class="{ 'show-menu': isMenuOpen }">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/rating" class="nav-link" active-class="active">Rate Projects</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <button @click="handleLogout" class="nav-link btn btn-link">Logout</button>
          </li>
          <li class="nav-item" v-else>
            <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/register" class="nav-link" active-class="active">Register</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<style scoped>
  .bheader-container {
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }

  .site-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-left: 20px;
  }

  .breadcrumb-nav .nav-link {
    font-weight: bold;
    color: #555;
    margin: 0 5px;
  }

  .nav-link.active {
    color: white;
    background-color: #007bff;
  }

  .nav-link.btn-link {
    color: #007bff;
  }

  .hamburger-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
  }

  .hamburger-icon {
    color: #007bff;
  }

@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
    margin-right: 20px;
  }

  .breadcrumb-nav {
    display: none;
  }


  .breadcrumb-nav.show-menu {
    display: block;
    position: absolute;
    top: 60px; 
    right: 20px;
    background-color: #f8f9fa;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .breadcrumb-nav ul {
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumb-nav .nav-link {
    margin-bottom: 10px;
  }
}
</style>
