const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.closeProject = functions.https.onCall(async (data, context) => {
  console.log("executing closeProject()");
  try {
    if (admin.apps.length === 0) admin.initializeApp();
    //get the project
    let userDocument = await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get();

    let projectDocument = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

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
