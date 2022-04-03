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
  } = useAppContext();

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
      <Card>
        <FormGroup className={style.myData}>
          <Typography
            variant="h6"
            component="h2"
            style={{ gridArea: "a1", whiteSpace: "pre-wrap", width: "100%" }}
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
          <Typography variant="body1" gutterBottom style={{ gridArea: "a3" }}>
            {getString("userId")}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            style={{ gridArea: "a4", opacity: "0.5" }}
          >
            {userDocId}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ gridArea: "a5" }}>
            {getString("creationDate")}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            style={{ gridArea: "a6", opacity: "0.5" }}
          >
            {userData.user
              ? new Date(userData.user.creationDate._seconds * 1000).toString()
              : ""}
          </Typography>
        </FormGroup>
      </Card>

      <Card sx={{ backgroundColor: "background.paper" }}>
        <FormGroup className={style.preferences}>
          <Typography
            variant="h6"
            component="h2"
            style={{ gridArea: "a1", whiteSpace: "pre-wrap", width: "100%" }}
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
            <InputLabel id="language-label">{getString("language")}</InputLabel>
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
      </Card>

      <Card sx={{ backgroundColor: "background.paper" }}>
        <FormGroup className={style.credentials}>
          <Typography
            variant="h6"
            component="h2"
            style={{ gridArea: "a1", whiteSpace: "pre-wrap", width: "100%" }}
          >
            {getString("accesAccounts")}
          </Typography>
          <Stack spacing={2}>
            <SectionConfigurationAccesAccountGoogle></SectionConfigurationAccesAccountGoogle>
            <SectionConfigurationAccesAccountUsernameAndPassword></SectionConfigurationAccesAccountUsernameAndPassword>
          </Stack>
        </FormGroup>
      </Card>
    </Box>
  );
};
/**
 

      <section className="card" name="ACCES_ACCOUNTS">
        <h2>{getString("accesAccounts")}</h2>
        <SectionConfigurationAccesAccountGoogle></SectionConfigurationAccesAccountGoogle>
        <SectionConfigurationAccesAccountUsernameAndPassword></SectionConfigurationAccesAccountUsernameAndPassword>
      </section>

      <section className="card" name="MY_DATA">
        <h2>{getString("myData")}Mis Datos</h2>
        <label htmlFor="username">{getString("name")} :</label>
        <input
          name="username"
          id="username"
          type="text"
          value={userDisplayName}
          onChange={handleChangeName}
          onBlur={handleBlurName}
        />
        <label htmlFor="userId">{getString("userId")} :</label>
        <span name="userId" id="userId">
          {userDocId}
        </span>
        <label htmlFor="creationDate">{getString("creationDate")} :</label>
        <span name="creationDate" id="creationDate">
          {userData.user
            ? new Date(userData.user.creationDate._seconds * 1000).toString()
            : ""}
        </span>
      </section>

 */
export default SectionConfiguration;
