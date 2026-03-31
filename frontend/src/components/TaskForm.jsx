import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { suggestAIMetadata } from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState("");

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAISuggest = async () => {
    if (!title || !title.trim()) {
      setError("Please enter at least a title for AI suggestions.");
      return;
    }
    setError("");
    setLoadingAI(true);
    try {
      const suggestion = await suggestAIMetadata(
        title.trim(),
        description.trim(),
      );
      setPriority(suggestion.priority);
      // Append the estimated time gracefully to the description
      setDescription(
        (prev) =>
          prev +
          (prev ? "\n\n" : "") +
          `[AI Estimate: ${suggestion.estimatedCompletionTime}]`,
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch AI suggestion.";
      setError(errorMsg);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setError("");
    const newTask = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      completed: false,
    };
    onTaskAdded(newTask);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDeadline("");
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: "1.25rem", fontSize: "1.2rem", fontWeight: 600 }}>
        Create New Task
      </h2>
      <form onSubmit={handleSubmit} className="task-form">

        {/* Row 1: Title + Description side-by-side */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label>Description</label>
            <textarea
              className="form-control"
              rows="1"
              placeholder="Add some details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>
        </div>

        {/* Row 2: Priority + Deadline + AI button + Submit */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "120px" }}>
            <label>Priority</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "140px" }}>
            <label>Deadline (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="ai-btn"
            onClick={handleAISuggest}
            disabled={loadingAI || !title}
            style={{ marginBottom: "0", height: "42px", whiteSpace: "nowrap" }}
          >
            {loadingAI ? (
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Sparkles size={16} />
            )}
            {loadingAI ? "Analyzing..." : "AI Suggest"}
          </button>


          // Submit button is always enabled, but will show error if title is empty
          <button
            type="submit"
            className="submit-btn"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: 0,
              height: "42px",
              minWidth: "120px",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {error && <div className="error-text">{error}</div>}
      </form>
    </div>
  );
};

export default TaskForm;
