<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Ask the AI</h1>
        <p class="text-center">
          Ask the AI a question about the world around you. It's like having a personal assistant.
        </p>
        <input v-model="prompt" placeholder="Enter your question" class="form-control row mb-3" />
        <div class="text-center ">
          <button @click="getAIResponse" class="btn btn-primary me-2">Submit</button>
        </div>
        <div v-if="response" class="response-box">
          <h3>AI Response:</h3>
          <p>{{ response }}</p>
        </div>
        <div v-if="errorMessage" class="error-box">
          <p>{{ errorMessage }}</p>
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
        prompt: '',
        response: '',
        errorMessage: '',
      };
    },
    methods: {
      async getAIResponse() {
        this.errorMessage = '';
        try {
          const res = await axios.post('https://generateairesponse-dvj7jctgiq-uc.a.run.app/', {
            prompt: this.prompt,
          });
          this.response = res.data.response;
        } catch (error) {
          console.error('Error fetching AI response:', error);
          this.errorMessage = 'Failed to fetch AI response. Please try again later.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .ai-response-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }


  .response-box, .error-box {
    margin-top: 20px;
    padding: 15px;
    border-radius: 5px;
  }
  
  .response-box {
    background-color: #e0f7fa;
    color: #00796b;
  }
  
  .error-box {
    background-color: #fbe9e7;
    color: #d32f2f;
  }
  </style>
  