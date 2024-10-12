const {onRequest} = require("firebase-functions/v2/https");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
const Busboy = require("busboy");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const path = require("path");
const os = require("os");
const fs = require("fs");
const functions = require('firebase-functions');


// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid API key from Firebase environment variables
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Sends an email with an attachment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.sendDynamicEmail = onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const busboy = Busboy({headers: req.headers}); //eslint-disable-line
    const fields = {};
    const uploads = {};
    const fileWrites = [];

    // Handle file uploads
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log("Received file:", filename, "with MIME type:", mimetype);
      const allowedMimeTypes =
      ["application/pdf", "text/plain", "image/jpeg", "image/png", "image/gif"];

      if (!allowedMimeTypes.includes(mimetype)) {
        return res.status(400).send({error: "Invalid file type."});
      }

      const filepath = path.join(os.tmpdir(), filename);
      uploads[fieldname] = {filepath, mimetype, filename};
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      fileWrites.push(
          new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
          }),
      );
    });

    // Handle non-file fields
    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("finish", async () => {
      try {
        await Promise.all(fileWrites);

        const {toEmail, subject, text} = fields;
        if (!toEmail || !subject || !text) {
          return res.status(400).send({
            error: "Recipient email, subject, and text are required.",
          });
        }

        const uploadedFile = uploads["file"];
        if (!uploadedFile) {
          return res.status(400).send({error: "No file uploaded."});
        }

        const fileContent =
        fs.readFileSync(uploadedFile.filepath).toString("base64");
        const msg = {
          to: toEmail,
          from: "lianzheng0014@tutamail.com",
          subject: subject,
          text: text,
          attachments: [
            {
              content: fileContent,
              filename: uploadedFile.filename,
              type: uploadedFile.mimetype,
              disposition: "attachment",
            },
          ],
        };

        await sgMail.send(msg);

        // Clean up temporary file
        if (fs.existsSync(uploadedFile.filepath)) {
          fs.unlinkSync(uploadedFile.filepath);
        }

        res.status(200).send({
          message: "Email sent successfully.",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({
          error: "Failed to send email.",
        });
      }
    });

    busboy.end(req.rawBody);
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

exports.sendBulkEmails = onRequest(async (req, res) => {

  const msg = {
    to: [],
    from: "lianzheng0014@tutamail.com",
    subject: subject,
    text: text,
  };
  try {
    await sgMail.sendMultiple(msg);
    res.status(200).send("Bulk emails sent successfully!");
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    res.status(500).send("Failed to send emails.");
  }
});