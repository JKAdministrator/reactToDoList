const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.deleteProject = functions.https.onCall(async (data, context) => {
  try {
    if (admin.apps.length === 0) admin.initializeApp();

    //delete the project
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .delete();

    let userDocumentRef = await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get();

    // create a new array of closed project with all projects except the one deleted
    let userClosedProjects = userDocumentRef
      .data()
      .userClosedProjects.filter((project) => {
        return project.id !== data.project.id;
      });

    //update the user document
    let newUserData = {
      userClosedProjects: userClosedProjects,
    };
    await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .set(newUserData, { merge: true });

    return {
      errorCode: 0,
      userData: newUserData,
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
