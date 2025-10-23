// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProtectedRoute from './pages/ProtectedRoute';
import ProtectedLayout from './pages/ProtectedLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CreateProject />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      
      </Routes>
    </Router>
  );
}

export default App;
