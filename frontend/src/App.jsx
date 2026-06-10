import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SupportForm from './pages/SupportForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [admin, setAdmin] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('adminEmail');
    const storedName = localStorage.getItem('adminName');
    if (storedToken && storedEmail) {
      return { token: storedToken, email: storedEmail, name: storedName };
    }
    return null;
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (token, adminData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('adminEmail', adminData.email);
    localStorage.setItem('adminName', adminData.name || '');
    setAdmin({ token, email: adminData.email, name: adminData.name });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    setAdmin(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          admin={admin}
          logout={handleLogout}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SupportForm />} />
            <Route
              path="/login"
              element={<Login admin={admin} onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/dashboard"
              element={
                admin ? (
                  <Dashboard admin={admin} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
