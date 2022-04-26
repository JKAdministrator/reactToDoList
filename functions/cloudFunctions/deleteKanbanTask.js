const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.deleteKanbanTask = functions.https.onCall(async (data, context) => {
  try {
    //if (admin.apps.length === 0) admin.initializeApp();
    console.log(data);
    console.log(data.project);
    console.log(data.project.list);
    console.log(data.project.list.task);

    //delete the task
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .collection("tasks")
      .doc(data.project.list.task.id)
      .delete();

    //remove the task from the owner
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

    let newTasks = projectDocumentRef.data().tasks;
    let taskIndex = newTasks.findIndex((t) => {
      return t.id === data.project.list.task.id;
    });
    newTasks.splice(taskIndex, 1);

    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .set({ tasks: newTasks }, { merge: true });

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
