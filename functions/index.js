const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.login = functions.https.onCall(async (_data, context) => {
  // Grab the text parameter.
  console.log("LOGIN: --------------------------------");
  try {
    let loginDoc = await findLogin(_data);
    let userDocId = null;
    if (!loginDoc) loginDoc = await createNewLogin(_data);
    //check if login has a user a user asociated
    if (loginDoc.data().userDocId !== "") {
      userDocId = loginDoc.data().userDocId;
    } else {
      //if not => check if there is other login with the same email
      let otherLogin = await findLoginByEmail(_data.email, loginDoc.id);
      //[if other login found => get userDocId] ELSE [create a new user]
      if (otherLogin) userDocId = otherLogin.data().userDocId;
      else {
        let newUserDoc = await createNewUser(_data);
        userDocId = newUserDoc.id;
      }
      // asociate the userDocId to the login
      await updateLoginDocUserDocId(loginDoc, userDocId);
    }
    return {
      errorCode: 0,
      errorMessage: "",
      userDocId: userDocId,
      userData: await getUserData(userDocId), // returns all the data of the user (user document, login accounts, etc...)
    };
  } catch (e) {
    return {
      errorCode: 1,
      errorMessage: e.toString(),
      userData: {},
    };
  }
});
exports.updateUserField = functions.https.onCall(async (_data, context) => {
  let field = _data.field;
  let newValue = _data.newValue;
  let userDocId = _data.userDocId;
  console.log("UPDATE USER FIELD", { field, newValue, userDocId });
  await admin
    .firestore()
    .collection("users")
    .doc(userDocId)
    .update({
      [field]: newValue,
    });
  return {};
});

exports.deleteLoginCredential = functions.https.onCall(
  async (_data, context) => {
    // Grab the text parameter.
    console.log("DELETE LOGIN: --------------------------------");

    try {
      console.log(_data.loginDocId);
      return {
        errorCode: 0,
        errorMessage: "",
      };
    } catch (e) {
      return {
        errorCode: 1,
        errorMessage: e.toString(),
        userData: {},
      };
    }
  }
);

async function findLogin(_data) {
  let querySnapshot;
  switch (_data.source) {
    case "google": {
      querySnapshot = await admin
        .firestore()
        .collection("logins")
        .where("source", "==", _data.source)
        .where("email", "==", _data.email)
        .get();
      break;
    }
    case "usernameAndPassword": {
      querySnapshot = await admin
        .firestore()
        .collection("logins")
        .where("source", "==", _data.source)
        .where("email", "==", _data.email)
        .where("password", "==", _data.password)
        .get();
      break;
    }
    default: {
      break;
    }
  }
  return !querySnapshot.empty ? querySnapshot.docs[0] : null;
}
async function findLoginByEmail(_email, filterLoginDocId) {
  let querySnapshot = await admin
    .firestore()
    .collection("logins")
    .where("email", "==", _email)
    .where(admin.firestore.FieldPath.documentId(), "!=", filterLoginDocId)
    .get();
  return !querySnapshot.empty ? querySnapshot.docs[0] : null;
}

async function createNewUser(_data) {
  // Timestamp to Date
  //const d = t.toDate();
  let userDoc = await admin
    .firestore()
    .collection("users")
    .add({
      displayName: _data.displayName,
      creationDate: admin.firestore.FieldValue.serverTimestamp(),
      theme: _data.navigatorTheme ? _data.navigatorTheme : "light",
      language: _data.navigatorLanguage ? _data.navigatorLanguage : "en",
      userImage: _data.userImage ? _data.userImage : "",
    });
  return userDoc;
}

async function createNewLogin(_data) {
  try {
    let loginAddResult = await admin
      .firestore()
      .collection("logins")
      .add({
        ..._data,
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginDate: admin.firestore.FieldValue.serverTimestamp(),
        userDocId: "",
      });
    let loginDoc = await admin
      .firestore()
      .collection("logins")
      .doc(loginAddResult.id)
      .get();
    return loginDoc;
  } catch (e) {
    throw e;
  }
}

async function updateLoginDocUserDocId(_loginDoc, _userDocId) {
  await admin.firestore().collection("logins").doc(_loginDoc.id).update({
    userDocId: _userDocId,
  });
}

async function getUserData(_userDocId) {
  let response = {
    user: {},
    logins: [],
  };

  //get all 1-1 information
  let userDoc = await admin
    .firestore()
    .collection("users")
    .doc(_userDocId)
    .get();
  response.user = userDoc.data();

  //get all the logins
  let querySnapshotLogins = await admin
    .firestore()
    .collection("logins")
    .where("userDocId", "==", _userDocId)
    .get();
  if (!querySnapshotLogins.empty) {
    querySnapshotLogins.forEach((e) => {
      response.logins.push({ ...e.data(), loginDocId: e.id });
    });
  }

  return response;
}
