// // src/components/Login.jsx
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaEnvelope, FaLock, FaGem, FaArrowRight, FaUserShield } from "react-icons/fa";
// import axios from "axios";
// import "./login.css";

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");

//     if (!email.trim() || !password.trim()) {
//       setMessage("Please fill all fields ❌");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log("Attempting login with:", { email, password });
      
//       const response = await axios.post(
//         "http://localhost:8080/api/users/login",
//         { email, password }
//       );

//       console.log("Login response:", response.data);

//       if (response.data.success) {
//         // Store user in localStorage
//         localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
//         localStorage.setItem("userToken", response.data.token);
        
//         setMessage("Login successful! Redirecting...");
        
//         // Redirect to home page
//         setTimeout(() => {
//           navigate("/");
//         }, 1000);
//       }
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       setMessage(error.response?.data?.message || "Login failed ❌");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="luxury-login-page">
//       {/* LEFT SIDE - Luxury Brand Section */}
//       <div className="luxury-left">
//         <div className="luxury-overlay">
//           <div className="luxury-brand">
//             <FaGem className="luxury-gem-icon" />
//             <h1 className="luxury-brand-name">INCHU<span>CART</span></h1>
//           </div>
          
//           <div className="luxury-welcome-text">
//             <h2>Welcome Back</h2>
//             <div className="luxury-divider">
//               <span className="luxury-divider-line"></span>
//               <span className="luxury-divider-diamond">◆</span>
//               <span className="luxury-divider-line"></span>
//             </div>
//             <p>Experience luxury fashion at your fingertips</p>
//           </div>

//           <div className="luxury-features">
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Exclusive Collections</span>
//             </div>
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Premium Quality</span>
//             </div>
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Worldwide Shipping</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE - Login Form */}
//       <div className="luxury-right">
//         <div className="luxury-login-card">
          
//           <div className="luxury-card-header">
//             <h3>Sign In</h3>
//             <p>Please enter your credentials</p>
//           </div>

//           <form onSubmit={handleLogin} className="luxury-form">
//             <div className="luxury-input-group">
//               <FaEnvelope className="luxury-icon" />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <div className="luxury-input-group">
//               <FaLock className="luxury-icon" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <button 
//               type="submit" 
//               className={`luxury-login-btn ${isLoading ? 'luxury-loading' : ''}`}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="luxury-loader"></span>
//               ) : (
//                 <>
//                   Sign In <FaArrowRight className="luxury-btn-icon" />
//                 </>
//               )}
//             </button>

//             {message && <p className="luxury-error">{message}</p>}
//           </form>

//           <div className="luxury-register-section">
//             <p className="luxury-register-text">
//               Don't have an account? <Link to="/register" className="luxury-register-link">Register here</Link>
//             </p>
//           </div>

//           {/* Admin Login Link */}
//           <div className="luxury-admin-section">
//             <p className="luxury-admin-text">
//               <FaUserShield className="luxury-admin-icon" />
//               Admin Login? <Link to="/admin/login" className="luxury-admin-link">Click here</Link>
//             </p>
//           </div>

//           <div className="luxury-footer-text">
//             <p>By signing in, you agree to our</p>
//             <div className="luxury-footer-links">
//               <Link to="/terms">Terms</Link>
//               <span className="luxury-separator">•</span>
//               <Link to="/privacy">Privacy</Link>
//               <span className="luxury-separator">•</span>
//               <Link to="/cookies">Cookies</Link>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;







import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGem, FaArrowRight, FaUserShield } from "react-icons/fa";
import axios from "axios";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Frontend validation
    if (!email.trim() || !password.trim()) {
      setMessage("Please fill all fields ❌");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Store user data and token
        localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);

        setMessage("Login successful! Redirecting... ✅");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Login failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="luxury-login-page">
      {/* LEFT SIDE - Luxury Brand Section */}
      <div className="luxury-left">
        <div className="luxury-overlay">
          <div className="luxury-brand">
            <FaGem className="luxury-gem-icon" />
            <h1 className="luxury-brand-name">INCHU<span>CART</span></h1>
          </div>

          <div className="luxury-welcome-text">
            <h2>Welcome Back</h2>
            <div className="luxury-divider">
              <span className="luxury-divider-line"></span>
              <span className="luxury-divider-diamond">◆</span>
              <span className="luxury-divider-line"></span>
            </div>
            <p>Experience luxury fashion at your fingertips</p>
          </div>

          <div className="luxury-features">
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Exclusive Collections</span>
            </div>
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Premium Quality</span>
            </div>
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Worldwide Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="luxury-right">
        <div className="luxury-login-card">

          <div className="luxury-card-header">
            <h3>Sign In</h3>
            <p>Please enter your credentials</p>
          </div>

          {message && (
            <div className={`luxury-message ${message.includes("✅") ? "luxury-success" : "luxury-error"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="luxury-form">
            <div className="luxury-input-group">
              <FaEnvelope className="luxury-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="luxury-input-focus"></span>
            </div>

            <div className="luxury-input-group">
              <FaLock className="luxury-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="luxury-input-focus"></span>
            </div>

            <button
              type="submit"
              className={`luxury-login-btn ${isLoading ? "luxury-loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="luxury-loader"></span>
              ) : (
                <>
                  Sign In <FaArrowRight className="luxury-btn-icon" />
                </>
              )}
            </button>
          </form>

          <div className="luxury-register-section">
            <p className="luxury-register-text">
              Don't have an account?{" "}
              <Link to="/register" className="luxury-register-link">
                Register here
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="luxury-admin-section">
            <p className="luxury-admin-text">
              <FaUserShield className="luxury-admin-icon" />
              Admin Login?{" "}
              <Link to="/admin/login" className="luxury-admin-link">
                Click here
              </Link>
            </p>
          </div>

          <div className="luxury-footer-text">
            <p>By signing in, you agree to our</p>
            <div className="luxury-footer-links">
              <Link to="/terms">Terms</Link>
              <span className="luxury-separator">•</span>
              <Link to="/privacy">Privacy</Link>
              <span className="luxury-separator">•</span>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;