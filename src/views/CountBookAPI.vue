<template>
  <!-- 🗄️ W10. functions page -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ Book Counter API</h1>
        <p class="text-center">Get Book Count</p>
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
    this.getBookCountAPI();
  },
  methods: {
    async getBookCountAPI() {
      try {
        const response = await axios.get('https://countbooks-eu4bnvkwlq-uc.a.run.app');
        this.jsondata = JSON.stringify(response.data, null, 2);
        this.error = null;
      } catch (error) {
        console.error('Error fetching book count:', error);
        this.error = 'Failed to fetch data';
        this.jsondata = null;
      }
    }
  }
};
</script>
