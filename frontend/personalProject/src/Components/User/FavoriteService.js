import React, { useState } from "react";
import "../User/UserCss/FavoriteService.css";

export default function FavoriteService() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const allServices = [
    {
      id: 1,
      name: "Hair Styling",
      price: "₹100",
      duration: "45 mins",
    },
    {
      id: 2,
      name: "Facial Treatment",
      price: "₹250",
      duration: "60 mins",
    },
    {
      id: 3,
      name: "Manicure",
      price: "₹250",
      duration: "30 mins",
    },
    {
      id: 4,
      name: "Pedicure",
      price: "₹250",
      duration: "45 mins",
    },
    {
      id: 5,
      name: "Massage",
      price: "₹1000",
      duration: "60 mins",
    },
    {
      id: 6,
      name: "Birdal MakeUp",
      price: "₹1000",
      duration: "60 mins",
    },
    {
      id: 7,
      name: "Nail Art",
      price: "₹1000",
      duration: "60 mins",
    },
  ];

  const toggleFavorite = (service) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(
        (fav) => fav.id === service.id
      );
      if (isAlreadyFavorite) {
        return prevFavorites.filter((fav) => fav.id !== service.id);
      }
      return [...prevFavorites, service];
    });
  };

  const filteredServices = allServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="favorite-services-container text-center">
      {/* Header Section */}
      <div className="services-header">
        <h2>Salon Services</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services List */}
      <div className="services-grid d-flex justify-content-around">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card text-center">
            <div className="service-image">
              <button
                className={`favorite-button ${
                  favorites.some((fav) => fav.id === service.id) ? "active" : ""
                }`}
                onClick={() => toggleFavorite(service)}
              >
                ♥
              </button>
            </div>
            <div className="service-info text-center">
              <h6>{service.name}</h6>
              <p className="price">{service.price}</p>
              <p className="duration">{service.duration}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Favorites Section */}
      <div className="favorites-section">
        <h3>Your Favorite Services</h3>
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-item">
                <div className="favorite-info">
                  <h4>{favorite.name}</h4>
                  <p>{favorite.price}</p>
                </div>
                <button
                  className="remove-favorite"
                  onClick={() => toggleFavorite(favorite)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No favorites added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
