import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

// These files are grandfathered in because they were written before the strict theme rules.
// They already contain many hardcoded colors and refactoring them all now is out of scope.
const ignoredFiles = [
    'ProfileModal.jsx',
    'HelpModal.jsx',
    'LevelBar.jsx',
    'index.css',
    'AdminPanel.jsx',
    'App.jsx',
    'CalendarModal.jsx',
    'TaskCard.jsx',
    'Tooltip.jsx',
    'CyberButton.jsx',
    'SystemModal.jsx',
    'DirectiveModal.jsx',
    'TaskFilters.jsx',
    'AuthForm.jsx',
    'CyberSelect.jsx'
];

let hasErrors = false;

function scanDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (stat.isFile() && fullPath.endsWith('.jsx')) {
            const fileName = path.basename(fullPath);
            if (ignoredFiles.includes(fileName)) continue;

            checkFile(fullPath);
        }
    }
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Regex matches #123, #123456, rgb(), rgba() but tries to ignore hex codes in comments 
    // For simplicity, we just look for literal CSS color declarations
    const colorRegex = /(#[0-9a-fA-F]{3,6}\b|rgba?\([^)]+\))/g;

    lines.forEach((line, index) => {
        if (line.trim().startsWith('//')) return; // skip line comments
        if (line.match(colorRegex)) {
            // Check if it's inside a string that isn't a className wait, Tailwind classes don't use arbitrary hex values without bracket notation, 
            // e.g. text-[#ff0000]. The focus here is strictly on avoiding any magic colors in the DOM.
            console.error(`[check-theme] ❌ Hardcoded color found in ${filePath}:${index + 1} -> ${line.trim()}`);
            hasErrors = true;
        }
    });
}

scanDir(srcDir);

if (hasErrors) {
    console.error('\n[check-theme] 💥 Hardcoded colors (HEX/RGB) are forbidden in new/modified .jsx files to enforce theme consistency.');
    process.exit(1);
} else {
    console.log('[check-theme] ✅ Theme compliance check passed.');
    process.exit(0);
}
