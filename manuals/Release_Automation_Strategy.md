# Release Automation Strategy (Implemented in US-2.6.3)

To prevent the version number from being manually forgotten, incorrectly incremented, or shipping development artifacts alongside production code, we have established an automated bash pipeline.

Currently, we manage the version via `package.json`, which is dynamically read by the React frontend for the Admin Panel during runtime. All manuals are also strictly bound to this version number.

## The "One-Step Release" Pipeline

We have created a centralized bash script (`scripts/release.sh`) that automates the entire release cycle with fail-safes. 

### Pipeline Stages (`scripts/release.sh`):

1. **i18n Checks:** Validates complete translation coverage across all 24 languages (`npm run check-translations`).
2. **Theme Validation:** Scans the repository for hardcoded hex colors to prevent theme bleeding (`npm run check:theme`).
3. **Automated E2E Tests:** Executes the full Playwright test suite to guarantee core functionality is intact (`npx playwright test`). If any test fails, the release aborts immediately.
4. **Scrubbing Development Artifacts:** *CRITICAL SECURITY STEP.* Deletes local E2E test logs (`api/mail_log.txt`) and the test database (`api/cybertracker.db`) to ensure dummy data and generated passwords are never packaged and deployed to production.
5. **Interactive Version Bumping:** Prompts the developer for the new SemVer version and securely patches `package.json` across all OS platforms.
6. **Documentation Sync:** Automatically seeks and increments the version number headers across all Markdown files in the `manuals/` directory to match the software version.
7. **Manual PDF Generation:** Recompiles all Markdown documents into distributable PDF files via Puppeteer (`scripts/build_pdfs.cjs`).
8. **Git Checkpoint:** Automatically stages, commits (`chore(release): bump version...`), and tags the repository with `vX.X.X`.
9. **Remote Sync:** Optionally executes a `git push --follow-tags` to publish the release upstream natively.

### Benefits of this Structure
- **No Thinking Required:** You only need to call `./scripts/release.sh`.
- **Consistency:** The `package.json` is always the absolute "Source of Truth". The Admin Panel reads this value dynamically.
- **Error Prevention:** The tag, the commit, and all PDF manuals always match the exact version shipped in the app.
- **Security by Default:** A release only happens if all security tests (e.g. Privilege Escalation TS-12.10) pass, and all generated debug logs/databases are forcefully deleted off the disk before the commit.
