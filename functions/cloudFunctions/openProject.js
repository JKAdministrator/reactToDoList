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

    //get the project to open
    let projectElement = userDocumentRef
      .data()
      .userClosedProjects.find((project) => {
        return project.id === data.project.id;
      });

    // create a new array of closed projects with all projects except the one to open
    let userClosedProjects = userDocumentRef
      .data()
      .userClosedProjects.filter((project) => {
        return project.id !== data.project.id;
      });

    // add the project to open to the open projects array
    let userOpenProjects = [
      ...userDocumentRef.data().userOpenProjects,
      projectElement,
    ];

    //update the user document
    let newUserData = {
      userOpenProjects: userOpenProjects,
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
