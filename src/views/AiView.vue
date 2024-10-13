<template>
    <div class="ai-response-container">
      <h2>Ask the AI</h2>
      <input v-model="prompt" placeholder="Enter your question" class="input-box" />
      <button @click="getAIResponse" class="submit-btn">Submit</button>
      <div v-if="response" class="response-box">
        <h3>AI Response:</h3>
        <p>{{ response }}</p>
      </div>
      <div v-if="errorMessage" class="error-box">
        <p>{{ errorMessage }}</p>
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
  
  .input-box {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  
  .submit-btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    cursor: pointer;
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
  