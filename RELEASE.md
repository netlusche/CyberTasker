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
