import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'public/locales');
const enPath = path.join(localesDir, 'en', 'translation.json');

if (!fs.existsSync(enPath)) {
    console.error('Source of truth EN translation missing.');
    process.exit(1);
}

const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
let hasErrors = false;

function checkKeys(sourceRef, targetRef, lang, currentPath = '') {
    for (const key in sourceRef) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;

        if (!(key in targetRef)) {
            console.error(`[check-i18n] ❌ Missing key in ${lang}: ${fullPath}`);
            hasErrors = true;
            continue;
        }

        if (typeof sourceRef[key] === 'object' && sourceRef[key] !== null) {
            if (typeof targetRef[key] !== 'object' || targetRef[key] === null) {
                console.error(`[check-i18n] ❌ Type mismatch for object in ${lang}: ${fullPath}`);
                hasErrors = true;
            } else {
                checkKeys(sourceRef[key], targetRef[key], lang, fullPath);
            }
        }
    }
}

const files = fs.readdirSync(localesDir);
files.forEach(lang => {
    if (lang === 'en' || !fs.statSync(path.join(localesDir, lang)).isDirectory()) return;

    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) {
        console.error(`[check-i18n] ❌ Missing translation.json for language: ${lang}`);
        hasErrors = true;
        return;
    }

    const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    checkKeys(enData, langData, lang);
});

if (hasErrors) {
    console.error('\n[check-i18n] 💥 i18n consistency check failed.');
    process.exit(1);
} else {
    console.log('[check-i18n] ✅ All translation files match EN keys.');
    process.exit(0);
}
