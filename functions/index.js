const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");


// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid API key from Firebase environment variables
sgMail.setApiKey(functions.config().sendgrid.key);

// Store API key securely
const genAI = new GoogleGenerativeAI(functions.config().genai.key);

exports.sendEmailWithPdf = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }

    const {to, subject, text} = req.body;

    if (!to || !subject || !text) {
      console.error("Missing required email fields.");
      res.status(400).send("Missing required email fields.");
      return;
    }

    const msg = {
      to,
      from: "lianzheng0014@tutamail.com",
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      res.status(200).send({
        message: "Email sent successfully!",
        success: true});
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send email.");
    }
  });
});

exports.sendWelcomeEmail = onDocumentCreated(
    "/users/{userId}", async (event) => {
      const user = event.data.data(); // Accesses document data

      if (!user || !user.email) {
        console.error("User or user email is undefined");
        return;
      }

      console.log("New user created:", user); // Log for debugging
      const email = user.email;
      const displayName = user.displayName || "User";

      const msg = {
        to: email,
        from: "lianzheng0014@tutamail.com",
        subject: "Welcome to Our App!",
        text:
    `Hello ${displayName}, welcome to our app! We’re glad to have you onboard.`,
      };

      return sgMail.send(msg)
          .then(() => console.log(`Welcome email sent to ${email}`))
          .catch((error) => console.error("Error sending email:", error));
    });

exports.sendBulkEmails = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }

    const {emails, subject, text} = req.body;

    if (!emails || emails.length === 0) {
      console.error("No recipient emails provided.");
      res.status(400).send("No recipient emails provided.");
      return;
    }

    const msg = {
      to: emails,
      from: "lianzheng0014@tutamail.com",
      subject,
      text,
    };

    try {
      await sgMail.sendMultiple(msg);
      res.status(200).send("Bulk emails sent successfully!");
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      res.status(500).send("Failed to send emails.");
    }
  });
});


// create Firebase Cloud Function
exports.generateAIResponse = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    try {
      const {prompt} = req.body;
      const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
      const result = await model.generateContent([prompt]);
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).send({response: result.response.text()});
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).send({error: "Failed to generate response"});
    }
  });
});
