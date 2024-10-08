<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errors = ref({
  email: null,
  password: null
});

// Clear form function
const clearForm = () => {
  email.value = '';
  password.value = '';
  errors.value.email = null;
  errors.value.password = null;
};

// Validation functions
const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && !emailPattern.test(email.value)) {
    if (blur) errors.value.email = 'Please enter a valid email address.';
  } else {
    errors.value.email = null;
  }
};

const validatePassword = (blur) => {
  if (password.value.length < 8) {
    if (blur) errors.value.password = 'Password must be at least 8 characters long.';
  } else {
    errors.value.password = null;
  }
};

// Login function
const signInUser = async () => {
  validateEmail(true);
  validatePassword(true);

  if (!errors.value.email && !errors.value.password) {
    const success = await store.dispatch('login', {
      email: email.value,
      password: password.value
    });

    if (success) {
      clearForm();
      router.push({ name: 'Home' });
    }
  }
};
</script>

<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">🗄️ Library Login</h1>
          <p class="text-center">
            Let's build some more advanced features into our form.
          </p>
          <form @submit.prevent="signInUser">
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Sign In</button>
              <p v-if="currentUser">
                Logged in as: {{ currentUser.email }} (Role: {{ userRole }})
              </p>
              <button v-if="currentUser" @click="logout" class="btn btn-secondary">Logout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
