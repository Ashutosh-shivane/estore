import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await adminAPI.getUserDetails(id);
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center' }}>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/admin/users')} className="btn btn-outline">
        ← Back to Users
      </button>

      <div className="card" style={{ marginTop: '20px' }}>
        <h1>User Details</h1>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user.name}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{user.address || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>

          {user.role === 'store_owner' && user.rating !== null && (
            <div className="detail-item">
              <span className="detail-label">Store Rating:</span>
              <span className="detail-value">
                {parseFloat(user.rating).toFixed(2)} ⭐
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;