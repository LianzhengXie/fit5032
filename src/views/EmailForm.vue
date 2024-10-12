<template>
  <div class="file-upload">
    <h2>Send Email with Attachment</h2>
    <form @submit.prevent="uploadFile">
      <div>
        <label for="toEmail">Recipient Email:</label>
        <input
          type="email"
          id="toEmail"
          v-model="toEmail"
          required
          placeholder="Enter recipient's email"
        />
      </div>
      
      <div>
        <label for="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          v-model="subject"
          required
          placeholder="Enter subject"
        />
      </div>
      
      <div>
        <label for="text">Message:</label>
        <textarea
          id="text"
          v-model="text"
          required
          placeholder="Enter your message"
        ></textarea>
      </div>

      <div>
        <label for="file">Choose File:</label>
        <input
          type="file"
          id="file"
          @change="handleFileUpload"
          accept=".pdf, .txt, .jpg, .jpeg, .png, .gif"
        />
      </div>

      <button type="submit">Send Email</button>
    </form>

    <p v-if="responseMessage">{{ responseMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      toEmail: '',
      subject: '',
      text: '',
      file: null,
      responseMessage: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        this.responseMessage = 'Please select a file to upload.';
        return;
      }

      const formData = new FormData();
      formData.append('toEmail', this.toEmail);
      formData.append('subject', this.subject);
      formData.append('text', this.text);
      formData.append('file', this.file);

      try {
        const response = await axios.post(
          'https://senddynamicemail-dvj7jctgiq-uc.a.run.app', // Replace with your Firebase function URL
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.responseMessage = response.data.message;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.responseMessage = `Error: ${error.response.data.error}`;
        } else {
          this.responseMessage = 'An error occurred while sending the email.';
        }
      }
    }
  }
};
</script>

<style scoped>
.file-upload {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}
.file-upload label {
  display: block;
  margin-top: 10px;
}
.file-upload input[type="text"],
.file-upload input[type="email"],
.file-upload input[type="file"],
.file-upload textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.file-upload button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.file-upload button:hover {
  background-color: #45a049;
}
.file-upload p {
  margin-top: 10px;
  font-weight: bold;
}
</style>








<!-- <template>
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
</style> -->