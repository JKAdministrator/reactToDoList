const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.closeProject = functions.https.onCall(async (data, context) => {
  try {
    if (admin.apps.length === 0) admin.initializeApp();
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

    //get the project to close
    let projectElement = userDocumentRef
      .data()
      .userOpenProjects.find((project) => {
        return project.id === data.project.id;
      });
    // create a new array of open project with all projects except the one to close
    let userOpenProjects = userDocumentRef
      .data()
      .userOpenProjects.filter((project) => {
        return project.id !== data.project.id;
      });
    // add the project to close to the closed projects array
    let userClosedProjects = [
      ...userDocumentRef.data().userClosedProjects,
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
