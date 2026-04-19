# GIT_WORKFLOW_GUIDE.md

# GitHub Branch Naming & Commit Message Guide

*For Beginners (Smart Travel Planner Project)*

This guide helps team members use GitHub professionally and avoid conflicts.

---

# 📌 Why Use Branches?

Branches allow each developer to work on features separately without breaking the main project.

Benefits:

* Safe development
* Easier teamwork
* Cleaner history
* Easier debugging
* Better collaboration

---

# 🌳 Recommended Branch Structure

```text id="g1"
main
develop
feature/*
bugfix/*
hotfix/*
docs/*
refactor/*
```

---

# 🏆 Main Branches

## `main`

Production-ready stable branch.

Rules:

* Never code directly here
* Only merge tested code
* Always keep stable

---

## `develop`

Main working branch for team development.

Use for:

* combine completed features
* testing integration
* preparing release

---

# 🚀 Feature Branch Naming

Use when building new functionality.

Format:

```text id="g2"
feature/<name>
```

Examples:

```text id="g3"
feature/login-page
feature/signup-api
feature/trip-crud
feature/weather-widget
feature/admin-dashboard
feature/explore-page
feature/rbac-auth
feature/search-destination
```

---

# 🐛 Bug Fix Branch Naming

Use when fixing bugs.

Format:

```text id="g4"
bugfix/<name>
```

Examples:

```text id="g5"
bugfix/login-error
bugfix/navbar-mobile
bugfix/token-expired-loop
bugfix/api-timeout
```

---

# 🔥 Hotfix Branch Naming

Use for urgent production issues.

Format:

```text id="g6"
hotfix/<name>
```

Examples:

```text id="g7"
hotfix/security-cookie
hotfix/server-crash
hotfix/payment-error
```

---

# 🧼 Refactor Branch Naming

Use for code cleanup without adding features.

Format:

```text id="g8"
refactor/<name>
```

Examples:

```text id="g9"
refactor/auth-service
refactor/frontend-layout
refactor/trip-controller
```

---

# 📄 Docs Branch Naming

Use for documentation only.

Format:

```text id="g10"
docs/<name>
```

Examples:

```text id="g11"
docs/readme-update
docs/backend-guide
docs/api-documentation
```

---

# 🎯 Best Practice for This Project

Since this is group assignment:

Each member picks one feature branch.

Example:

```text id="g12"
Member A -> feature/frontend-login
Member B -> feature/backend-auth-api
Member C -> feature/trip-dashboard
Member D -> feature/admin-analytics
```

Then merge into `develop`.

---

# 🧠 Branch Naming Rules

## Use:

* lowercase letters
* hyphen `-`
* short meaningful names

Good:

```text id="g13"
feature/user-profile
feature/trip-planner
```

Bad:

```text id="g14"
feature/NewPage123
mybranch
test
aaaa
```

---

# 💬 Commit Message Best Practice

Use clear commit messages.

Format:

```text id="g15"
type: short description
```

---

# 🏆 Common Commit Types

```text id="g16"
feat:
fix:
docs:
refactor:
style:
test:
chore:
```

---

# ✨ Feature Commits

```text id="g17"
feat: add login page UI
feat: create trip CRUD API
feat: add weather forecast card
feat: implement admin dashboard
feat: add protected routes
```

---

# 🐛 Fix Commits

```text id="g18"
fix: resolve token refresh issue
fix: correct navbar alignment
fix: prevent duplicate trip creation
fix: handle null user profile
```

---

# 📄 Docs Commits

```text id="g19"
docs: update README
docs: add backend guide
docs: write API setup steps
```

---

# 🧼 Refactor Commits

```text id="g20"
refactor: simplify auth middleware
refactor: clean trip service logic
refactor: split dashboard components
```

---

# ⚙️ Chore Commits

```text id="g21"
chore: update dependencies
chore: add eslint config
chore: setup prettier
```

---

# ❌ Bad Commit Messages

Avoid:

```text id="g22"
update
fix bug
done
aaa
test
123
final
```

These give no meaning.

---

# ✅ Good Commit Messages

```text id="g23"
feat: add user registration endpoint
fix: solve login cookie issue
docs: add frontend setup guide
refactor: improve route structure
```

---

# 🚀 Beginner Daily Workflow

## 1. Pull latest changes

```bash id="g24"
git pull origin develop
```

---

## 2. Create branch

```bash id="g25"
git checkout -b feature/login-page
```

---

## 3. Work and commit

```bash id="g26"
git add .
git commit -m "feat: create login page"
```

---

## 4. Push branch

```bash id="g27"
git push origin feature/login-page
```

---

## 5. Open Pull Request

Merge into:

```text id="g28"
develop
```

---

# 🛡️ Team Rules

## Never commit directly to `main`

## Always pull before coding

```bash id="g29"
git pull origin develop
```

## Keep commits small and meaningful

## Review teammate PR before merge

---

# 📌 Example For Smart Travel Planner

Frontend:

```text id="g30"
feature/home-page
feature/profile-page
feature/shadcn-ui-layout
feature/search-trip
```

Backend:

```text id="g31"
feature/auth-api
feature/trip-api
feature/weather-api
feature/admin-rbac
feature/logging-system
```

Docs:

```text id="g32"
docs/report-content
docs/readme-update
```

---

# 🎯 Final Advice for Beginners

If unsure:

Use:

```text id="g33"
feature/<what-you-build>
feat: add <what-you-built>
```

Example:

```text id="g34"
feature/user-profile
feat: add user profile page
```

Simple and professional.

---

# 🚀 Happy Team Coding

Clean Git history = easier teamwork + better project quality.
