import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Layout from './components/Layout';
import PurchaseList from './pages/PurchaseList';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel'; // New admin-only page
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const storedRole = localStorage.getItem('userRole');
    
    if (userToken && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  // Function to handle login
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Protected route component with role check
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    // If a specific role is required and user doesn't have it
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#e53935',
      },
      secondary: {
        main: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="billing" element={<Billing />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase" element={<PurchaseList />} />
            
            {/* Admin-only route */}
            <Route path="admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;