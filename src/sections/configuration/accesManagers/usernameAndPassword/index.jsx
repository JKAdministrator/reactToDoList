import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../../../context/appContext";
import { CircularProgress, Typography, Card, FormGroup } from "@mui/material";

export const AppContext = React.createContext();
const SectionConfigurationAccesAccountUsernameAndPassword = () => {
  const { getLanguageString, userData } = useAppContext();

  const [dataObject, setDataObject] = useState({
    displayName: "",
    email: "",
    state: "LOADING",
  });

  useEffect(() => {
    let loginData = userData.logins.find((l) => {
      return l.source === "usernameAndPassword";
    });
    console.log("loginData usernameAndPassword", { loginData });
    if (loginData) {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "READY" };
      });
    } else {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "EMPTY" };
      });
    }
  }, []);

  const getString = (string) => {
    return getLanguageString(
      "sectionConfiguration/accesAccounts/usernameAndPassword",
      string
    );
  };

  function handleDeleteClick(e) {
    setDataObject((_prevData) => {
      return { ..._prevData, state: "DELETING" };
    });
  }

  return (
    <>
      {dataObject.state === "READY" || dataObject.state === "DELETING" ? (
        <Card variant="outlined" sx={{}}>
          <FormGroup className={style.userAndPasswordCard}>
            <Typography variant="h7" component="h3" style={{ gridArea: "a1" }}>
              {getString("usernameAndPassword")}
            </Typography>

            <Typography variant="body1" gutterBottom style={{ gridArea: "a2" }}>
              {getString("username")}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              style={{ gridArea: "a3", opacity: "0.7" }}
            >
              {dataObject ? dataObject.email : ""}
            </Typography>

            <Typography variant="body1" gutterBottom style={{ gridArea: "a4" }}>
              {getString("password")}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              style={{ gridArea: "a5", opacity: "0.7" }}
            >
              {dataObject?.password ? "*****" : ""}
            </Typography>

            <Typography variant="body1" gutterBottom style={{ gridArea: "a6" }}>
              {getString("id")}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              style={{ gridArea: "a7", opacity: "0.7" }}
            >
              {dataObject ? dataObject.loginDocId : ""}
            </Typography>
          </FormGroup>
        </Card>
      ) : (
        <></>
      )}

      {dataObject.state === "LOADING" ? (
        <div className={style.loaderContainer}>
          <CircularProgress></CircularProgress>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SectionConfigurationAccesAccountUsernameAndPassword;
