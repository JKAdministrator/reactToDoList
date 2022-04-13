const cors = require("cors")({ origin: true });

const createUserModule = require("./cloudFunctions/createUser");
const loginUserModule = require("./cloudFunctions/loginUser");
const updateUserModule = require("./cloudFunctions/updateUser");
const createProjectModule = require("./cloudFunctions/createProject");
const deleteProjectModule = require("./cloudFunctions/deleteProject");
const updateProjectModule = require("./cloudFunctions/updateProject");

exports.createUser = createUserModule.createUser;
exports.loginUser = loginUserModule.loginUser;
exports.updateUser = updateUserModule.updateUser;
exports.createProject = createProjectModule.createProject;
exports.deleteProject = deleteProjectModule.deleteProject;
exports.updateProject = updateProjectModule.updateProject;
