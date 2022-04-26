import React, { useState, useCallback, useEffect } from "react";
import { createTheme, PaletteMode, Theme } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  EnumThemeString,
  IAppContextData,
  EnumUserLoginState,
  IUser,
  IProject,
  ISection,
} from "./index.d";
import i18n from "i18next";
import Firebase from "./firebase";
import { getAuth, onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import { Functions, getFunctions, httpsCallable } from "firebase/functions";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import i18next from "i18next";
import { loadExternalImage } from "../utils";
import { useNavigate } from "react-router-dom";
function getDefautThemeString(): PaletteMode {
  let themeMode: EnumThemeString =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? EnumThemeString.DARK
      : EnumThemeString.LIGHT;
  return themeMode;
}

function getThemeObject(themeString: PaletteMode): Theme {
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

export const AppContext = React.createContext<IAppContextData | null>(null);

const defaultUserThemeString: PaletteMode = getDefautThemeString();

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [themeObject, setThemeObject] = useState(
    getThemeObject(defaultUserThemeString)
  );
  const [firebaseApp, setFirebaseApp] = useState(Firebase);
  const auth = getAuth();
  const [userLoginState, setUserLoginState] = useState(
    EnumUserLoginState.LOADING
  );
  const [userObject, setUserObject] = useState<IUser | null>(null);
  const [userImage, setUserImage] = useState<string>("./noUserImage.png");

  const [headerLinks, setHeaderLinks] = useState<ISection[]>();

  useEffect(() => {
    // if user logout => reset the themeObject
  }, []);

  // on render context the first time check if user is logued in with google
  useEffect(() => {
    const onAuthChange: Unsubscribe = onAuthStateChanged(
      auth,
      (_user: User) => {
        if (_user) {
          console.log("auth user change!");
          if (
            userLoginState === EnumUserLoginState.LOGUED_OUT ||
            userLoginState === EnumUserLoginState.LOADING
          ) {
            //hace el login del usuario
            let functions: Functions = getFunctions(firebaseApp);
            const createLoginUserFunction = httpsCallable(
              functions,
              "loginUser"
            );
            createLoginUserFunction({
              name: _user?.displayName ? _user.displayName : _user.email,
              darkMode: themeObject.palette.mode,
              language: i18n.language,
              uid: _user.uid,
            })
              .then((response: any) => {
                let user: IUser = {
                  creationDate: response.data.userData.userCreationDate,
                  darkMode: response.data.userData.darkMode,
                  language: response.data.userData.language,
                  name: response.data.userData.name,
                  userProjects: response.data.userData.userProjects,
                  uid: _user.uid,
                };

                setUserObject(user);
                setThemeObject(getThemeObject(response.data.userData.darkMode));
                i18n.changeLanguage(user.language);

                const storage = getStorage(firebaseApp);
                const folder: string = `${_user.uid}/userImage`;
                const userImageRef = ref(storage, folder);
                getDownloadURL(userImageRef)
                  .then((url) => {
                    try {
                      changeImage(url, "path", folder); // url for <img> tag
                      setUserLoginState((_prevstate) => {
                        return EnumUserLoginState.LOGUED_IN; // last to update so it update the callback function on this context component
                      });
                    } catch (e) {
                      throw e;
                    }
                  })
                  .catch((error) => {
                    try {
                      if (_user.photoURL)
                        changeImage(_user.photoURL, "path", folder); //if cant acces storage userImage => upload credential userImage
                      setUserLoginState((_prevstate) => {
                        return EnumUserLoginState.LOGUED_IN; // last to update so it update the callback function on this context component
                      });
                    } catch (e) {
                      setUserLoginState((_prevstate) => {
                        return EnumUserLoginState.LOGUED_OUT; // last to update so it update the callback function on this context component
                      });
                    }
                  });
              })
              .catch((e) => {
                setUserLoginState((_prevstate) => {
                  return EnumUserLoginState.LOGUED_OUT;
                });
                setUserObject(null);
                setThemeObject(getThemeObject(defaultUserThemeString));
              });
          }
        } else {
          if (
            userLoginState === EnumUserLoginState.LOGUED_IN ||
            userLoginState === EnumUserLoginState.LOADING
          ) {
            setUserLoginState((_prevstate) => {
              return EnumUserLoginState.LOGUED_OUT;
            });
            setThemeObject(getThemeObject(getDefautThemeString()));
          }
        }
      }
    );
    //onAuthChange();
  }, []);

  const changeLanguage: (lanCode: string) => void = useCallback(
    (lanCode: string) => {
      i18n.changeLanguage(lanCode);
    },
    []
  );

  const changeImage: (
    url: string,
    type: "path" | "base64",
    folder: string
  ) => void = useCallback(
    (url: string, type: "path" | "base64", folder: string) => {
      const storage = getStorage(firebaseApp);
      switch (type) {
        case "base64": {
          const userImageRef = ref(storage, folder);
          // Base64 formatted string
          setUserImage(url);
          try {
            uploadString(userImageRef, url, "data_url");
          } catch (e) {}
          break;
        }
        case "path": {
          loadExternalImage(url).then((dataUrl: string) => {
            const userImageRef = ref(storage, folder);
            // Base64 formatted string
            setUserImage(dataUrl);
            try {
              uploadString(userImageRef, dataUrl, "data_url");
            } catch (e) {}
          });

          break;
        }
      }
    },
    [userLoginState, userObject]
  );

  const changeUserDarkMode: (newMode: string) => void = useCallback(
    (newMode: string) => {
      let functions: Functions = getFunctions(firebaseApp);
      const createUpdateUserFunction = httpsCallable(functions, "updateUser");
      setThemeObject(getThemeObject(newMode as PaletteMode));
      createUpdateUserFunction({
        uid: userObject ? userObject.uid : "",
        newData: {
          field: "darkMode",
          value: newMode,
        },
      })
        .then((result) => {
          setUserObject((_prevData) => {
            return {
              ..._prevData,
              darkMode: newMode,
            } as IUser;
          });
        })
        .catch((e) => {});
    },
    [userLoginState]
  );

  const changeUserLanguage: (newLanguage: string) => void = useCallback(
    (newLanguage: string) => {
      let functions: Functions = getFunctions(firebaseApp);
      const createUpdateUserFunction = httpsCallable(functions, "updateUser");
      i18n.changeLanguage(newLanguage);
      createUpdateUserFunction({
        uid: userObject ? userObject.uid : "",
        newData: {
          field: "language",
          value: newLanguage,
        },
      })
        .then((result) => {
          setUserObject((_prevData) => {
            return {
              ..._prevData,
              language: newLanguage,
            } as IUser;
          });
        })
        .catch((e) => {});
    },
    [userLoginState]
  );
  const changeUserName: (newName: string, updateOnServer: boolean) => void =
    useCallback(
      (newName: string, updateOnServer: boolean) => {
        let functions: Functions = getFunctions(firebaseApp);
        const createUpdateUserFunction = httpsCallable(functions, "updateUser");
        setUserObject((_prevData) => {
          return {
            ..._prevData,
            name: newName,
          } as IUser;
        });
        if (updateOnServer) {
          createUpdateUserFunction({
            uid: userObject ? userObject.uid : "",
            newData: {
              field: "name",
              value: newName,
            },
          })
            .then((result) => {
              setUserObject((_prevData) => {
                return {
                  ..._prevData,
                  name: newName,
                } as IUser;
              });
            })
            .catch((e) => {});
        }
      },
      [userLoginState]
    );

  const createKanbanList: (name: string, projectId: string) => Promise<any> =
    useCallback(
      (name: string, projectId: string) => {
        return new Promise((resolve, reject) => {
          let functions: Functions = getFunctions(firebaseApp) as Functions;
          const createKanbanListFunction = httpsCallable(
            functions,
            "createKanbanList"
          );
          createKanbanListFunction({
            uid: userObject?.uid,
            project: {
              id: projectId,
              list: {
                name: name,
              },
            },
          })
            .then((response: any) => {
              response.data.errorCode === 0
                ? resolve(response.data)
                : reject(response);
            })
            .catch((e) => {
              reject(e);
            });
        });
      },
      [userLoginState]
    );

  const createKanbanTask: (
    name: string,
    projectId: string,
    listId: string
  ) => Promise<any> = useCallback(
    (name: string, projectId: string, listId: string) => {
      return new Promise((resolve, reject) => {
        let functions: Functions = getFunctions(firebaseApp) as Functions;
        const createKanbanTaskFunction = httpsCallable(
          functions,
          "createKanbanTask"
        );
        createKanbanTaskFunction({
          uid: userObject?.uid,
          project: {
            id: projectId,
            list: {
              id: listId,
              task: {
                name: name,
              },
            },
          },
        })
          .then((response: any) => {
            response.data.errorCode === 0
              ? resolve(response.data)
              : reject(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    [userLoginState]
  );

  const deleteKanbanTask: (
    projectId: string,
    listId: string,
    taskId: string
  ) => void = useCallback(
    (projectId: string, listId: string, taskId: string) => {
      let functions: Functions = getFunctions(firebaseApp) as Functions;
      const deleteKanbanTaskFunction = httpsCallable(
        functions,
        "deleteKanbanTask"
      );

      deleteKanbanTaskFunction({
        uid: userObject?.uid,
        project: {
          id: projectId,
          list: {
            id: listId,
            task: {
              id: taskId,
            },
          },
        },
      });
    },
    [userLoginState]
  );

  const deleteKanbanList: (projectId: string, listId: string) => void =
    useCallback(
      (projectId: string, listId: string) => {
        httpsCallable(
          getFunctions(firebaseApp),
          "deleteKanbanList"
        )({
          uid: userObject?.uid,
          project: {
            id: projectId,
            list: {
              id: listId,
            },
          },
        });
      },
      [userLoginState]
    );

  const createProject: (name: string) => Promise<any> = useCallback(
    (name: string) => {
      return new Promise((resolve, reject) => {
        httpsCallable(
          getFunctions(firebaseApp),
          "createProject"
        )({
          uid: userObject?.uid,
          project: {
            name,
          },
        })
          .then((response: any) => {
            if (response.data.errorCode === 0) {
              setUserObject((_prevData: IUser) => {
                return {
                  ..._prevData,
                  userProjects: [
                    ...Array.from(_prevData?.userProjects),
                    {
                      id: response.data.project.id,
                      name: name,
                      isOpen: true,
                    },
                  ],
                };
              });
              resolve(null);
            } else {
              reject(response);
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    [userLoginState]
  );

  const updateProject: (
    id: string,
    newData: any,
    updateOnServer: boolean
  ) => void = useCallback(
    (id: string, newData: any, updateOnServer: boolean) => {
      //update locally
      setUserObject((_prevData: IUser) => {
        let projects: IProject[] = _prevData?.userProjects
          ? _prevData.userProjects
          : [];
        let project: any | undefined = projects.find((project: IProject) => {
          return project.id === id;
        });
        if (project) {
          for (const [key, val] of Object.entries(newData)) {
            project[key] = val;
          }
        }
        return {
          ..._prevData,
          userProjects: projects,
        };
      });
      if (updateOnServer) {
        //udate on server (dont wait for response)
        let functions: Functions = getFunctions(firebaseApp);
        const createUpdateProjectFunction = httpsCallable(
          functions,
          "updateProject"
        );
        createUpdateProjectFunction({
          uid: userObject?.uid,
          project: {
            id: id,
            newData: newData,
          },
        });
      }
    },
    [userLoginState]
  );

  const deleteProject: (id: string) => void = useCallback(
    (id: string) => {
      //update locally
      setUserObject((_prevData: IUser) => {
        let projects: IProject[] = _prevData?.userProjects
          ? _prevData.userProjects
          : [];
        projects = projects.filter((project: IProject) => {
          return project.id !== id;
        });
        return {
          ..._prevData,
          userProjects: projects,
        };
      });

      //udate on server (dont wait for response)
      let functions: Functions = getFunctions(firebaseApp);
      const createDeleteProjectFunction = httpsCallable(
        functions,
        "deleteProject"
      );
      createDeleteProjectFunction({
        uid: userObject?.uid,
        project: {
          id: id,
        },
      });
    },
    [userLoginState]
  );

  const appContextData: IAppContextData = {
    changeLanguage,
    themeObject,
    userLoginState,
    userObject: userObject,
    changeImage,
    changeUserDarkMode,
    changeUserLanguage,
    changeUserName,
    userImage,
    createProject,
    updateProject,
    deleteProject,
    createKanbanList,
    createKanbanTask,
    deleteKanbanTask,
    deleteKanbanList,
    headerLinks,
    setHeaderLinks,
  };

  return (
    <AppContext.Provider value={appContextData}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
