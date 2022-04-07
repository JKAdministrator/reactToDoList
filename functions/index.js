const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });

const createUserModule = require("./cloudFunctions/createUser");
const loginUserModule = require("./cloudFunctions/loginUser");
const updateUserModule = require("./cloudFunctions/updateUser");
const createProjectModule = require("./cloudFunctions/createProject");
const closeProjectModule = require("./cloudFunctions/closeProject");

exports.createUser = createUserModule.createUser;
exports.loginUser = loginUserModule.loginUser;
exports.updateUser = updateUserModule.updateUser;
exports.createProject = createProjectModule.createProject;
exports.closeProject = closeProjectModule.closeProject;

/*
  console.log("closeProject data", {
    data: _data,
    context,
    params: context.rawRequest.params,
    body: context.rawRequest.body,
    params: context.rawRequest.body,
    auth: context.auth,
    authToken: context.auth,
  });*/
