import { Theme } from "@mui/material";

export interface ILanguageComponent {
  id: string;
  strings: { id: string; value: string }[];
}

export interface ILanguage {
  id: string;
  label: string;
  components: ILanguageComponent[];
}

export interface IProject {
  id: string;
  name?: string;
  isOpen?: boolean;
}

export interface ICredential {
  provider: string;
  uid: string;
  name: string;
  email: string;
  image: string;
}

export enum EnumThemeString {
  DARK = "dark",
  LIGHT = "light",
}

export interface IFirebaseHttpCallableFunctions {
  https_loginUser: any;
  https_createUser: any;
  https_closeProject: any;
  https_openProject: any;
  https_deleteProject: any;
  https_createProject: any;
  https_updateProject: any;
  https_updateUser: any;
}
export interface IFirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

export enum EnumUserLoginState {
  LOADING = "LOADING",
  LOGUED_IN = "LOGUED_IN",
  LOGUED_OUT = "LOGUED_OUT",
  ERROR = "ERROR",
}
export interface IAppContextData {
  changeLanguage: (lanCode: string) => void;
  themeObject: Theme;
  userLoginState: EnumUserLoginState;
  userObject: IUser | null;
  changeImage: (url: string, type: "path" | "base64", folder: string) => void;
  changeUserDarkMode: (newMode: string) => void;
  changeUserLanguage: (newLanguage: string) => void;
  changeUserName: (newName: string, updateOnServer: boolean) => void;
  createProject: (name: string) => Promise<any>;
  updateProject: (id: string, newData: any, updateOnServer: boolean) => void;
  deleteProject: (id: string) => void;
  userImage: string;
  //  currentLanguage: string;
}

export interface IUser {
  creationDate: {
    _seconds: number;
    _miliseconds: number;
  };
  darkMode: string;
  language: string;
  name: string;
  userProjects: IProject[];
  uid: string;
}

/*
  //firebase connection data
  firebaseConnectionState: EnumFirebaseConnectionState;
  firebaseConnectionStateError: string;
  firebaseApp: object;
  firebaseFunctions: object;
  firebaseHttpsCallableFunctions: IFirebaseHttpCallableFunctions;
  emulatorStarted: boolean;
  //global server functions
  createUser?: (_data: {
    email: string;
    password: string;
    name: string;
    image: string;
  }) => Promise<void>;
  loginUser?: (_data: {
    source: "google" | "usernameAndPassword";
    email: string;
    password: string;
  }) => Promise<void>;
  logoutUser?: () => Promise<void>;
  recoverUser?: (_data: { email: string }) => Promise<void>;
  getUserCredentials?: () => ICredential[];
  updateUser?: (_data: {
    field: string;
    value: string;
    updateOnServer: boolean;
  }) => void;
  createProject?: (_data: { name: string }) => Promise<void>;
  closeProject?: (_projectId: string) => Promise<any>;
  deleteProject?: (_projectId: String) => Promise<any>;
  openProject?: (_projectId: string) => Promise<any>;
  updateProject?: (_data: {
    projectId: string;
    newData: any;
    updateOnServer: boolean;
  }) => void;
  // user data
  userUid: string;
  userLanguage: string;
  userDisplayName: string;
  userImage: string;
  userProjects: IProject[];
  userCreationDate: { _seconds: number; _miliseconds: number };
  userDarkMode: boolean;
  //customization objects (themes, languages, etc...)
  themeObject: object;
  languages: ILanguage[];
  getLanguageString?: (componentName: string, stringId: string) => string;
  //userLoginState
  userLoginState: EnumUserLoginState;
}*/

interface IhttpCallableLoginUserResponse {
  data: {
    errorCode: number;
    errorMessage: string;
    userData: {
      darkMode: boolean;
      name: string;
      image: string;
      language: string;
      userProjects: IProject[];
      creationDate: { _seconds: number; _miliseconds: number };
    };
  };
}

interface IhttpCallableCreateProjectResponse {
  data: {
    errorCode: number;
    errorMessage: string;
    project: {
      id: string;
    };
  };
}
interface IhttpCallableDeleteProjectResponse {
  data: {
    errorCode: number;
    errorMessage: string;
    userData: {
      userProjects: IProject[];
    };
  };
}
