# CyberTasker v1.3.0 - Release Notes

## 📂 Category Customization
- **Personalized Protocols**: Operatives can now add, rename, and delete custom categories via their Profile.
- **Default Priorities**: Tag any category as "DEFAULT" to have it automatically selected and prioritized in the "New Directive" terminal.
- **Initial Load-out**: Every new operative starts with a standardized set of 5 protocols: *Private*, *Work*, *Finance*, *Health*, and *Hobby*.
- **Direct Selection**: "Private" is the initial default for all new accounts.
- **Real-time Sync**: Changes to categories reflect instantly across the dashboard without system reloads.

## ✨ UI Polish & Visibility
- **Contrast Improvements**: Lightened the "SYSTEM HELP" and authentication links for better visibility in dark environments.
- **Handy Badges**: Added visible "DEFAULT" indicators in the Profile category list.
- **Handbook Update**: The Operative Handbook now contains a new section on Category Protocols.

---

# CyberTasker v1.2.1 - Release Notes

## 🕵️‍♂️ Admin Panel Fixes
- **Password Visibility**: Added an eye icon (Neon Cyan) to the "Reset Password" modal, allowing admins to verify the new password before submission. This matches the style of the global authentication forms.

---

# CyberTasker v1.2.0 - Release Notes

## 🕵️‍♂️ Admin Panel 2.0
- **Advanced Search**: Real-time, filtering-as-you-type search for users by Codename.
- **Dynamic Sorting**: Sort users by ID, Codename, Status, or History. Admins always stay at the top.
- **Smart Pagination**: Navigation controls (First, Prev, Next, Last) handle large user bases efficiently.
- **User History**: New "History" column tracks the `last_login` timestamp for every operative.

## ⚙️ Backend Enhancements
- **Enhanced Seeding**: Improved database seeding scripts for robust test data generation across MySQL and SQLite.
- **Security**: Hardened "Admin Priority" logic ensures administrators are never buried in pagination results.

## 🐛 Bug Fixes
- Fixed consistent sorting order across different database types.
- Corrected pagination limit/offset calculations.

---
*For update instructions, see [UPDATE_INSTRUCTIONS.md](./UPDATE_INSTRUCTIONS.md).*
