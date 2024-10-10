// functions/index.js
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const cors = require("cors")({origin: true}); // Enable CORS for all origins

const apiKey = process.env.SENDGRID_API_KEY ||
functions.config().sendgrid.api_key;
sgMail.setApiKey(apiKey);

exports.sendEmailWithAttachment = functions.https.onRequest((req, res) => {
  cors(req, res, () => { // Ensure CORS is properly configured
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "/tmp");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).send("Error parsing form data");
      }

      const {to, subject, text} = fields;
      console.log("Parsed fields:", fields);

      const attachments = [];
      if (files.attachment) {
        const file = files.attachment;
        const filePath = file.path;
        const fileName = file.name;

        console.log("Attachment file info:", file);

        const fileData = fs.readFileSync(filePath);
        attachments.push({
          content: fileData.toString("base64"),
          filename: fileName,
          type: file.type,
          disposition: "attachment",
        });

        fs.unlinkSync(filePath);
      }

      const msg = {
        to: to,
        from: "lianzheng0014@tutamail.com",
        subject: subject,
        text: text,
        attachments: attachments,
      };

      try {
        await sgMail.send(msg);
        console.log("Email sent successfully to:", to);
        return res.status(200).send({
          success: true,
          message: "Email sent successfully!",
        });
      } catch (error) {
        console.error("Error sending email:",
          error.response ? error.response.body : error.message);
        return res.status(500).send({
          success: false,
          message: "Failed to send email.",
          error: error.message,
        });
      }
    });
  });
});


// // functions/index.js
// const functions = require("firebase-functions");
// const axios = require("axios");
// // Added FormData module to handle multipart/form-data
// const FormData = require("form-data");

// const {mailgunApiKey, mailgunDomain} = functions.config().mailgun;

// // Create a function to send an email with an attachment
// exports.sendEmail = functions.https.onCall(async (data, context) => {
//   const {to, subject, text, attachment} = data;

//   const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
//   const auth = {
//     username: "api",
//     password: mailgunApiKey,
//   };

//   // Changed from URLSearchParams to FormData for multipart support
//   const form = new FormData();
//   form.append("from", `Jack <mailgun@${mailgunDomain}>`);
//   form.append("to", to);
//   form.append("subject", subject);
//   form.append("text", text);

//   // If there is an attachment, decode it from Base64 and add it
//   if (attachment) {
//     // Convert the attachment from Base64 to a Buffer
//     const buffer = Buffer.from(attachment, "base64");
//     // Append the buffer as an attachment file in the form
//     form.append("attachment", buffer, {filename: "attachment.pdf"});
//     // Specify the file name here
//   }

//   try {
//     const response = await axios.post(mailgunUrl, form, {
//       auth: auth,
//       headers: {
//         ...form.getHeaders(),
//       },
//     });
//     return {
//       success: true,
//       message: "Email sent successfully!",
//       data: response.data,
//     };
//   } catch (error) {
//     console.error(
//         "Error response from Mailgun:",
//          error.response ?
//          error.response.data : error.message);
//     return {
//       success: false,
//       message: "Failed to send email.",
//       error: error.message,
//     };
//   }
// });
