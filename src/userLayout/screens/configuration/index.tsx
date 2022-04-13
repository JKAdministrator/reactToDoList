import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Stack,
  Fade,
  Zoom,
  Input,
  Avatar,
} from "@mui/material";
import CredentialCard from "./credentialCard";
import { IAppContextData } from "../../../appContext/index.d";
import { AppContext } from "../../../appContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Auth, getAuth, User, UserInfo } from "firebase/auth";

interface ILanguage {
  id: string;
  name: string;
}

const languages: ILanguage[] = [
  { id: "en", name: "English" },
  { id: "es", name: "Español" },
];

const ScreenConfiguration: React.FC = (props) => {
  const { t } = useTranslation();
  const {
    themeObject,
    changeImage,
    userObject,
    changeUserDarkMode,
    changeUserLanguage,
    changeUserName,
    userImage,
  } = React.useContext(AppContext) as IAppContextData;
  const [credentials, setCredentials] = useState<UserInfo[]>([]);

  useEffect(() => {
    let auth: Auth = getAuth();
    let user: User | null = auth.currentUser;
    if (user) setCredentials(user.providerData);
  }, []);

  function onUserImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result)
          changeImage(
            reader.result.toString(),
            "base64",
            `${userObject ? userObject.uid : ""}/userImage`
          );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onChangeThemeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    changeUserDarkMode(themeObject.palette.mode === "dark" ? "light" : "dark");
  }

  function onChangeLanguageHandler(e: React.ChangeEvent<HTMLInputElement>) {
    changeUserLanguage(e.target.value.toString());
  }

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    changeUserName(e.target.value.toString(), false);
  }
  function handleBlurName(e: React.FocusEvent<HTMLInputElement>) {
    changeUserName(e.target.value.toString(), true);
  }

  return (
    <Box className={style.container}>
      <Zoom in={true}>
        <Card
          style={{
            gridArea: "a1",
            height: "max-content",
          }}
        >
          <Fade in={true}>
            <FormGroup className={style.myData}>
              <Typography
                variant="h6"
                component="h2"
                style={{
                  gridArea: "a1",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                }}
              >
                {t("screen-configuration-myData")}
              </Typography>
              <TextField
                type="username"
                name="username"
                id="username"
                value={userObject ? userObject.name : ""}
                variant="filled"
                onChange={handleChangeName}
                onBlur={handleBlurName}
                label={t("screen-configuration-name")}
                style={{ gridArea: "a2" }}
              />
              <Typography
                variant="body1"
                gutterBottom
                style={{ gridArea: "a3" }}
              >
                {t("screen-configuration-userId")}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ gridArea: "a4", opacity: "0.5" }}
              >
                {userObject ? userObject.uid : ""}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ gridArea: "a5" }}
              >
                {t("screen-configuration-creationDate")}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ gridArea: "a6", opacity: "0.5" }}
              >
                {userObject
                  ? new Date(userObject?.creationDate?._seconds).toUTCString()
                  : ""}
              </Typography>
              <Avatar
                alt="User Image"
                src={userImage ? userImage : ""}
                style={{
                  gridArea: "a7",
                  justifySelf: "center",
                }}
                sx={{ width: 200, height: 200 }}
              >
                {userObject ? userObject?.name?.substring(0, 2) : "US"}
              </Avatar>
              <label htmlFor="contained-button-file" style={{ gridArea: "a8" }}>
                <Input
                  inputProps={{ accept: "image/*" }}
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={onUserImageChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  style={{ width: "100%" }}
                >
                  {t("screen-configuration-changeImage")}
                </Button>
              </label>
            </FormGroup>
          </Fade>
        </Card>
      </Zoom>
      <Zoom in={true}>
        <Card
          sx={{ backgroundColor: "background.paper" }}
          style={{ gridArea: "a2" }}
        >
          <Fade in={true}>
            <FormGroup className={style.preferences}>
              <Typography
                variant="h6"
                component="h2"
                style={{
                  gridArea: "a1",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                }}
              >
                {t("screen-configuration-application")}
              </Typography>
              <FormControlLabel
                style={{ gridArea: "a2" }}
                control={
                  <Switch
                    checked={themeObject.palette.mode === "dark" ? true : false}
                    onChange={onChangeThemeHandler}
                  />
                }
                label={t("screen-configuration-darkMode")}
              />
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, gridArea: "a3" }}
              >
                <InputLabel id="language-label">
                  {t("screen-configuration-language")}
                </InputLabel>
                <Select
                  style={{ gridArea: "language" }}
                  labelId="language-label"
                  id="language"
                  value={i18next.language}
                  label={t("screen-configuration-language")}
                  onChange={onChangeLanguageHandler}
                  variant="filled"
                >
                  {Array.from(languages).map((language: ILanguage) => {
                    return (
                      <MenuItem value={language.id} key={language.id}>
                        {language.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </FormGroup>
          </Fade>
        </Card>
      </Zoom>

      <Zoom in={true}>
        <Card
          sx={{ backgroundColor: "background.paper" }}
          style={{ gridArea: "a3" }}
        >
          <Fade in={true}>
            <FormGroup className={style.credentials}>
              <Typography
                variant="h6"
                component="h2"
                style={{
                  gridArea: "a1",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                }}
              >
                {t("screen-configuration-accesAccounts")}
              </Typography>
              <Stack spacing={2}>
                {credentials ? (
                  credentials.map((credentialData: UserInfo) => {
                    return (
                      <CredentialCard
                        key={credentialData.uid}
                        {...credentialData}
                      ></CredentialCard>
                    );
                  })
                ) : (
                  <></>
                )}
              </Stack>
            </FormGroup>
          </Fade>
        </Card>
      </Zoom>
    </Box>
  );
};

export default ScreenConfiguration;
