const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp();
exports.resortKanbanLists = functions.https.onCall(async (data, context) => {
  try {
    //get the project document
    let projectDocumentRef = await admin
      .firestore()
      .collection("projects")
      .doc(data.project.id)
      .get();

    const oldOrder = data.project.list.oldOrder;
    const newOrder = data.project.list.newOrder;

    const projectLists = projectDocumentRef.data().lists;

    // remove the list from the array
    const [listItemRemoved] = projectLists.splice(oldOrder, 1);

    //add the list item in the new order
    projectLists.splice(newOrder, 0, listItemRemoved);

    await admin.firestore().collection("projects").doc(data.project.id).update(
      {
        lists: projectLists,
      },
      { merge: true }
    );

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
