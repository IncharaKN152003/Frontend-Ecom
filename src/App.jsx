import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Women from "./components/Pages/Women";
import Men from "./components/Pages/Men";
import Kids from "./components/Pages/Kids";
import KidsAccessories from "./components/Pages/KidsAccessories";
import Watches from "./components/Pages/Watches";
import Accessories from "./components/Pages/Accessories";
import Cart from "./components/Pages/Cart";
import Checkout from "./components/Pages/Checkout";
import Profile from "./components/Pages/Profile";
import Orders from "./components/Pages/Orders";
import Wishlist from "./components/Pages/Wishlist";
import Settings from "./components/Pages/Settings";
import Header from "./components/Header";
import Blog from "./components/Pages/Blog";
import Contact from "./components/Pages/Contact";
import Invoice from "./components/Pages/Invoice";
import InchuCartChatbot from "./components/InchuCartChatbot"; // ← ADD THIS

// Product Pages
import MyProducts from "./components/Pages/MyProduct";

// Admin Imports
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminRoute from "./components/Admin/AdminRoute";
import AdminProducts from "./components/Admin/AdminProducts";

function App() {
  return (
    <>
      <Header/>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Product Pages */}
        <Route path="/products" element={<MyProducts />} />
        <Route path="/women" element={<Women />} />
        <Route path="/women/accessories" element={<Accessories />} />
        <Route path="/men" element={<Men />} />
        <Route path="/men/watches" element={<Watches />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/kids/accessories" element={<KidsAccessories />} />
        
        {/* User Pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoice" element={<Invoice />} />

        {/* My Products Routes */}
        <Route path="/myproduct" element={<MyProducts/>}/>
        <Route path="/myproducts" element={<MyProducts/>}/>
        
        {/* Information Pages */}
        <Route path="/blog" element={<Blog/>} />
        <Route path="/contact" element={<Contact/>} />
        
        {/* ========== ADMIN ROUTES ========== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } 
        />
        
        {/* Redirect any other admin routes to dashboard */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        
        {/* ========== 404 PAGE ========== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ Chatbot floats on every page */}
      <InchuCartChatbot />
    </>
  );
}

export default App;
