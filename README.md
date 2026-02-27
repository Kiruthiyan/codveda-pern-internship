# ✦ TaskFlow – Codveda PERN Stack Internship

[![Codveda Internship](https://img.shields.io/badge/Codveda-Internship-blueviolet?style=for-the-badge)](https://codveda.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)

A beautiful, fully-featured Task Management application built to complete the **Full Stack Development Internship** at [Codveda Technologies](https://www.codveda.com). 

This repository contains the progression of the internship tasks across three levels (Basic, Intermediate, and Advanced), culminating in a robust **PERN stack** (PostgreSQL, Express, React, Node.js) application with secure JWT authentication and a premium dark glassmorphism UI.

---

## ⚡ Features

### Level 1: Foundation (Basic)
- 🗄️ **RESTful API**: Node.js & Express server handling complete CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
- 🎨 **Vanilla Frontend**: A responsive, vanilla HTML/CSS/JS frontend utilizing the Fetch API for dynamic DOM updates without page reloads.

### Level 2: Security & Database (Intermediate)
- 🔐 **Authentication**: Secure user registration and login endpoints.
- 🔑 **JWT & Bcrypt**: Password hashing with `bcryptjs` and route protection using JSON Web Tokens (JWT).
- 🗃️ **Relational Database**: Advanced PostgreSQL schema linking `users` 1-to-Many with their `tasks` using foreign keys and cascading deletes.

### Level 3: Modern UI (Advanced)
- ⚛️ **React Frontend**: A Vite + React Single Page Application (SPA).
- 🛣️ **Protected Routing**: React Router DOM implementation preventing unauthenticated users from accessing the dashboard.
- 🪝 **State Management**: Leveraging React hooks (`useState`, `useEffect`, `useContext`) and Axios interceptors for seamless asynchronous API communication.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | React (Vite), HTML5, Vanilla CSS, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | PostgreSQL, `pg` (Node Postgres module) |
| **Tools** | Git, REST Client, Postman/Thunder Client |

---

## 🚀 Getting Started

Follow these instructions to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) (Running locally on default port 5432)

### 1. Database Setup
1. Open pgAdmin or `psql` and create a database named `taskmanager`.
2. Run the provided SQL schema file to create the tables:
   ```bash
   psql -U postgres -d taskmanager -f backend/schema.sql
   ```

### 2. Backend API Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your PostgreSQL credentials if they differ from the defaults.
4. Start the server:
   ```bash
   npm run dev
   ```
   *The API will start running on `http://localhost:5000`*

### 3. Frontend Setup (React Application)
1. Open a new terminal and navigate to the React frontend directory:
   ```bash
   cd frontend-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The React app will open at `http://localhost:5173`*

---

## 📸 Application Screenshots
> *(Tip for Kiruthiyan: You can upload your screenshots here to make the README pop!)*

- **Login / Registration**: Secure entry points utilizing JWT tokens.
- **Task Dashboard**: A sleek, dark-themed UI that tracks pending and completed tasks.

---

## 👨‍💻 Author

**Theivendrarasa Kiruthiyan**
* Full Stack Development Intern @ Codveda Technologies
* LinkedIn: [Your Profile Link Here]
* GitHub: [@Kiruthiyan](https://github.com/Kiruthiyan)

---
*This repository strictly adheres to Codveda Technologies' Zero Tolerance Policy for Plagiarism. All code was written from scratch.*
