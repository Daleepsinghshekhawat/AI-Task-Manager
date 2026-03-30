import React from 'react';
import { Trash2, AlertCircle, Clock } from 'lucide-react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const { id, title, description, priority, deadline, completed } = task;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className={`glass-panel task-item ${completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="title-group">
          <input 
            type="checkbox" 
            className="checkbox" 
            checked={completed}
            onChange={() => onToggleComplete(id, !completed)}
          />
          <div>
            <div className="task-title">{title}</div>
            {description && <div className="task-description">{description}</div>}
          </div>
        </div>
        <div className="actions">
          <button className="icon-btn delete" onClick={() => onDelete(id)} aria-label="Delete task">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="task-meta">
        <span className={`badge badge-priority-${priority}`}>
          <AlertCircle size={14} /> {priority}
        </span>
        {deadline && (
          <span className="badge badge-time">
            <Clock size={14} /> Due {formatDate(deadline)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
