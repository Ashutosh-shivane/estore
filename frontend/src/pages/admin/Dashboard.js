import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="card stat-card">
          <h3>{stats?.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
        
        <div className="card stat-card">
          <h3>{stats?.totalStores || 0}</h3>
          <p>Total Stores</p>
        </div>
        
        <div className="card stat-card">
          <h3>{stats?.totalRatings || 0}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/stores" className="btn btn-primary">
            Manage Stores
          </Link>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/admin/stores/create" className="btn btn-success">
            Add Store
          </Link>
          <Link to="/admin/users/create" className="btn btn-success">
            Add User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;