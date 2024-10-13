<template>
  <div class="container mt-5">
    <h2>Send Bulk Email</h2>
    <form @submit.prevent="sendBulkEmail">
      <div class="mb-3">
        <label for="subject" class="form-label">Subject:</label>
        <input type="text" id="subject" v-model="subject" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="text" class="form-label">Message:</label>
        <textarea id="text" v-model="text" class="form-control" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Send Email</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      subject: '',
      text: '',
      emails: []
    };
  },
  created() {
    this.emails = this.$route.query.emails || [];
  },
  methods: {
    async sendBulkEmail() {
    if (!this.emails || this.emails.length === 0) {
      alert("Please select at least one user to send the email.");
      return;
    }

    try {
      await axios.post('https://sendbulkemails-dvj7jctgiq-uc.a.run.app', {
        emails: this.emails,
        subject: this.subject,
        text: this.text,
      });
      alert("Bulk emails sent successfully!");
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      alert("Failed to send emails.");
    }
  }

  }
};
</script>
