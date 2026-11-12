# Cloud Deployment Guide — Campus Placement Management System

This guide outlines the complete step-by-step procedure to deploy the **Campus Recruitment and Placement Management System** to production cloud hosting.

---

## 1. Architecture Overview

```
                      PRODUCTION CLOUD DEPLOYMENT
┌───────────────────────┐             ┌─────────────────────────┐
│     REACT FRONTEND    │             │   SPRING BOOT BACKEND   │
│   (Hosted on Vercel)  │ ──────────> │   (Hosted on Render)    │
│  https://your-app.com │   REST API  │ https://your-api.com    │
└───────────────────────┘             └────────────┬────────────┘
                                                   │
                                                   │ JDBC (SSL)
                                                   ▼
                                      ┌─────────────────────────┐
                                      │   NEON POSTGRESQL CLOUD │
                                      │     (AWS ap-southeast)  │
                                      │       placementdb       │
                                      └─────────────────────────┘
```

---

## 2. Component 1: PostgreSQL Database (Neon Cloud)
* **Status**: **Already Live and Active**
* **Host**: Neon AWS Cloud (`ap-southeast-1`)
* **Database Name**: `placementdb`
* **Tables**: 16 Normalized Tables, 2 Views, 2 Triggers, 2 Stored Procedures
* **Credentials**: Stored in environment variables (`DB_URL`, `DB_PASSWORD`). Never committed to Git.

---

## 3. Component 2: Spring Boot Backend Deployment (Render / Railway)

### Option A: Render (Free Tier Web Service)
1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** $\longrightarrow$ **Web Service**.
3. Select your repository: `Ravikiranswamy/CampusPlacementManagementSystem`.
4. Configure service parameters:
   * **Name**: `campus-placement-api`
   * **Language / Environment**: `Docker` (Render will automatically detect the root `Dockerfile`)
   * **Branch**: `master`
   * **Instance Type**: `Free`
5. Click **Advanced** $\longrightarrow$ **Add Environment Variable**:
   * `DB_URL` = `jdbc:postgresql://<neon-host>/placementdb?sslmode=require`
   * `DB_PASSWORD` = `<your-neon-database-password>`
6. Click **Deploy Web Service**.
7. Render will build the Docker container and provide a live URL, e.g.:
   `https://campus-placement-api.onrender.com`

---

## 4. Component 3: React Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** $\longrightarrow$ **Project**.
3. Import `Ravikiranswamy/CampusPlacementManagementSystem`.
4. Configure project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select **`frontend`**
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. In **Environment Variables**, add:
   * `VITE_API_BASE_URL` = `https://campus-placement-api.onrender.com/api`
6. Click **Deploy**.
7. Vercel will build and deploy your React frontend within 60 seconds, providing an instant HTTPS URL!

---

## 5. Local Development Execution (IntelliJ + Vite)

### Running Backend in IntelliJ IDEA:
1. Ensure `DB_URL` and `DB_PASSWORD` are set in your Run Configuration environment variables.
2. Run `CampusplacementApplication.java`.
3. Backend starts on `http://localhost:8080`.

### Running Frontend in Terminal:
```bash
cd frontend
npm run dev
```
Vite dev server starts on `http://localhost:5173` with automatic reverse proxy to `http://localhost:8080/api`.

