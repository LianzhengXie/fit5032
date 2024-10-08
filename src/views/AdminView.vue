<script setup>
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';

    const store = useStore();
    const router = useRouter();

    const handleLogout = () => {
    store.dispatch('logout', router); // Call the Vuex logout action
    router.push({ name: 'Login' });   // Redirect to Login page
    };
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h1 class="text-center">🗄️ Admin</h1>
                <p class="text-center">
                    This is the admin user page only the administrator has permission to open, in this page you can see the details of the site, the follow-up will be added to other features, such as view all user information.                </p>

                <div class="text-center">
                    <button type="button" @click="handleLogout" class="btn btn-primary me-2">Logout</button>
                </div>
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