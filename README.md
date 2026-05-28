# 🎵 MusicMenia

A full-stack music streaming web application where artists can upload music and users can discover, stream, and enjoy tracks from their favorite artists.

---

## 🚀 Live Demo

- **Frontend:** [MusicMenia App](https://music-menia-app.vercel.app) [repo](https://github.com/nikhil-tiwari1419/MusicMenia)
- **Backend API:** [repo](https://github.com/nikhil-tiwari1419/MusicMenia)

---

## ✨ Features

### 👤 Users
- Register & Login with OTP email verification
- Stream music from followed artists
- Browse local feed for new music
- Receive email notifications on new music drops

### 🎤 Artists
- Artist account registration & verification
- Upload music (MP3) with thumbnail
- Audio compression on upload (large files auto-compressed)
- Manage uploaded tracks

### 🔐 Authentication & Security
- JWT-based authentication
- OTP email verification
- Rate limiting with `express-rate-limit`
- Role-based access (User / Artist)

### 📧 Email Notifications
- Welcome email on registration
- OTP email for verification & password reset
- Login & logout notification emails
- New music drop notification to followers
- Password reset confirmation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| Vite | Build Tool |
| Axios | HTTP Client |
| React Router | Navigation |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Multer | File Upload Handling |
| Imagekit | Audio & Image Storage |
| Brevo API | Transactional Emails |
| FFmpeg | Audio Compression |
| Helmet| to secure web applications by setting various HTTP security headers |
| express-rate-limit | Rate Limiting |

---

## 📁 Project Structure

```
MusicMeniaApp/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (auth, player)
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── controllers/         # Route controllers
│   ├── middleware/           # Auth & other middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── utils/
│   │   ├── sendEmail.js     # Brevo email utility
│   │   └── compressAudio.js # FFmpeg audio compression
│   └── package.json
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Imagekit
IMAGEKIT_PRIVATE_KEY=your_api_secret

# Brevo Email API
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_brevo_registered_email

# Client
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (`client/.env`)
```env
VITE_API_URL=https://musicmenia.onrender.com
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Brevo account (free tier — 300 emails/day)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/nikhil-tiwari1419/MusicMeniaApp.git
cd MusicMeniaApp
```

**2. Install Backend Dependencies**
```bash
cd server
npm install
```

**3. Install Frontend Dependencies**
```bash
cd client
npm install
```

**4. Setup Environment Variables**

Create `.env` files in both `server/` and `client/` folders using the variables above.

**5. Run the App**

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

---

## 📧 Email Setup (Brevo)

This project uses [Brevo](https://brevo.com) HTTP API for transactional emails (works on Render free tier).

1. Sign up at **brevo.com** (free — 300 emails/day)
2. Go to **SMTP & API → API Keys** → Generate key
3. Add `BREVO_API_KEY` to your environment variables
4. Add `BREVO_SENDER_EMAIL` (your Brevo registered email)

> ⚠️ Do NOT use SMTP on Render free tier — ports 587/465 are blocked. Use Brevo HTTP API instead.

---

## 🎵 Audio Upload & Compression

- Users can upload MP3 files up to **50MB**
- Server automatically compresses audio using **FFmpeg** before storing
- Compressed files are stored on **Cloudinary**
- File size is saved in the database in **KB format**

```
20MB MP3 uploaded → compressed to ~2-3MB → stored on Cloudinary
```

---

## 🚀 Deployment

### Backend — Render
1. Connect GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add all environment variables
5. Add `app.set('trust proxy', 1)` for rate limiting to work correctly

### Frontend — Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `client/`
3. Add `VITE_API_URL` environment variable

---

## 👨‍💻 Author

**Nikhil Tiwari**
- GitHub: [@nikhil-tiwari1419](https://github.com/nikhil-tiwari1419)

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details..
