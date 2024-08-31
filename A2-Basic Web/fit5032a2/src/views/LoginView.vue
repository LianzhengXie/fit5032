<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../router/auth';

const { users, login } = useAuth();
const router = useRouter();

const formData = ref({
  username: '',
  password: ''
});

const errors = ref({
  username: null,
  password: null
});

const loginForm = () => {
  const user = users.value.find(
    (u) => u.username === formData.value.username && u.password === formData.value.password
  );

  if (user) {
    login(user.role);
    console.log('Login successful:', user);

    if (user.role === 'admin') {
      router.push({ name: 'Admin' });
    } else {
      router.push({ name: 'Home' });
    }
  } else {
    alert('Invalid login credentials');
  }
};

const toRegister = () => {
  formData.value = {
    username: '',
    password: ''
  };
  router.push({ name: 'Register' });
};

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    errors.value.username = 'Name must be at least 3 characters';
  } else {
    errors.value.username = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    errors.value.password = 'Password must contain at least one number.';
  } else if (!hasSpecialChar) {
    errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ Library Login</h1>
        <p class="text-center">
          Please enter your credentials to login.
        </p>
        <form @submit.prevent="loginForm">
          <div class="row mb-3">
            <div class="col-md-6 offset-md-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 offset-md-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>
            <button type="button" class="btn btn-secondary" @click="toRegister">Register</button>
          </div>
        </form>
      </div>
    </div>
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
</style>
