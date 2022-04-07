const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.createProject = functions.https.onCall(async (data, context) => {
  console.log("executing createProject()");
  try {
    if (admin.apps.length === 0) admin.initializeApp();
    // create project entity
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .add({
        name: data.name,
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
        userOpenProjects: admin.firestore.FieldValue.arrayUnion({
          id: projectDocumentRef.id,
          name: data.name,
        }),
      });

    return {
      errorCode: 0,
      projectData: {
        id: projectDocumentRef.id,
      },
    };
  } catch (e) {
    console.log("ERROR:", { e });
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
