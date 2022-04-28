const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.getProject = functions.https.onCall(async (data, context) => {
  try {
    const projectDoc = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get(); //get the user document
    const projectDocData = projectDoc.data(); //get the user document data
    return {
      errorCode: 0,
      project: { ...projectDocData, id: data.project.id },
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
