import { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('complex-todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('complex-todo-projects');
    return saved ? JSON.parse(saved) : [
      { id: 'inbox', name: 'Inbox', color: '#6366f1' },
      { id: 'work', name: 'Work', color: '#10b981' },
      { id: 'personal', name: 'Personal', color: '#f59e0b' }
    ];
  });

  const [activeProject, setActiveProject] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('complex-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('complex-todo-projects', JSON.stringify(projects));
  }, [projects]);

  const addTask = (task) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description || '',
      projectId: task.projectId || 'inbox',
      completed: false,
      createdAt: new Date().toISOString(),
      startDate: task.startDate || null,
      endDate: task.endDate || null,
      priority: task.priority || 'medium', // low, medium, high
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TodoContext.Provider value={{
      tasks,
      projects,
      activeProject,
      setActiveProject,
      searchQuery,
      setSearchQuery,
      addTask,
      toggleTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}
