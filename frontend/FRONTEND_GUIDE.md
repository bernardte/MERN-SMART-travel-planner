# FULLSTACK_PROJECT_GUIDE.md

# Smart Travel Planner - Developer Guide

Welcome to the project. This guide helps beginners understand how to run the project, folder structure, and responsibilities of both frontend and backend.

---

# 📌 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router

---

# 🚀 How to Run Project

---

# 1. Clone Project

```bash id="m1"
git clone <your-repository-url>
cd project-name
```

---

# 2. Install Frontend

```bash id="m2"
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text id="m3"
http://localhost:3000
```

---

# 📁 Project Structure

```text id="m8"
project/
│── frontend/
│── backend/
```

---

# 🌐 FRONTEND GUIDE (React + Vite)

---

# Frontend Structure

```text id="m9"
frontend/
│── src/
│   │── pages/
│   │── components/
│   │── hooks/
│   │── lib/
│   │── constants/
│   │── layouts/
│   │── assets/
│   │── App.tsx
│   └── main.tsx
│
│── public/
│── package.json
│── vite.config.ts
```

---

# 📄 pages/

Contains full pages/screens.

Examples:

```text id="m10"
HomePage.tsx
LoginPage.tsx
SignupPage.tsx
DashboardPage.tsx
TripPage.tsx
ExplorePage.tsx
AdminPage.tsx
ProfilePage.tsx
```

Use pages for route-level UI.

---

# 🧩 components/

Reusable UI pieces.

Examples:

```text id="m11"
Navbar.tsx
Footer.tsx
TripCard.tsx
WeatherCard.tsx
LoadingSpinner.tsx
ProtectedRoute.tsx
```

---

# 🎨 components/ui/

shadcn/ui components.

Examples:

```text id="m12"
button.tsx
input.tsx
card.tsx
dialog.tsx
table.tsx
badge.tsx
sheet.tsx
dropdown-menu.tsx
```

Do not edit heavily unless customizing theme.

---

# 🪝 hooks/

Custom React hooks.

Examples:

```text id="m13"
useAuth.ts
useTrips.ts
useWeather.ts
useDebounce.ts
useLocalStorage.ts
```

Use hooks for reusable state logic.

---

# 🧰 lib/

Utilities and libraries.

Examples:

```text id="m14"
axios.ts
utils.ts
api.ts
auth.ts
date.ts
```

Use for:

* Axios instance
* token helper
* helper functions

---

# 📌 constants/

Static values.

Examples:

```text id="m15"
routes.ts
roles.ts
api.ts
countries.ts
theme.ts
```

Example:

```ts id="m16"
export const ROLES = {
  ADMIN: "admin",
  USER: "user"
}
```

---

# 🧱 layouts/

Page wrappers.

Examples:

```text id="m17"
MainLayout.tsx
DashboardLayout.tsx
AdminLayout.tsx
AuthLayout.tsx
```

Use layouts for navbar/sidebar/shared page structure.

---

# 🖼️ assets/

Static files.

Examples:

```text id="m18"
logo.png
hero.jpg
icons/
videos/
fonts/
```

---

# Example Frontend Flow

```text id="m20"
Page
 ↓
Components
 ↓
Hook
 ↓
lib/api.ts
 ↓
Backend API
```

---

# 🔐 Authentication Frontend

Login flow:

```text id="m21"
LoginPage
 ↓
useAuth hook
 ↓
POST /api/auth/login
 ↓
save token / cookie
 ↓
redirect dashboard
```

---

# 📦 `.gitignore`

Create at root:

```gitignore id="m30"
node_modules/
dist/
build/
.env
*.log
.vscode/
coverage/
temp/
uploads/
frontend/node_modules/
backend/node_modules/
frontend/dist/
backend/dist/
```

---

# 🧼 Team Rules
* Keep components reusable
* Keep controller thin
* Use service for logic
* Use constants for magic strings
* Use hooks for reusable React logic
* Use layouts for shared UI
* Keep assets organized

---

# 🎯 Final Advice for Beginners

Frontend first learn:

1. pages
2. components
3. hooks
4. routes
5. api calls

---

# 🚀 Happy Coding

Build clean, secure, scalable Smart Travel Planner.
