# JagaIT (IT Support Tracker) — Development Logbook

**Project Title:** JagaIT — IT Support & Asset Management Tracker  
**Technology Stack:** Laravel (PHP 8.4), Inertia.js v2, React 18, Tailwind CSS, SQLite/MySQL, Vite  
**Log Date:** 3 November 2026  

---

## 1. Executive Summary (Ringkasan Eksekutif)

- **English:** Designed, architected, and implemented the full-stack **JagaIT (IT Support Tracker)** web application from UI prototypes into a functional Laravel + Inertia React system. Completed database modeling, role-based authentication (Member Login, Administrator Login, and Staff Registration), 8 core operational screens, automated PHPUnit feature tests, and a global **Dwibahasa (`BM` / `EG`)** bilingual translation engine.
- **Bahasa Melayu:** Mereka bentuk dan membangunkan aplikasi web **JagaIT (Sistem Jejak Sokongan IT)** secara menyeluruh menggunakan Laravel + Inertia React. Melengkapkan pangkalan data, pengesahan berasaskan peranan (Log Masuk Ahli, Log Masuk Pentadbir, dan Pendaftaran Staf), 8 skrin operasi utama, ujian automatik PHPUnit, serta fungsi **Dwibahasa (`BM` / `EG`)** di seluruh aplikasi.

---

## 2. Completed Development Tasks (Today's Log)

### A. Environment, Design System & Tooling Setup
1. **Tailwind CSS & Material 3 Token Configuration** (`tailwind.config.js`, `resources/views/app.blade.php`):
   - Configured the custom cobalt-blue color palette (`primary`, `primary-container`, `surface-container-*`, `on-surface`, `error-container`), typography (`Inter` and `JetBrains Mono`), and `Material Symbols Outlined` icons.
2. **IDE Terminal Path Automation** (`.vscode/settings.json`):
   - Configured VS Code integrated terminals to automatically resolve Laragon's `php-8.4`, `composer`, and `node-v22` binaries.

### B. Database Schema, Models & Seeders
Created migrations, Eloquent models with relationships, factories, and realistic IT department seed data in `database/seeders/DatabaseSeeder.php`:
1. **`User`** — Added `role` (`Staff`, `Admin`/`Administrator`) and `department` fields.
2. **`Asset`** — Tracks hardware inventory (`asset_tag`, `uid_code`, `model`, `serial_number`, `ip_address`, `mac_address`, `toner_level`, `warranty_expires_at`, `incident_count_30d`).
3. **`SupportTask`** — Tracks helpdesk tickets (`task_code`, `requester_name`, `department`, `category`, `status`, `time_spent_minutes`, `hq_ticket_ref`, `hq_dispatch_code`, `attachments`, `audit_trail`).
4. **`MaintenanceSchedule`** — Tracks recurring preventive maintenance intervals (`repeat_interval_days`, `last_done_date`, `next_due_date`, `status`).
5. **`KnowledgeBaseArticle`** — Stores technical troubleshooting SOPs (`doc_id`, `category`, `steps`, `helpful_count`, `source_task_id`).

### C. Authentication & Role-Based Portals
1. **Member / Staff Login Page** (`resources/js/Pages/Auth/Login.jsx`):
   - Redesigned into a split two-column card with a laptop + geometric shapes illustration on the left and pill-shaped (`rounded-full`) inputs/buttons on the right.
2. **Dedicated Administrator Login Page** (`resources/js/Pages/Auth/AdminLogin.jsx` & `AuthenticatedSessionController`):
   - Accessible when clicking **Administrator Login** on the main login page (`/admin/login`).
   - Features an elevated cobalt-navy theme, `CLEARANCE: LEVEL-4 ADMIN` badge, and backend role verification restricting access to `Admin` / `Administrator` accounts only.
3. **Staff Registration Page** (`resources/js/Pages/Auth/Register.jsx` & `RegisteredUserController`):
   - Matching split-card layout with inputs for Full Name, Official Email, Department selector, Role selector (`Staff` / `Admin`), Password, and Confirm Password.

### D. Core Operational Modules (Backend Controllers & Frontend Pages)
- **Dashboard (`DashboardController` / `Dashboard.jsx`)**: Live KPI cards, Tasks by Category bar chart, Technician Workload table, Waiting on HQ queue, Repeat Failure Assets alert table, CSV export.
- **Support Tasks (`SupportTaskController` / `Tasks/Index.jsx`, `Tasks/Show.jsx`)**: Multi-criteria filtering (status, category, department, search), New Task modal, HQ Escalation workflow, Local Resolution, Admin Verification, Audit Trail.
- **Assets Inventory (`AssetController` / `Assets/Index.jsx`, `Assets/Show.jsx`)**: Hardware directory, telemetry bars (toner level, page count, network IP/MAC), warranty status, and full repair history timeline per asset.
- **Maintenance (`MaintenanceScheduleController` / `Maintenance/Index.jsx`)**: Overdue/Upcoming/Scheduled status filtering, interactive calendar view, New Schedule modal, one-click **Mark Done** with automatic next-due-date recalculation.
- **Knowledge Base (`KnowledgeBaseArticleController` / `KnowledgeBase/Index.jsx`)**: Split-pane SOP reader, category tabs, search filter, step-by-step instructions, New SOP modal, and interactive "Helpful" counter.
- **Reports (`ReportController` / `Reports/Index.jsx`)**: SLA compliance metrics, resolution rates, department incident distribution, and print-ready summary view.

### E. Dwibahasa (Bilingual: Bahasa Melayu & English) Feature
- Created `resources/js/Contexts/LanguageContext.jsx` with the **`BM` | `EG`** toggle button (`LanguageSwitcher`), persistent `localStorage` state, and translation helpers (`tr()`, `translateStatus()`, `translateCategory()`, `translateDepartment()`).
- Integrated across `AuthenticatedLayout.jsx`, all Auth pages, and all 8 operational modules.

### F. Automated Testing & Code Formatting
- Created PHPUnit feature tests in `tests/Feature/ItSupportTrackerTest.php` and `tests/Feature/Auth/RegistrationTest.php` (all passing).
- Formatted all PHP files using `vendor/bin/pint`.

---

## 3. Upcoming Development Roadmap (Next Tasks)

### Phase 1: Role-Based Access Control (RBAC) & Middleware Hardening
- [ ] Enforce dedicated backend middleware (`EnsureUserIsAdmin`) on administrative actions such as **Verify & Close Task**, **Delete Asset**, and **Approve Knowledge Base SOP**.
- [ ] Add an **Admin Staff Management** page (`/admin/users`) to allow Administrators to reset staff passwords, change user departments, and promote/demote roles.

### Phase 2: Real File Uploads & PDF/Excel Reporting
- [ ] Replace static attachment metadata in Support Tasks with real image/document uploads using Laravel `Storage` (`public` disk) so technicians can upload live photos of hardware faults.
- [ ] Add downloadable **PDF Monthly SLA Report** and **Excel Asset Inventory Export** in the Reports and Assets modules.

### Phase 3: Notifications & SLA Alert Automation
- [ ] Implement real-time in-app notification dropdown in `AuthenticatedLayout.jsx` (using the bell icon) for newly assigned tasks, HQ escalation responses, and overdue maintenance alerts.
- [ ] Create a scheduled Laravel Artisan command (`schedule:work`) to automatically mark maintenance items as `Overdue` when `next_due_date` passes and send email reminders to assigned technicians.

### Phase 4: QR Code Asset Tagging & Audit Logs
- [ ] Generate printable QR Code labels on the Asset Detail page (`Assets/Show.jsx`) so technicians can scan a printer or switch tag to jump directly to its repair history and log a ticket.
- [ ] Add a system-wide **Security & Activity Audit Log** page for Administrators to review logins, escalations, and configuration changes.

