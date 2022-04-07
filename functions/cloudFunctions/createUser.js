const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.createUser = functions.https.onCall(async (data, context) => {
  console.log("executing createUser()");
  try {
    // add a login document (autogenerated id)
    if (admin.apps.length === 0) admin.initializeApp();
    await admin.firestore().collection("users").doc(data.uid).set({
      name: data.name,
      image: data.image,
      creationDate: admin.firestore.FieldValue.serverTimestamp(),
      darkMode: data.darkMode,
      language: data.language,
      userOpenProjects: [],
      userClosedProjects: [],
    });

    return {
      errorCode: 0,
      userData: {},
    };
  } catch (e) {
    console.log("ERROR:", { e });
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
