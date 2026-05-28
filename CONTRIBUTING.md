# Contributing to MusicMenia 🎵

Thanks for your interest in contributing to MusicMenia! This guide will help you get started.

---

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Issue Labels](#issue-labels)
- [Pull Request Process](#pull-request-process)
- [Commit Message Format](#commit-message-format)
- [Project Structure](#project-structure)

---

## Code of Conduct

Please be respectful and supportive to all contributors. We are building together!

---

## Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/MusicMeniaApp.git
cd MusicMeniaApp
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
```

### 4. Setup Environment Variables

Create a `.env` file inside `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_CLOUD_NAME=your_cloud_name
IMAGEKIT_API_KEY=your_api_key
IMAGEKIT_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_brevo_registered_email
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `client/`:
```
VITE_API_URL=http://localhost:5173
```

### 5. Run the App

Backend:
```bash
cd server
npm run dev
```

Visit `http://localhost:3000`

```

```
Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`

---

## How to Contribute

### Find an Issue
- Browse [open issues](https://github.com/nikhil-tiwari1419/MusicMeniaApp/issues)
- Look for the `good first issue` label if you're new
- Comment **"I'd like to work on this"** and wait for assignment
- Please discuss major changes before starting work
- Contributors must wait for issue assignment/maintainer approval before submitting a PR
- Pull requests created without an assigned issue may be closed
- Do not work on issues already assigned to someone else
- Keep PRs focused and limited to a single feature/fix
- Do **NOT** submit a PR for an unassigned issue

### Before Opening a Pull Request

Make sure:
- The issue is assigned to you
- Your branch is updated with the latest `main`
- The application runs locally without errors
- You have tested your changes properly
  
### Create a Branch
```bash
git checkout -b fix/issue-title
# or
git checkout -b feat/feature-name
```

### Make Changes & Test
- Test your changes locally before submitting
- Make sure both frontend and backend run without errors
- Keep changes focused — one issue per PR

---

## Issue Labels

| Label | Points | Description |
|-------|--------|-------------|
| `level-1` | 10 pts | Small fixes — UI, typos, README updates |
| `level-2` | 25 pts | Medium features — new routes, UI components |
| `level-3` | 40 pts | Complex features — new modules, integrations |
| `bug` | — | Something is broken |
| `enhancement` | — | New feature request |
| `good first issue` | — | Great for beginners |
| `documentation` | — | Docs improvement |

---

## Pull Request Process

1. Make sure your branch is up to date with `main`
2. Fill out the PR template completely
3. Link the issue number: `Closes #<issue-number>`
4. Wait for review — don't merge your own PR
5. Address review comments promptly

### PR Title Format
```
feat: add playlist feature to dashboard
fix: resolve audio compression bug on large files
docs: update brevo email setup instructions
refactor: clean up sendEmail utility
```

---

## Commit Message Format

```
type: short description

Types: feat | fix | docs | style | refactor | test | chore
```

Examples:
```
feat: add follow/unfollow artist feature
fix: multer file size limit for audio uploads
docs: add brevo API setup to README
refactor: replace nodemailer smtp with brevo http api
```

---

## Project Structure

```
MusicMeniaApp/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth & player context
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── controllers/         # Route controllers
│   ├── middleware/           # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── utils/
│   │   ├── sendEmail.js     # Brevo email utility
│   └── package.json
│
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

**Happy Contributing! 🚀🎵**
