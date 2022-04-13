const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.updateProject = functions.https.onCall(async (data, context) => {
  try {
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .update(data.project.newData, { merge: true });

    let userDocument = await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get();

    let userProjects = userDocument.data().userProjects;
    let project = userProjects.find((project) => {
      return data.project.id === project.id;
    });

    for (const [key, val] of Object.entries(data.project.newData))
      project[key] = val;

    await admin.firestore().collection("users").doc(data.uid).update(
      {
        userProjects,
      },
      { merge: true }
    );

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
