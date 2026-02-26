-- ============================================================
-- Codveda Task Manager – Database Schema
-- Run this file against your PostgreSQL `taskmanager` database
-- psql -U postgres -d taskmanager -f schema.sql
-- ============================================================

-- ─── Drop existing tables (in correct order) ────────────────
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- ─── Users table ─────────────────────────────────────────────
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  UNIQUE NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        VARCHAR(20)   DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP     DEFAULT NOW()
);

-- ─── Tasks table ─────────────────────────────────────────────
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  completed   BOOLEAN       DEFAULT FALSE,
  user_id     INTEGER       REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP     DEFAULT NOW()
);

-- ─── Indexes for performance ──────────────────────────────────
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_users_email   ON users(email);

-- ─── Seed an admin user (password: admin123) ─────────────────
-- (bcrypt hash of "admin123" with salt rounds = 10)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@codveda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
