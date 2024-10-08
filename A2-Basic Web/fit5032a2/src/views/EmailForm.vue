<template>
  <div class="email-form">
    <h2>Send an Email with Attachment</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="to">To:</label>
        <input
          type="email"
          id="to"
          class="form-control"
          v-model="to"
          required
          placeholder="Recipient's Email"
        />
      </div>

      <div class="form-group">
        <label for="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          class="form-control"
          v-model="subject"
          required
          placeholder="Email Subject"
        />
      </div>

      <div class="form-group">
        <label for="message">Message:</label>
        <textarea
          id="message"
          class="form-control"
          v-model="message"
          rows="5"
          required
          placeholder="Your message here..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="attachment">Attachment:</label>
        <input
          type="file"
          class="form-control"
          id="attachment"
          @change="handleFileUpload"
          accept="application/pdf,image/*"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send Email" }}
      </button>
    </form>

    <p v-if="feedbackMessage" :class="{ success: emailSent, error: !emailSent }">
      {{ feedbackMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';

const to = ref('');
const subject = ref('');
const message = ref('');
const attachment = ref(null);
const loading = ref(false);
const feedbackMessage = ref('');
const emailSent = ref(false);


const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      attachment.value = reader.result.split(',')[1]; // Base64 encode
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (!to.value || !subject.value || !message.value) {
    feedbackMessage.value = 'Please fill in all required fields.';
    emailSent.value = false;
    return;
  }

  loading.value = true;
  const functions = getFunctions();
  const sendEmailFunction = httpsCallable(functions, 'sendEmail');

  try {
    const result = await sendEmailFunction({
      to: to.value,
      subject: subject.value,
      text: message.value,
      attachment: attachment.value,
    });

    feedbackMessage.value = result.data.message;
    emailSent.value = result.data.success;
    if (emailSent.value) {
      clearForm();
    }
  } catch (error) {
    feedbackMessage.value = 'Failed to send email. Please try again.';
    emailSent.value = false;
    console.error("Error sending email:", error);
  } finally {
    loading.value = false;
  }
};

const clearForm = () => {
  to.value = '';
  subject.value = '';
  message.value = '';
  attachment.value = null;
};
</script>

<style scoped>
.email-form {
  max-width: 600px;
  margin: auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.email-form h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
}

input[type="email"],
input[type="text"],
input[type="file"],
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 0.7rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #007bff;
  cursor: not-allowed;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
