import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ActiveSessionsService from "../../services/activeSessionsService";
import authService from "../../services/authService";
import LostPasswordDialog from "../dialogs/LostPasswordDialog";
import UserConnectedDialog from "../dialogs/UserConnectedDialog";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openUserConnectedDialog, setOpenUserConnectedDialog] = useState(false);
  const { t } = useTranslation();
  const [openChangePassword, setOpenChangePassword] = useState(false);



  /*   async function getUsers() {
      const result = await userService.getAll();
      if (result) {
        // Sort users in alphabetical order by their name
        const sortedUsers = result.sort((a, b) => a.username.localeCompare(b.username));
        setUsers(sortedUsers);
      }
    } */

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
