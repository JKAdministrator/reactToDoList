const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { useForkRef } = require("@mui/material");
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
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

    //add the task to the list of tasks for the project
    let projectTasks = projectDocumentRef.data().tasks;
    console.log("project tasks before", projectTasks);
    if (!projectTasks) projectTasks = [];
    projectTasks.push({
      id: taskDocumentRef.id,
      name: data.project.list.task.name,
      listId: data.project.list.id,
    });
    console.log("project tasks after", projectTasks);

    await admin.firestore().collection("projects").doc(data.project.id).update(
      {
        tasks: projectTasks,
      },
      { merge: true }
    );
    console.log("project taks updated");

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
