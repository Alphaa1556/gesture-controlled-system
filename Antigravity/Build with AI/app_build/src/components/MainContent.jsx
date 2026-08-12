import { useState } from 'react';
import { Plus, Menu, LayoutDashboard } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import TaskItem from './TaskItem';
import './MainContent.css';
import { format, isToday } from 'date-fns';

export default function MainContent({ onOpenModal, isSidebarOpen, toggleSidebar }) {
  const { tasks, activeProject, projects, searchQuery } = useTodo();

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by project/category
    if (activeProject === 'today') {
      filtered = filtered.filter(t => {
        if (!t.startDate && !t.endDate) return false;
        const now = new Date();
        now.setHours(0,0,0,0);
        
        const start = t.startDate ? new Date(t.startDate) : null;
        if (start) start.setHours(0,0,0,0);
        
        const end = t.endDate ? new Date(t.endDate) : null;
        if (end) end.setHours(0,0,0,0);
        
        if (start && end) {
          return now >= start && now <= end;
        } else if (start) {
          return now.getTime() === start.getTime();
        } else if (end) {
          return now.getTime() === end.getTime();
        }
        return false;
      });
    } else if (activeProject === 'important') {
      filtered = filtered.filter(t => t.priority === 'high' || t.priority === 'urgent');
    } else if (activeProject !== 'all') {
      filtered = filtered.filter(t => t.projectId === activeProject);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(t => t.completed);
  const activeTasks = filteredTasks.filter(t => !t.completed);

  const getProjectName = () => {
    if (activeProject === 'all') return 'All Tasks';
    if (activeProject === 'today') return 'Today';
    if (activeProject === 'important') return 'Important';
    const proj = projects.find(p => p.id === activeProject);
    return proj ? proj.name : 'Tasks';
  };

  return (
    <main className="main-content">
      <header className="main-header glass-panel">
        <div className="header-left">
          {!isSidebarOpen && (
            <button className="btn-icon" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
          )}
          <h1 className="project-title">{getProjectName()}</h1>
          <span className="task-count">{activeTasks.length} tasks</span>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={onOpenModal}>
            <Plus size={18} /> Add Task
          </button>
        </div>
      </header>

      <div className="content-scroll">
        <div className="task-list-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <LayoutDashboard size={48} />
              <h3>No tasks found</h3>
              <p>Looks like you're all caught up!</p>
              <button className="btn-primary" onClick={onOpenModal} style={{ marginTop: '1rem' }}>
                <Plus size={18} /> Create Task
              </button>
            </div>
          ) : (
            <>
              {activeTasks.length > 0 && (
                <div className="task-group">
                  {activeTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}

              {completedTasks.length > 0 && (
                <div className="task-group completed-group">
                  <h3 className="group-title">Completed</h3>
                  {completedTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
