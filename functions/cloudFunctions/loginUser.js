const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();

exports.loginUser = functions.https.onCall(async (data, context) => {
  try {
    userDoc = await admin.firestore().collection("users").doc(data.uid).get(); //get the user document
    documentData = userDoc.data(); //get the user document data
    if (!documentData) {
      //user not found (so its tring to login from google)
      documentData = {
        // define the initial document data
        name: data.name,
        darkMode: data.darkMode,
        language: data.language,
        userProjects: [],
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginDate: admin.firestore.FieldValue.serverTimestamp(),
      };
      await admin // create the user document
        .firestore()
        .collection("users")
        .doc(data.uid)
        .set(documentData);
    } else {
      await admin.firestore().collection("users").doc(data.uid).set(
        {
          lastLoginDate: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
    return {
      errorCode: 0,
      userData: documentData,
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
