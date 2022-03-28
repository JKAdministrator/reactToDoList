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
} from "firebase/auth";

const AppContext = React.createContext();

export function AppProvider(props) {
  const useEmulator = false;
  const [appContextData, setAppContextData] = useState({
    theme: "dark",
    firebaseConnectionState: "LOADING",
    firebaseConnectionStateError: "",
    firebaseApp: {},
    firebaseFunctions: {},
    firebaseHttpsCallableFunctions: {},
    firebaseLoginFuncions: {},
    firebaseCurrentUser: {},
    isUserLoguedIn: false,
    setTheme: () => {},
    language: "",
    setLanguage: () => {},
    languages: {},
    getString: () => {},
  });

  const getFiles = async () => {
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
  };

  const setTheme = (newThemeClass) => {
    setAppContextData((_prevProps) => {
      return {
        ..._prevProps,
        theme: newThemeClass,
      };
    });
  };

  const setLanguage = (newLanguageValue) => {
    setAppContextData((_prevProps) => {
      return {
        ..._prevProps,
        language: newLanguageValue,
      };
    });
  };

  useEffect(() => {
    getFiles()
      .then(async (result) => {
        let app,
          functions,
          httpsCallableFunctions = {},
          user = {},
          firebaseLoginFuncions = {};
        // connect to firebase and get cloud functions
        try {
          app = initializeApp(result.firebase);
          functions = getFunctions(app);
          if (useEmulator)
            connectFunctionsEmulator(functions, "localhost", 5001);
          httpsCallableFunctions.getDatabases = httpsCallable(
            functions,
            "getDatabases"
          );
          httpsCallableFunctions.login = httpsCallable(functions, "login");
        } catch (e) {
          throw e.toString();
        }

        //create loguin functions
        firebaseLoginFuncions.signInWithEmailAndPassword = async (
          email,
          password
        ) => {
          let auth = getAuth();
          let userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          return userCredential;
        };

        firebaseLoginFuncions.signInWithGoogle = (email, password) => {
          let provider = new GoogleAuthProvider();
          let auth = getAuth();
          signInWithRedirect(auth, provider);
        };

        firebaseLoginFuncions.signOut = async () => {
          const auth = getAuth();
          try {
            await signOut(auth);
            setAppContextData((prevProps) => {
              return {
                ...prevProps,
                firebaseCurrentUser: {},
                firebaseLoginFuncions,
                isUserLoguedIn: false,
              };
            });
          } catch (error) {
            throw error.toString();
          }
        };

        // verify if already logued in
        let errorMessage, isUserLoguedIn;
        try {
          let auth = getAuth();
          let redirectResult = await getRedirectResult(auth);
          user = redirectResult.user;
          isUserLoguedIn = true;
        } catch (e) {
          //let errorCode = e.code;
          //errorMessage = e.message;
          //let loginCredential = GoogleAuthProvider.credentialFromError(e);
          errorMessage = "";
          isUserLoguedIn = false;
        }

        setAppContextData((prevProps) => {
          return {
            ...prevProps,
            firebaseApp: app,
            firebaseFunctions: functions,
            firebaseHttpsCallableFunctions: httpsCallableFunctions,
            firebaseConnectionState: errorMessage ? "ERROR" : "READY",
            firebaseConnectionStateError: errorMessage,
            firebaseCurrentUser: user,
            firebaseLoginFuncions,
            isUserLoguedIn: isUserLoguedIn,
            setTheme: setTheme,
            setLanguage: setLanguage,
            languages: result.languages.languages,
            language: "es",
            theme: "light",
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
    document.body.setAttribute("data-theme", appContextData.theme);
  }, [appContextData.theme]);

  // el provider siempre tiene una variable value
  // este es el valor retornado por el provider al componente interesado en escuchar al proveedor
  // use memo permite que React guarde el objeto retornado salvo que las propiedades en [] cambien
  const value = useMemo(() => {
    let getLanguageString = (componentName, stringName) => {
      if (appContextData.languages.length > 0) {
        let language = appContextData.languages.find((element) => {
          return appContextData.language === element.id;
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
    appContextData.theme,
    appContextData.language,
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
