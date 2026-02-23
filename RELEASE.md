# CyberTasker v2.4 (The Automation & Precision Update)
*Release Date: 2026-02-23*

*   **Tactical Keyboard Controls**: Navigate the grid at lightspeed with global hotkeys: press `N` to create a directive, `/` to focus the search matrix, and `Esc` to instantly close any active overlay.
*   **Sub-Routine Automation**: Completely re-engineered the Dossier sub-routines with drag-and-drop sorting capabilities, allowing operatives to rearrange complex protocol execution orders on the fly.
*   **Dashboard QoL Integration**: Implemented rapid-access Category selection directly on the operative dashboard cards, alongside new global Quick-Filter Pills (Overdue, Today, High Priority) for instantaneous tactical sorting without accessing the deep search menu.
*   **Directive Duplication**: Added the ability to clone entire mission dossiers, instantly copying priorities, categories, recurrent schedules, and sub-routines to drastically cut down on repetitive protocol creation.
*   **Diagnostics & Translations**: Hardened the global translation engine with a dedicated Python validation script integrated into the Github Actions CI pipeline, and perfected the Klingon localized calendar UI for total cross-language integrity.

---

# CyberTasker v2.3 (Workflow & Stability Update)
*Release Date: 2026-02-23*

*   **Scheduled Protocols**: Added full support for recurring directives (Daily, Weekly, Monthly) with optional end dates. The Global Calendar creates "Holo-Projections" for future tasks.
*   **Directive Sub-Routines**: Directly inside the Dossier, operatives can split large directives into trackable sub-routines (checklists) featuring inline text-editing and individual persistence.
*   **Tactical Progress Tracking**: Directive cards continuously track sub-routine completion ratios on the dashboard (e.g., 3/5).
*   **Cross-Database Integrity**: Implemented a robust GitHub Actions E2E test-pipeline that evaluates the environment securely and asynchronously against both lightweight SQLite targets and MariaDB clusters to block dialect-anomalies.

---

# CyberTasker v2.2 (The Dashboard & Dossier Upgrade)
*Release Date: 2026-02-22*

*   **Global Chrono-Sync Calendar**: A dedicated top-level Calendar UI mapped to the header navigation, allowing operatives to visualize deadlines and interface directly with dossiers.
*   **Dossier Field Editing**: Integrated native dropdowns for changing Priority and Category directly within the Directive Dossier overlay with correctly stacked `CyberConfirm` z-index layers.
*   **Internationalization Scale-up**: Deployed robust language packs for Japanese, Korean, Hindi, Turkish, and Vietnamese.
*   **Security & UX Polish**: Implemented double-entry confirmation for password changes, inline Dossier title editing, and optimized Dashboard pagination rendering limits.

---

# CyberTasker v2.1 (Deep Directives & Global Localization)
*Release Date: 2026-02-22*

*   **Deep Directives**: Markdown-powered extended mission intel with external Up-Links and an encrypted asset vault for file attachments.
*   **Targeted Hotfixes**: Backend session routing stabilization for restrictive Linux hosting (Strato) and critical PHP schema update sequencing fixes.
*   **Static Localization**: The authentication pages now hydrate natively without booting React, resulting in microsecond load times.
*   **Aesthetic Refinements**: Introduced Klingon, Westeros, Marvel, and Gotham matrices. Global custom scrollbar support injected for Firefox parity and Matrix alpha-compositing brightened.

---

# CyberTasker v2.0 (The Architecture Update)
*Release Date: 2026-02-21*

*   **MVC Backend Revolution**: Transitioned to a centralized Front Controller, Domain Controllers, and Repository patterns for database interactions without external frameworks.
*   **Shared Hosting Compatibility**: Integrated whitespace resistance buffering, session stability fallback routing, and dynamic CORS/HTTPS proxy headers to unblock deployments on rigid shared hosting endpoints.
*   **Visual Precision**: Rolled out the Matrix and Weyland-Yutani themes. Standardized LCARS "pill-shape" geometry and implemented dynamic webkit scrollbars.
*   **Industrial Automation**: Playwright E2E suite deployed, verifying critical mission stories and security policies automatically.

---

# CyberTasker v1.9 (Security Hardening & Multi-Theme)
*Release Date: 2026-02-20*

*   **OWASP Security Baseline**: Zero-config auto-locks prevent unauthorized installer access. Implemented enterprise CSRF middleware, strict CORS, and session fixation regenerations. Database errors are now sterilized before hitting the client.
*   **Anti-Brute Force Protocols**: Database-backed rate limiting automatically locks terminals over-attempting 2FA or Passwords. CDN dependencies secured via Subresource Integrity (SRI) hashes.
*   **Theme Engine**: Introduced the robust Multi-Theme architecture supporting persistent visual identities (Cyberpunk vs. LCARS), strictly isolating CSS semantic variables to prevent "theme bleeding".

---

# CyberTasker v1.8 (Uplink Stability & Validation Polish)
*Release Date: 2026-02-18*

*   **Database Agnosticism**: Standardized session math across SQLite, MySQL, and MariaDB environments using PHP date logic instead of native SQL functions to guarantee 100% interoperability.
*   **Enterprise Scaling**: Successfully stress-tested the application under 250+ simultaneous directives and 40+ recruited operatives with zero pagination degradation.
*   **Multilingual Link**: Fully localized UI payloads deployed for DE, EN, NL, ES, FR, and IT.
*   **Validation UX**: Streamlined recovery flows, global "Clear-on-Focus" tooltips, and uniform high-immersion CyberAlert modals.

---

# CyberTasker v1.5 (Residue-Free Security)
*Release Date: 2026-02-17*

*   **Deep Purge Protocols**: Account deletion accurately cascades to nullify all 2FA artifacts, bespoke categories, and orphaned task assignments.
*   **Administration Contrast**: Re-tuned the backend fleet management console for higher data density and structural boundary visibility.
*   **SQLite Default**: Re-configured the deployment architecture to use SQLite out-of-the-box for instant zero-configuration boot sequences.

---

# CyberTasker v1.4 (Deep Security & Overrides)
*Release Date: 2026-02-15*

*   **Administrative Overrides**: Admins granted access to mechanically disable operative 2FA via the Management Console if authenticators are lost.
*   **CyberConfirm System**: Replaced all native browser warnings with immersive neon-colored modals for high-risk operations (Data Wipes).
*   **Calendar Stabilization**: Portal-based calendar rendering prevents mobile container clipping and orphaned boundary issues.

---

# CyberTasker v1.3 (The Neon Update)
*Release Date: 2026-02-15*

*   **Personal Protocols**: Custom operative task categories.
*   **Smart Scheduling**: Immersive neon date picker with Imminent/Future/Overdue visual indicators.
*   **Deep Search & Filters**: Live title indexing and advanced semantic filtering.

---

# CyberTasker v1.2 (Fleet Management 2.0)
*   **Admin Console Overhaul**: Advanced sorting, real-time code-name filtering, and smart pagination for bulk user management.
