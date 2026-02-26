const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /tasks – Fetch all tasks (Public for Level 1 frontend)
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).json({ error: "Server error while fetching tasks" });
    }
});

// GET /tasks/:id – Fetch a single task
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching task:", err.message);
        res.status(500).json({ error: "Server error while fetching task" });
    }
});

// POST /tasks – Create a new task
router.post("/", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "Task title is required" });
        }
        
        // For Level 1 without auth, we'll assign it to the first user or null
        // Since user_id could be required by FK, let's grab the admin user we seeded
        const adminUser = await pool.query("SELECT id FROM users LIMIT 1");
        const userId = adminUser.rows.length > 0 ? adminUser.rows[0].id : null;

        const result = await pool.query(
            "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
            [title.trim(), userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(500).json({ error: "Server error while creating task" });
    }
});

// PUT /tasks/:id – Update a task
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const existing = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updatedTitle =
            title !== undefined ? title.trim() : existing.rows[0].title;
        const updatedCompleted =
            completed !== undefined ? completed : existing.rows[0].completed;

        if (updatedTitle === "") {
            return res.status(400).json({ error: "Task title cannot be empty" });
        }

        const result = await pool.query(
            "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
            [updatedTitle, updatedCompleted, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ error: "Server error while updating task" });
    }
});

// DELETE /tasks/:id – Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err.message);
        res.status(500).json({ error: "Server error while deleting task" });
    }
});

module.exports = router;
