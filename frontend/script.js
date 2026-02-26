/* ══════════════════════════════════════════════════════════
   TaskFlow – Frontend Script
   Codveda Full Stack Internship | Level 1 Task 3
   Communicates with the REST API on http://localhost:5000
   ══════════════════════════════════════════════════════════ */

const API = "http://localhost:5000/tasks";

let allTasks = [];          // cache from server
let editingId = null;        // track which task is being edited
let activeFilter = "all";      // 'all' | 'pending' | 'completed'

// ─── Initialise ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();
  // Close modal on backdrop click
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  // Keyboard shortcut: Escape closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

// ─── Feedback helpers ─────────────────────────────────────────
function showFeedback(msg, type = "loading") {
  const bar = document.getElementById("feedbackBar");
  bar.textContent = msg;
  bar.className = "feedback-bar " + type;
}

function setNavStatus(text) {
  document.getElementById("navStatus").textContent = text;
}

// ─── Update stats ─────────────────────────────────────────────
function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  document.getElementById("statTotal").textContent = total;
  document.getElementById("statPending").textContent = pending;
  document.getElementById("statDone").textContent = completed;
}

// ─── Render task list ─────────────────────────────────────────
function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  const empty = document.getElementById("emptyState");
  list.innerHTML = "";

  // Apply filter
  const filtered = tasks.filter(t => {
    if (activeFilter === "pending") return !t.completed;
    if (activeFilter === "completed") return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    empty.hidden = false;
  } else {
    empty.hidden = true;
    filtered.forEach(task => list.appendChild(createTaskItem(task)));
  }

  updateStats(tasks);
}

// ─── Build a single task <li> ─────────────────────────────────
function createTaskItem(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  // Format date nicely
  const date = new Date(task.created_at);
  const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  li.innerHTML = `
    <div class="task-check ${task.completed ? "done" : ""}"
         onclick="toggleComplete(${task.id}, ${task.completed})"
         title="${task.completed ? "Mark as pending" : "Mark as complete"}"
         role="button" tabindex="0" aria-label="Toggle completion">
    </div>
    <span class="task-title">${escapeHtml(task.title)}</span>
    <span class="task-meta">${dateStr}</span>
    <div class="task-actions">
      <button class="btn-icon complete"
              onclick="toggleComplete(${task.id}, ${task.completed})"
              title="${task.completed ? "Undo" : "Complete"}"
              aria-label="Toggle task completion">
        ${task.completed ? "↩" : "✓"}
      </button>
      <button class="btn-icon"
              onclick="openEditModal(${task.id})"
              title="Edit task"
              aria-label="Edit task">✎</button>
      <button class="btn-icon danger"
              onclick="deleteTask(${task.id})"
              title="Delete task"
              aria-label="Delete task">✕</button>
    </div>
  `;
  return li;
}

// Prevent XSS when rendering task titles
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── FETCH all tasks (GET) ────────────────────────────────────
async function fetchTasks() {
  showFeedback("Loading tasks…", "loading");
  setNavStatus("Syncing…");
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allTasks = await res.json();
    renderTasks(allTasks);
    showFeedback("");
    setNavStatus("Ready");
  } catch (err) {
    showFeedback("⚠ Could not load tasks. Is the server running?", "error");
    setNavStatus("Offline");
    console.error("fetchTasks error:", err);
  }
}

// ─── ADD task (POST) ──────────────────────────────────────────
async function handleAddTask(event) {
  event.preventDefault();
  const input = document.getElementById("taskInput");
  const title = input.value.trim();

  if (!title) {
    showFeedback("Task title cannot be empty.", "error");
    return;
  }

  const btn = document.getElementById("addBtn");
  btn.disabled = true;
  btn.innerHTML = "<span>Adding…</span>";

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add task");

    allTasks.unshift(data);           // prepend to local cache
    renderTasks(allTasks);
    input.value = "";
    showFeedback("✓ Task added successfully!", "success");
    setTimeout(() => showFeedback(""), 2500);
  } catch (err) {
    showFeedback("⚠ " + err.message, "error");
    console.error("addTask error:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "<span>+ Add Task</span>";
  }
}

// ─── TOGGLE completion (PUT) ───────────────────────────────────
async function toggleComplete(id, currentStatus) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");

    // Update local cache
    const idx = allTasks.findIndex(t => t.id === id);
    if (idx !== -1) allTasks[idx] = data;
    renderTasks(allTasks);
  } catch (err) {
    showFeedback("⚠ " + err.message, "error");
    console.error("toggleComplete error:", err);
  }
}

// ─── OPEN edit modal ──────────────────────────────────────────
function openEditModal(id) {
  editingId = id;
  const task = allTasks.find(t => t.id === id);
  if (!task) return;
  document.getElementById("editInput").value = task.title;
  document.getElementById("modalOverlay").hidden = false;
  setTimeout(() => document.getElementById("editInput").focus(), 50);
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
  editingId = null;
}

// ─── SAVE edit (PUT) ──────────────────────────────────────────
async function saveEdit() {
  const newTitle = document.getElementById("editInput").value.trim();
  if (!newTitle) {
    showFeedback("Title cannot be empty.", "error");
    return;
  }
  try {
    const res = await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");

    const idx = allTasks.findIndex(t => t.id === editingId);
    if (idx !== -1) allTasks[idx] = data;
    renderTasks(allTasks);
    closeModal();
    showFeedback("✓ Task updated!", "success");
    setTimeout(() => showFeedback(""), 2000);
  } catch (err) {
    showFeedback("⚠ " + err.message, "error");
    console.error("saveEdit error:", err);
  }
}

// ─── DELETE task (DELETE) ─────────────────────────────────────
async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Delete failed");

    allTasks = allTasks.filter(t => t.id !== id);
    renderTasks(allTasks);
    showFeedback("✓ Task deleted.", "success");
    setTimeout(() => showFeedback(""), 2000);
  } catch (err) {
    showFeedback("⚠ " + err.message, "error");
    console.error("deleteTask error:", err);
  }
}

// ─── Filter ───────────────────────────────────────────────────
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  const target = { all: "filterAll", pending: "filterPending", completed: "filterCompleted" };
  document.getElementById(target[filter]).classList.add("active");
  renderTasks(allTasks);
}