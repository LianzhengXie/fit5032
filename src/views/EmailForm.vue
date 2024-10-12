<template>
  <div class="email-form">
    <h2>Send an Email with Attachment</h2>
    <form @submit.prevent="sendEmail">
      <div>
        <label for="toEmail">Recipient Email:</label>
        <input
          type="email"
          id="toEmail"
          v-model="toEmail"
          required
          placeholder="Enter recipient email"
        />
      </div>
      <div>
        <label for="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          v-model="subject"
          required
          placeholder="Enter email subject"
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
        <label for="attachment">Attachment:</label>
        <input
          type="file"
          id="attachment"
          @change="handleFileUpload"
          :accept="allowedFileTypes"
        />
      </div>
      <button type="submit" :disabled="loading || !file">
        {{ loading ? 'Sending...' : 'Send Email' }}
      </button>
    </form>
    <div v-if="message" :class="{ success: success, error: !success }">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'EmailForm',
  setup() {
    const toEmail = ref('');
    const subject = ref('');
    const text = ref('');
    const file = ref(null);
    const loading = ref(false);
    const message = ref('');
    const success = ref(false);
    const allowedFileTypes = '.pdf,.txt,.jpg,.jpeg,.png,.gif';

    const handleFileUpload = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        file.value = selectedFile;
      }
    };

    const sendEmail = async () => {
      if (!file.value) {
        message.value = 'Please select a file to attach.';
        success.value = false;
        return;
      }

      loading.value = true;
      message.value = '';
      success.value = false;

      try {
        const formData = new FormData();
        formData.append('toEmail', toEmail.value);
        formData.append('subject', subject.value);
        formData.append('text', text.value);
        formData.append('file', file.value);

        const response = await axios.post(
          'https://senddynamicemail-dvj7jctgiq-uc.a.run.app',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        message.value = response.data.message;
        success.value = true;
        // Clear the form fields
        toEmail.value = '';
        subject.value = '';
        text.value = '';
        file.value = null;
        // Reset the file input
        document.getElementById('attachment').value = '';
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          message.value = error.response.data.error;
        } else {
          message.value = 'An unexpected error occurred.';
        }
        success.value = false;
      } finally {
        loading.value = false;
      }
    };

    return {
      toEmail,
      subject,
      text,
      file,
      loading,
      message,
      success,
      allowedFileTypes,
      handleFileUpload,
      sendEmail,
    };
  },
};
</script>

<style scoped>
.email-form {
  max-width: 600px;
  margin: auto;
}

.email-form div {
  margin-bottom: 15px;
}

.email-form label {
  display: block;
  margin-bottom: 5px;
}

.email-form input,
.email-form textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.email-form button {
  padding: 10px 20px;
}

.success {
  color: green;
}

.error {
  color: red;
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