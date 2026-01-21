import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../services/api';
import './StoreOwner.css';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await storeOwnerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Store Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <h3>{dashboardData?.averageRating || '0.00'}</h3>
          <p>Average Rating ⭐</p>
        </div>
        
        <div className="card stat-card">
          <h3>{dashboardData?.totalRatings || 0}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      <div className="card">
        <h2>Customer Ratings</h2>
        
        {dashboardData?.ratings?.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
            No ratings yet
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.ratings?.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.user_name}</td>
                    <td>{rating.user_email}</td>
                    <td>
                      <span className="rating-badge">
                        {rating.rating} ⭐
                      </span>
                    </td>
                    <td>{new Date(rating.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;