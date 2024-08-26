import React, { useEffect, useState } from "react";
import authService from "../../services/authService";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../stores/authStore";

function LanguageSelector() {
  const { user } = useAuthStore();
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language.split("-")[0]
  );

  useEffect(() => {
    console.log(user.language);
    setSelectedLanguage(user.language);
  }, []);

  const changeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    setSelectedLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("i18nextLng", selectedLanguage);
    try {

      authService.updateLanguage(selectedLanguage, user.id);
    }
    catch (error) {
      console.error("Error during language change:", error);
    }
  };

  return (
    <Box>
      <FormControl size="small">
        <Select value={selectedLanguage} onChange={changeLanguage}>
          <MenuItem value="en">
            {/* <Box src={"/medias/flag/en.png"} alt="English" width={20} height={20} /> */}
            English
          </MenuItem>
          <MenuItem value="fr">
            {/*   <Box src={"/medias/flag/fr.png"} alt="Français" width={20} height={20} />  */}
            Français
          </MenuItem>
          <MenuItem value="pl">
            {/* <Box src={"/medias/flag/pl.png"} alt="Polski" width={20} height={20} />  */}
            Polski
          </MenuItem>
          <MenuItem value="de">
            {/* <Box src={"/medias/flag/de.png"} alt="Deutsch" width={20} height={20} />  */}
            Deutsch
          </MenuItem>
          <MenuItem value="es">
            {/* <Box src={"/medias/flag/es.png"} alt="Español" width={20} height={20} />  */}
            Español
          </MenuItem>
          <MenuItem value="nl">
            {/* <Box src={"/medias/flag/nl.png"} alt="Nederlands" width={20} height={20} />  */}
            Nederlands
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default LanguageSelector;
