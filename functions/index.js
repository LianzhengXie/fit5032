// functions/index.js
const functions = require("firebase-functions");
const axios = require("axios");
// Added FormData module to handle multipart/form-data
const FormData = require("form-data");

const {mailgunApiKey, mailgunDomain} = functions.config().mailgun;

// Create a function to send an email with an attachment
exports.sendEmail = functions.https.onCall(async (data, context) => {
  const {to, subject, text, attachment} = data;

  const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
  const auth = {
    username: "api",
    password: mailgunApiKey,
  };

  // Changed from URLSearchParams to FormData for multipart support
  const form = new FormData();
  form.append("from", `Jack <mailgun@${mailgunDomain}>`);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);

  // If there is an attachment, decode it from Base64 and add it
  if (attachment) {
    // Convert the attachment from Base64 to a Buffer
    const buffer = Buffer.from(attachment, "base64");
    // Append the buffer as an attachment file in the form
    form.append("attachment", buffer, {filename: "attachment.pdf"});
    // Specify the file name here
  }

  try {
    const response = await axios.post(mailgunUrl, form, {
      auth: auth,
      headers: {
        ...form.getHeaders(),
      },
    });
    return {
      success: true,
      message: "Email sent successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error(
        "Error response from Mailgun:",
         error.response ?
         error.response.data : error.message);
    return {
      success: false,
      message: "Failed to send email.",
      error: error.message,
    };
  }
});
