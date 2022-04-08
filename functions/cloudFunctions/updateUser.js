const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.updateUser = functions.https.onCall(async (data, context) => {
  try {
    await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .update(data.newData, { merge: true });
    return {
      errorCode: 0,
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});