<script setup>
import { useAuth } from '../router/auth';
import { useRouter } from 'vue-router';

const { logout } = useAuth();

const router = useRouter();

const handleLogout = () => {
  router.push({ name: 'Login' });

  logout(router);  // router as a parameter
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">About Our Library</h1>
        <p>
          Welcome to our digital library! We're dedicated to providing a vast collection of books and resources to our community.
        </p>
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-secondary" @click="handleLogout">Logout</button>
      </div>

    </div>
  </div>
</template>
  

  
<style>
  .container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

</style>