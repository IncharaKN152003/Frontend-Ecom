// Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaCamera
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: ""
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    setLoading(true);
    try {
      // Get logged in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      
      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      // Get user details from registered users
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userDetails = users.find(u => u.email === loggedInUser.email) || loggedInUser;

      setUser(userDetails);
      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        address: userDetails.address || "",
        city: userDetails.city || "",
        state: userDetails.state || "",
        zipCode: userDetails.zipCode || "",
        bio: userDetails.bio || "Luxury fashion enthusiast"
      });
    } catch (error) {
      console.error("Error loading user:", error);
      setMessage({ type: "error", text: "Error loading profile" });
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setSaveLoading(true);
    
    try {
      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...formData };
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Update logged in user
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Error saving profile" });
    }
    
    setSaveLoading(false);
  };

  const handleCancelEdit = () => {
    // Reset form to original user data
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      bio: user.bio || "Luxury fashion enthusiast"
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loaderStyle}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      
      {/* Header */}
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 style={titleStyle}>My Profile</h1>
        <div style={headerRightStyle}>
          {!isEditing ? (
            <button style={editButtonStyle} onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div style={editActionsStyle}>
              <button 
                style={cancelButtonStyle} 
                onClick={handleCancelEdit}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                style={saveButtonStyle} 
                onClick={handleSaveProfile}
                disabled={saveLoading}
              >
                <FaSave /> {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...messageStyle,
          backgroundColor: message.type === "success" ? "rgba(40, 167, 69, 0.1)" : "rgba(220, 53, 69, 0.1)",
          color: message.type === "success" ? "#28a745" : "#dc3545",
          border: message.type === "success" ? "1px solid #28a745" : "1px solid #dc3545"
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Content */}
      <div style={profileContainerStyle}>
        
        {/* Left Column - Avatar */}
        <div style={avatarSectionStyle}>
          <div style={avatarContainerStyle}>
            <FaUser style={avatarIconStyle} />
            <div style={avatarOverlayStyle}>
              <FaCamera style={cameraIconStyle} />
            </div>
          </div>
          <h2 style={userNameStyle}>{formData.name}</h2>
          <p style={userEmailStyle}>{formData.email}</p>
          <div style={memberSinceStyle}>
            Member since {new Date().getFullYear()}
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div style={detailsSectionStyle}>
          
          {/* Bio */}
          <div style={bioSectionStyle}>
            <label style={labelStyle}>Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                style={textareaStyle}
                rows="3"
              />
            ) : (
              <p style={bioTextStyle}>{formData.bio}</p>
            )}
          </div>

          {/* Personal Information */}
          <h3 style={subsectionTitleStyle}>Personal Information</h3>
          
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FaUser style={inputIconStyle} /> Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              ) : (
                <p style={infoTextStyle}>{formData.name}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FaEnvelope style={inputIconStyle} /> Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              ) : (
                <p style={infoTextStyle}>{formData.email}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FaPhone style={inputIconStyle} /> Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter phone number"
                />
              ) : (
                <p style={infoTextStyle}>{formData.phone || "Not provided"}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <h3 style={subsectionTitleStyle}>Address Information</h3>
          
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FaMapMarkerAlt style={inputIconStyle} /> Street Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter street address"
                />
              ) : (
                <p style={infoTextStyle}>{formData.address || "Not provided"}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter city"
                />
              ) : (
                <p style={infoTextStyle}>{formData.city || "Not provided"}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter state"
                />
              ) : (
                <p style={infoTextStyle}>{formData.state || "Not provided"}</p>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter ZIP code"
                />
              ) : (
                <p style={infoTextStyle}>{formData.zipCode || "Not provided"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  padding: "40px 80px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const backButtonStyle = {
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #C4A962",
  borderRadius: "8px",
  color: "#C4A962",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  transition: "all 0.3s ease"
};

const titleStyle = {
  fontSize: "32px",
  color: "#333",
  margin: 0
};

const headerRightStyle = {};

const editButtonStyle = {
  padding: "10px 20px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s ease"
};

const editActionsStyle = {
  display: "flex",
  gap: "10px"
};

const cancelButtonStyle = {
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #dc3545",
  borderRadius: "8px",
  color: "#dc3545",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  transition: "all 0.3s ease"
};

const saveButtonStyle = {
  padding: "10px 20px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s ease"
};

const loadingStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: "20px"
};

const loaderStyle = {
  width: "50px",
  height: "50px",
  border: "3px solid #f3f3f3",
  borderTop: "3px solid #C4A962",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const messageStyle = {
  padding: "12px 20px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontWeight: "500"
};

const profileContainerStyle = {
  display: "grid",
  gridTemplateColumns: "300px 1fr",
  gap: "30px",
  background: "#fff",
  borderRadius: "15px",
  padding: "30px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
};

const avatarSectionStyle = {
  textAlign: "center",
  padding: "20px",
  background: "#f8f9fa",
  borderRadius: "10px"
};

const avatarContainerStyle = {
  position: "relative",
  width: "150px",
  height: "150px",
  margin: "0 auto 20px",
  borderRadius: "50%",
  backgroundColor: "#e0e0e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden"
};

const avatarIconStyle = {
  fontSize: "60px",
  color: "#C4A962"
};

const avatarOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease"
};

const cameraIconStyle = {
  color: "white",
  fontSize: "24px"
};

const userNameStyle = {
  fontSize: "20px",
  color: "#333",
  marginBottom: "5px",
  fontWeight: "600"
};

const userEmailStyle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "10px"
};

const memberSinceStyle = {
  fontSize: "12px",
  color: "#C4A962",
  padding: "5px 10px",
  background: "#fff",
  borderRadius: "20px",
  display: "inline-block"
};

const detailsSectionStyle = {
  padding: "20px"
};

const bioSectionStyle = {
  marginBottom: "30px"
};

const bioTextStyle = {
  fontSize: "14px",
  color: "#666",
  lineHeight: "1.6",
  marginTop: "5px"
};

const subsectionTitleStyle = {
  fontSize: "18px",
  color: "#333",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #e0e0e0"
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px",
  marginBottom: "30px"
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const inputIconStyle = {
  color: "#C4A962",
  fontSize: "14px"
};

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s ease"
};

const textareaStyle = {
  padding: "10px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s ease",
  resize: "vertical",
  fontFamily: "'Inter', sans-serif"
};

const infoTextStyle = {
  fontSize: "14px",
  color: "#333",
  padding: "10px 0"
};

// Hover effects
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  ${backButtonStyle}:hover {
    background: #C4A962;
    color: white;
  }
  
  ${editButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
  }
  
  ${cancelButtonStyle}:hover {
    background: #dc3545;
    color: white;
  }
  
  ${saveButtonStyle}:hover {
    background: #218838;
    transform: translateY(-2px);
  }
  
  ${avatarContainerStyle}:hover ${avatarOverlayStyle} {
    opacity: 1;
  }
  
  ${inputStyle}:focus, ${textareaStyle}:focus {
    border-color: #C4A962;
  }
`;

export default Profile;