import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#0B1120]/60 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black font-display text-white tracking-tight hover:opacity-80 transition-opacity">
              Judge<span className="text-red-500">Me</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Simulate
            </Link>
            <Link 
              to="/history" 
              className={`text-sm font-semibold transition-colors ${location.pathname === '/history' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Past cases
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
