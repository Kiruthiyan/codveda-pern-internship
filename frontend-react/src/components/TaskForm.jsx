import React, { useState } from "react";
import api from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/tasks", { title });
            onTaskAdded(res.data);
            setTitle("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-task-card">
            <form className="add-form" onSubmit={handleSubmit} style={{ margin: 0 }}>
                <input
                    type="text"
                    className="input-base"
                    placeholder="What do you need to get done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "+ Add Task"}
                </button>
            </form>
            {error && <div className="error-text">{error}</div>}
        </div>
    );
};

export default TaskForm;
