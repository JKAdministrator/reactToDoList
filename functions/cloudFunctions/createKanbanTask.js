const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.createKanbanTask = functions.https.onCall(async (data, context) => {
  try {
    //create the list
    let taskDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .collection("tasks")
      .add({
        name: data.project.list.task.name,
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
      });

    //get the project document
    let listDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .get();

    //add the task to the list of tasks for the project
    let projectTasks = listDocumentRef.data().tasks;
    projectTasks.push({
      id: taskDocumentRef.id,
      name: data.project.list.task.name,
      listId: data.project.list.id,
    });

    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.id)
      .update(
        {
          tasks: projectTasks,
        },
        { merge: true }
      );

    return {
      errorCode: 0,
      project: {
        list: {
          task: {
            id: taskDocumentRef.id,
          },
        },
      },
    };
  } catch (e) {
    console.log("error ", { e });
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
