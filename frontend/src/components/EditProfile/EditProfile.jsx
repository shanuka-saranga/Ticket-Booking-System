import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";

// Image compression utility
const compressImage = (
  base64String,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.7,
) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };
  });
};

const EditProfile = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (isOpen) {
      const userString = localStorage.getItem("user");
      console.log("Raw user string from storage:", userString); // මෙය පරීක්ෂා කිරීමටයි

      const user = JSON.parse(userString || "{}");
      setUserData(user);

      // ID එක ඇත්තටම තියෙනවද කියලා console එකේ බලන්න
      console.log("Parsed User ID:", user.id);

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size must be less than 5MB");
        setMessageType("error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        // Compress the image before storing
        try {
          const compressedImage = await compressImage(reader.result);
          setProfileImage(file);
          setImagePreview(compressedImage);
        } catch (err) {
          console.error("Error compressing image:", err);
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // Retrieve userId with proper fallback
      let userId = userData?.id;

      // Fallback: if userData doesn't have id, parse from localStorage again
      if (!userId) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        userId = storedUser?.id;
      }

      if (!userId) {
        setMessage("User ID not found. Please log in again.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // ... ඉතිරි Axios call එක ...
      const updateData = { ...formData };

      // Only include profileImage if it was changed
      if (profileImage) {
        // New image was uploaded - use compressed version
        updateData.profileImage = imagePreview;
      } else if (imagePreview && imagePreview !== userData?.profileImage) {
        // Image preview was modified but no file selected - still send compressed version
        updateData.profileImage = imagePreview;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update localStorage with new user data - include profileImage
      const updatedUser = {
        ...userData,
        ...formData,
        profileImage: updateData.profileImage || imagePreview,
        id: userId, // Ensure id is set
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Dispatch custom event to notify Navbar to refresh
      window.dispatchEvent(new Event("userProfileUpdated"));

      setMessage("Profile updated successfully!");
      setMessageType("success");

      setTimeout(() => {
        setProfileImage(null); // Reset file input
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Failed to update profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const userInitial = formData.name
    ? formData.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-custom">
          <h3 className="modal-title-custom">Edit Profile</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-custom">
          {message && (
            <div className={`alert-message ${messageType}`}>
              <i
                className={`bi ${messageType === "success" ? "bi-check-circle" : "bi-exclamation-circle"}`}
              ></i>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-picture-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="profile-picture"
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <span>{userInitial}</span>
                  </div>
                )}
                <label
                  className="picture-upload-btn"
                  htmlFor="profileImageInput"
                >
                  <i className="bi bi-camera-fill"></i>
                </label>
              </div>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="d-none"
              />
              <p className="picture-hint">Click camera icon to upload photo</p>
            </div>

            {/* Form Fields */}
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control-custom"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control-custom"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control-custom"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
