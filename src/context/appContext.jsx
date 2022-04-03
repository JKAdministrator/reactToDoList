import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import {
  getAuth,
  signOut,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  connectAuthEmulator,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Box, Container, createTheme } from "@mui/material";
import { blueGrey, deepOrange, grey, red } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
const AppContext = React.createContext();

const initialContextData = {
  firebaseConnectionState: "LOADING",
  firebaseConnectionStateError: "",
  firebaseApp: {},
  firebaseFunctions: {},
  firebaseHttpsCallableFunctions: {},
  languages: {},
  getString: () => {},
  useEmulator: false,
  emulatorStarted: false,
  userDocId: "",
  userData: {},
  tryLogin: () => {},
  tryLogout: () => {},
  trySignup: () => {},
  tryRecover: () => {},
  updateName: () => {},
  updateLanguage: () => {},
  userLanguage: "",
  userDisplayName: "",
  theme: {},
  darkMode: false,
  setDarkMode: () => {},
  updateUserImage: () => {},
  userImage: "",
};

async function getFiles() {
  try {
    let responses = await Promise.all([
      fetch("./json/firebasePublicCredentials.json"),
      fetch("./json/languages.json"),
    ]);
    let dataObjects = await Promise.all([
      responses[0].json(),
      responses[1].json(),
    ]);
    return { firebase: dataObjects[0], languages: dataObjects[1] };
  } catch (e) {
    throw e.toString();
  }
}

function getDefautTheme() {
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

export function AppProvider(props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // use the local emulator
  const useEmulator = false;
  const [appContextData, setAppContextData] = useState({
    ...initialContextData,
    darkMode: prefersDarkMode,
  });
  console.log("appContextData", {
    darkMode: appContextData.darkMode,
    theme: appContextData.theme,
  });

  const theme = createTheme({
    palette: {
      mode: appContextData.darkMode ? "dark" : "light",
    },
  });
  useEffect(() => {
    let app,
      functions,
      httpsCallableFunctions = {},
      userDocId = "",
      userData = {},
      userDisplayName = "",
      userLanguage = getDefautLanguage(),
      userTheme = getDefautTheme();
    const _useEmulator = useEmulator;
    getFiles()
      .then(async (result) => {
        // connect to firebase
        try {
          app = initializeApp(result.firebase);
          functions = getFunctions(app);
          if (useEmulator) {
            let auth = getAuth();
            connectFunctionsEmulator(functions, "localhost", 5001);
            connectAuthEmulator(auth, "http://localhost:9099");
          }
        } catch (e) {
          throw e.toString();
        }

        // get cloud functions references
        try {
          httpsCallableFunctions.getDatabases = httpsCallable(
            functions,
            "getDatabases"
          );
          httpsCallableFunctions.login = httpsCallable(functions, "login");
          httpsCallableFunctions.deleteLoginCredential = httpsCallable(
            functions,
            "deleteLoginCredential"
          );
          httpsCallableFunctions.updateUserField = httpsCallable(
            functions,
            "updateUserField"
          );
        } catch (e) {
          throw e.toString();
        }

        let setDarkMode = () => {
          setAppContextData((prevProps) => {
            let newDarkMode = !prevProps.darkMode;
            let themeString = newDarkMode ? "dark" : "light";
            console.log("new dark mode is", newDarkMode);
            httpsCallableFunctions.updateUserField({
              field: "theme",
              newValue: themeString,
              userDocId: userDocId,
            });

            return {
              ...prevProps,
              darkMode: newDarkMode,
              theme: getThemeObject(themeString),
            };
          });
        };

        // UPDATE USER IMAGE
        let updateUserImage = (userImageSrc) => {
          console.log("updating user image...", { src: userImageSrc });
          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userImage: userImageSrc,
            };
          });
          httpsCallableFunctions.updateUserField({
            field: "userImage",
            newValue: userImageSrc,
            userDocId: userDocId,
          });
        };

        //UPDATE NAME LOCALLY AND OPTIONALLY ON SERVER
        let updateName = (_newName, userDocId = null) => {
          console.log("AppContext.updateName", { _newName, userData });
          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userDisplayName: _newName,
            };
          });
          if (userDocId) {
            httpsCallableFunctions.updateUserField({
              field: "displayName",
              newValue: _newName,
              userDocId: userDocId,
            });
          }
        };

        //update theme locally and on the server
        let updateLanguage = (_newLanguage, userDocId) => {
          console.log("AppContext.updateLanguage", { _newLanguage, userData });
          //update context data (locally)
          setAppContextData((prevProps) => {
            return {
              ...prevProps,
              userLanguage: _newLanguage,
            };
          });

          //save change to server
          httpsCallableFunctions.updateUserField({
            field: "language",
            newValue: _newLanguage,
            userDocId: userDocId,
          });
        };

        //RECOVER PASSWORD FUNCTION
        let tryRecover = async (_data) => {
          try {
            let auth = getAuth();

            await sendPasswordResetEmail(auth, _data.email);
          } catch (error) {
            throw error.toString();
          }
        };

        // LOGOUT FUNCTION
        let tryLogout = async () => {
          try {
            let auth = getAuth();

            await signOut(auth);
            setAppContextData((prevProps) => {
              return {
                ...prevProps,
                userDocId: "",
                userData: {},
                userLanguage: getDefautLanguage(),
                userTheme: getDefautTheme(),
                userDisplayName: "",
              };
            });
          } catch (error) {
            throw error.toString();
          }
        };

        //SIGNUP FUNCTION
        let trySignup = async (_data) => {
          try {
            let auth = getAuth();
            auth.languageCode = userLanguage;
            let userCredential = await createUserWithEmailAndPassword(
              auth,
              _data.email,
              _data.password
            );

            await sendEmailVerification(auth.currentUser);

            console.log("trySignup response ", { userCredential });
            let responseLogin = await httpsCallableFunctions.login({
              source: "usernameAndPassword",
              email: _data.email,
              password: _data.password,
              displayName: _data.username,
              navigatorTheme: userTheme,
              navigatorLanguage: userLanguage,
              userImage: _data.userImage,
            });
            console.log("trySignup responseLogin ", { responseLogin });
            if (responseLogin.data.errorCode === 0) {
              setAppContextData((prevProps) => {
                return {
                  ...prevProps,
                  userDocId: responseLogin.data.userDocId,
                  userData: responseLogin.data.userData,
                  userLanguage: responseLogin.data.userData.user.language,
                  userTheme: responseLogin.data.userData.user.theme,
                  userDisplayName: responseLogin.data.userData.user.displayName,
                  userImage: responseLogin.data.userData.user.userImage,
                };
              });
            } else {
              throw responseLogin.data.errorMessage;
            }
          } catch (error) {
            throw error.toString();
          }
        };

        // LOGIN FUNCTION (AUTH + LOGIN)
        let tryLogin = async (_data) => {
          try {
            console.log("AppContext.tryLogin(_data)", {
              _data,
            });
            switch (_data.source) {
              case "google": {
                let auth = getAuth();

                let provider = new GoogleAuthProvider();

                signInWithRedirect(auth, provider);
                break;
              }
              case "usernameAndPassword": {
                let auth = getAuth();

                let responseSignInWithEmailAndPassword =
                  await signInWithEmailAndPassword(
                    auth,
                    _data.email.toString(),
                    _data.password.toString()
                  );
                let responseLogin = await httpsCallableFunctions.login({
                  source: "usernameAndPassword",
                  email: _data.email,
                  password: _data.password,
                  displayName:
                    responseSignInWithEmailAndPassword.user.displayName,
                  navigatorTheme: userTheme,
                  navigatorLanguage: userLanguage,
                });
                if (responseLogin.data.errorCode === 0) {
                  setAppContextData((prevProps) => {
                    return {
                      ...prevProps,
                      userDocId: responseLogin.data.userDocId,
                      userData: responseLogin.data.userData,
                      userLanguage: responseLogin.data.userData.user.language,
                      userTheme: responseLogin.data.userData.user.theme,
                      userDisplayName:
                        responseLogin.data.userData.user.displayName,
                    };
                  });
                } else {
                  throw responseLogin.data.errorMessage;
                }
                break;
              }
              default: {
                throw "Must specify a login source";
                break;
              }
            }
          } catch (e) {
            throw e.toString();
          }
        };

        // IF ALREADY LOGUED IN FROM READIRECT
        let errorMessage, isUserLoguedIn;
        let userImage = "";

        //get the google user data from redirect and do a login with that
        try {
          let auth = getAuth();

          let redirectResult = await getRedirectResult(auth);
          console.log(redirectResult.user);
          let responseLogin = await httpsCallableFunctions.login({
            source: "google",
            email: redirectResult.user.email,
            displayName: redirectResult.user.displayName,
            photoURL: redirectResult.user.photoURL,
            uid: redirectResult.user.uid,
            navigatorTheme: userTheme,
            navigatorLanguage: userLanguage,
            userImage: redirectResult.user.photoURL,
          });

          if (responseLogin.errorCode > 0) {
            setAppContextData((prevProps) => {
              return {
                ...prevProps,
                firebaseConnectionState: "ERROR",
                firebaseConnectionStateError: responseLogin.errorMessage,
              };
            });
            return;
          } else {
            userDocId = responseLogin.data.userDocId;
            userData = responseLogin.data.userData;
            userTheme = userData.user.theme;
            userLanguage = userData.user.language;
            userDisplayName = userData.user.displayName;
            userImage = userData.user.userImage;
            console.log("USER DATA FROM LOGIN", { responseLogin });
          }
        } catch (e) {}

        setAppContextData((prevProps) => {
          return {
            ...prevProps,
            firebaseApp: app,
            firebaseFunctions: functions,
            firebaseHttpsCallableFunctions: httpsCallableFunctions,
            firebaseConnectionState: errorMessage ? "ERROR" : "READY",
            firebaseConnectionStateError: errorMessage,
            userDocId: userDocId,
            userData: userData,
            languages: result.languages.languages,
            useEmulator: useEmulator,
            emulatorStarted: useEmulator ? true : false,
            tryLogin: tryLogin,
            tryLogout: tryLogout,
            trySignup: trySignup,
            tryRecover: tryRecover,
            updateName: updateName,
            updateLanguage: updateLanguage,
            userLanguage: userLanguage,
            userDisplayName: userDisplayName,
            darkMode: userTheme === "dark" ? true : false,
            theme: getThemeObject(userTheme),
            setDarkMode: setDarkMode,
            updateUserImage: updateUserImage,
            userImage: userImage,
          };
        });
      })
      .catch((e) => {
        console.log("error", { e });
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
        return "NaStr";
      }
    };

    return {
      ...appContextData,
      getLanguageString: getLanguageString,
    };
  }, [
    appContextData.firebaseConnectionState,
    appContextData.firebaseConnectionStateError,
    appContextData.firebaseCurrentUser,
    appContextData.userDocId,
    appContextData.userData,
    appContextData.userDisplayName,
    appContextData.userTheme,
    appContextData.userLanguage,
    appContextData.darkMode,
    appContextData.userImage,
  ]);

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
