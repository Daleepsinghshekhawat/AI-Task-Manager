import React, { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import * as api from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationError, setOperationError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("API Error:", err);
      const errorMsg =
        err.response?.data?.error ||
        "Failed to load tasks. Please ensure the backend server is running on port 5000.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Clear operation error after 5 seconds
  useEffect(() => {
    if (operationError) {
      const timer = setTimeout(() => setOperationError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [operationError]);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskAdded = async (newTaskData) => {
    try {
      setOperationError(null);
      await api.createTask(newTaskData);
      loadTasks(); // Refresh list after creation
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add task";
      setOperationError(errorMsg);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      setOperationError(null);
      // Optimistic upate could go here, but doing re-fetch for simplicity and consistency
      await api.updateTask(id, { completed });
      loadTasks();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update task";
      setOperationError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      setOperationError(null);
      if (window.confirm("Are you sure you want to delete this task?")) {
        await api.deleteTask(id);
        loadTasks();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete task";
      setOperationError(errorMsg);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Smart Task Manager</h1>
        <p>
          Organize intelligently with automated time and priority suggestions.
        </p>
      </header>

      <main className="main-content">
        <div className="form-section">
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>

        <div className="list-section">
          {error && (
            <div
              className="glass-panel"
              style={{
                color: "var(--danger)",
                marginBottom: "1rem",
                borderLeft: "4px solid var(--danger)",
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {operationError && (
            <div
              className="glass-panel"
              style={{
                color: "var(--danger)",
                marginBottom: "1rem",
                borderLeft: "4px solid var(--danger)",
              }}
            >
              <strong>Operation Failed:</strong> {operationError}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="filter-tabs" role="tablist" aria-label="Task filter">
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                role="tab"
                aria-selected={activeFilter === tab}
                className={`filter-tab ${activeFilter === tab ? 'active' : ''} filter-tab-${tab}`}
                onClick={() => setActiveFilter(tab)}
              >
                <span className="tab-label">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
                <span className="tab-count">{counts[tab]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-panel empty-state">
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "3px solid var(--primary)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p>Loading tasks...</p>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
