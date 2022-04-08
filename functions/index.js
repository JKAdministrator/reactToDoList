const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });

const createUserModule = require("./cloudFunctions/createUser");
const loginUserModule = require("./cloudFunctions/loginUser");
const updateUserModule = require("./cloudFunctions/updateUser");
const createProjectModule = require("./cloudFunctions/createProject");
const closeProjectModule = require("./cloudFunctions/closeProject");
const deleteProjectModule = require("./cloudFunctions/deleteProject");
const openProjectModule = require("./cloudFunctions/openProject");
const updateProjectModule = require("./cloudFunctions/updateProject");

exports.createUser = createUserModule.createUser;
exports.loginUser = loginUserModule.loginUser;
exports.updateUser = updateUserModule.updateUser;
exports.createProject = createProjectModule.createProject;
exports.closeProject = closeProjectModule.closeProject;
exports.deleteProject = deleteProjectModule.deleteProject;
exports.openProject = openProjectModule.openProject;
exports.updateProject = updateProjectModule.updateProject;
