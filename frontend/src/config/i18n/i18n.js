import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./en.json";
import translationFR from "./fr.json";
import translationPL from "./pl.json";
import translationDE from "./de.json";
import translationES from "./es.json";
import translationNL from "./nl.json";
import useAuthStore from "../../stores/authStore";

const initI18n = async (user) => {
  let fallbackLng = "fr"; // Langue par défaut

  if (user) {
    try {
      console.log(user.language);
      fallbackLng = user.language || fallbackLng;
      console.log(fallbackLng);
    } catch (error) {
      console.error("Error fetching user language:", error);
    }
  }

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng, // Utilise la langue de l'utilisateur ou la langue par défaut
      lng: fallbackLng, // Définit la langue initiale
      resources: {
        en: {
          translation: translationEN,
        },
        fr: {
          translation: translationFR,
        },
        pl: {
          translation: translationPL,
        },
        de: {
          translation: translationDE,
        },
        es: {
          translation: translationES,
        },
        nl: {
          translation: translationNL,
        },
      },
      detection: {
        order: ["localStorage", "navigator"], // vérifie d'abord localStorage, puis la langue du navigateur
        caches: ["localStorage"], // stocke le choix de langue de l'utilisateur dans localStorage
      },
      interpolation: {
        escapeValue: false, // React échappe déjà les valeurs
      },
    });
};

// Initialisation avec l'utilisateur actuel
let user = useAuthStore.getState().user;
initI18n(user);

// Écouter les événements de connexion et de déconnexion
useAuthStore.subscribe((state) => {
  if (state.user !== user) {
    user = state.user; // Met à jour l'utilisateur
    initI18n(user); // Réinitialise i18n avec le nouvel utilisateur
  }
});

export default i18n;