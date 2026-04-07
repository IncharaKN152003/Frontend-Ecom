// Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBell, 
  FaLock, 
  FaPalette,
  FaGlobe,
  FaCreditCard,
  FaEnvelope,
  FaArrowLeft,
  FaSave,
  FaTimes
} from "react-icons/fa";

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Settings state
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    promotions: false,
    
    // Privacy Settings
    showProfile: true,
    showEmail: false,
    showOrders: true,
    
    // Appearance
    theme: "light",
    language: "en",
    currency: "INR",
    
    // Payment Settings
    defaultPayment: "card",
    saveCards: true
  });

  // Load settings from localStorage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setLoading(false);
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default?")) {
      const defaultSettings = {
        emailNotifications: true,
        pushNotifications: false,
        orderUpdates: true,
        promotions: false,
        showProfile: true,
        showEmail: false,
        showOrders: true,
        theme: "light",
        language: "en",
        currency: "INR",
        defaultPayment: "card",
        saveCards: true
      };
      setSettings(defaultSettings);
    }
  };

  return (
    <div style={pageStyle}>
      
      {/* Header */}
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 style={titleStyle}>Settings</h1>
        <div style={headerRightStyle}>
          <button style={resetButtonStyle} onClick={handleReset}>
            <FaTimes /> Reset
          </button>
          <button 
            style={saveButtonStyle} 
            onClick={handleSave}
            disabled={loading}
          >
            <FaSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
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

      {/* Settings Sections */}
      <div style={settingsContainerStyle}>
        
        {/* Notification Settings */}
        <div style={settingsSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaBell style={sectionIconStyle} /> Notifications
          </h2>
          
          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Email Notifications</span>
              <span style={settingDescStyle}>Receive updates via email</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Push Notifications</span>
              <span style={settingDescStyle}>Receive push notifications</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Order Updates</span>
              <span style={settingDescStyle}>Get notified about order status</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={() => handleToggle('orderUpdates')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Promotions</span>
              <span style={settingDescStyle}>Receive promotional offers</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.promotions}
                onChange={() => handleToggle('promotions')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div style={settingsSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaLock style={sectionIconStyle} /> Privacy
          </h2>
          
          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Show Profile</span>
              <span style={settingDescStyle}>Make profile visible to others</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.showProfile}
                onChange={() => handleToggle('showProfile')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Show Email</span>
              <span style={settingDescStyle}>Display email on profile</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={() => handleToggle('showEmail')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Show Orders</span>
              <span style={settingDescStyle}>Make orders public</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.showOrders}
                onChange={() => handleToggle('showOrders')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
          </div>
        </div>

        {/* Appearance Settings */}
        <div style={settingsSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaPalette style={sectionIconStyle} /> Appearance
          </h2>
          
          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Theme</span>
              <span style={settingDescStyle}>Choose your preferred theme</span>
            </div>
            <select 
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              style={selectStyle}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>
                <FaGlobe style={{ marginRight: "5px" }} /> Language
              </span>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              style={selectStyle}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Currency</span>
            </div>
            <select 
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              style={selectStyle}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
        </div>

        {/* Payment Settings */}
        <div style={settingsSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaCreditCard style={sectionIconStyle} /> Payment
          </h2>
          
          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Default Payment Method</span>
            </div>
            <select 
              value={settings.defaultPayment}
              onChange={(e) => handleChange('defaultPayment', e.target.value)}
              style={selectStyle}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          <div style={settingItemStyle}>
            <div style={settingInfoStyle}>
              <span style={settingLabelStyle}>Save Cards</span>
              <span style={settingDescStyle}>Save card details for faster checkout</span>
            </div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={settings.saveCards}
                onChange={() => handleToggle('saveCards')}
                style={checkboxStyle}
              />
              <span style={toggleSliderStyle}></span>
            </label>
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

const headerRightStyle = {
  display: "flex",
  gap: "10px"
};

const resetButtonStyle = {
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #6c757d",
  borderRadius: "8px",
  color: "#6c757d",
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

const messageStyle = {
  padding: "12px 20px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontWeight: "500"
};

const settingsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const settingsSectionStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "25px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const sectionTitleStyle = {
  fontSize: "18px",
  color: "#333",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  paddingBottom: "10px",
  borderBottom: "1px solid #e0e0e0"
};

const sectionIconStyle = {
  color: "#C4A962",
  fontSize: "20px"
};

const settingItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 0",
  borderBottom: "1px solid #f0f0f0"
};

const settingInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const settingLabelStyle = {
  fontSize: "15px",
  fontWeight: "500",
  color: "#333"
};

const settingDescStyle = {
  fontSize: "12px",
  color: "#666"
};

// Toggle Switch Styles
const toggleStyle = {
  position: "relative",
  display: "inline-block",
  width: "50px",
  height: "24px"
};

const checkboxStyle = {
  opacity: 0,
  width: 0,
  height: 0
};

const toggleSliderStyle = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ccc",
  transition: "0.3s",
  borderRadius: "24px"
};

// Select Style
const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#fff",
  minWidth: "150px",
  cursor: "pointer"
};

// Add hover effects via CSS
const globalStyles = `
  ${backButtonStyle}:hover {
    background: #C4A962;
    color: white;
  }
  
  ${resetButtonStyle}:hover {
    background: #6c757d;
    color: white;
  }
  
  ${saveButtonStyle}:hover {
    background: #218838;
    transform: translateY(-2px);
  }
  
  input:checked + ${toggleSliderStyle} {
    background-color: #C4A962;
  }
  
  input:focus + ${toggleSliderStyle} {
    box-shadow: 0 0 1px #C4A962;
  }
  
  ${toggleSliderStyle}:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
  
  input:checked + ${toggleSliderStyle}:before {
    transform: translateX(26px);
  }
  
  ${selectStyle}:hover {
    border-color: #C4A962;
  }
  
  ${selectStyle}:focus {
    border-color: #C4A962;
  }
`;

export default Settings;