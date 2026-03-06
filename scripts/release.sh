#!/usr/bin/env bash

# Fail fast mechanism
set -e

# Colors for console output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${YELLOW}Starting Release Process for CyberTasker...${RESET}\n"

# 1. i18n Check
echo -e "${GREEN}[1/6] Running i18n checks...${RESET}"
npm run check-translations

# 2. Theme Check
echo -e "${GREEN}[2/6] Running theme checks...${RESET}"
npm run check:theme

# 3. E2E Tests
echo -e "${GREEN}[3/6] Running Playwright E2E tests...${RESET}"
npx playwright test --workers=1

# 4. Clean Artifacts
echo -e "\n${GREEN}[4/7] Scrubbing Development Artifacts...${RESET}"
rm -f api/mail_log.txt api/cybertracker.db
echo "Deleted api/mail_log.txt and api/cybertracker.db"

# 5. Version Bumping
echo -e "\n${GREEN}[5/7] Version Bumping${RESET}"
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "Current version is: ${YELLOW}${CURRENT_VERSION}${RESET}"

read -p "Enter new version (e.g., 2.6.0) or 'C' to cancel: " NEW_VERSION

if [ -z "$NEW_VERSION" ] || [ "$NEW_VERSION" = "C" ] || [ "$NEW_VERSION" = "c" ]; then
    echo -e "${RED}Release aborted by user.${RESET}"
    exit 1
fi

echo -e "Updating package.json to version ${NEW_VERSION}..."
# Safely update package.json version across platforms using Node
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.version = '$NEW_VERSION';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# 6. Document Version Bumping
echo -e "\n${GREEN}[6/8] Document Version Bumping${RESET}"
echo -e "Updating manuals to version ${NEW_VERSION}..."
sed -i '' "s/# CyberTasker v[0-9]*\.[0-9]*.* - /# CyberTasker v${NEW_VERSION} - /g" manuals/*.md

echo -e "Prepending UPDATE_INSTRUCTIONS.md template..."
env CURRENT_VERSION="$CURRENT_VERSION" NEW_VERSION="$NEW_VERSION" node -e "
const fs = require('fs');
const filepath = './manuals/UPDATE_INSTRUCTIONS.md';
let content = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : '';
const template = \`# CyberTasker Server Update Instructions (v\${process.env.CURRENT_VERSION} → v\${process.env.NEW_VERSION})

These instructions guide you through the update to **v\${process.env.NEW_VERSION}** (Name of the Update).

## 1. Backup (MANDATORY)
- **Files**: Backup your \\\`api/config.php\\\` and your database file (if using SQLite). Be sure to also back up any existing files in the \\\`uploads/\\\` directory to prevent data loss.

## 2. Deploy Files
1.  Upload the contents of the \\\`dist\\\` folder to your server.
    > [!CAUTION]
    > **CRITICAL SECURITY WARNING FOR MACOS USERS**: macOS Finder hides files starting with a dot (like \\\`.htaccess\\\`) by default. If you simply drag the visible files to your FTP client, the \\\`.htaccess\\\` files **will be left behind**, exposing your database and uploads to the public web! 
    > Press \\\`Cmd\\\` + \\\`Shift\\\` + \\\`.\\\` in Finder to reveal hidden files, and ensure \\\`.htaccess\\\` in \\\`api/\\\` and \\\`api/uploads/\\\` are successfully transferred to your web server.
2.  **Overwrite all files** EXCEPT \\\`api/config.php\\\` and your database file.

## 3. Database Update
This update introduces new schemas...
1.  Navigate to your installer URL: \\\`https://yourdomain.com/tasks/api/install.php\\\`
2.  The script will automatically detect the missing tables/columns and append them to your active SQLite or MySQL database.
3.  **Verification**: Ensure the \\\"Database Schema Updated\\\" messages appear.
4.  **Security Note**: Delete \\\`api/install.php\\\` and \\\`install.html\\\` after verification.

## 4. Verify Update
1.  _Add verification steps here_

---\n\n\`;
fs.writeFileSync(filepath, template + content);
" || echo -e "${YELLOW}Warning: Failed to update UPDATE_INSTRUCTIONS.md${RESET}"

# 7. PDF Generation
echo -e "\n${GREEN}[7/8] Generating PDF Manuals${RESET}"
node scripts/build_pdfs.cjs

# 8. Git Commit & Tag
echo -e "\n${GREEN}[8/8] Git Commit & Tag${RESET}"

read -p "Did you update CHANGELOG.md, README.md, UPDATE_INSTRUCTIONS.md, USER STORIES.md, manuals/CyberTasker_Admin_Guide.md, manuals/MASTER_TEST_PLAN.md, manuals/Release_Automation_Strategy.md, and manuals/Technical_Reference.md? (y/N): " DOCS_CONFIRM
if [[ ! "$DOCS_CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Release paused. Please update the documentation files, then run the commit manually or restart the script.${RESET}"
    exit 1
fi

git add .
git commit -m "chore(release): bump version to v${NEW_VERSION} and update manuals"
git tag "v${NEW_VERSION}"
echo -e "Committed and tagged as v${NEW_VERSION}\n"

# 9. Push
echo -e "${GREEN}[9/9] Push to remote${RESET}"
read -p "Do you want to push the commit and tags to origin? (y/N): " PUSH_CONFIRM
if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "Pushing commits and tags..."
    git push --follow-tags
    echo -e "${GREEN}Release v${NEW_VERSION} successfully published!${RESET}"
else
    echo -e "${YELLOW}Push skipped. You can push manually using 'git push --follow-tags'.${RESET}"
    echo -e "${GREEN}Release v${NEW_VERSION} prepared locally.${RESET}"
fi
