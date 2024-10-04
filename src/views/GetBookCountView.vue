<template>
    <!-- 🗄️ W9. functions page -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">🗄️ Book Counter</h1>
          <p class="text-center">
            Get Book Count          </p>
          <div class="text-center">
            <button @click="getBookCount" class="btn btn-primary">Get Book Count</button>
            <p v-if="count !== null">Total number of books: {{ count }}</p>
            <p v-if="error">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        count: null,
        error: null
      };
    },
    methods: {
      async getBookCount() {
        try {
          const response = await axios.get('https://countbooks-eu4bnvkwlq-uc.a.run.app');
          this.count = response.data.count;
          this.error = null;
        } catch (error) {
          console.error('Error fetching book count: ', error);
          this.error = 'Error fetching book count. Please try again later.';
          this.count = null;
        }
      }
    }
  };
  </script>
  