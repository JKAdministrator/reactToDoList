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
  getRedirectResult,
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

async function getFile(filePath) {
  try {
    let file = await fetch(filePath);
    let data = await file.json();
    return data;
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

  const [appContextData, setAppContextData] = useState({
    ...initialContextData,
    darkMode: prefersDarkMode,
  });

  useEffect(() => {
    let app,
      functions,
      httpsCallableFunctions = {},
      userDocId = "",
      userData = {},
      userDisplayName = "",
      userLanguage = getDefautLanguage(),
      userTheme = getDefautTheme(),
      auth,
      errorMessage,
      userImage;

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
        console.log("firebaseConfig", firebaseConfig);
        // initialize firebase app
        app = initializeApp(firebaseConfig);

        // get cloud functions reference
        functions = getFunctions(app);

        auth = getAuth();

        // connect to the emulator if developement
        if (process.env.REACT_APP_USE_FIREBASE_EMULATOR !== "1") {
          connectFunctionsEmulator(functions, "localhost", 5001);
          connectAuthEmulator(auth, "http://localhost:9099");
        }

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

        console.log("firebase INITED", {
          app,
          auth,
          functions,
          httpsCallableFunctions,
        });

        // DARK MODE SET STATE
        let setDarkMode = () => {
          setAppContextData((prevProps) => {
            let newDarkMode = !prevProps.darkMode;
            let themeString = newDarkMode ? "dark" : "light";
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

        // USER IMAGE SET STATE
        let updateUserImage = (userImageSrc) => {
          setAppContextData((prevProps) => {
            return { ...prevProps, userImage: userImageSrc };
          });
          httpsCallableFunctions.updateUserField({
            field: "userImage",
            newValue: userImageSrc,
            userDocId: userDocId,
          });
        };

        // DISPLAY NAME SET STATE
        let updateName = (_newName, userDocId = null) => {
          setAppContextData((prevProps) => {
            return { ...prevProps, userDisplayName: _newName };
          });
          httpsCallableFunctions.updateUserField({
            field: "displayName",
            newValue: _newName,
            userDocId: userDocId,
          });
        };

        // LANGUAGE
        let updateLanguage = (_newLanguage, userDocId) => {
          setAppContextData((prevProps) => {
            return { ...prevProps, userLanguage: _newLanguage };
          });
          httpsCallableFunctions.updateUserField({
            field: "language",
            newValue: _newLanguage,
            userDocId: userDocId,
          });
        };

        //RECOVER PASSWORD FUNCTION
        let tryRecover = async (_data) => {
          try {
            await sendPasswordResetEmail(auth, _data.email);
          } catch (error) {
            throw error.toString();
          }
        };

        // LOGOUT FUNCTION
        let tryLogout = async () => {
          try {
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
            auth.languageCode = userLanguage;
            await createUserWithEmailAndPassword(
              auth,
              _data.email,
              _data.password
            );

            await sendEmailVerification(auth.currentUser);

            let responseLogin = await httpsCallableFunctions.login({
              source: "usernameAndPassword",
              email: _data.email,
              password: _data.password,
              displayName: _data.username,
              navigatorTheme: userTheme,
              navigatorLanguage: userLanguage,
              userImage: _data.userImage,
            });

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
            switch (_data.source) {
              case "google": {
                let provider = new GoogleAuthProvider();
                signInWithRedirect(auth, provider);
                break;
              }
              case "usernameAndPassword": {
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
                throw new Error("Must specify a login source");
              }
            }
          } catch (e) {
            throw e.toString();
          }
        };

        //try get the google user data from redirect and do a login with that
        try {
          let redirectResult = await getRedirectResult(auth);
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
          }
        } catch (e) {} //if fails continue as nothing happend

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
            languages: languagesFile.languages,
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
