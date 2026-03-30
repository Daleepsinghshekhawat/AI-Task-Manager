import React from 'react';
import TaskItem from './TaskItem';
import { ListTodo } from 'lucide-react';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <ListTodo size={48} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <h3>No tasks yet</h3>
        <p>Add a task using the form to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
