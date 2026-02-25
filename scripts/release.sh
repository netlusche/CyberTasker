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

# 4. Version Bumping
echo -e "\n${GREEN}[4/6] Version Bumping${RESET}"
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

# 5. Git Commit & Tag
echo -e "\n${GREEN}[5/6] Git Commit & Tag${RESET}"
git add .
git commit -m "chore(release): bump version to v${NEW_VERSION}"
git tag "v${NEW_VERSION}"
echo -e "Committed and tagged as v${NEW_VERSION}\n"

# 6. Push
echo -e "${GREEN}[6/6] Push to remote${RESET}"
read -p "Do you want to push the commit and tags to origin? (y/N): " PUSH_CONFIRM
if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "Pushing commits and tags..."
    git push --follow-tags
    echo -e "${GREEN}Release v${NEW_VERSION} successfully published!${RESET}"
else
    echo -e "${YELLOW}Push skipped. You can push manually using 'git push --follow-tags'.${RESET}"
    echo -e "${GREEN}Release v${NEW_VERSION} prepared locally.${RESET}"
fi
