//import { collection, query, where } from "firebase/firestore";

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// Take the text parameter passed to this HTTP endpoint and insert it into // Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.getDatabases = functions.https.onCall(async (req, res) => {
  const JSONOBJECT = {
    servers: [
      {
        id: "S1",
        name: "SERVER 1",
        databases: [
          { id: "D1", name: "DATABASE 1" },
          { id: "D2", name: "DATABASE 2" },
          { id: "D3", name: "DATABASE 3" },
        ],
      },
      {
        id: "S2",
        name: "SERVER 2",
        databases: [
          { id: "D4", name: "DATABASE 4" },
          { id: "D5", name: "DATABASE 5" },
          { id: "D6", name: "DATABASE 6" },
        ],
      },
      {
        id: "S3",
        name: "SERVER 3",
        databases: [
          { id: "D7", name: "DATABASE 7" },
          { id: "D8", name: "DATABASE 8" },
          { id: "D9", name: "DATABASE 9" },
        ],
      },
    ],
    defaults: {
      server: "S3",
      database: "D9",
    },
  };
  // res.json(JSONOBJECT);
  return JSONOBJECT;
});

exports.login = functions.https.onCall(async (data, context) => {
  // Grab the text parameter.
  let username = data.username;
  let password = data.password;
  let server = data.server;
  let database = data.database;
  console.log("data:", data);
  console.log("username:" + username);
  console.log("password:" + password);

  let databaseReference = admin.firestore();
  let collectionUsersReference = databaseReference.collection("users");

  try {
    let querySnapshot = await collectionUsersReference
      .where("username", "==", username)
      .get();

    console.log("querySnapshot", { snap: querySnapshot });
    let userDocument;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("docdata [" + doc.data().password + "==" + password + "]", {
        docdata: doc.data(),
      });
      if (doc.data().password == password) {
        userDocument = doc;
      }
    });
    if (userDocument) {
      console.log("user document found ");
      return {
        isValid: true,
        errorCode: 0,
        errorMessage: "",
      };
    } else {
      console.log("user document not found");
      return {
        isValid: false,
        errorCode: 1,
        errorMessage: "Invalid Username and/or Password",
      };
    }
  } catch (e) {
    return {
      isValid: false,
      errorCode: 2,
      errorMessage: e.toString(),
    };
  }
});
