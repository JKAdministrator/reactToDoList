import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  connectAuthEmulator,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const AppContext = React.createContext();
const initialContextData = {
  //firebase connection data
  firebaseConnectionState: "LOADING",
  firebaseConnectionStateError: "",
  firebaseApp: {},
  firebaseFunctions: {},
  firebaseHttpsCallableFunctions: {},
  emulatorStarted: false,
  //global server functions
  createUser: async () => {},
  loginUser: async () => {},
  logoutUser: async () => {},
  recoverUser: async () => {},
  getUserCredentials: async () => {},
  updateUser: async () => {},
  createProject: () => {},
  closeProject: () => {},
  deleteProject: () => {},
  openProject: () => {},
  updateProject: () => {},
  // user data
  userUid: "",
  userLanguage: "",
  userDisplayName: "",
  userImage: "",
  userOpenProjects: [],
  userClosedProjects: [],
  userCreationDate: "",
  userDarkMode: true,
  //customization objects (themes, languages, etc...)
  themeObject: {},
  languages: {},
  //userLoginState
  userLoginState: "LOADING",
};

function getDefautThemeString() {
  let themeMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  return themeMode;
}

function getThemeObject(themeString) {
  return createTheme({
    palette: {
      mode: themeString,
      background: {
        default: themeString === "dark" ? grey[900] : grey[50],
        paper: themeString === "dark" ? grey[800] : "#fff",
      },
      text: {
        primary: themeString === "dark" ? "#fff" : grey[800],
        secondary: themeString === "dark" ? grey[500] : grey[900],
      },
    },
  });
}

function getDefautLanguage() {
  return "en";
}

async function getFile(filePath) {
  try {
    let file = await fetch(filePath);
    let data = await file.json();
    return data;
  } catch (e) {
    throw e.toString();
  }
}

export function AppProvider(props) {
  const [appContextData, setAppContextData] = useState({
    ...initialContextData,
  });

  useEffect(() => {
    let userThemeString = getDefautThemeString();
    let app,
      functions,
      httpsCallableFunctions = {},
      userUid = "",
      userDisplayName = "",
      userLanguage = getDefautLanguage(),
      errorMessage,
      userImage,
      userOpenProjects = [],
      userClosedProjects = [],
      userDarkMode = userThemeString === "dark" ? true : false,
      themeObject = getThemeObject(userThemeString),
      userCreationDate = "",
      userLoginState = "LOADING",
      emulatorStarted = false;

    getFile("./json/languages.json")
      .then(async (languagesFile) => {
        let firebaseConfig = {
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.REACT_APP_FIREBASE_APP_ID,
          measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
        };
        // initialize firebase app
        app = initializeApp(firebaseConfig);

        // get cloud functions reference
        functions = getFunctions(app);

        // connect to the emulator if developement
        let useEmulator = process.env.REACT_APP_USE_FIREBASE_EMULATOR;

        if (useEmulator === "1") {
          emulatorStarted = true;
          let autho = getAuth();
          connectFunctionsEmulator(functions, "localhost", 5001);
          connectAuthEmulator(autho, "http://localhost:9099");
        }

        httpsCallableFunctions.getDatabases = httpsCallable(
          functions,
          "getDatabases"
        );

        httpsCallableFunctions.login = httpsCallable(functions, "login");

        httpsCallableFunctions.createProject = httpsCallable(
          functions,
          "createProject"
        );
        httpsCallableFunctions.closeProject = httpsCallable(
          functions,
          "closeProject"
        );
        httpsCallableFunctions.openProject = httpsCallable(
          functions,
          "openProject"
        );
        httpsCallableFunctions.updateProject = httpsCallable(
          functions,
          "updateProject"
        );
        httpsCallableFunctions.deleteProject = httpsCallable(
          functions,
          "deleteProject"
        );
        httpsCallableFunctions.createUser = httpsCallable(
          functions,
          "createUser"
        );
        httpsCallableFunctions.loginUser = httpsCallable(
          functions,
          "loginUser"
        );
        httpsCallableFunctions.updateUser = httpsCallable(
          functions,
          "updateUser"
        );

        let loginUser = async (_data) => {
          try {
            let auth = getAuth();
            switch (_data.source) {
              case "google": {
                let provider = new GoogleAuthProvider();
                signInWithRedirect(auth, provider);
                break;
              }
              case "usernameAndPassword": {
                try {
                  let responseSignInWithEmailAndPassword =
                    await signInWithEmailAndPassword(
                      auth,
                      _data.email.toString(),
                      _data.password.toString()
                    );
                  let responseLogin = await httpsCallableFunctions.loginUser({
                    source: "usernameAndPassword",
                    uid: responseSignInWithEmailAndPassword.user.uid,
                  });

                  let responseUserDarkMode =
                    responseLogin.data.userData.darkMode;
                  let responseDefaultThemeString = responseUserDarkMode
                    ? "dark"
                    : "light";
                  let responseThemeObject = getThemeObject(
                    responseDefaultThemeString
                  );

                  setAppContextData((prevProps) => {
                    return {
                      ...prevProps,
                      userUid: responseSignInWithEmailAndPassword.user.uid,
                      userDisplayName: responseLogin.data.userData.name,
                      userImage: responseLogin.data.userData.image,
                      userLanguage: responseLogin.data.userData.language,
                      userDarkMode: responseUserDarkMode,
                      userOpenProjects:
                        responseLogin.data.userData.userOpenProjects,
                      userClosedProjects:
                        responseLogin.data.userData.userClosedProjects,
                      userCreationDate:
                        responseLogin.data.userData.creationDate,
                      themeObject: responseThemeObject,
                    };
                  });
                } catch (e) {
                  throw e.toString();
                }
                break;
              }
              default: {
                throw new Error("Must specify a login source");
              }
            }
          } catch (e) {
            throw e.toString();
          }
        };

        let createUser = async (_data) => {
          try {
            let auth = getAuth();
            auth.languageCode = userLanguage;
            let response = await createUserWithEmailAndPassword(
              auth,
              _data.email,
              _data.password
            );
            await sendEmailVerification(auth.currentUser);
            await httpsCallableFunctions.createUser({
              source: "password",
              uid: response.user.uid,
              email: _data.email,
              password: _data.password,
              name: _data.name,
              darkMode: userDarkMode,
              language: userLanguage,
              image: _data.image,
            });
          } catch (error) {
            throw error.toString();
          }
        };

        let logoutUser = async (_data) => {
          try {
            let auth = getAuth();
            await signOut(auth);
            let defaultThemeString = getDefautThemeString();
            let themeObject = getThemeObject(defaultThemeString);
            let userDarkMode = defaultThemeString === "dark" ? true : false;
            setAppContextData((prevProps) => {
              return {
                ...prevProps,
                userUid: "",
                userDisplayName: "",
                userImage: "",
                userLanguage: getDefautLanguage(),
                userOpenProjects: [],
                userClosedProjects: [],
                userDarkMode: userDarkMode,
                themeObject: themeObject,
              };
            });
          } catch (error) {
            throw error.toString();
          }
        };

        let recoverUser = async (_data) => {
          let auth = getAuth();
          try {
            await sendPasswordResetEmail(auth, _data.email);
          } catch (error) {
            throw error.toString();
          }
        };

        let getUserCredentials = () => {
          let auth = getAuth();
          let user = auth.currentUser;
          if (user !== null) {
            return Array.from(user.providerData).map((profile) => {
              return {
                provider: profile.providerId,
                uid: profile.uid,
                name: profile.displayName,
                email: profile.email,
                image: profile.photoURL,
              };
            });
          }
          return [];
        };

        let closeProject = async (_projectId) => {
          let response = await httpsCallableFunctions.closeProject({
            project: { id: _projectId },
            uid: userUid,
          });

          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userOpenProjects: response.data.userData.userOpenProjects,
              userClosedProjects: response.data.userData.userClosedProjects,
            };
          });
          return response;
        };
        let openProject = async (_projectId) => {
          let response = await httpsCallableFunctions.openProject({
            project: { id: _projectId },
            uid: userUid,
          });

          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userOpenProjects: response.data.userData.userOpenProjects,
              userClosedProjects: response.data.userData.userClosedProjects,
            };
          });
          return response;
        };

        let deleteProject = async (_projectId) => {
          let response = await httpsCallableFunctions.deleteProject({
            project: { id: _projectId },
            uid: userUid,
          });

          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userClosedProjects: response.data.userData.userClosedProjects,
            };
          });
          return response;
        };

        let createProject = async (_data) => {
          try {
            let response = await httpsCallableFunctions.createProject({
              project: {
                name: _data.name,
              },
              uid: userUid,
            });

            let newProjectObject = {
              id: response.data.project.id,
              name: _data.name,
            };

            setAppContextData((prevProps) => {
              let newUserOpenProjects = [
                ...prevProps.userOpenProjects,
                newProjectObject,
              ];
              return {
                ...prevProps,
                userOpenProjects: newUserOpenProjects,
              };
            });
          } catch (error) {
            throw error.toString();
          }
        };

        // UPDATE USER DATA
        let updateProject = async (
          projectId,
          newData,
          updateOnServer = true
        ) => {
          if (updateOnServer) {
            let dataToSend = {
              project: {
                newData: newData,
                id: projectId,
              },
              uid: userUid,
            };
            httpsCallableFunctions.updateProject(dataToSend);
          }

          setAppContextData((prevProps) => {
            let dataToChange = {
              userClosedProjects: prevProps.userClosedProjects,
              userOpenProjects: prevProps.userOpenProjects,
            };

            if (newData.name !== "") {
              //locally we update the user open projects and closed projects for that project id
              [
                ...dataToChange.userClosedProjects,
                ...dataToChange.userOpenProjects,
              ].find((project) => {
                return project.id === projectId;
              }).name = newData.name;
            }
            return { ...prevProps, ...dataToChange };
          });
        };

        // UPDATE USER DATA
        let updateUser = async (field, value, updateOnServer = true) => {
          let auth = getAuth();
          let userUid = auth.currentUser !== null ? auth.currentUser.uid : null;
          let databaseFields = [];
          databaseFields["userImage"] = "image";
          databaseFields["userDisplayName"] = "name";
          databaseFields["userLanguage"] = "language";
          databaseFields["userDarkMode"] = "darkMode";
          if (updateOnServer) {
            httpsCallableFunctions.updateUser({
              newData: { [databaseFields[field]]: value },
              uid: userUid,
            });
          }

          let dataToChange = { [field]: value };
          if (field === "userDarkMode")
            dataToChange = {
              ...dataToChange,
              themeObject: getThemeObject(value ? "dark" : "light"),
            };
          setAppContextData((prevProps) => {
            return { ...prevProps, ...dataToChange };
          });
        };

        //try get the google user data from redirect and do a login with that
        let auth = getAuth();
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            let loginData = {
              source: "google",
              uid: user.uid,
              darkMode: userDarkMode,
              language: userLanguage,
              name: user.displayName,
              image: user.photoURL ? user.photoURL : "",
            };
            let responseLogin = await httpsCallableFunctions.loginUser(
              loginData
            );
            if (responseLogin.data.errorCode === 0) {
              let responseUserDarkMode = responseLogin.data.userData.darkMode;
              let responseDefaultThemeString = responseUserDarkMode
                ? "dark"
                : "light";
              let responseThemeObject = getThemeObject(
                responseDefaultThemeString
              );
              userUid = user.uid;
              userDarkMode = responseUserDarkMode;
              userLanguage = responseLogin.data.userData.language;
              userDisplayName = responseLogin.data.userData.name;
              userImage = responseLogin.data.userData.image;
              userOpenProjects = responseLogin.data.userData.userOpenProjects;
              userClosedProjects =
                responseLogin.data.userData.userClosedProjects;
              userCreationDate = responseLogin.data.userData.creationDate;
              themeObject = responseThemeObject;
              userLoginState = "LOGUED_IN";
            }
          } else {
            userLoginState = "LOGUED_OUT";
          }
          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              //firebase connection data
              firebaseConnectionState: errorMessage ? "ERROR" : "READY",
              firebaseConnectionStateError: errorMessage,
              firebaseApp: app,
              firebaseFunctions: functions,
              firebaseHttpsCallableFunctions: httpsCallableFunctions,
              emulatorStarted: emulatorStarted,
              //global server functions
              createUser: createUser,
              loginUser: loginUser,
              logoutUser: logoutUser,
              recoverUser: recoverUser,
              getUserCredentials: getUserCredentials,
              updateUser: updateUser,
              createProject: createProject,
              closeProject: closeProject,
              deleteProject: deleteProject,
              openProject: openProject,
              updateProject: updateProject,
              userCreationDate: userCreationDate,
              // user data
              userUid: userUid,
              userLanguage: userLanguage,
              userDisplayName: userDisplayName,
              userImage: userImage,
              userOpenProjects: userOpenProjects,
              userClosedProjects: userClosedProjects,
              userDarkMode: userDarkMode,
              //customization objects (themes, languages, etc...)
              languages: languagesFile.languages,
              themeObject: themeObject,
              //userLoginState
              userLoginState: userLoginState,
            };
          });
        });
      })
      .catch((e) => {
        setAppContextData((prevProps) => {
          return {
            ...prevProps,
            firebaseConnectionState: "ERROR",
            firebaseConnectionStateError: e.toString(),
          };
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", appContextData.userTheme);
  }, [appContextData.userTheme]);

  // el provider siempre tiene una variable value
  // este es el valor retornado por el provider al componente interesado en escuchar al proveedor
  // use memo permite que React guarde el objeto retornado salvo que las propiedades en [] cambien
  const value = useMemo(() => {
    let getLanguageString = (componentName, stringName) => {
      let userLanguage = appContextData.userLanguage;
      if (appContextData.languages.length > 0) {
        let language = appContextData.languages.find((element) => {
          return userLanguage === element.id;
        });
        let component = language.components.find((component) => {
          return componentName === component.id;
        });
        let string = component.strings[stringName];
        return string;
      } else {
        return "---";
      }
    };

    return {
      ...appContextData,
      getLanguageString: getLanguageString,
    };
  }, [appContextData]);

  return <AppContext.Provider value={value} {...props}></AppContext.Provider>;
}

//se exporta un hook que sirve para que quien lo use pueda consumir el valor enviado por el Provider
export function useAppContext() {
  const context = React.useContext(AppContext); // esta variable context es el value pasado al AppContext.Provider
  if (!context) {
    throw new Error("useFirebase debe estar dentro del proveedor AppContext");
  }
  return context;
}
