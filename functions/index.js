/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.countBooks = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const db = admin.firestore();
            const booksSnapshot = await db.collection('books').get();
            const bookCount = booksSnapshot.size;
            res.status(200).send({ count: bookCount });
        } catch (error) {
            console.error('Error fetching book count: ', error);
            res.status(500).send({ error: 'Failed to fetch book count' });
        }
    });
});


exports.capitalizeBookData = onDocumentCreated("books/{bookId}", async (event) => {
    const newValue = event.data.data();
    const capitalizedData = {
      ...newValue,
      name: newValue.name.toUpperCase(),
    };
    await event.data.ref.update(capitalizedData);
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
