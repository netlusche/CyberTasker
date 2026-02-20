# CyberTasker: Master Automated Test Plan v2.0.0

This plan outlines the end-to-end testing strategy for CyberTasker v2.0.0. The goal is to verify all functional requirements, multi-theming architecture, and OWASP-aligned security hardening using automated browser sessions and backend audits.

---

## 🧪 test-suite-01: Identity & Security Hardening

### TS-01.1: Registration & Initial Setup
- **Scenario**: Create a new operative account and verify database entry.
- **Validation**: User exists in DB; unique constraints (email/username) are enforced.

### TS-01.2: 2FA Activation (TOTP/Email)
- **Scenario**: Enable 2FA and verify secondary challenge on next login.
- **Validation**: Session is refused without the correct secondary token.

### TS-01.3: CSRF Shield Verification [NEW]
- **Scenario**: Attempt a `POST` or `DELETE` request without the `X-CSRF-Token` header.
- **Validation**: Server returns `403 Forbidden` and terminates the request.

### TS-01.4: Brute-Force Mitigation (Rate Limiting) [NEW]
- **Scenario**: Perform 5+ failed login attempts from the same IP.
- **Validation**: Server returns `429 Too Many Requests` and enforces a cooldown window.

### TS-01.5: Session Regeneration [NEW]
- **Scenario**: Monitor `PHPSESSID` before and after successful login.
- **Validation**: Session ID is regenerated to prevent session fixation attacks.

### TS-01.6: Email Transmission Verification [NEW]
- **Scenario**: Register an account, update email, and request Email 2FA.
- **Validation**: SMTP/Mail relay successfully dispatches the payload, and tokens contained are valid and time-restricted.

### TS-01.7: Real-world 2FA Validation [NEW]
- **Scenario**: Setup TOTP using a standard authenticator seed, and setup Email 2FA receiving a real code.
- **Validation**: The system accurately validates authentic 6-digit codes and rejects invalid/expired ones.

---

## 📋 test-suite-02: Directive Management (CRUD)

### TS-02.1: Initialize & Edit Directive
- **Scenario**: Create a task, modify priority/category via badges, and edit title inline.
- **Validation**: DB reflects changes; UI triggers "Confetti" on completion.

### TS-02.2: Cyber-Triage Sorting
- **Scenario**: Verify that "Overdue" tasks always appear at the top of the stream.
- **Validation**: Sorting logic respects the Triage Protocol (Status > Urgency > Priority).

### TS-02.3: Stream Pagination [NEW]
- **Scenario**: Populate the operative's timeline with 50+ directives.
- **Validation**: The stream is paginated, fetching records in tactical chunks without compromising UI responsiveness.

---

## 🎨 test-suite-03: Visual Architecture & Multi-Theming

### TS-03.1: Theme Switching & Isolation
- **Scenario**: Switch between "Cyberpunk", "LCARS", "Matrix", and "Weyland-Yutani" in the profile.
- **Validation**: CSS variables and fonts update immediately (e.g., Antonio vs Courier vs VT323 vs Share Tech Mono). Contrast ratios remain compliant across all themes.

### TS-03.2: Theme Persistence
- **Scenario**: Set theme (e.g., "Matrix"), logout, and verify login screen aesthetics.
- **Validation**: Theme choice persists across sessions and is applied securely by pulling from the database API upon page load.

---

## 🕵️‍♂️ test-suite-04: Fleet Administration

### TS-04.1: Neural Override (Admin Controls)
- **Scenario**: Admin resets a user's password or disables 2FA.
- **Validation**: Changes are applied instantly; user can recover access.

### TS-04.2: Roster Pagination [NEW]
- **Scenario**: Retrieve the `admin/users` grid populated with 100+ operatives.
- **Validation**: The grid accurately displays page controls, total records, and navigates seamlessly using the DataGrid component without freezing the dashboard.

---

## 🚀 test-suite-05: Installation & Zero-Config Portability

### TS-05.1: Security Auto-Lock [NEW]
- **Scenario**: Access `api/install.php` when the system is already initialized.
- **Validation**: Access is denied unless a valid Admin session is active.

### TS-05.2: Subdirectory Compatibility [NEW]
- **Scenario**: Install system in a subdirectory and verify verification links.
- **Validation**: `FRONTEND_URL` dynamically detects the path and includes it in links.

### TS-05.3: Diagnostic Integrity [NEW]
- **Scenario**: Run `install.php` and verify diagnostic output.
- **Validation**: Checks for PHP version, PDO drivers, and database writeability (特に macOS `tmp` redirection).

---

## 📊 Structured Test Reporting

Every execution run generates a `test_report.md` tracking pass/fail rates, backend logs, and browser recordings as proof of work.

---

## 🏗 Test Data Preparation [NEW]

To execute the automated suites above effectively, the following isolated test data will be seeded programmatically via a standalone script (`tests/seed_test_data.php`):
- **User Personas**: Generate 1 Admin (`Admin_Alpha`), 5 Operatives with active 2FA (`Op_Beta`), and 100 baseline users for Admin pagination testing.
- **Directive Matrix**: Populate `Op_Beta` with 55 directives to trigger and test frontend pagination components.
- **Mail Capture Strategy**: Configure a mock SMTP endpoint (e.g., MailHog) or logging service to reliably capture and verify outbound token transmissions instantly.
- **Authenticator Seeds**: Pre-define valid TOTP secrets to programmatically assert validation code limits without manual authenticator input.
