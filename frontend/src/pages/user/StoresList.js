import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import RatingModal from '../../components/RatingModal';
import './User.css';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await userAPI.getStores({
        name: searchName,
        address: searchAddress
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadStores();
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    setShowRatingModal(false);
    setSelectedStore(null);
    await loadStores();
  };

  return (
    <div className="container">
      <h1>Available Stores</h1>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by store name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : (
        <div className="stores-grid">
          {stores.length === 0 ? (
            <div className="card">
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No stores found
              </p>
            </div>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="card store-card">
                <h3>{store.name}</h3>
                <p className="store-address">📍 {store.address}</p>
                
                <div className="store-rating">
                  <div>
                    <span className="rating-label">Overall Rating:</span>
                    <span className="rating-value">
                      {parseFloat(store.overall_rating).toFixed(1)} ⭐
                    </span>
                  </div>
                  
                  {store.user_rating && (
                    <div>
                      <span className="rating-label">Your Rating:</span>
                      <span className="rating-value">
                        {store.user_rating} ⭐
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRateStore(store)}
                  className={`btn ${store.user_rating ? 'btn-secondary' : 'btn-primary'} btn-block`}
                >
                  {store.user_rating ? 'Update Rating' : 'Rate Store'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {showRatingModal && (
        <RatingModal
          store={selectedStore}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedStore(null);
          }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default StoresList;