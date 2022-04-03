import React, { useEffect } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";
import SectionConfigurationAccesAccountGoogle from "./accesManagers/google";
import SectionConfigurationAccesAccountUsernameAndPassword from "./accesManagers/usernameAndPassword";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
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
  Slide,
  Zoom,
  Input,
  Avatar,
} from "@mui/material";
export const AppContext = React.createContext();

const SectionConfiguration = () => {
  const {
    userLanguage,
    userDisplayName,
    getLanguageString,
    userDocId,
    userData,
    updateName,
    updateLanguage,
    setDarkMode,
    darkMode,
    updateUserImage,
    userImage,
  } = useAppContext();

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
    console.log("onChangeThemeHandler", e);
    setDarkMode();
    //let newValue = e.target.checked ? `dark` : `light`;
    //setTheme(newValue);
  }

  function onChangeLanguageHandler(e) {
    updateLanguage(e.target.value, userDocId);
  }

  const getString = (string) => {
    return getLanguageString("sectionConfiguration", string);
  };

  function handleChangeName(e) {
    updateName(e.target.value, null);
  }
  function handleBlurName(e) {
    updateName(e.target.value, userDocId);
  }

  console.log("redrawing", { darkMode: darkMode });

  return (
    <Box className={style.container}>
      <Zoom in={true}>
        <Card style={{ gridArea: "a1" }}>
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
                {userDocId}
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
                {userData.user
                  ? new Date(
                      userData.user.creationDate._seconds * 1000
                    ).toString()
                  : ""}
              </Typography>
              <Avatar
                alt="Remy Sharp"
                src={userImage ? userImage : false}
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
                  <Switch checked={darkMode} onChange={onChangeThemeHandler} />
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
                  <MenuItem value={"en"}>English</MenuItem>
                  <MenuItem value={"es"}>Español</MenuItem>
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
                <SectionConfigurationAccesAccountGoogle></SectionConfigurationAccesAccountGoogle>
                <SectionConfigurationAccesAccountUsernameAndPassword></SectionConfigurationAccesAccountUsernameAndPassword>
              </Stack>
            </FormGroup>
          </Fade>
        </Card>
      </Zoom>
    </Box>
  );
};

export default SectionConfiguration;
