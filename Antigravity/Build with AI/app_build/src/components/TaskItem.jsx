import { Check, Calendar as CalendarIcon, Flag, Trash2 } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { format, isPast, isToday } from 'date-fns';
import './TaskItem.css';

export default function TaskItem({ task }) {
  const { toggleTask, deleteTask, projects } = useTodo();

  const getPriorityColor = () => {
    switch(task.priority) {
      case 'urgent': return 'var(--danger-color)';
      case 'high': return 'var(--warning-color)';
      case 'low': return 'var(--text-secondary)';
      default: return 'var(--accent-color)';
    }
  };

  const formattedDate = () => {
    if (!task.startDate && !task.endDate) return null;
    let str = '';
    if (task.startDate) {
      str += format(new Date(task.startDate), 'MMM d');
    }
    if (task.endDate) {
      str += str ? ` - ${format(new Date(task.endDate), 'MMM d')}` : format(new Date(task.endDate), 'MMM d');
    }
    return str;
  };

  const dateClass = () => {
    if (!task.endDate) return '';
    const date = new Date(task.endDate);
    if (isPast(date) && !isToday(date) && !task.completed) return 'overdue';
    if (isToday(date)) return 'today';
    return '';
  };

  const projectColor = projects.find(p => p.id === task.projectId)?.color || 'var(--text-secondary)';

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button 
        className="checkbox-wrapper" 
        onClick={() => toggleTask(task.id)}
        aria-label="Toggle task"
      >
        <div className="checkbox" style={{ borderColor: task.completed ? 'var(--success-color)' : projectColor }}>
          {task.completed && <Check size={14} color="var(--success-color)" />}
        </div>
      </button>

      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && <p className="task-desc">{task.description}</p>}
        
        <div className="task-meta">
          {(task.startDate || task.endDate) && (
            <span className={`meta-item date ${dateClass()}`}>
              <CalendarIcon size={12} /> {formattedDate()}
            </span>
          )}
          {task.priority !== 'medium' && (
            <span className="meta-item priority" style={{ color: getPriorityColor() }}>
              <Flag size={12} /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="btn-icon delete-btn" onClick={() => deleteTask(task.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
