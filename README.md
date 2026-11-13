# 🎓 Campus Placement & Recruitment Management System

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Docker](https://img.shields.io/badge/Docker-Deployed-2496ED?style=for-the-badge&logo=docker)

**A full-stack, role-based campus placement portal built as a DBMS course project.**  
Manages the complete hiring lifecycle — from student registration to offer issuance.

[🌐 Live Demo](https://campus-placement-management-system-dbms.vercel.app) · [🔗 Backend API](https://campusplacement-backend-l4g2.onrender.com) · [📋 API Docs](#api-endpoints)

</div>

---

## 📌 Project Overview

This is a **Database Management Systems (DBMS) course project** (24CS520) developed at **JSS Science & Technology University, Mysuru**. It demonstrates real-world database design and application development using:

- **16-table normalized relational schema** on Neon PostgreSQL
- **RESTful Spring Boot backend** with JPA/Hibernate ORM
- **React SPA frontend** with role-based routing
- **Full deployment pipeline** — Vercel (frontend) + Render (backend) + Neon (database)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│          React 19 + Vite + React Router v7              │
│          Deployed on: Vercel                             │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS REST API
┌───────────────────────▼─────────────────────────────────┐
│                 BACKEND (Spring Boot 4.1)                │
│    Java 17 · Spring MVC · Spring Data JPA · BCrypt       │
│    Deployed on: Render (Docker)                          │
└───────────────────────┬─────────────────────────────────┘
                        │ JDBC (SSL)
┌───────────────────────▼─────────────────────────────────┐
│              DATABASE (Neon PostgreSQL 18)               │
│    16 Tables · Triggers · Views · Indexes                │
│    Hosted on: Neon Serverless Postgres                   │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Role-Based Access

The system supports three distinct user roles, each with their own portal and dashboard:

| Role | Portal URL | Responsibilities |
|------|-----------|-----------------|
| **Student** | `/student` | Register, fill academic profile, browse drives, check eligibility, apply, track status, view offer letters |
| **Placement Team** | `/team` | Add companies, create job roles, publish placement drives, set eligibility criteria, conduct selection rounds, evaluate candidates |
| **Placement Officer** | `/officer` | View student directory, issue/manage offers, block/unblock students, view audit logs, generate placement reports |

---

## ✨ Key Features

### 🎓 Student Portal
- Self-registration with university email, USN, CGPA, department
- Browse active placement drives with company details & packages
- Real-time eligibility check per drive (CGPA, backlogs, department)
- Apply for drives, withdraw applications
- Track application status across selection rounds
- View & accept/decline offer letters
- Manage skills profile

### 🏢 Placement Team Portal
- Full CRUD for companies and job roles
- Create placement drives with deadlines and eligibility rules (min CGPA, max backlogs, eligible departments)
- Publish/close drives, manage drive status
- Record selection round results (Aptitude → Technical → HR → Offer)
- Evaluate candidates per round

### 🛡️ Placement Officer Portal
- Student directory with profile details
- Restrict/unblock students (with reasons)
- Issue official offer letters with package details
- View audit log of all offer-related events
- Placement statistics & analytics reports

---

## 🗄️ Database Schema (16 Tables)

```
departments          → University departments (CSE, ISE, ECE, MECH…)
users                → Authentication table (all roles)
students             → Academic profile linked to users
skills               → Skills catalog
student_skills       → Student ↔ Skills (many-to-many with proficiency)
companies            → Recruiting companies
job_roles            → Roles offered by companies
placement_drives     → Hiring drives linking companies + job roles
drive_eligibility    → Eligibility rules per drive
drive_eligibility_departments → Eligible departments per drive
applications         → Student applications to drives
selection_rounds     → Interview/test rounds per drive
round_results        → Per-student results for each round
offers               → Final offer letters
placement_restrictions → Student block/unblock records
audit_logs           → Immutable audit trail (via DB trigger)
```

### 🔧 Database Features
- **Triggers**: Auto-audit on offer insert, prevent blocked students from applying
- **Indexes**: On foreign keys and frequently queried columns
- **Transactions**: Atomic student registration (User + Student in one TX)
- **Constraints**: CHECK constraints on CGPA (0–10), backlogs (≥0), status enums

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Core language |
| Spring Boot | 4.1 | Application framework |
| Spring Data JPA | 4.x | ORM / database abstraction |
| Spring MVC | 4.x | REST API layer |
| Spring Security Crypto | 6.x | BCrypt password hashing |
| PostgreSQL Driver | 42.x | Database connectivity |
| Bean Validation | 3.x | Request payload validation |
| Docker | — | Containerization for deployment |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| React Router | 7 | SPA routing |
| Vite | 8 | Build tool |
| Lucide React | 1.7 | Icon library |

### Infrastructure
| Service | Plan | Purpose |
|--------|------|---------|
| Neon PostgreSQL | Free | Serverless database (Singapore region) |
| Render | Free | Backend Docker hosting |
| Vercel | Hobby | Frontend static hosting |
| GitHub | Free | Source control + CI/CD |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 20+ & npm
- PostgreSQL (or Neon account)

### 1. Clone the Repository
```bash
git clone https://github.com/Ravikiranswamy/CampusPlacementManagementSystem.git
cd CampusPlacementManagementSystem
```

### 2. Database Setup
Run the schema SQL against your PostgreSQL instance:
```bash
psql -h <host> -U <user> -d <dbname> -f database/master_schema.sql
```

### 3. Backend Setup
Create `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://<host>/<dbname>?sslmode=require
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=validate
server.port=8080
```

Run the backend:
```bash
./mvnw spring-boot:run
```

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local → set VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 Live Deployment

| Component | URL | Platform |
|-----------|-----|---------|
| Frontend | https://campus-placement-management-system-dbms.vercel.app | Vercel |
| Backend API | https://campusplacement-backend-l4g2.onrender.com | Render |
| Database | Neon PostgreSQL (`placementdb`) | Neon (AWS ap-southeast-1) |

> **Note:** The backend is on Render's free tier and may take **30–50 seconds** to wake from sleep on first request. Subsequent requests are fast.

### Default Admin Credentials
| Role | Email | Password |
|------|-------|---------|
| Placement Team | `team.demo@example.edu` | `password123` |
| Placement Officer | `officer.demo@example.edu` | `password123` |

> Students must **self-register** via the `/register` page — no demo student accounts.

---

## 📡 API Endpoints

Base URL: `https://campusplacement-backend-l4g2.onrender.com/api`

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/auth/login` | Authenticate user |
| `GET` | `/students` | List all students |
| `POST` | `/students` | Register new student |
| `PUT` | `/students/{id}` | Update student profile |
| `GET` | `/companies` | List all companies |
| `POST` | `/companies` | Create company |
| `PUT` | `/companies/{id}` | Update company |
| `GET` | `/job-roles` | List all job roles |
| `POST` | `/job-roles` | Create job role |
| `GET` | `/drives` | List all drives |
| `GET` | `/drives/published` | List active drives |
| `POST` | `/drives` | Create placement drive |
| `GET` | `/eligibility/check` | Check student eligibility for drive |
| `POST` | `/applications` | Apply for a drive |
| `GET` | `/applications/student/{id}` | Student's applications |
| `POST` | `/rounds` | Create selection round |
| `POST` | `/rounds/results` | Record round result |
| `GET` | `/offers` | List all offers |
| `POST` | `/offers` | Issue offer letter |
| `POST` | `/restrictions/block` | Block a student |
| `GET` | `/audit-logs` | View audit trail |
| `GET` | `/reports/placement-stats` | Placement statistics |
| `GET` | `/departments` | List departments |
| `GET` | `/skills` | List skills catalog |

---

## 📁 Project Structure

```
campusplacement/
├── src/main/java/com/placement/campusplacement/
│   ├── controller/          # 14 REST controllers
│   ├── service/             # Business logic interfaces + impls
│   ├── repository/          # Spring Data JPA repositories
│   ├── entity/              # JPA entities (16 tables)
│   ├── dto/                 # Request/Response DTOs
│   ├── exception/           # Custom exception classes
│   └── config/              # CORS, Security config
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── student/     # Student portal pages
│       │   ├── team/        # Placement team pages
│       │   └── officer/     # Placement officer pages
│       ├── api/             # Centralized API client
│       ├── context/         # AuthContext, DataContext
│       ├── components/      # Reusable UI components
│       ├── routes/          # Role-based routing & nav
│       └── styles/          # Global CSS
├── database/
│   ├── master_schema.sql    # Complete DB schema
│   └── academic_dbms_queries.sql  # Course queries
├── documentation/
│   └── CAMPUS_PLACEMENT_DBMS_REPORT.tex
└── Dockerfile               # Backend container config
```

---

## 🔄 Workflow

```
Placement Team                    Student                    Placement Officer
     │                               │                               │
     ▼                               │                               │
Add Company                         │                               │
     │                               │                               │
     ▼                               │                               │
Create Job Role                     │                               │
     │                               │                               │
     ▼                               ▼                               │
Publish Drive ──────────────► Browse Drives                        │
     │                          Check Eligibility                    │
     │                          Apply for Drive                      │
     ▼                               │                               │
Add Selection Rounds ◄──────── Appear for Rounds                   │
     │                               │                               │
     ▼                               ▼                               ▼
Record Results ──────────────► View Round Status         Issue Offer Letter
                                     │                        │
                                     ▼                        │
                               Accept/Decline ◄───────────────┘
                                  Offer
```

---


---

## 📄 License

This project is developed for academic purposes as part of the DBMS course at JSSSTU.

---

<div align="center">
  <sub>Built with ☕ Java, ⚛️ React, and 🐘 PostgreSQL</sub>
</div>
