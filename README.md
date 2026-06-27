# TaskNova - Task Management System

A modern, full-stack Task Management System featuring role-based access control, real-time WebSocket notifications, 2FA authentication, and automated email alerts.

## 🌟 Features
- **Role-Based Access**: Secure dashboards for Admins, Project Managers, and Collaborators.
- **Real-Time Updates**: Instantly see new tasks, status changes, and comments via WebSockets.
- **2FA Security**: Secure logins using dynamic 6-digit OTP codes sent via email.
- **Automated Notifications**: System-wide broadcasts, task assignment alerts, and deadline reminders delivered right to your inbox.
- **Cloud-Ready**: Fully configured for deployment on Azure (App Service, Static Web Apps, and Azure PostgreSQL).

---

## 🏗️ Architecture Overview

TaskNova is separated into a **Frontend** and a **Backend**.

### The Stack
- **Frontend**: React, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: PostgreSQL (Azure Database for PostgreSQL)
- **Email Service**: Nodemailer (via System Mail/Gmail App Password)

### Data Flow
1. **Frontend to Backend**: React sends HTTP requests (e.g., `POST /api/auth/login`) via Axios using the `FRONTEND_URL` environment variable.
2. **Backend to Database**: Express receives the request, processes the business logic in the Controllers, and uses Sequelize ORM to query the PostgreSQL Database.
3. **Backend to User**: The backend packages the data and sends it back to the frontend. It also triggers WebSockets for live UI updates and Nodemailer for email notifications.

### Codebase Structure

#### `frontend/`
- **`src/main.jsx`**: The React entry point.
- **`src/App.jsx`**: Handles routing using React Router.
- **`src/context/`**: Manages global state (`AuthContext.jsx` for user sessions, `ThemeContext.jsx` for dark mode).
- **`src/pages/`**: Full-screen views (Login, Dashboard, Projects, Tasks).
- **`src/components/`**: Reusable UI blocks (Sidebars, Modals, TaskCards).

#### `backend/`
- **`src/server.js`**: Starts the server, sets up CORS, and registers API routes.
- **`src/config/`**: Database connection (`database.js`) and Swagger API docs (`swagger.js`).
- **`src/models/`**: Sequelize database schemas (`User.js`, `Task.js`, `Project.js`, `Comment.js`, `Otp.js`).
- **`src/controllers/`**: Core business logic (`authController.js`, `taskController.js`, `adminController.js`).
- **`src/routes/`**: Maps URLs to controllers (e.g., `/api/tasks`).
- **`src/utils/`**: Helper services (`email.js` for Nodemailer, `websocket.js` for live updates, `scheduler.js` for hourly deadline checks).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL

### 1. Database Setup
```bash
# Create a local PostgreSQL database
createdb tasknova_db
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env   
# Edit .env: Set DATABASE_URL to your local Postgres (e.g., postgres://user:pass@localhost:5432/tasknova_db)

npm install
npm run dev            # Starts backend on http://localhost:5000
```
> **Note**: To enable real emails locally, set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` in your `.env`. Otherwise, 2FA codes will default to `123456`.

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env   
# Ensure VITE_API_URL is set to http://localhost:5000/api

npm install
npm run dev            # Starts frontend on http://localhost:5173
```

### 4. Test Accounts
Once the server is running, use these default accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tms.com | Admin@1234 |
| Project Manager | manager@tms.com | Manager@1234 |
| Collaborator | collab@tms.com | Collab@1234 |

---

## ☁️ Azure Deployment Guide

This project is configured for seamless deployment to Microsoft Azure.

1. **Database**: Provision an **Azure Database for PostgreSQL**.
2. **Backend**: Deploy the `backend/` folder to an **Azure App Service** (Node.js). Set the following Environment Variables in the Azure Portal:
   - `DATABASE_URL`: Your Azure Postgres connection string.
   - `FRONTEND_URL`: Your deployed frontend URL (for CORS).
   - `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure random strings for token generation.
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: Your System Mail credentials (e.g. Gmail App Password) for sending 2FA and system notifications.
3. **Frontend**: Deploy the `frontend/` folder to **Azure Static Web Apps**. Set the `VITE_API_URL` environment variable to your deployed backend URL.

---

## 📖 API Documentation
Once the backend is running, visit the interactive Swagger API documentation at:
`http://localhost:5000/api/docs` (or your deployed backend URL).
