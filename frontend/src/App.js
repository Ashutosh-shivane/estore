import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import StoresList from './pages/admin/StoresList';
import CreateStore from './pages/admin/CreateStore';
import UsersList from './pages/admin/UsersList';
import CreateUser from './pages/admin/CreateUser';
import UserDetails from './pages/admin/UserDetails';
import UserStoresList from './pages/user/StoresList';
import StoreOwnerDashboard from './pages/storeOwner/Dashboard';

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'store_owner':
      return <Navigate to="/store-owner/dashboard" replace />;
    default:
      return <Navigate to="/stores" replace />;
  }
};

const Unauthorized = () => (
  <div className="container">
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Access Denied</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StoresList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateStore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserStoresList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/store-owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;