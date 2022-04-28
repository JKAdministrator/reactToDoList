const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();

exports.deleteKanbanList = functions.https.onCall(async (data, context) => {
  try {
    //if (admin.apps.length === 0) admin.initializeApp();
    //delete the list tasks

    //dont delete the lis tasks
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .delete();

    //remove the list from the owner project
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

    let newLists = projectDocumentRef.data().lists.filter((l) => {
      return l.id !== data.project.list.id;
    });
    for (i = 0; i < newLists.length; i++) newLists[i].order = i;

    //update the project
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .set({ lists: newLists }, { merge: true });

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
