# 🚀 Modern URL Shortener

A full-stack, production-grade URL shortener with analytics, user authentication, and a beautiful modern UI.

---

## ✨ Features

- 🔒 **User Authentication** (JWT, secure, per-user data isolation)
- ✂️ **URL Shortening** with custom aliases
- 📊 **Analytics Dashboard** (click stats, history)
- 🖥️ **Modern UI** (React, Vite, Tailwind, custom pastel palette)
- ⚡ **Rate Limiting, Security Headers, Input Validation**
- 📱 **Responsive & Accessible**
- 🛡️ **Production-Ready Backend** (Express, MongoDB, Helmet, express-validator)

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Helmet, express-validator
- **Dev Tools:** ESLint, Prettier, React Query, Docker-ready

---

## 📦 Project Structure

```
url-shortner-Api/
  frontend/   # React + Vite + Tailwind UI
  backend/    # Express + MongoDB API
```

---

## 🚀 Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/url-shortner-Api.git
cd url-shortner-Api
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env # Fill in your MongoDB URI and JWT secret
npm install
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
cp .env.example .env # Set VITE_API_URL to your backend
npm install
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔐 Security & Best Practices

- All endpoints are authenticated and user-isolated
- Helmet for HTTP security headers
- express-validator for input sanitization
- Rate limiting on sensitive endpoints
- Centralized error handling
- No sensitive data in frontend
- HTTPS enforced in production

---

## 🖼️ Screenshots

> _Add screenshots or a GIF of your UI here to impress recruiters!_

---

## 📚 Documentation

- API docs: See backend/README.md
- Frontend structure: See frontend/README.md

---

## 🤝 Contributing

PRs welcome! Please open an issue first to discuss changes.

---


> _Built with ❤️ by Sai Harsha_
