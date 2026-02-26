import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks([newTask, ...tasks]);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    };

    const handleTaskDelete = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading tasks...</div>;
    if (error) return <div className="error-text" style={{ textAlign: "center", marginTop: "40px" }}>{error}</div>;

    return (
        <>
            <header style={{ textAlign: "center", marginBottom: "36px" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", marginBottom: "8px" }}>My Task Board</h1>
                <p style={{ color: "var(--text-muted)" }}>Stay organised. Stay productive.</p>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
                <div className="card" style={{ padding: "18px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--accent)" }}>{tasks.length}</span>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</span>
                </div>
                <div className="card" style={{ padding: "18px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--accent)" }}>{tasks.filter(t => !t.completed).length}</span>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Pending</span>
                </div>
                <div className="card" style={{ padding: "18px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--accent)" }}>{tasks.filter(t => t.completed).length}</span>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Completed</span>
                </div>
            </div>

            <TaskForm onTaskAdded={handleTaskAdded} />

            <ul className="task-list">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onUpdate={handleTaskUpdate}
                        onDelete={handleTaskDelete}
                    />
                ))}
                {tasks.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📋</div>
                        No tasks found. Add your first task above!
                    </div>
                )}
            </ul>
        </>
    );
};

export default Dashboard;
