import React, { useState } from 'react';
import { userAPI } from '../services/api';

const RatingModal = ({ store, onClose, onSubmit }) => {
  const [rating, setRating] = useState(store.user_rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userAPI.submitRating({ storeId: store.id, rating });
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your rating?')) {
      return;
    }

    setLoading(true);
    try {
      await userAPI.deleteRating(store.id);
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rate {store.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
            {rating > 0 ? `You selected ${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || rating === 0}
            style={{ flex: 1 }}
          >
            {loading ? 'Submitting...' : store.user_rating ? 'Update Rating' : 'Submit Rating'}
          </button>
          
          {store.user_rating && (
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={loading}
            >
              Delete
            </button>
          )}
          
          <button onClick={onClose} className="btn btn-outline" disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;