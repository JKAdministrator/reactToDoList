const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.deleteProject = functions.https.onCall(async (data, context) => {
  try {
    //if (admin.apps.length === 0) admin.initializeApp();

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
    // get the projects
    let projects = userDocumentRef.data().userProjects;
    // remove the project to delete
    let userProjects = projects.filter((project) => {
      return project.id !== data.project.id;
    });

    await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .set({ userProjects }, { merge: true });

    return {
      errorCode: 0,
      userData: { userProjects },
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
