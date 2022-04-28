const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.resortKanbanTasks = functions.https.onCall(async (data, context) => {
  try {
    //get the task document the task from the old list
    let taskDocumentToMoveRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.oldListId)
      .collection("tasks")
      .doc(data.project.list.task.id)
      .get();

    let taskDocumentData = {
      ...taskDocumentToMoveRef.data(),
      id: taskDocumentToMoveRef.id,
    };

    //remove the task from source list
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.oldListId)
      .collection("tasks")
      .doc(data.project.list.task.id)
      .delete();

    //remove the task from the old list
    let oldListDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.oldListId)
      .get();

    const newOldListTasks = Array.from(oldListDocumentRef.data().tasks);
    const [taskRemoved] = newOldListTasks.splice(
      data.project.list.task.oldOrder,
      1
    );

    //moving the task inside the same list
    if (data.project.list.oldListId === data.project.list.newListId)
      newOldListTasks.splice(data.project.list.task.newOrder, 0, taskRemoved);

    //update the old list
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.oldListId)
      .update(
        {
          tasks: newOldListTasks,
        },
        { merge: true }
      );

    //remove the task document

    if (data.project.list.oldListId !== data.project.list.newListId) {
      //moving the task to other list
      let newListDocumentRef = await admin
        .firestore()
        .collection("projects")
        .doc(data.project.id)
        .collection("lists")
        .doc(data.project.list.newListId)
        .get();

      const newNewListTasks = Array.from(newListDocumentRef.data().tasks);
      taskRemoved.listId = data.project.list.newListId;

      newNewListTasks.splice(data.project.list.task.newOrder, 0, taskRemoved);

      //update the new list
      await admin
        .firestore()
        .collection("projects")
        .doc(data.project.id)
        .collection("lists")
        .doc(data.project.list.newListId)
        .update(
          {
            tasks: newNewListTasks,
          },
          { merge: true }
        );
    }

    //add the document to the task collection
    await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .collection("lists")
      .doc(data.project.list.newListId)
      .collection("tasks")
      .doc(taskDocumentData.id)
      .set(taskDocumentData);

    return {
      errorCode: 0,
    };
  } catch (e) {
    console.log("error ", { e });
    return {
      errorCode: 1,
      errorMessage: e.toString(),
    };
  }
});
