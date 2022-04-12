const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.openProject = functions.https.onCall(async (data, context) => {
  try {
    //if (admin.apps.length === 0) admin.initializeApp();
    //update the project state
    await admin.firestore().collection("projects").doc(data.project.id).set(
      {
        isOpen: true,
      },
      { merge: true }
    );

    let userDocumentRef = await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get();

    //get the projects
    let userProjects = userDocumentRef.data().userProjects;
    //get the project to open
    let projectElement = userProjects.find((project) => {
      return project.id === data.project.id;
    });
    projectElement.isOpen = true;

    //update the user document
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
