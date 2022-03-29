//import { collection, query, where } from "firebase/firestore";

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

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

exports.login = functions.https.onCall(async (_data, context) => {
  // Grab the text parameter.
  console.log("LOGIN: --------------------------------");
  try {
    let loginDoc = await findLogin(_data);
    let userDocId = null;
    if (!loginDoc) loginDoc = await createNewLogin(_data);
    //check if login has a user a user asociated
    if (loginDoc.data().userDocId !== "") {
      userDocId = loginDoc.data().userDocId;
    } else {
      //if not => check if there is other login with the same email
      let otherLogin = await findLoginByEmail(_data.email, loginDoc.id);
      //[if other login found => get userDocId] ELSE [create a new user]
      if (otherLogin) userDocId = otherLogin.data().userDocId;
      else {
        let newUserDoc = await createNewUser(_data);
        userDocId = newUserDoc.id;
      }
      // asociate the userDocId to the login
      await updateLoginDocUserDocId(loginDoc, userDocId);
    }
    return {
      errorCode: 0,
      errorMessage: "",
      userDocId: userDocId,
      userData: await getUserData(userDocId), // returns all the data of the user (user document, login accounts, etc...)
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
      userData: {},
    };
  }
});
exports.updateUserField = functions.https.onCall(async (_data, context) => {
  let field = _data.field;
  let newValue = _data.newValue;
  let userDocId = _data.userDocId;
  console.log("UPDATE USER FIELD", { field, newValue, userDocId });
  await admin
    .firestore()
    .collection("users")
    .doc(userDocId)
    .update({
      [field]: newValue,
    });
  return {};
});

exports.deleteLoginCredential = functions.https.onCall(
  async (_data, context) => {
    // Grab the text parameter.
    console.log("DELETE LOGIN: --------------------------------");

    try {
      console.log(_data.loginDocId);
      return {
        errorCode: 0,
        errorMessage: "",
      };
    } catch (e) {
      return {
        errorCode: 1,
        errorMessage: e.toString(),
        userData: {},
      };
    }
  }
);

async function findLogin(_data) {
  let querySnapshot;
  switch (_data.source) {
    case "google": {
      querySnapshot = await admin
        .firestore()
        .collection("logins")
        .where("source", "==", _data.source)
        .where("email", "==", _data.email)
        .get();
      break;
    }
    case "usernameAndPassword": {
      querySnapshot = await admin
        .firestore()
        .collection("logins")
        .where("source", "==", _data.source)
        .where("email", "==", _data.email)
        .where("password", "==", _data.password)
        .get();
      break;
    }
    default: {
      break;
    }
  }
  return !querySnapshot.empty ? querySnapshot.docs[0] : null;
}
async function findLoginByEmail(_email, filterLoginDocId) {
  let querySnapshot = await admin
    .firestore()
    .collection("logins")
    .where("email", "==", _email)
    .where(admin.firestore.FieldPath.documentId(), "!=", filterLoginDocId)
    .get();
  return !querySnapshot.empty ? querySnapshot.docs[0] : null;
}

async function createNewUser(_data) {
  // Timestamp to Date
  //const d = t.toDate();
  let userDoc = await admin
    .firestore()
    .collection("users")
    .add({
      displayName: _data.displayName,
      creationDate: admin.firestore.FieldValue.serverTimestamp(),
      theme: _data.navigatorTheme ? _data.navigatorTheme : "light",
      language: _data.navigatorLanguage ? _data.navigatorLanguage : "en",
    });
  return userDoc;
}

async function createNewLogin(_data) {
  try {
    let loginAddResult = await admin
      .firestore()
      .collection("logins")
      .add({
        ..._data,
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginDate: admin.firestore.FieldValue.serverTimestamp(),
        userDocId: "",
      });
    let loginDoc = await admin
      .firestore()
      .collection("logins")
      .doc(loginAddResult.id)
      .get();
    return loginDoc;
  } catch (e) {
    throw e;
  }
}

async function updateLoginDocUserDocId(_loginDoc, _userDocId) {
  await admin.firestore().collection("logins").doc(_loginDoc.id).update({
    userDocId: _userDocId,
  });
}

async function getUserData(_userDocId) {
  let response = {
    user: {},
    logins: [],
  };

  //get all 1-1 information
  let userDoc = await admin
    .firestore()
    .collection("users")
    .doc(_userDocId)
    .get();
  response.user = userDoc.data();

  //get all the logins
  let querySnapshotLogins = await admin
    .firestore()
    .collection("logins")
    .where("userDocId", "==", _userDocId)
    .get();
  if (!querySnapshotLogins.empty) {
    querySnapshotLogins.forEach((e) => {
      response.logins.push({ ...e.data(), loginDocId: e.id });
    });
  }

  return response;
}
