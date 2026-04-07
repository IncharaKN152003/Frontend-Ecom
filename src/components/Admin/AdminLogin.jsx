// src/components/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUserShield } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check against localStorage users (if you're storing admin there)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check for admin user (you can also check a separate admin list)
    const adminUser = users.find(
      user => user.email === credentials.email && 
             user.password === credentials.password && 
             user.isAdmin === true
    );

    // Or if you have a separate admin storage
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const admin = admins.find(
      admin => admin.email === credentials.email && 
               admin.password === credentials.password
    );

    // Default admin credentials (for testing)
    const defaultAdmin = {
      email: "admin@inchucart.com",
      password: "admin123"
    };

    setTimeout(() => {
      // Check against default admin
      if (credentials.email === defaultAdmin.email && 
          credentials.password === defaultAdmin.password) {
        
        // Store admin session
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", credentials.email);
        localStorage.setItem("adminName", "Administrator");
        localStorage.setItem("adminRole", "admin");
        
        navigate("/admin/dashboard");
      }
      // Check against admin from users list
      else if (adminUser) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", adminUser.email);
        localStorage.setItem("adminName", adminUser.name || "Administrator");
        localStorage.setItem("adminRole", "admin");
        
        navigate("/admin/dashboard");
      }
      // Check against admins list
      else if (admin) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", admin.email);
        localStorage.setItem("adminName", admin.name || "Administrator");
        localStorage.setItem("adminRole", admin.role || "admin");
        
        navigate("/admin/dashboard");
      }
      else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <FaUserShield style={iconStyle} />
          <h1 style={titleStyle}>Admin Login</h1>
          <p style={subtitleStyle}>INCHU CART Administration</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FaEnvelope style={inputIconStyle} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FaLock style={inputIconStyle} /> Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        <div style={infoStyle}>
          <p>Default Admin:</p>
          <p>Email: admin@inchucart.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontFamily: "'Inter', sans-serif"
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  width: "100%",
  maxWidth: "400px"
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px"
};

const iconStyle = {
  fontSize: "60px",
  color: "#C4A962",
  marginBottom: "10px"
};

const titleStyle = {
  fontSize: "28px",
  color: "#333",
  marginBottom: "5px"
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#666"
};

const errorStyle = {
  backgroundColor: "rgba(220, 53, 69, 0.1)",
  color: "#dc3545",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "20px",
  textAlign: "center"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const inputGroupStyle = {
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
  color: "#C4A962"
};

const inputStyle = {
  padding: "12px 15px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s ease"
};

const buttonStyle = {
  padding: "14px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: "10px"
};

const infoStyle = {
  marginTop: "20px",
  padding: "15px",
  background: "#f8f9fa",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#666",
  textAlign: "center"
};

export default AdminLogin;