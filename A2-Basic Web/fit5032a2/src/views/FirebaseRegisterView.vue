<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: ''
});

const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null
});

// Clear form function
const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  };
};

// Validation functions
const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.value.email && !emailPattern.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.';
  } else {
    errors.value.email = null;
  }
};

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters';
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
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.';
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

// Registration function
const registerForm = async () => {
  // Validate all fields before proceeding
  validateName(true);
  validateEmail(true);
  validatePassword(true);
  validateConfirmPassword(true);

  // If no errors, proceed with registration
  if (!errors.value.username && !errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    const success = await store.dispatch('register', {
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      gender: formData.value.gender
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
        <h1 class="text-center">User Registration</h1>
        <form @submit.prevent="registerForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username<span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
                required
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-md-6">
              <label for="email" class="form-label">Email<span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                id="email"
                @blur="() => validateEmail(true)"
                @input="() => validateEmail(false)"
                v-model="formData.email"
                required
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="password" class="form-label">Password<span class="text-danger">*</span></label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
                required
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>

            <div class="col-md-6">
              <label for="confirm-password" class="form-label">Confirm Password<span class="text-danger">*</span></label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                required
              />
              <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="col-md-6">
                <label for="role" class="form-label">Role</label>
                <select class="form-select" id="role" v-model="formData.role">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                </select>
            </div>
          </div>


          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Register</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-danger {
  color: red;
}
</style>
