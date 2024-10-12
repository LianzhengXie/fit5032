const {onRequest} = require("firebase-functions/v2/https");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
const bbusboy = require("busboy");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid API key from Firebase environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email with an attachment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.sendDynamicEmail = onRequest((req, res) => {
  // Enable CORS
  cors(req, res, () => {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const busboy = bbusboy({headers: req.headers});

    const fields = {};
    const uploads = {};

    const fileWrites = [];

    // Handle file uploads
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const allowedMimeTypes = [
        "application/pdf",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (!allowedMimeTypes.includes(mimetype)) {
        return res.status(400).send({error: "Invalid file type."});
      }

      const filepath = path.join(os.tmpdir(), filename);
      uploads[fieldname] = {filepath, mimetype, filename};
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      fileWrites.push(promise);
    });

    // Handle field data
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

        // Read the uploaded file
        const uploadedFile = uploads["file"];
        if (!uploadedFile) {
          return res.status(400).send({
            error: "No file uploaded.",
          });
        }

        const fileContent =
        fs.readFileSync(uploadedFile.filepath).toString("base64");

        // Create the email message with the attachment
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

        // Send the email
        await sgMail.send(msg);

        // Delete the temporary file
        fs.unlinkSync(uploadedFile.filepath);

        return res.status(200).send({
          message: "Email sent successfully.",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
          error: "Failed to send email.",
        });
      }
    });

    busboy.end(req.rawBody);
  });
});


// Replace `users` with the collection name you're listening to
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

exports.aggregateUserData = functions.firestore
.document('user_data/{docId}')
.onWrite((change, context) => {
  const newValue = change.after.exists ? change.after.data() : null;
  const oldValue = change.before.exists ? change.before.data() : null;

  // Example of calculating some metric or difference based on data changes
  const db = admin.firestore();
  return db.collection('statistics').doc('user_stats').set({
    totalDataPoints: admin.firestore.FieldValue.increment(1),
    latestChange: newValue ? newValue.someField : oldValue.someField
  });
});
  