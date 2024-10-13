<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
  const goToLogin = () => {
    router.push({ name: 'Login' });
  };
  
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Error Page</h1>
        <p>
          Welcome to Mental Health Support, a dedicated platform committed to supporting individuals on their journey to mental well-being. We understand that mental health is a vital aspect of overall health, yet it often remains overlooked or stigmatized. Our mission is to provide a safe, compassionate, and inclusive space where everyone can access the resources, support, and community they need to navigate their mental health challenges.

        </p>
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-primary me-2" @click="goToLogin">Login</button>
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