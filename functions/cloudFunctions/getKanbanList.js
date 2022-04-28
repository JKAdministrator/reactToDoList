const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.getKanbanList = functions.https.onCall(async (data, context) => {
  try {
    const projectDoc = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .get(); //get the user document
    const listDocData = projectDoc.data(); //get the user document data
    return {
      errorCode: 0,
      project: {
        id: data.project.id,
        list: {
          ...listDocData,
          id: data.project.list.id,
        },
      },
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
