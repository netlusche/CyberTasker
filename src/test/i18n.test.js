import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import i18n from '../i18n';

describe('i18n Configuration', () => {
    beforeAll(() => {
        // Load translations manually in Vitest to avoid Vite public asset import errors
        const enPath = path.resolve(__dirname, '../../public/locales/en/translation.json');
        const dePath = path.resolve(__dirname, '../../public/locales/de/translation.json');

        const enTranslation = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const deTranslation = JSON.parse(fs.readFileSync(dePath, 'utf8'));

        i18n.addResourceBundle('en', 'translation', enTranslation);
        i18n.addResourceBundle('de', 'translation', deTranslation);
    });
    it('should initialize with English as the default fallback language', () => {
        expect(i18n.options.fallbackLng).toContain('en');
    });

    it('should have translations for German and English', () => {
        expect(i18n.hasResourceBundle('de', 'translation')).toBe(true);
        expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
    });

    it('should translate a header key correctly in German', () => {
        i18n.changeLanguage('de');
        expect(i18n.t('header.system_help')).toBe('SYSTEMHILFE');
    });

    it('should translate a header key correctly in English', () => {
        i18n.changeLanguage('en');
        expect(i18n.t('header.system_help')).toBe('SYSTEM HELP');
    });
});
