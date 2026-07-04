# Functionalities

This document outlines the complete functional scope of the Human Resource Management System (HRMS) built for this hackathon. The system supports two user roles — **Employee** and **Admin/HR** — each with a distinct set of permissions and workflows, backed by a shared data layer and consistent UI/UX across both sides of the application.

---

## Employee Functionalities

### Authentication
- Sign up using Employee ID, email address, password, and role selection (Employee / HR).
- Password validation against defined security rules.
- Email verification required before account activation.
- Sign in using email and password, with clear error messaging on invalid credentials.
- Successful login redirects the user to their role-specific dashboard.

### Dashboard
- Landing overview with quick-access cards for Profile, Attendance, and Leave Requests.
- At-a-glance summary of recent activity and relevant alerts.
- Single-click navigation to all core employee modules.

### Profile Management
- View personal details, job details, salary structure, uploaded documents, and profile picture.
- Edit a limited set of self-service fields — phone number, address, and profile picture.
- All other profile fields (department, designation, salary, etc.) remain admin-managed for data integrity.

### Attendance Management
- View personal attendance history in both daily and weekly formats.
- Check-in / check-out actions to log attendance for the current day.
- Attendance status is one of: **Present**, **Absent**, **Half-day**, or **Leave**.
- Attendance restricted to the logged-in employee's own records.

### Leave Management
- Apply for leave by selecting a leave type (Paid, Sick, or Unpaid), a date range via an interactive calendar, and optional remarks.
- Monthly calendar view with visual Present/Absent/Leave markers for quick reference.
- Track the real-time status of submitted requests: **Pending**, **Approved**, or **Rejected**.
- Immediate visibility into HR comments once a request is actioned.

### Payroll Management
- Read-only access to personal payroll details, including base salary, bonuses, deductions, and net salary.
- No edit permissions — payroll changes are exclusively managed by Admin/HR.

---

## Admin/HR Functionalities

### Dashboard
- Organization-wide summary with quick-stat cards: total employees, employees on leave today, pending approvals, and overall attendance percentage.
- "My Week" widget summarizing the HR officer's own attendance for the current week.
- Recent activity log capturing key organizational events (leave submissions, approvals, payroll updates, etc.).
- Quick-action shortcuts to jump directly into Leave Approvals, Employee Management, Attendance, or Payroll.
- Ability to switch context between employees for detailed review.

### Employee Management
- View all employees in a structured table/grid layout.
- Search employees by name or Employee ID, with an additional filter by department.
- Drill into individual employee profiles for a complete, detailed view.
- Edit complete employee records — including personal details, department, designation, contact information, salary structure, and documents.

### Attendance Management
- View attendance records for all employees, not just the logged-in user.
- Toggle between Daily View and Weekly View for organization-wide tracking.
- Filter by department and by attendance status (Present, Absent, Half-day, Leave).
- Serves as the single source of truth for attendance-based decisions (payroll, leave reconciliation, performance reviews).

### Leave Approval System
- Centralized view of all leave requests across the organization, filterable by status.
- Approve or reject requests with a mandatory or optional HR comment field.
- Status changes reflect immediately in both the Admin view and the requesting employee's record — no page reload or delay.

### Payroll Management
- View payroll details for every employee in a single consolidated table.
- Edit salary structure per employee — base salary, bonus, and deductions.
- Net salary is automatically recalculated as: `Net = Base + Bonus − Deductions`.
- Ensures payroll accuracy and a clear audit trail of adjustments.

### Profile Administration
- Full administrative control over every employee's profile fields, unlike the employee's limited self-service scope.
- Manage profile pictures, identification details, department/designation assignments, and document records.
- Add new employee records and maintain the organizational roster as the company scales.

---

## Shared Features

- **Responsive UI** — Consistent, mobile-friendly layout across both Employee and Admin/HR views, built on a unified retro pixel-art dark theme.
- **Role-Based Access Control (RBAC)** — Strict separation of permissions ensures employees only access their own data while Admin/HR retains organization-wide visibility and control.
- **Centralized Database** — A single source of truth for employee, attendance, leave, and payroll data shared across both roles (mock data for the hackathon build; API-ready structure for future integration).
- **Real-Time Updates** — State changes (leave approvals, attendance edits, payroll adjustments) reflect instantly across the relevant views without requiring a refresh.
- **Secure Authentication** — Email/password-based sign-up and sign-in with validation, verification, and role assignment at the point of registration.

---

*This document reflects the intended functional scope for the hackathon submission and serves as a reference for both the Employee and Admin/HR development tracks to ensure feature parity and design consistency.*
