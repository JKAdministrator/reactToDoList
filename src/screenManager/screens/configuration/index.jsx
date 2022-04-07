import React from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../../context/appContext";
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
export const AppContext = React.createContext();

const ScreenConfiguration = () => {
  const {
    userLanguage,
    userDisplayName,
    getLanguageString,
    userUid,
    userDarkMode,
    updateUserImage,
    userImage,
    getUserCredentials,
    languages,
    updateUser,
  } = useAppContext();
  console.log("languages", languages);
  function onUserImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        updateUserImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  function onChangeThemeHandler(e) {
    let newDarkMode = !userDarkMode;
    updateUser("userDarkMode", newDarkMode, true);
  }

  function onChangeLanguageHandler(e) {
    updateUser("userLanguage", e.target.value, true);
  }

  const getString = (string) => {
    return getLanguageString("screenConfiguration", string);
  };

  function handleChangeName(e) {
    updateUser("userDisplayName", e.target.value, false);
  }
  function handleBlurName(e) {
    updateUser("userDisplayName", e.target.value, true);
  }

  return (
    <Box className={style.container}>
      <Zoom in={true}>
        <Card style={{ gridArea: "a1", height: "max-content" }}>
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
                {getString("myData")}
              </Typography>
              <TextField
                type="username"
                name="username"
                id="username"
                value={userDisplayName}
                variant="filled"
                onChange={handleChangeName}
                onBlur={handleBlurName}
                label={getString("name")}
                style={{ gridArea: "a2" }}
              />
              <Typography
                variant="body1"
                gutterBottom
                style={{ gridArea: "a3" }}
              >
                {getString("userId")}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ gridArea: "a4", opacity: "0.5" }}
              >
                {userUid}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ gridArea: "a5" }}
              >
                {getString("creationDate")}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ gridArea: "a6", opacity: "0.5" }}
              >
                {"neww to get it from database"}
              </Typography>
              <Avatar
                alt="User Image"
                src={
                  userImage && userImage !== ""
                    ? userImage
                    : "./noUserImage.png"
                }
                style={{
                  gridArea: "a7",
                  justifySelf: "center",
                }}
                sx={{ width: 200, height: 200 }}
              >
                {userDisplayName.substring(0, 2)}
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
                  {getString("changeImage")}
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
                {getString("application")}
              </Typography>
              <FormControlLabel
                style={{ gridArea: "a2" }}
                control={
                  <Switch
                    checked={userDarkMode}
                    onChange={onChangeThemeHandler}
                  />
                }
                label={getString("darkMode")}
              />
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120, gridArea: "a3" }}
              >
                <InputLabel id="language-label">
                  {getString("language")}
                </InputLabel>
                <Select
                  style={{ gridArea: "language" }}
                  labelId="language-label"
                  id="language"
                  value={userLanguage}
                  label={getString("language")}
                  onChange={onChangeLanguageHandler}
                  variant="filled"
                >
                  {Array.from(languages).map((language) => {
                    return (
                      <MenuItem value={language.id} key={language.id}>
                        {language.label}
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
                {getString("accesAccounts")}
              </Typography>
              <Stack spacing={2}>
                {getUserCredentials().map((credentialData) => {
                  console.log("credentialData", { credentialData });
                  return (
                    <CredentialCard
                      key={credentialData.uid}
                      {...credentialData}
                    ></CredentialCard>
                  );
                })}
              </Stack>
            </FormGroup>
          </Fade>
        </Card>
      </Zoom>
    </Box>
  );
};

export default ScreenConfiguration;
