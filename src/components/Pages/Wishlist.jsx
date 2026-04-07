// Wishlist.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash,
  FaArrowLeft,
  FaStar,
  FaRegHeart,
  FaHeartBroken
} from "react-icons/fa";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    loadWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      console.log("Wishlist loaded:", savedWishlist);
      setWishlistItems(savedWishlist);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistItems([]);
    }
    setLoading(false);
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Add to cart
  const addToCart = (product) => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ 
        ...product, 
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  // Clear wishlist
  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setWishlistItems([]);
      localStorage.setItem("wishlist", JSON.stringify([]));
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  // Move all to cart
  const moveAllToCart = () => {
    if (wishlistItems.length === 0) return;
    
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    wishlistItems.forEach(product => {
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
      } else {
        existingCart.push({ 
          ...product, 
          quantity: 1
        });
      }
    });
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert("All items moved to cart!");
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loaderStyle}></div>
        <p>Loading wishlist...</p>
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
        <h1 style={titleStyle}>
          <FaHeart style={titleIconStyle} />
          My Wishlist ({wishlistItems.length})
        </h1>
        <div style={headerRightStyle}>
          {wishlistItems.length > 0 && (
            <>
              <button style={moveAllButtonStyle} onClick={moveAllToCart}>
                <FaShoppingCart /> Move All to Cart
              </button>
              <button style={clearButtonStyle} onClick={clearWishlist}>
                <FaTrash /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        // Empty Wishlist
        <div style={emptyStateStyle}>
          <FaHeartBroken style={emptyIconStyle} />
          <h2 style={emptyTitleStyle}>Your wishlist is empty</h2>
          <p style={emptyTextStyle}>Save your favorite items here</p>
          <button style={shopNowButtonStyle} onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        // Wishlist Items Grid
        <div style={productsGridStyle}>
          {wishlistItems.map((product) => (
            <div key={product.id} style={productCardStyle}>
              
              {/* Product Badge */}
              {product.badge && (
                <span style={{
                  ...badgeStyle,
                  backgroundColor: 
                    product.badge === "Premium" ? "#C4A962" :
                    product.badge === "Sale" ? "#dc3545" :
                    product.badge === "New" ? "#28a745" :
                    product.badge === "New Arrival" ? "#28a745" : "#d63384"
                }}>
                  {product.badge}
                </span>
              )}

              {/* Remove Button */}
              <button 
                style={removeButtonStyle}
                onClick={() => removeFromWishlist(product.id)}
                title="Remove from wishlist"
              >
                <FaTrash />
              </button>

              {/* Product Image */}
              <img 
                src={product.image} 
                alt={product.name}
                style={productImageStyle}
                onClick={() => {
                  // Navigate to appropriate product page based on category
                  if (product.category === "dresses" || product.category === "traditional" || product.category === "casual") {
                    navigate("/women");
                  } else if (product.category === "suits" || product.category === "shirts" || product.category === "t-shirts" || product.category === "jeans" || product.category === "trousers") {
                    navigate("/men");
                  } else if (product.category === "girls" || product.category === "boys" || product.category === "babies") {
                    navigate("/kids");
                  } else if (product.brand) {
                    navigate("/men/watches");
                  } else {
                    navigate("/");
                  }
                }}
              />

              {/* Product Details */}
              <div style={productInfoStyle}>
                <h3 style={productNameStyle}>{product.name}</h3>
                
                {/* Brand/Category */}
                {product.brand && <p style={productBrandStyle}>{product.brand}</p>}
                {product.ageGroup && <p style={productBrandStyle}>{product.ageGroup}</p>}

                {/* Rating */}
                {product.rating && (
                  <div style={ratingStyle}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        style={{
                          color: i < Math.floor(product.rating) ? "#FFD700" : "#e0e0e0",
                          fontSize: "12px"
                        }}
                      />
                    ))}
                    <span style={reviewCountStyle}>({product.reviews || 0})</span>
                  </div>
                )}

                {/* Price */}
                <div style={priceContainerStyle}>
                  <span style={currentPriceStyle}>{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span style={originalPriceStyle}>{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                  <div style={colorContainerStyle}>
                    {product.colors.slice(0, 4).map((color, index) => (
                      <span 
                        key={index}
                        style={{
                          ...colorDotStyle,
                          backgroundColor: color
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                )}

                {/* Add to Cart Button */}
                <button 
                  style={addToCartButtonStyle}
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "15px"
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
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const titleIconStyle = {
  color: "#dc3545",
  fontSize: "28px"
};

const headerRightStyle = {
  display: "flex",
  gap: "10px"
};

const moveAllButtonStyle = {
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

const clearButtonStyle = {
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

const emptyStateStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "#fff",
  borderRadius: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
};

const emptyIconStyle = {
  fontSize: "80px",
  color: "#dc3545",
  marginBottom: "20px"
};

const emptyTitleStyle = {
  fontSize: "24px",
  color: "#333",
  marginBottom: "10px"
};

const emptyTextStyle = {
  fontSize: "16px",
  color: "#666",
  marginBottom: "30px"
};

const shopNowButtonStyle = {
  padding: "12px 30px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "30px"
};

const productCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  position: "relative"
};

const badgeStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
  padding: "4px 12px",
  borderRadius: "20px",
  color: "white",
  fontSize: "11px",
  fontWeight: "600",
  zIndex: 2
};

const removeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#fff",
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
  color: "#dc3545",
  transition: "all 0.3s ease"
};

const productImageStyle = {
  width: "100%",
  height: "280px",
  objectFit: "cover",
  cursor: "pointer",
  transition: "transform 0.3s ease"
};

const productInfoStyle = {
  padding: "20px"
};

const productNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "5px"
};

const productBrandStyle = {
  fontSize: "13px",
  color: "#C4A962",
  marginBottom: "8px",
  fontWeight: "500"
};

const ratingStyle = {
  display: "flex",
  alignItems: "center",
  gap: "3px",
  marginBottom: "10px"
};

const reviewCountStyle = {
  color: "#666",
  fontSize: "11px",
  marginLeft: "5px"
};

const priceContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px"
};

const currentPriceStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#C4A962"
};

const originalPriceStyle = {
  fontSize: "13px",
  color: "#999",
  textDecoration: "line-through"
};

const colorContainerStyle = {
  display: "flex",
  gap: "6px",
  marginBottom: "15px",
  flexWrap: "wrap"
};

const colorDotStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  cursor: "pointer",
  border: "1px solid #e0e0e0"
};

const addToCartButtonStyle = {
  width: "100%",
  padding: "12px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.3s ease"
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
  
  ${moveAllButtonStyle}:hover {
    background: #218838;
    transform: translateY(-2px);
  }
  
  ${clearButtonStyle}:hover {
    background: #dc3545;
    color: white;
  }
  
  ${shopNowButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
  }
  
  ${productCardStyle}:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
  
  ${productCardStyle}:hover ${productImageStyle} {
    transform: scale(1.05);
  }
  
  ${removeButtonStyle}:hover {
    background: #dc3545;
    color: white;
  }
  
  ${addToCartButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
  }
`;

export default Wishlist;