const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.createProject = functions.https.onCall(async (data, context) => {
  try {
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .add({
        name: data.project.name,
        owner: data.uid,
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
        isOpen: true,
      });

    //update user projects
    await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .update({
        userProjects: admin.firestore.FieldValue.arrayUnion({
          id: projectDocumentRef.id,
          name: data.project.name,
          isOpen: true,
        }),
      });

    return {
      errorCode: 0,
      project: {
        id: projectDocumentRef.id,
      },
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
