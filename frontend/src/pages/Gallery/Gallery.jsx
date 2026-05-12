import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/gallery");
      setImages(response.data);

      // Extract unique categories
      const uniqueCategories = [
        "All",
        ...new Set(response.data.map((img) => img.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);

      // Initialize with all images
      setFilteredImages(response.data);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === category));
    }
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="loading-spinner">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="error-message">
          <i className="bi bi-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchGalleryImages} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <div className="gallery-header container">
        <h2 className="section-title gallery-page-title mb-3">Our Gallery</h2>
        <p className="gallery-page-subtitle mb-0">
          Explore our amazing collection of event moments
        </p>
      </div>

      {/* Gallery Container */}
      <div className="gallery-container">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filter">
            <h3 className="filter-title">Filter by Category</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Images Grid */}
        {filteredImages.length > 0 ? (
          <div className="gallery-grid">
            {filteredImages.map((image, index) => (
              <div
                key={image.id || index}
                className="gallery-item"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery Image"}
                  className="gallery-img"
                />
                <div className="gallery-overlay">
                  <h4 className="gallery-title">{image.title}</h4>
                  {image.category && (
                    <span className="gallery-category">{image.category}</span>
                  )}
                  <button className="view-btn">
                    <i className="bi bi-eye-fill"></i> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-images">
            <i className="bi bi-image"></i>
            <p>No images found in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h2>{selectedImage.title}</h2>
              {selectedImage.category && (
                <p className="lightbox-category">
                  Category: <strong>{selectedImage.category}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
