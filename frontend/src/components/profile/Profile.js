import React, { useEffect, useRef, useState } from "react";

import {
  Box, Button, CircularProgress, Grid, IconButton, Paper, Stack, Switch, TextField, Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
import paramService from "../../services/paramService";
import veilleService from "../../services/veilleService";
import LanguageSelector from "../common/LanguageSelector";
import ChangePasswordDialog from "../dialogs/ChangePasswordDialog";

import modeServiceInstance from "../../services/modeService";
import spaceService from "../../services/spaceService";
import useAuthStore from "../../stores/authStore";

function Profile() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [param, setParam] = useState({});
  const [veille, setVeille] = useState({});
  const [editRestartAt, setEditRestartAt] = useState("");
  const totalSize = 100; // Total size in GB
  const usedSize = 90; // Used size in GB
  const [user, setUser] = useState(null);
  const { darkMode, setDarkMode } = useDarkMode();
  const [mode, setMode] = useState({});
  const [sportsData, setSportsData] = useState([]);
  const timeoutRef = useRef(null);

  const predefinedColors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8C33", "#8C33FF", "#33FFF5", "#FFD700", // Couleurs précédentes
    "#FF6347", "#4682B4", "#32CD32", "#FF4500", "#DA70D6", "#7B68EE", "#00FA9A", "#FFDAB9", // Nouvelles couleurs
    "#FF1493", "#00BFFF", "#ADFF2F", "#FF69B4", "#BA55D3", "#9370DB", "#3CB371", "#FFB6C1", // Plus de couleurs
    "#FF7F50", "#6495ED", "#7FFF00", "#FF6347", "#DDA0DD", "#8A2BE2", "#20B2AA", "#FFA07A"  // Encore plus de couleurs
  ];

  useEffect(() => {
    modeServiceInstance.getMode().then(data => {
      setMode(data.mode);
    });

    spaceService.getSpace().then((data) => {
      const widths = [];
      const sportsData = [];
      let currentWidth = 0;
      let colorIndex = 0;

      Object.entries(data).forEach(([sport, size]) => {
        if (sport !== 'Total') {
          const width = (size / data.Total) * 100;
          widths.push(width);
          currentWidth += width;
          sportsData.push({
            name: sport,
            color: predefinedColors[colorIndex % predefinedColors.length],
            width: width,
          });
          colorIndex++;
        }
      });
      setWidths(widths);
      setSportsData(sportsData);
    }).catch((error) => {
      console.error("Error fetching space data:", error);
    });

    const currentUser = useAuthStore.getState().user;
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
      paramService.getByUserId(user.id).then((paramData) => {
        const paramDataItem = paramData?.[0] || {};
        setParam(paramDataItem);
        veilleService.getByUserId(paramDataItem.veille_id).then(veilleData => {
          setVeille(veilleData || {});
          setEditRestartAt(veilleData?.restart_at || "");
        });
      });
    }
  }, [user]);

  function getRandomColor() {
    const letters = '012233445566778899AABBCCCDEEFF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleRestartAtChange = (e) => {
    setEditRestartAt(e.target.value);
  };

  const submitVeilleUpdate = () => {
    if (!editRestartAt.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      alert("Please enter a valid time.");
      return;
    }
    const updatedVeille = { ...veille, restart_at: editRestartAt };
    veilleService.update(updatedVeille).then(() => {
      setVeille(updatedVeille);
      alert("Veille time updated successfully.");
    }).catch(error => {
      console.error("Error updating veille time:", error);
      alert("Failed to update veille time.");
    });
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const setIsDarkMode = () => {
    setDarkMode(prevDarkMode => {
      localStorage.setItem("darkMode", !prevDarkMode);
      return !prevDarkMode;
    });
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
              <Typography variant="h6" sx={{ color: "text.primary" }} className="headerTitle">
                {t("Profile.title")}
              </Typography>
            </Box>
          </Stack>
          <Box className="containerPage" sx={{ paddingLeft: { xs: 2, sm: 6 }, paddingRight: { xs: 2, sm: 6 } }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                {/* Other components remain unchanged */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ color: "text.secondary" }}>
                    {t("Profile.account")}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                    <Stack spacing={3} direction="row" alignItems="center">
                      <IconButton disabled>
                        <ModeNightIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                      <Typography>{t("Profile.restartTime")}:</Typography>
                    </Stack>
                    <TextField
      type="time"
      value={veille.restart_at}
      onChange={(e) => {
        const updatedVeille = {
          ...veille,
          restart_at: e.target.value,
        };
        setVeille(updatedVeille);

        // Définir un délai avant d'envoyer la mise à jour
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          updatedVeille01(updatedVeille);
        }, 1000); // Attendre 1 seconde après la dernière entrée
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
          </Box>
        </Paper>
      </Grid>
      <ChangePasswordDialog open={modalOpen} onClose={toggleModal} />
    </>
  );
}

export default Profile;
