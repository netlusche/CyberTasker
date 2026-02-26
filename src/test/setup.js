import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import i18n from '../i18n';

// Load translations manually in Vitest to avoid Vite public asset import errors
const enPath = path.resolve(__dirname, '../../public/locales/en/translation.json');
const dePath = path.resolve(__dirname, '../../public/locales/de/translation.json');

if (fs.existsSync(enPath) && fs.existsSync(dePath)) {
    const enTranslation = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const deTranslation = JSON.parse(fs.readFileSync(dePath, 'utf8'));

    i18n.addResourceBundle('en', 'translation', enTranslation);
    i18n.addResourceBundle('de', 'translation', deTranslation);
}
