// src/components/MyProducts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaBox, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

function MyProducts() {
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);

  // Load user and orders on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Logged in user:", user);
    setLoggedInUser(user);
    
    if (user) {
      fetchUserOrders(user.id || user._id || user.email);
    } else {
      setLoading(false);
    }
    
    loadWishlist();
  }, []);

  // Fetch user orders from backend ONLY
  const fetchUserOrders = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching orders for user:", userId);
      
      // ONLY get orders from API - no dummy data
      const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
      console.log("API Response:", response.data);
      
      if (response.data.success && response.data.orders) {
        const ordersData = response.data.orders;
        setOrders(ordersData);
        
        // Extract purchased products from orders
        const purchased = [];
        ordersData.forEach(order => {
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              // Only push if item has valid data
              if (item.productId || item._id || item.id) {
                purchased.push({
                  id: item.productId || item._id || item.id,
                  name: item.name || item.productName,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity || 1,
                  category: item.category,
                  orderId: order._id || order.id,
                  orderDate: order.createdAt || order.date,
                  deliveryStatus: order.deliveryStatus || order.status || "processing",
                  estimatedDelivery: order.estimatedDelivery,
                  trackingNumber: order.trackingNumber
                });
              }
            });
          }
        });
        
        console.log("Purchased products extracted:", purchased);
        setPurchasedProducts(purchased);
      } else {
        // No orders found - set empty arrays
        setOrders([]);
        setPurchasedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Unable to load your orders. Please try again later.");
      // Set empty arrays on error - NO FALLBACK TO LOCALSTORAGE
      setOrders([]);
      setPurchasedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistItems(savedWishlist);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const addToWishlist = (product) => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      
      const existingIndex = wishlist.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        wishlist.splice(existingIndex, 1);
        alert(`${product.name} removed from wishlist!`);
      } else {
        wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        });
        alert(`${product.name} added to wishlist!`);
      }
      
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistItems(wishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const reorderProduct = (product) => {
    addToCart(product);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return "N/A";
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle style={{ color: "#28a745" }} />;
      case "processing":
        return <FaClock style={{ color: "#ffc107" }} />;
      case "shipped":
        return <FaTruck style={{ color: "#17a2b8" }} />;
      default:
        return <FaBox style={{ color: "#6c757d" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered":
        return "#28a745";
      case "processing":
        return "#ffc107";
      case "shipped":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  // Filter products by status
  const filteredProducts = filterStatus === "all" 
    ? purchasedProducts 
    : purchasedProducts.filter(p => p.deliveryStatus?.toLowerCase() === filterStatus.toLowerCase());

  if (!loggedInUser) {
    return (
      <div style={styles.container}>
        <div style={styles.loginMessage}>
          <FaBox size={60} color="#C4A962" />
          <h2>Please Login to View Your Products</h2>
          <p>You need to be logged in to see your purchased products</p>
          <button 
            style={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading your purchased products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Purchased Products</h1>
        <p style={styles.subtitle}>View all products you have purchased</p>
      </div>

      {/* Error message if API fails */}
      {error && (
        <div style={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {/* Only show summary if there are orders */}
      {orders.length > 0 && (
        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryNumber}>{orders.length}</span>
            <span style={styles.summaryLabel}>Total Orders</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryNumber}>{purchasedProducts.length}</span>
            <span style={styles.summaryLabel}>Products Purchased</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryNumber}>
              {orders.filter(o => o.deliveryStatus?.toLowerCase() === "delivered").length}
            </span>
            <span style={styles.summaryLabel}>Delivered</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryNumber}>
              {orders.filter(o => o.deliveryStatus?.toLowerCase() === "processing").length}
            </span>
            <span style={styles.summaryLabel}>Processing</span>
          </div>
        </div>
      )}

      {/* Status Filter - only show if there are products */}
      {purchasedProducts.length > 0 && (
        <div style={styles.filterBar}>
          <button 
            style={{
              ...styles.filterButton,
              backgroundColor: filterStatus === "all" ? "#C4A962" : "transparent",
              color: filterStatus === "all" ? "white" : "#333"
            }}
            onClick={() => setFilterStatus("all")}
          >
            All Products ({purchasedProducts.length})
          </button>
          <button 
            style={{
              ...styles.filterButton,
              backgroundColor: filterStatus === "delivered" ? "#28a745" : "transparent",
              color: filterStatus === "delivered" ? "white" : "#333",
              borderColor: "#28a745"
            }}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered ({purchasedProducts.filter(p => p.deliveryStatus?.toLowerCase() === "delivered").length})
          </button>
          <button 
            style={{
              ...styles.filterButton,
              backgroundColor: filterStatus === "shipped" ? "#17a2b8" : "transparent",
              color: filterStatus === "shipped" ? "white" : "#333",
              borderColor: "#17a2b8"
            }}
            onClick={() => setFilterStatus("shipped")}
          >
            Shipped ({purchasedProducts.filter(p => p.deliveryStatus?.toLowerCase() === "shipped").length})
          </button>
          <button 
            style={{
              ...styles.filterButton,
              backgroundColor: filterStatus === "processing" ? "#ffc107" : "transparent",
              color: filterStatus === "processing" ? "white" : "#333",
              borderColor: "#ffc107"
            }}
            onClick={() => setFilterStatus("processing")}
          >
            Processing ({purchasedProducts.filter(p => p.deliveryStatus?.toLowerCase() === "processing").length})
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} style={styles.productCard}>
              
              {/* Status Badge */}
              <div style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(product.deliveryStatus)
              }}>
                {getStatusIcon(product.deliveryStatus)}
                <span style={styles.statusText}>
                  {product.deliveryStatus || "Processing"}
                </span>
              </div>

              {/* Wishlist Button */}
              <button 
                style={{
                  ...styles.wishlistButton,
                  color: isInWishlist(product.id) ? "#dc3545" : "#666"
                }}
                onClick={() => addToWishlist(product)}
              >
                <FaHeart />
              </button>

              {/* Product Image */}
              <img 
                src={product.image || "https://via.placeholder.com/300?text=No+Image"} 
                alt={product.name || "Product"}
                style={styles.productImage}
                onClick={() => product.id && navigate(`/product/${product.id}`)}
              />

              {/* Product Details */}
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name || "Product"}</h3>
                
                {/* Order Info */}
                <div style={styles.orderInfo}>
                  <p style={styles.orderId}>Order ID: #{product.orderId?.slice(-8) || "N/A"}</p>
                  <p style={styles.orderDate}>Purchased: {formatDate(product.orderDate)}</p>
                  {product.estimatedDelivery && (
                    <p style={styles.estimatedDate}>
                      Est. Delivery: {formatDate(product.estimatedDelivery)}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div style={styles.priceContainer}>
                  <span style={styles.currentPrice}>{formatPrice(product.price)}</span>
                  {product.quantity > 1 && (
                    <span style={styles.quantity}>Qty: {product.quantity}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.reorderButton}
                    onClick={() => reorderProduct(product)}
                  >
                    <FaShoppingCart /> Reorder
                  </button>
                  
                  {product.trackingNumber && (
                    <button 
                      style={styles.trackButton}
                      onClick={() => window.open(`/track-order/${product.trackingNumber}`, '_blank')}
                    >
                      <FaTruck /> Track
                    </button>
                  )}
                </div>

                {/* View Order Details Link */}
                <button 
                  style={styles.viewOrderLink}
                  onClick={() => navigate(`/orders?order=${product.orderId}`)}
                >
                  View Order Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noProducts}>
            <FaBox size={50} color="#C4A962" />
            <h3>No purchased products found</h3>
            <p>You haven't purchased any products yet</p>
            <button 
              style={styles.shopNowButton}
              onClick={() => navigate("/women")}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "40px 80px"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "10px"
  },
  subtitle: {
    fontSize: "18px",
    color: "#666"
  },
  loginMessage: {
    textAlign: "center",
    padding: "80px 20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    maxWidth: "500px",
    margin: "0 auto"
  },
  loginButton: {
    padding: "12px 30px",
    background: "#C4A962",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px"
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center"
  },
  summaryCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  summaryCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  summaryNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#C4A962"
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#666"
  },
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  filterButton: {
    padding: "8px 20px",
    border: "1px solid #e0e0e0",
    borderRadius: "30px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px"
  },
  productCard: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    position: "relative"
  },
  statusBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  statusText: {
    fontSize: "11px"
  },
  wishlistButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "white",
    border: "none",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 2,
    transition: "all 0.3s ease"
  },
  productImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    cursor: "pointer"
  },
  productInfo: {
    padding: "20px"
  },
  productName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px"
  },
  orderInfo: {
    marginBottom: "15px",
    padding: "10px",
    background: "#f8f9fa",
    borderRadius: "8px"
  },
  orderId: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px"
  },
  orderDate: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px"
  },
  estimatedDate: {
    fontSize: "12px",
    color: "#C4A962",
    fontWeight: "500"
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "15px"
  },
  currentPrice: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#C4A962"
  },
  quantity: {
    fontSize: "14px",
    color: "#666"
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px"
  },
  reorderButton: {
    flex: 1,
    padding: "10px",
    background: "#C4A962",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    transition: "all 0.3s ease"
  },
  trackButton: {
    flex: 1,
    padding: "10px",
    background: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    transition: "all 0.3s ease"
  },
  viewOrderLink: {
    background: "none",
    border: "none",
    color: "#C4A962",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "5px",
    width: "100%",
    textAlign: "left"
  },
  noProducts: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px",
    background: "white",
    borderRadius: "12px"
  },
  shopNowButton: {
    padding: "12px 30px",
    background: "#C4A962",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "20px"
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #C4A962",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default MyProducts;