import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'rs', // Default language if none is detected
    debug: false,
    backend: {
      loadPath: 'public/locales/{{lng}}/translation.json',
      // loadPath: 'https://ljubicjanko.github.io/CBD-Locales/locales/{{lng}}/translation.json',
    },
    detection: {
      order: [
        'querystring',
        'localStorage',
        'cookie',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],
      lookupQuerystring: 'language',
      lookupLocalStorage: 'i18nextLng', // Local storage key
      lookupCookie: 'i18next', // Cookie key
      caches: ['localStorage', 'cookie'], // Save the language in localStorage and cookie
    },
    returnEmptyString: false,
    ns: 'translation',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },
  });

// Check if a language is set in localStorage or cookie, if not, set it to 'rs'
// const userLanguage = localStorage.getItem('i18nextLng') || i18n.language || 'rs';
if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'rs');
  i18n.changeLanguage('rs');
}

export default i18n;
