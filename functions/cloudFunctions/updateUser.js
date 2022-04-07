const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.updateUser = functions.https.onCall(async (data, context) => {
  console.log("executing updateUser()", { data: data });
  try {
    if (admin.apps.length === 0) admin.initializeApp();
    await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .update(data.newData, { merge: true });
    return {
      errorCode: 0,
    };
  } catch (e) {
    console.log("ERROR:", { e });
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
