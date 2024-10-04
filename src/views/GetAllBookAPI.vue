<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">📚 All Books API</h1>
        <p class="text-center">Display all books in JSON format</p>
        <div class="text-center">
          <pre v-if="jsondata">{{ jsondata }}</pre>
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
      jsondata: null,
      error: null,
    };
  },
  mounted() {
    this.getAllBooksAPI();
  },
  methods: {
    async getAllBooksAPI() {
      try {
        const response = await axios.get('https://getallbooks-eu4bnvkwlq-uc.a.run.app');
        this.jsondata = JSON.stringify(response.data, null, 2); 
        this.error = null;
      } catch (error) {
        console.error('Error fetching all books:', error);
        this.error = 'Failed to fetch data';
        this.jsondata = null;
      }
    }
  }
};
</script>
