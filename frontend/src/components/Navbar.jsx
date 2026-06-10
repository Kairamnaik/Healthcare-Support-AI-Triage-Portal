import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = ({ theme, toggleTheme, admin, logout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar animate-fade-in">
      <Link to="/" className="navbar-brand">
        <Activity size={24} />
        <span>CareFlow</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/submit" className={`navbar-link ${isActive('/submit')}`}>
          Request Support
        </Link>
        
        {admin ? (
          <>
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')} style-dashboard-link`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </span>
            </Link>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.35rem 0.75rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {admin.email.substring(0, 1).toUpperCase()}
              </div>
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                textTransform: 'capitalize',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {admin.name || admin.email.split('@')[0]}
              </span>
            </div>
            <button onClick={logout} className="btn-icon-only" title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link to="/login" className={`navbar-link ${isActive('/login')}`}>
            Admin Login
          </Link>
        )}

        <button onClick={toggleTheme} className="btn-icon-only" title="Toggle Theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
