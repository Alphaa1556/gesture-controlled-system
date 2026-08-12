import { useState } from 'react';
import { X, Calendar as CalendarIcon, Tag, Flag } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import './TaskModal.css';

export default function TaskModal({ onClose }) {
  const { addTask, projects } = useTodo();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'inbox');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      startDate,
      endDate,
      priority,
      projectId
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Create New Task</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title (e.g. Finish quarterly report)"
              className="task-input title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description (optional)"
              className="task-input desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions-grid">
            <div className="action-item">
              <CalendarIcon size={16} className="action-icon" />
              <label style={{display: 'none'}}>Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title="Start Date"
              />
            </div>
            
            <div className="action-item">
              <CalendarIcon size={16} className="action-icon" />
              <label style={{display: 'none'}}>End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                title="End Date"
              />
            </div>

            <div className="action-item">
              <Flag size={16} className="action-icon" />
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="action-item">
              <Tag size={16} className="action-icon" />
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
