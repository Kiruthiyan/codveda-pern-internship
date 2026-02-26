import React, { useState } from "react";
import api from "../services/api";

const TaskItem = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleToggle = async () => {
        try {
            const res = await api.put(`/tasks/${task.id}`, {
                completed: !task.completed,
            });
            onUpdate(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) return;
        try {
            const res = await api.put(`/tasks/${task.id}`, { title: editTitle });
            onUpdate(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await api.delete(`/tasks/${task.id}`);
            onDelete(task.id);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <li className={`task-item ${task.completed ? "completed" : ""}`}>
            <div
                className={`task-check ${task.completed ? "done" : ""}`}
                onClick={handleToggle}
            >
                {task.completed && "✓"}
            </div>

            <div style={{ flex: 1 }}>
                {isEditing ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="text"
                            className="input-base"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                        />
                        <button className="btn btn-primary" onClick={handleSaveEdit} style={{ width: "auto" }}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ width: "auto" }}>Cancel</button>
                    </div>
                ) : (
                    <span className="task-title">{task.title}</span>
                )}
            </div>

            {!isEditing && (
                <div className="task-actions">
                    <button className="icon-btn" onClick={() => setIsEditing(true)}>✎</button>
                    <button className="icon-btn danger" onClick={handleDelete}>✕</button>
                </div>
            )}
        </li>
    );
};

export default TaskItem;
