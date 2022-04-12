const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.closeProject = functions.https.onCall(async (data, context) => {
  try {
    //update the project state
    await admin.firestore().collection("projects").doc(data.project.id).set(
      {
        isOpen: false,
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
    console.log("userProjects", { userProjects });
    //get the project to close
    let projectElement = userProjects.find((project) => {
      return project.id === data.project.id;
    });
    console.log("projectElement", { projectElement });
    //close the projext
    projectElement.isOpen = false;
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
