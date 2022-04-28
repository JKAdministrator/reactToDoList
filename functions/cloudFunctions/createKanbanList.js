const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.createKanbanList = functions.https.onCall(async (data, context) => {
  try {
    //create the list
    let listDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .add({
        name: data.project.list.name,
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
        tasks: [],
      });

    //get the project document
    let projectDocument = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

    //add the list to the project
    let projectLists = projectDocument.data().lists;
    projectLists.push({
      id: listDocumentRef.id,
      name: data.project.list.name,
    });

    await admin.firestore().collection("projects").doc(data.project.id).update(
      {
        lists: projectLists,
      },
      { merge: true }
    );

    return {
      errorCode: 0,
      project: {
        list: {
          id: listDocumentRef.id,
        },
      },
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
