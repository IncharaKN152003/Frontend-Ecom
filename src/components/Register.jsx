// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaGem, FaArrowRight, FaShieldAlt } from "react-icons/fa";
// import "./register.css";

// function Register() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phone_number, setPhone_number] = useState("");
//   const [message, setMessage] = useState(location.state?.message || "");
//   const [isLoading, setIsLoading] = useState(false);

//   // Auto hide success message
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleRegister = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!name || !email || !password || !confirmPassword || !phone_number) {
//       setMessage("Please fill all fields ❌");
//       setIsLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setMessage("Passwords do not match ❌");
//       setIsLoading(false);
//       return;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone_number)) {
//       setMessage("Phone number must be exactly 10 digits ❌");
//       setIsLoading(false);
//       return;
//     }

//     const newUser = { name, email, password, phone_number };
//     const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

//     const userExists = existingUsers.find((u) => u.email === email);
//     if (userExists) {
//       setMessage("User already registered ❌");
//       setIsLoading(false);
//       return;
//     }

//     setTimeout(() => {
//       existingUsers.push(newUser);
//       localStorage.setItem("users", JSON.stringify(existingUsers));
//       setMessage("Registration Successful ✅");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     }, 1000);
//   };

//   return (
//     <div className="luxury-register-page">
//       {/* LEFT SIDE - Luxury Brand Section */}
//       <div className="luxury-left">
//         <div className="luxury-overlay">
//           <div className="luxury-brand">
//             <FaGem className="luxury-gem-icon" />
//             <h1 className="luxury-brand-name">INCHU<span>CART</span></h1>
//           </div>
          
//           <div className="luxury-welcome-text">
//             <h2>Join the Elite</h2>
//             <div className="luxury-divider">
//               <span className="luxury-divider-line"></span>
//               <span className="luxury-divider-diamond">◆</span>
//               <span className="luxury-divider-line"></span>
//             </div>
//             <p>Begin your luxury fashion journey</p>
//           </div>

//           <div className="luxury-features">
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Early Access to Collections</span>
//             </div>
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Personal Stylist Consultation</span>
//             </div>
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>VIP Events & Preview</span>
//             </div>
//             <div className="luxury-feature">
//               <span className="luxury-feature-dot"></span>
//               <span>Complimentary Gift Wrapping</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE - Registration Form */}
//       <div className="luxury-right">
//         <div className="luxury-register-card">
          
//           <div className="luxury-card-header">
//             <h3>Create Account</h3>
//             <p>Begin your luxury experience</p>
//           </div>

//           {message && (
//             <div className={`luxury-message ${message.includes('✅') ? 'luxury-success' : 'luxury-error'}`}>
//               {message}
//             </div>
//           )}

//           <form onSubmit={handleRegister} className="luxury-form">
//             <div className="luxury-input-group">
//               <FaUser className="luxury-icon" />
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <div className="luxury-input-group">
//               <FaEnvelope className="luxury-icon" />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
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
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <div className="luxury-input-group">
//               <FaShieldAlt className="luxury-icon" />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <div className="luxury-input-group">
//               <FaPhone className="luxury-icon" />
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone_number}
//                 maxLength="10"
//                 onChange={(e) =>
//                   setPhone_number(e.target.value.replace(/\D/g, ""))
//                 }
//               />
//               <span className="luxury-input-focus"></span>
//             </div>

//             <div className="luxury-terms">
//               <input type="checkbox" id="terms" required />
//               <label htmlFor="terms">
//                 I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
//               </label>
//             </div>

//             <button 
//               type="submit" 
//               className={`luxury-register-btn ${isLoading ? 'luxury-loading' : ''}`}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="luxury-loader"></span>
//               ) : (
//                 <>
//                   Create Account <FaArrowRight className="luxury-btn-icon" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="luxury-login-section">
//             <p className="luxury-login-text">
//               Already have an account?
//             </p>
//             <Link to="/login" className="luxury-login-link">
//               Sign In <FaArrowRight className="luxury-link-icon" />
//             </Link>
//           </div>

//           <div className="luxury-security-badge">
//             <FaShieldAlt />
//             <span>256-bit SSL Secure Encryption</span>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;








import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGem, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import axios from "axios";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [isLoading, setIsLoading] = useState(false);

  // Auto hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Frontend validations
    if (!name || !email || !password || !confirmPassword || !phone_number) {
      setMessage("Please fill all fields ❌");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match ❌");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      setMessage("Phone number must be exactly 10 digits ❌");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/users/register", {
        fullName: name,
        email,
        password,
        phoneNumber: phone_number,
      });

      if (response.data.success) {
        setMessage("Registration Successful ✅");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Registration failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="luxury-register-page">
      {/* LEFT SIDE - Luxury Brand Section */}
      <div className="luxury-left">
        <div className="luxury-overlay">
          <div className="luxury-brand">
            <FaGem className="luxury-gem-icon" />
            <h1 className="luxury-brand-name">INCHU<span>CART</span></h1>
          </div>

          <div className="luxury-welcome-text">
            <h2>Join the Elite</h2>
            <div className="luxury-divider">
              <span className="luxury-divider-line"></span>
              <span className="luxury-divider-diamond">◆</span>
              <span className="luxury-divider-line"></span>
            </div>
            <p>Begin your luxury fashion journey</p>
          </div>

          <div className="luxury-features">
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Early Access to Collections</span>
            </div>
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Personal Stylist Consultation</span>
            </div>
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>VIP Events & Preview</span>
            </div>
            <div className="luxury-feature">
              <span className="luxury-feature-dot"></span>
              <span>Complimentary Gift Wrapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Registration Form */}
      <div className="luxury-right">
        <div className="luxury-register-card">

          <div className="luxury-card-header">
            <h3>Create Account</h3>
            <p>Begin your luxury experience</p>
          </div>

          {message && (
            <div className={`luxury-message ${message.includes("✅") ? "luxury-success" : "luxury-error"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="luxury-form">
            <div className="luxury-input-group">
              <FaUser className="luxury-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="luxury-input-focus"></span>
            </div>

            <div className="luxury-input-group">
              <FaEnvelope className="luxury-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
              <span className="luxury-input-focus"></span>
            </div>

            <div className="luxury-input-group">
              <FaShieldAlt className="luxury-icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="luxury-input-focus"></span>
            </div>

            <div className="luxury-input-group">
              <FaPhone className="luxury-icon" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone_number}
                maxLength="10"
                onChange={(e) => setPhone_number(e.target.value.replace(/\D/g, ""))}
              />
              <span className="luxury-input-focus"></span>
            </div>

            <div className="luxury-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className={`luxury-register-btn ${isLoading ? "luxury-loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="luxury-loader"></span>
              ) : (
                <>
                  Create Account <FaArrowRight className="luxury-btn-icon" />
                </>
              )}
            </button>
          </form>

          <div className="luxury-login-section">
            <p className="luxury-login-text">Already have an account?</p>
            <Link to="/login" className="luxury-login-link">
              Sign In <FaArrowRight className="luxury-link-icon" />
            </Link>
          </div>

          <div className="luxury-security-badge">
            <FaShieldAlt />
            <span>256-bit SSL Secure Encryption</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;