import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ActiveSessionsService from "../../services/activeSessionsService";
import authService from "../../services/authService";
import LostPasswordDialog from "../dialogs/LostPasswordDialog";
import UserConnectedDialog from "../dialogs/UserConnectedDialog";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import veilleService from "../../services/veilleService";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openUserConnectedDialog, setOpenUserConnectedDialog] = useState(false);
  const { t } = useTranslation();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [veille, setVeille] = useState({});

  useEffect(() => {
   veilleService
          .get()
          .then((data) => {
            console.log(data);
            setVeille(data);
            setBrightness(data.brightness);
          });
  }, []);

  const handleBrightnessChange = (event, newValue) => {
    const updatedVeille = {
      ...veille,
      brightness: newValue,
    };
    setBrightness(newValue);
    veilleService.update(updatedVeille).then((response) => { });
  };

  function deleteUserConected() {
    ActiveSessionsService.deleteCurrentUser();
    handleSubmit();
    closeUserConnectedDialog();
  }

  function lostPassword() {
    setOpenChangePassword(!openChangePassword);
  }

  function UserConnectedDialogOpen() {
    setOpenUserConnectedDialog(true);
  }

  function closeUserConnectedDialog() {
    setOpenUserConnectedDialog(false);
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      const response = await authService.login("Tennis", password);
      if (response.status === 401) {
        // Throw an error manually to get inside the catch block
        throw new Error("error mot de passe");
      }
      if (response.status === 409 && response.isConnected) {
        UserConnectedDialogOpen();
      }
    } catch (error) {
      console.log(error.message);
      setError(t("Login.errorMessage"));
    }
  }
  return (
    <Grid item>
      <Paper>
        <Box className="herderTitlePage">
          <Box className="headerLeft">
            <IconButton disabled>
              <LoginIcon
                sx={{ color: "primary.light" }}
                className="headerButton"
              />
            </IconButton>
            <Typography
              className="headerTitle"
              variant="h6"
              sx={{ color: "primary.light" }}
            >
              {t("Login.title")}
            </Typography>
          </Box>
        </Box>

        <Box className="centeredContainer">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ width: "35vh" }}>
              {/* <InputLabel>{t("Login.username")}</InputLabel>
              <Select
                labelId="user-select-label"
                label={t("Login.username")}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              >
                {users &&
                  users?.map((userOption) => (
                    <MenuItem key={userOption.id} value={userOption.username}>
                      {userOption.username}
                    </MenuItem>
                  ))}
              </Select> */}
              <TextField
                label={t("Login.password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
              />
              <Typography
                variant="body2"
                sx={{
                  color: error ? "error.main" : "transparent",
                  textAlign: "center",
                  height: "1.5em",
                }}
              >
                {error || " "}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  height: "1.5em",
                  color: "secondary.main",
                  cursor: "pointer",
                }}
                onClick={lostPassword}
              >
                {t("Login.lostPassword")}
              </Typography>

              <Button type="submit" sx={{ color: "secondary.main" }}>
                {t("Login.loginButton")}
              </Button>
            </FormControl>
          </form>
        </Box>
         
      </Paper>
      <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                  >
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <Brightness4Icon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography variant="h8" sx={{ color: "text.primary" }}>
                        {t("Profile.brightness")}
                      </Typography>
                    </Stack>
                    <Slider
                      color="secondary"
                      value={brightness}
                      onChange={handleBrightnessChange}
                      aria-labelledby="brightness-slider"
                      min={0}
                      max={10}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ width: 150 }}
                    />
                  </Stack>
      <LostPasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        users={"Tennis"}
      />
      <UserConnectedDialog
        open={openUserConnectedDialog}
        onClose={closeUserConnectedDialog}
        userDisconnect={deleteUserConected}
      />
    </Grid>
  );
}

export default Login;
