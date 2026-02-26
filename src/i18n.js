import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const isTest = import.meta.env.MODE === 'test';

const i18nConfig = {
    fallbackLng: 'en',
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    backend: {
        loadPath: 'locales/{{lng}}/translation.json',
    }
};

if (isTest) {
    i18nConfig.resources = {}; // Tests will inject translations manually
}

const instance = i18n.use(initReactI18next);

if (!isTest) {
    instance.use(HttpApi).use(LanguageDetector);
}

instance.init(i18nConfig);

export default i18n;
