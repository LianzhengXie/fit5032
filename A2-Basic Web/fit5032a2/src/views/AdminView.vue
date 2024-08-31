<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h1 class="text-center">🗄️ Admin</h1>
                <p class="text-center">
                    You do not have permission to view this page, please log in with your account to view .
                </p>

                <div class="text-center">
                    <button type="button" @click="goToLogin" class="btn btn-primary me-2">Go to Login</button>
                </div>
            </div>
        </div>
    </div>
</template>



    
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
  const goToLogin = () => {
    router.push({ name: 'Login' });
  };
  
</script>
    
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