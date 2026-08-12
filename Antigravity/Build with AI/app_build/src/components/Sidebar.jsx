import { Plus, Search, Home, Calendar, Star, FolderOpen, Menu } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { projects, activeProject, setActiveProject, searchQuery, setSearchQuery } = useTodo();

  if (!isOpen) return null;

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="avatar">A</div>
          <span className="username">Antigravity</span>
        </div>
        <button className="btn-icon" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <nav className="nav-menu">
        <h3 className="nav-title">Filters</h3>
        <button 
          className={`nav-item ${activeProject === 'all' ? 'active' : ''}`}
          onClick={() => setActiveProject('all')}
        >
          <Home size={18} /> All Tasks
        </button>
        <button 
          className={`nav-item ${activeProject === 'today' ? 'active' : ''}`}
          onClick={() => setActiveProject('today')}
        >
          <Calendar size={18} /> Today
        </button>
        <button 
          className={`nav-item ${activeProject === 'important' ? 'active' : ''}`}
          onClick={() => setActiveProject('important')}
        >
          <Star size={18} /> Important
        </button>
      </nav>

      <nav className="nav-menu projects-menu">
        <h3 className="nav-title">Projects</h3>
        {projects.map(project => (
          <button 
            key={project.id}
            className={`nav-item ${activeProject === project.id ? 'active' : ''}`}
            onClick={() => setActiveProject(project.id)}
          >
            <span className="project-color" style={{ backgroundColor: project.color }}></span>
            {project.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
