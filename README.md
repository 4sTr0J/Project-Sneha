# 💜 Sneha - Patient & Caregiver Support Platform

> A full-stack web application designed to provide emotional, psychological, and community support to patients and caregivers in Sri Lanka.

---

## 🌟 Key Features

- **🧘 Mind Relaxation & Wellness Library**: Curated meditation guides, breathing exercises, affirmations, and guided video sessions.
- **🤝 Peer Support Communities**: Dedicated support groups for Cancer Support, Chronic Illness, Caregivers, and Survivors.
- **🤖 AI Healing Companion**: Integrated Gemini AI conversational assistant offering compassionate emotional support.
- **📊 Mood Tracker**: Interactive daily mood logging, intensity tracking, and emotional progress visualization.
- **🎵 Healing Frequencies**: Binaural and ambient relaxation tracks tuned for stress relief and deep sleep.
- **✨ Instant Guest Demo Access**: One-click demo login enabling instant platform exploration without manual signup.

---

## 🏗️ Architecture & Tech Stack

```
sneha/
├── frontend/       # React 18 + Vite, Lucide Icons, Framer Motion
└── backend/        # Node.js, Express, SQLite (via Sequelize ORM), JWT, Gemini AI
```

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS with custom Theme Engine (Light & Dark modes)
- **Icons & Motion**: Lucide React, Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios with automated bearer token interceptor

### Backend
- **Runtime**: Node.js & Express
- **Database**: SQLite (`database.sqlite`) via Sequelize ORM (zero external database setup required)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Security**: Helmet, CORS, and Express Rate Limiting

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   A default `.env` is configured for local development. You can customize it if needed:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   *The backend will start on **`http://localhost:5000`** and automatically sync with the local SQLite database.*

---

### 2. Frontend Setup

1. In a new terminal window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Login & Demo Credentials

You can test the application using either method on the Login page:

| Method | Email / Identifier | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Guest Access** | One-Click Button | *None required* | Instant access to the Dashboard and all views |
| **Demo Account** | `hh@example.com` | `password123` | Pre-configured test account |

---

## 📡 API Overview

The backend exposes RESTful endpoints with bearer authentication under `/api`:

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |

### 🌿 Wellness (`/api/wellness`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wellness` | List all wellness content (filter by `?type=`) | Private |
| `GET` | `/api/wellness/:id` | Retrieve specific wellness resource | Private |
| `GET` | `/api/wellness/user/favorites` | Retrieve user's favorited items | Private |
| `POST` | `/api/wellness/favorite/:id` | Toggle favorite status | Private |

### 👥 Communities (`/api/community`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/community/groups` | List all support groups | Private |
| `GET` | `/api/community/groups/:id` | Retrieve community details and members | Private |
| `POST` | `/api/community/groups/:id/join` | Join or leave a support group | Private |

### 💬 Chat & AI (`/api/chat`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/conversations` | Retrieve conversation threads | Private |
| `GET` | `/api/chat/messages/:id` | Retrieve messages for a thread | Private |
| `POST` | `/api/chat/messages` | Send message (triggers Gemini AI response) | Private |

### 📈 Mood Tracker (`/api/moods`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/moods` | Retrieve user mood logs | Private |
| `POST` | `/api/moods` | Log a new mood entry | Private |
| `DELETE` | `/api/moods` | Clear user mood history | Private |

### 🎧 Music (`/api/music`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/music` | List ambient relaxation frequencies | Private |

---

## 🛠️ Windows Troubleshooting Tip

If running on Windows and encountering file permission issues (`ENOENT` or `Access is denied`):
- Ensure the project is not placed directly inside Windows Defender's protected **`Documents`** folder, OR
- Add Node.js (`node.exe`) to **Windows Security > Virus & threat protection > Manage ransomware protection > Allow an app through Controlled folder access**.

---

## 📄 License & Team

Developed with 💜 for the Sneha Community.  
Project Repository: [https://github.com/4sTr0J/sneeha-project](https://github.com/4sTr0J/sneeha-project)
