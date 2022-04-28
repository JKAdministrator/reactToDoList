import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from "firebase/functions";
import { connectStorageEmulator } from "firebase/storage";
import { IFirebaseConfig } from "./index.d";

interface IFirebaseController {
  app: FirebaseApp;
  functions: Functions;
}

const firebaseConfig: IFirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const Firebase: FirebaseApp = initializeApp(firebaseConfig);
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === "1") {
  console.log("using emulator");
  let auth: Auth = getAuth();
  let functions: Functions = getFunctions(Firebase);
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
}
export default Firebase;
