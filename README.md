# 🎉 Gatherly

> A modern full-stack event management platform where users can create, discover, RSVP to, and manage events with real-time analytics, QR-based tickets, and email confirmations.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

Gatherly is a premium event booking and management platform that enables users to:

- Create and manage events
- Discover upcoming events
- RSVP instantly
- Receive email confirmations
- Access QR-code based tickets
- Monitor event analytics through a personal dashboard

It is built using a modern full-stack architecture with React, Express, Prisma, and TypeScript.

---

# ✨ Features

### 👤 User Authentication
- Secure Signup & Login
- JWT Authentication
- Password Hashing using bcrypt

### 🎫 Event Management
- Create new events
- Edit/Delete hosted events
- Browse upcoming events
- View complete event details

### ✅ RSVP System
- One-click RSVP
- Prevent duplicate registrations
- Automatic attendee tracking

### 📧 Email Confirmation
- Instant RSVP confirmation emails
- Event information included
- Ticket link sent automatically

### 🎟 QR Ticket Generation
- Personal event ticket
- QR Code generation
- Easy verification

### 📊 Dashboard
Track your activity through:

- Events Created
- Events Joined
- Total RSVPs
- Hosted Events

### 🎨 Modern UI
- Responsive Design
- Smooth Animations
- Tailwind CSS
- Clean Dashboard Interface

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- React Router
- Tailwind CSS
- Motion
- Lucide Icons
- Vite

## Backend

- Express.js
- TypeScript
- JWT Authentication
- bcryptjs
- Zod Validation

## Database

- Prisma ORM
- SQLite

## Additional Services

- Resend Email API
- QR Code Generator

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Mihir-Paul/gatherly.git

cd gatherly
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create a `.env` file using `.env.example`.

Example:

```env
DATABASE_URL="file:./dev.db"

JWT_SECRET=your_secret_key

RESEND_API_KEY=your_resend_api_key

APP_URL=http://localhost:3000
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migration

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run dev
```

Application runs on:

```
http://localhost:3000
```

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/signup

POST /api/auth/login
```

## Events

```
GET    /api/events

GET    /api/events/:id

POST   /api/events

DELETE /api/events/:id

POST   /api/events/:id/rsvp
```

## Users

```
GET /api/users/dashboard
```

---

# 🗄 Database Schema

The application consists of three core models.

### User

- Name
- Email
- Password
- Events Created
- RSVPs

### Event

- Title
- Description
- Date
- Location
- Image
- Creator

### RSVP

- User
- Event
- Timestamp

---

# 🔐 Authentication

Gatherly uses:

- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes
- Middleware Authorization

---

# 📧 Email Integration

After a successful RSVP:

- Confirmation email is sent
- Event details included
- Ticket URL generated
- Powered by Resend API

---

# 🎟 Ticket System

Each attendee receives:

- Personal ticket
- QR Code
- Event details
- Unique RSVP confirmation

---

# 📊 Dashboard Analytics

Users can monitor:

- Total Events Hosted
- Total Events Joined
- Total RSVPs Received

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.

2. Create your feature branch.

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes.

```bash
git commit -m "Add New Feature"
```

4. Push to the branch.

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request.

---


---

## ⭐ Support

If you found this project useful:

- ⭐ Star this repository
- 🍴 Fork it
- 💡 Share your feedback

Happy Coding! 🚀
