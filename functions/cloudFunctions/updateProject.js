const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.updateProject = functions.https.onCall(async (data, context) => {
  try {
    if (admin.apps.length === 0) admin.initializeApp();
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

    let userDocumentData = userDocument.data();
    let project;
    project = userDocumentData.userOpenProjects.find((project) => {
      return data.project.id === project.id;
    });
    if (project) project.name = data.project.newData.name;
    else {
      project = userDocumentData.userClosedProjects.find((project) => {
        return data.project.id === project.id;
      });
      project.name = data.project.newData.name;
    }

    await admin.firestore().collection("users").doc(data.uid).update(
      {
        userOpenProjects: userDocumentData.userOpenProjects,
        userClosedProjects: userDocumentData.userClosedProjects,
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
