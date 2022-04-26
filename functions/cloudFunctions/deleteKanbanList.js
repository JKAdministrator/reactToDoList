const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.deleteKanbanList = functions.https.onCall(async (data, context) => {
  try {
    //if (admin.apps.length === 0) admin.initializeApp();

    //delete the list
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

    let newLists = projectDocumentRef.data().lists;

    let listIndex = tasks.findIndex((l) => {
      return l.id !== data.project.list.id;
    });

    newLists.splice(listIndex, 1);

    //remove the tasks of the list oif the owner project
    let tasks = projectDocumentRef.data().tasks;

    let newTasks = tasks.filter((t) => {
      return t.listId !== data.project.list.id;
    });

    //update the project
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .set({ tasks: newTasks, lists: newLists }, { merge: true });

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
