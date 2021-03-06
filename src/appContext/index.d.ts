import { SvgIconTypeMap, Theme } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

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
  createKanbanList: (name: string, projectId: string) => Promise<any>;
  createKanbanTask: (
    name: string,
    projectId: string,
    listId: string
  ) => Promise<any>;
  deleteKanbanTask: (
    projectId: string,
    listId: string,
    taskId: string
  ) => Promise<any>;
  deleteKanbanList: (projectId: string, listId: string) => Promise<any>;
  userImage: string;
  headerLinks: ISection[] | undefined;
  setHeaderLinks: React.Dispatch<React.SetStateAction<ISection[]>>;
  getProject: (projectId: string) => Promise<IGetProjectResult>;
  resortKanbanLists: (
    projectId: string,
    olrOrder: number,
    newOrder: number
  ) => void;
  resortKanbanTasks: (
    projectId: string,
    oldListId: string,
    newListId: string,
    olrOrder: number,
    newOrder: number,
    taskId: string
  ) => void;
  getKanbanList: (
    projectId: string,
    listId: string
  ) => Promise<IProjectResultList>;

  //  currentLanguage: string;
}
/**
 * MAIN SECTIONS (PROJECTS, CONFIGURATION, ETC)
 */
interface ISection {
  label: string;
  id: string;
  link: string;
  icon: any;
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

/*************************************
 * HTTP CALLABLE INTERFACES
 */
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
export interface IProjectResultTask {
  name: string;
  id: string;
  listId: string;
  state: EnumGetProjectResultState;
}

export interface IProjectResultList {
  name: string;
  id: string;
  tasks: IProjectResultTask[];
  state: EnumGetProjectResultState;
}

export interface IGetProjectResult {
  creationDate: { _seconds: number; _nanoseconds: number };
  id: string;
  isOpen: boolean;
  lists: IProjectResultList[];
  name: string;
  owner: string;
}
export enum EnumGetProjectResultState {
  LOADING = "LOADING",
  READY = "READY",
}
