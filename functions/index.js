// functions/index.js
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});

// Set up the SendGrid API key
sgMail.setApiKey(functions.config().sendgrid.api_key);

exports.sendEmailWithAttachment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({
        success: false,
        message: "Only POST requests are allowed",
      });
    }

    const {to, subject, text} = req.body;

    const msg = {
      to: to,
      from: "lianzheng0014@tutamail.com",
      subject: subject,
      text: text,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
      res.status(200).send({
        success: true,
        message: "Email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send({
        success: false,
        message: "Failed to send email.", error: error.message,
      });
    }
  });
});
