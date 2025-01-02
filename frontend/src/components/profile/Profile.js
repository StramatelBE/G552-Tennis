import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import BugReportIcon from "@mui/icons-material/BugReport";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import LockIcon from "@mui/icons-material/Lock";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import PhoneIcon from "@mui/icons-material/Phone";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import StopIcon from "@mui/icons-material/Stop";
import StorageIcon from "@mui/icons-material/Storage";

import { useDarkMode } from "../../contexts/DarkModeContext";
import authService from "../../services/authService";
import paramService from "../../services/paramService";
import veilleService from "../../services/veilleService";
import LanguageSelector from "../common/LanguageSelector";
import ChangePasswordDialog from "../dialogs/ChangePasswordDialog";

import modeServiceInstance from "../../services/modeService";
import spaceService from "../../services/spaceService";

function Profile() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const [veille, setVeille] = useState({});

  const [user, setUser] = useState(null);
  const { darkMode, setDarkMode } = useDarkMode();
  const [mode, setMode] = useState({});
  const [sportsData, setSportsData] = useState([]);
  const [brightness, setBrightness] = useState(0);


  useEffect(() => {
    modeServiceInstance.getMode().then((data) => {
      setMode(data.mode);
    });
    function getRandomColor() {
      const letters = '012233445566778899AABBCCCDEEFF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    spaceService.getSpace().then((data) => {
      const widths = [];
      const sportsData = [];
      Object.entries(data).forEach(([sport, size]) => {
        if (sport !== 'Total') {
          const width = (size / data.Total) * 100;
          widths.push(width);
         
          sportsData.push({
            name: sport,
            color: getRandomColor(),
            width: width,
          });
        }
      });

      setSportsData(sportsData);
    });
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);


  function setModeTest(mode) {
    const datamode = { event_id: null, mode: mode };
    modeServiceInstance.setMode(datamode).then((data) => {
      console.log("data", data);
      setMode(mode);
    });
  }



  useEffect(() => {
    if (user) {

      paramService.getByUserId(user.user.id).then((paramData) => {
    
   
      
        veilleService
          .get()
          .then((veilleData) => {
            setVeille(veilleData || {});
            setBrightness(veilleData.brightness);
           
          });
      });
    }
  }, [user]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const setIsDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      localStorage.setItem("darkMode", !prevDarkMode);
      return !prevDarkMode;
    });
  };


  const handleVeilleChange = (event) => {
    const updatedVeille = { ...veille, enable: event.target.checked ? 1 : 0 };
    setVeille(updatedVeille);
    veilleService.update(updatedVeille).then((response) => {
      console.log(response);
    });
  };

  function updatedVeille01(veille) {
    setVeille(veille);
    console.log(veille);
    veilleService.update(veille).then((response) => {
      console.log(response);
    });
  }

  const handleBrightnessChange = (event, newValue) => {
    const updatedVeille = {
      ...veille,
      brightness: newValue,
    };
    setBrightness(newValue);
    veilleService.update(updatedVeille).then((response) => { });
  };

  




  return (
    <>
      <Grid item xs={12}>
        <Paper className="mainPaperPage">
          <Stack className="herderTitlePage">
            <Box className="headerLeft">
              <IconButton disabled className="headerButton">
                <SettingsIcon sx={{ color: "primary.light" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "text.primary" }}
                className="headerTitle"
              >
                {t("Profile.title")}
              </Typography>
            </Box>
          </Stack>
          <Box
            className="containerPage"
            sx={{
              paddingLeft: { xs: 2, sm: 6 },
              paddingRight: { xs: 2, sm: 6 },
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>

                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ color: "text.secondary" }}>
                    {t("Profile.application")}
                  </Typography>
                  <Stack
                    onClick={toggleModal}
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <IconButton disabled>
                      <LockIcon sx={{ color: "text.secondary" }} />
                    </IconButton>
                    <Typography
                      variant="h8"
                      sx={{
                        color: "text.primary",
                        textTransform: "none",
                        padding: "0",
                      }}
                    >
                      {t("Profile.changePassword")}
                    </Typography>
                  </Stack>
                  <Stack
                    onClick={setIsDarkMode}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                  >
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <DarkModeIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography variant="h8" sx={{ color: "text.primary" }}>
                        {t("Profile.darkMode")}
                      </Typography>
                    </Stack>
                    <Switch checked={darkMode} color="secondary" />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                  >
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <BugReportIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography variant="h8" sx={{ color: "text.primary" }}>
                        {t("Profile.panelsTest")}
                      </Typography>
                    </Stack>
                    {mode && mode === "test" ? (
                      <IconButton
                        sx={{ p: 0 }}
                        size="big"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModeTest(null);
                        }}
                      >
                        <StopIcon sx={{ color: "secondary.main" }} />
                        <CircularProgress
                          size={20}
                          sx={{
                            left: 1.2,
                            position: "absolute",
                            color: "secondary.main",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        sx={{ p: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModeTest("test");
                        }}
                      >
                        <PlayArrowIcon
                          sx={{ fontSize: 30, color: "secondary.main" }}
                        />
                      </IconButton>
                    )}
                  </Stack>

                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <LanguageIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography variant="h8" sx={{ color: "text.primary" }}>
                        {t("Profile.languages")}
                      </Typography>
                    </Stack>
                    <LanguageSelector />
                  </Stack>
                </Stack>
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
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, color: "text.secondary" }}
                  >
                    {t("info")}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <IconButton disabled>
                      <PhoneIcon sx={{ color: "text.secondary" }} />
                    </IconButton>
                    <Typography variant="h8" sx={{ color: "text.primary" }}>
                      +33 (0) 2 40 25 46 90
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                /*   style={{
                  paddingTop: "15px"
                }} */
                item
                xs={12}
                sm={6}
              >
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ color: "text.secondary" }}>
                    {t("Profile.account")}
                  </Typography>
                
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                    onClick={handleVeilleChange}
                  >
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <ModeNightIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography>heure de redémarrage:</Typography>
                    </Stack>

                    <TextField
                      type="time"
                      value={veille.restart_at}
                      onInput={(e) => {
                        console.log("Input changed", e.target.value);
                        const updatedVeille = {
                          ...veille,
                          restart_at: e.target.value,
                        };
                        updatedVeille01(updatedVeille);
                      }}
                      required
                      margin="normal"
                      inputProps={{
                        step: 300, // Pas de 5 minutes pour la sélection de l'heure
                      }}
                    />
                  </Stack>
                 
                </Stack>
              </Grid>
            </Grid>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <IconButton disabled>
                <StorageIcon sx={{ color: "text.secondary" }} />
              </IconButton>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h8" sx={{ color: "text.primary" }}>
                  {t("Profile.usedStorageSpace")}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 10 }}>
                <Box sx={{ display: 'flex', height: '20px', outline: '1px solid #dbd2d2 !important' }}>
                  {sportsData.length > 0 && sportsData.filter(sport => sport.width >= 1).map((sport, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: `${sport.width}%`,
                        backgroundColor: sport.color,
                      }}
                    />
                  ))}
                </Box>

              </Box>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
              {sportsData.length > 0 && sportsData.filter(sport => sport.width >= 1).map((sport, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 1, mb: 1 }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: sport.color }} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {sport.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>
      <ChangePasswordDialog open={modalOpen} onClose={toggleModal} />
    </>
  );
}

export default Profile;
