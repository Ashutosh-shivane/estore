import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Store name must be between 20 and 60 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    if (formData.ownerName || formData.ownerEmail || formData.ownerPassword) {
      if (formData.ownerName && (formData.ownerName.length < 20 || formData.ownerName.length > 60)) {
        newErrors.ownerName = 'Owner name must be between 20 and 60 characters';
      }

      if (formData.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
        newErrors.ownerEmail = 'Please enter a valid owner email';
      }

      if (formData.ownerPassword) {
        if (formData.ownerPassword.length < 8 || formData.ownerPassword.length > 16) {
          newErrors.ownerPassword = 'Password must be between 8 and 16 characters';
        } else if (!/[A-Z]/.test(formData.ownerPassword)) {
          newErrors.ownerPassword = 'Password must contain at least one uppercase letter';
        } else if (!/[!@#$%^&*]/.test(formData.ownerPassword)) {
          newErrors.ownerPassword = 'Password must contain at least one special character';
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await adminAPI.createStore(formData);
      navigate('/admin/stores');
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Failed to create store' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Store</h1>

      <div className="card">
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          <h3>Store Information</h3>
          
          <div className="input-group">
            <label>Store Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="input-group">
            <label>Store Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="input-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>

          <h3>Store Owner (Optional)</h3>
          
          <div className="input-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
            {errors.ownerName && <div className="error">{errors.ownerName}</div>}
          </div>

          <div className="input-group">
            <label>Owner Email</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
            />
            {errors.ownerEmail && <div className="error">{errors.ownerEmail}</div>}
          </div>

          <div className="input-group">
            <label>Owner Password</label>
            <input
              type="password"
              name="ownerPassword"
              value={formData.ownerPassword}
              onChange={handleChange}
            />
            {errors.ownerPassword && <div className="error">{errors.ownerPassword}</div>}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Store'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;