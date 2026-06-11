# 📋 Task Management System (TMS)
**INTE 21323 — Group Assignment**

Full-stack web application built with **Node.js + Express + React + MySQL**

---

## 🏗️ Project Structure

```
tms/
├── backend/                  ← Express API server
│   ├── src/
│   │   ├── config/           ← Database & Swagger config
│   │   ├── controllers/      ← Request handlers
│   │   ├── middleware/        ← Auth, validation
│   │   ├── models/           ← Sequelize DB models
│   │   ├── routes/           ← API route definitions
│   │   └── utils/            ← Email, WebSocket helpers
│   ├── seed.js               ← Creates first admin user
│   └── Dockerfile
├── frontend/                 ← React app
│   ├── src/
│   │   ├── components/       ← Reusable UI components
│   │   ├── context/          ← Global state (auth)
│   │   ├── hooks/            ← Custom React hooks
│   │   ├── pages/            ← Page components
│   │   └── services/         ← Axios API service
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Step-by-Step Setup on Your Machine

### STEP 1 — Install Required Software

Download and install these (in order):

1. **Node.js** — https://nodejs.org  (download the "LTS" version)
   - After installing, open a terminal and check: `node --version`

2. **MySQL** — https://dev.mysql.com/downloads/installer/
   - During setup, set root password (remember it!)
   - Or use **XAMPP** (easier): https://www.apachefriends.org

3. **Git** — https://git-scm.com/downloads

4. **VS Code** (recommended editor) — https://code.visualstudio.com

---

### STEP 2 — Set Up the Database

Open **MySQL Workbench** or run in terminal:

```sql
CREATE DATABASE tms_db;
```

That's it — the app will create all the tables automatically.

---

### STEP 3 — Set Up the Backend

Open a terminal in the `tms/backend` folder:

```bash
# 1. Go into backend folder
cd tms/backend

# 2. Install all packages
npm install

# 3. Create your .env file by copying the example
cp .env.example .env
```

Now **open the `.env` file** in VS Code and fill in your MySQL password:
```
DB_PASSWORD=your_mysql_password_here
```

For email (to test without real email), go to https://mailtrap.io, create a free account, and copy the SMTP credentials into `.env`.

```bash
# 4. Create the first admin user
node seed.js

# 5. Start the backend server
npm run dev
```

You should see:
```
✅ MySQL connected successfully
✅ Database synced
🚀 Server running on http://localhost:5000
📖 API Docs: http://localhost:5000/api/docs
```

---

### STEP 4 — Set Up the Frontend

Open a **new terminal** in the `tms/frontend` folder:

```bash
# 1. Go into frontend folder
cd tms/frontend

# 2. Install all packages
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Start the React app
npm start
```

Your browser will open at http://localhost:3000

---

### STEP 5 — Log In

Use the default admin account:
- **Email:** admin@tms.com
- **Password:** Admin@1234

> ⚠️ Change this password after first login!

---

## 🔐 User Roles

| Role | Can Do |
|------|--------|
| **Admin** | Manage all users, assign roles, full access |
| **Project Manager** | Create/assign/delete tasks, full task control |
| **Collaborator** | View assigned tasks, update status, add comments |

---

## 📡 API Documentation

With the backend running, visit:  
**http://localhost:5000/api/docs**

This is your **Swagger UI** — it shows all endpoints and lets you test them.

---

## 🐳 Running with Docker (Alternative)

If you have Docker installed:

```bash
cd tms
docker-compose up --build
```

Then visit http://localhost:3000

---

## 🔄 Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8, Sequelize ORM |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Real-time | WebSockets (ws library) |
| API Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS, Rate Limiting, Parameterized queries |
| DevOps | Docker, Docker Compose |

---

## ☁️ Deployment (Cloud)

### Deploy to Render.com (Free & Easy)

**Backend:**
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node src/server.js`
6. Add environment variables (same as `.env`)

**Database:**
1. On Render → New PostgreSQL (or use PlanetScale for MySQL: https://planetscale.com)
2. Copy the connection string into backend env vars

**Frontend:**
1. On Render → New Static Site
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `build`

---

## 📤 Push to GitHub (Git Guide)

### First Time Setup

```bash
# 1. Create an account at github.com if you don't have one

# 2. Create a new repository on GitHub (click "New" on github.com)
#    Name it: task-management-system
#    Set it to Public
#    Do NOT add README or .gitignore (we already have them)

# 3. Open terminal in the tms/ folder

# 4. Initialize git
git init

# 5. Add all files
git add .

# 6. Make your first commit
git commit -m "Initial commit: Task Management System"

# 7. Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/task-management-system.git

# 8. Push to GitHub
git branch -M main
git push -u origin main
```

### Everyday Git Workflow

```bash
# After making changes:

# 1. Create a feature branch (good practice)
git checkout -b feature/my-new-feature

# 2. Add your changes
git add .

# 3. Commit with a meaningful message
git commit -m "Add: task filtering by priority"

# 4. Push the branch
git push origin feature/my-new-feature

# 5. On GitHub, create a Pull Request to merge into main
```

---

## 📋 Grading Checklist

- ✅ **Frontend (20%)** — React app with Login, Dashboard (Kanban), Tasks, Users pages
- ✅ **Backend (20%)** — Express REST API with all CRUD operations
- ✅ **Database (10%)** — MySQL with Sequelize ORM, proper relations
- ✅ **Security (15%)** — JWT auth, RBAC, bcrypt passwords, helmet, rate limiting, parameterized queries (ORM)
- ✅ **Real-Time Notifications (10%)** — WebSocket notifications for task events
- ✅ **DevOps & Deployment (20%)** — Docker + Docker Compose, cloud deployment guide
- ✅ **Documentation (5%)** — Swagger API docs, README

---

## 👥 Team Members

| Name | Student ID | Contribution |
|------|-----------|-------------|
| (Add your name) | | |
| | | |
| | | |

---

## 🔗 Links

- **Frontend:** https://your-frontend-url.com  ← add after deployment
- **Backend API:** https://your-backend-url.com  ← add after deployment
- **Swagger Docs:** https://your-backend-url.com/api/docs  ← add after deployment
- **GitHub Repo:** https://github.com/your-username/task-management-system
