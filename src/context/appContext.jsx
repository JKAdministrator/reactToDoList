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
    language: "es",
    setLanguage: () => {},
  });

  console.log("appContextData", { appContextData });

  const getFirebaseCredentilsData = async () => {
    try {
      let response = await fetch("./json/firebasePublicCredentials.json");
      let data = await response.json();
      return data;
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
    getFirebaseCredentilsData()
      .then(async (firebaseCredentials) => {
        let app,
          functions,
          httpsCallableFunctions = {},
          user = {},
          firebaseLoginFuncions = {};

        // connect to firebase and get cloud functions
        try {
          app = initializeApp(firebaseCredentials);
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
            console.log("firebase.signOut()");
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
          // This gives you a Google Access Token. You can use it to access Google APIs.
          //let credential = GoogleAuthProvider.credentialFromResult(redirectResult);
          //let token = credential.accessToken;
          // The signed-in user info.
          user = redirectResult.user;
          isUserLoguedIn = true;
          console.log("usuario logueado", { usuario: user });
        } catch (e) {
          let errorCode = e.code;
          errorMessage = e.message;
          // The email of the user's account used.
          //let email = e.email;
          // The AuthCredential type that was used.
          let loginCredential = GoogleAuthProvider.credentialFromError(e);
          console.log(
            "loginCredential",
            loginCredential,
            errorCode,
            errorMessage
          );
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
          };
        });
      })
      .catch((e) => {
        console.log("e", e.toString());
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
    return {
      firebaseConnectionState: appContextData.firebaseConnectionState,
      firebaseConnectionStateError: appContextData.firebaseConnectionStateError,
      firebaseHttpsCallableFunctions:
        appContextData.firebaseHttpsCallableFunctions,
      theme: appContextData.theme,
      firebaseLoginFuncions: appContextData.firebaseLoginFuncions,
      firebaseCurrentUser: appContextData.firebaseCurrentUser,
      setTheme: appContextData.setTheme,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appContextData.firebaseConnectionState,
    appContextData.theme,
    appContextData.firebaseConnectionStateError,
    appContextData.firebaseLoginFuncions,
    appContextData.firebaseCurrentUser,
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
