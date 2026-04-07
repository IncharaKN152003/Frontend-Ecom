// Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft,
  FaTag,
  FaGift,
  FaShieldAlt,
  FaTruck,
  FaCreditCard
} from "react-icons/fa";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [giftWrap, setGiftWrap] = useState(false);
  const [expressDelivery, setExpressDelivery] = useState(false);

  // Available promo codes
  const validPromos = {
    "LUXE10": 10,
    "LUXE20": 20,
    "WELCOME15": 15,
    "SPECIAL25": 25
  };

  // Load cart items from localStorage on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("Cart loaded:", savedCart);
      setCartItems(savedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item from cart
  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
      localStorage.setItem("cart", JSON.stringify([]));
      setPromoApplied(false);
      setPromoCode("");
      setDiscount(0);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    
    if (promoApplied) {
      setPromoMessage("Promo code already applied!");
      return;
    }

    if (validPromos[code]) {
      const discountPercent = validPromos[code];
      setDiscount(discountPercent);
      setPromoApplied(true);
      setPromoMessage(`✅ Promo applied! You saved ${discountPercent}%`);
    } else {
      setPromoMessage("❌ Invalid promo code");
    }

    setTimeout(() => setPromoMessage(""), 3000);
  };

  // Remove promo code
  const removePromo = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode("");
    setPromoMessage("Promo code removed");
    setTimeout(() => setPromoMessage(""), 3000);
  };

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateDiscount = (subtotal) => {
    return (subtotal * discount) / 100;
  };

  const calculateGiftWrapCharge = () => {
    return giftWrap ? 99 : 0;
  };

  const calculateDeliveryCharge = () => {
    if (expressDelivery) return 199;
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? 0 : 99;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount(subtotal);
    const giftWrapCharge = calculateGiftWrapCharge();
    const deliveryCharge = calculateDeliveryCharge();
    
    return subtotal - discountAmount + giftWrapCharge + deliveryCharge;
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Proceed to checkout - UPDATED to navigate to checkout page
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // Navigate to checkout with cart data
    navigate("/checkout", { 
      state: { 
        cartItems, 
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(calculateSubtotal()),
        total: calculateTotal(),
        giftWrap,
        expressDelivery
      } 
    });
  };

  // Continue shopping
  const continueShopping = () => {
    navigate("/");
  };

  return (
    <div style={pageStyle}>
      
      {/* Cart Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <FaShoppingCart style={titleIconStyle} />
          Your Shopping Cart
        </h1>
        <p style={itemCountStyle}>
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </p>
      </div>

      {cartItems.length === 0 ? (
        // Empty Cart
        <div style={emptyCartStyle}>
          <div style={emptyCartIconStyle}>🛒</div>
          <h2 style={emptyCartTitleStyle}>Your cart is empty</h2>
          <p style={emptyCartTextStyle}>Looks like you haven't added anything to your cart yet</p>
          <button style={shopNowButtonStyle} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        // Cart with Items
        <div style={cartContainerStyle}>
          
          {/* Left Section - Cart Items */}
          <div style={cartItemsSectionStyle}>
            
            {/* Clear Cart Button */}
            <div style={cartActionsStyle}>
              <button style={continueShoppingButtonStyle} onClick={continueShopping}>
                <FaArrowLeft /> Continue Shopping
              </button>
              <button style={clearCartButtonStyle} onClick={clearCart}>
                <FaTrash /> Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            <div style={cartItemsListStyle}>
              {cartItems.map((item) => (
                <div key={item.id} style={cartItemStyle}>
                  
                  {/* Product Image */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={cartItemImageStyle}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100x120?text=No+Image";
                    }}
                  />

                  {/* Product Details */}
                  <div style={cartItemDetailsStyle}>
                    <h3 style={cartItemNameStyle}>{item.name}</h3>
                    
                    {/* Product Attributes */}
                    <div style={cartItemAttributesStyle}>
                      {item.brand && <span style={attributeStyle}>Brand: {item.brand}</span>}
                      {item.ageGroup && <span style={attributeStyle}>Age: {item.ageGroup}</span>}
                      {item.movement && <span style={attributeStyle}>Movement: {item.movement}</span>}
                      {item.fit && <span style={attributeStyle}>Fit: {item.fit}</span>}
                      {item.caseSize && <span style={attributeStyle}>Case: {item.caseSize}</span>}
                    </div>

                    {/* Price */}
                    <div style={cartItemPriceStyle}>
                      <span style={currentPriceStyle}>{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span style={originalPriceStyle}>{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div style={quantityControlStyle}>
                      <button 
                        style={quantityButtonStyle}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span style={quantityStyle}>{item.quantity}</span>
                      <button 
                        style={quantityButtonStyle}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                      <button 
                        style={removeButtonStyle}
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div style={itemTotalStyle}>
                      Total: {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div style={orderSummaryStyle}>
            <h2 style={summaryTitleStyle}>Order Summary</h2>

            {/* Price Breakdown */}
            <div style={priceBreakdownStyle}>
              <div style={priceRowStyle}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              
              {discount > 0 && (
                <div style={priceRowStyle}>
                  <span>Discount ({discount}%)</span>
                  <span style={discountTextStyle}>-{formatPrice(calculateDiscount(calculateSubtotal()))}</span>
                </div>
              )}

              <div style={priceRowStyle}>
                <span>Delivery Charges</span>
                {calculateDeliveryCharge() === 0 ? (
                  <span style={freeTextStyle}>FREE</span>
                ) : (
                  <span>{formatPrice(calculateDeliveryCharge())}</span>
                )}
              </div>

              {giftWrap && (
                <div style={priceRowStyle}>
                  <span>Gift Wrap</span>
                  <span>{formatPrice(99)}</span>
                </div>
              )}

              {expressDelivery && (
                <div style={priceRowStyle}>
                  <span>Express Delivery</span>
                  <span>{formatPrice(199)}</span>
                </div>
              )}

              <div style={totalRowStyle}>
                <span>Total</span>
                <span style={totalAmountStyle}>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div style={promoSectionStyle}>
              <h3 style={promoTitleStyle}>Apply Promo Code</h3>
              <div style={promoInputStyle}>
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  style={promoFieldStyle}
                />
                {promoApplied ? (
                  <button style={removePromoButtonStyle} onClick={removePromo}>
                    Remove
                  </button>
                ) : (
                  <button style={applyPromoButtonStyle} onClick={applyPromoCode}>
                    Apply
                  </button>
                )}
              </div>
              {promoMessage && (
                <div style={{
                  ...promoMessageStyle,
                  color: promoMessage.includes('✅') ? '#28a745' : '#dc3545'
                }}>
                  {promoMessage}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div style={optionsSectionStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  style={checkboxStyle}
                />
                <span style={checkboxTextStyle}>
                  Add Gift Wrap <span style={optionPriceStyle}>(+₹99)</span>
                </span>
              </label>
              
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={expressDelivery}
                  onChange={(e) => setExpressDelivery(e.target.checked)}
                  style={checkboxStyle}
                />
                <span style={checkboxTextStyle}>
                  Express Delivery <span style={optionPriceStyle}>(+₹199)</span>
                </span>
              </label>
            </div>

            {/* Checkout Button */}
            <button 
              style={checkoutButtonStyle}
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
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
  marginBottom: "40px",
  paddingBottom: "20px",
  borderBottom: "1px solid #e0e0e0"
};

const titleStyle = {
  fontSize: "32px",
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  margin: 0
};

const titleIconStyle = {
  color: "#C4A962",
  fontSize: "32px"
};

const itemCountStyle = {
  fontSize: "16px",
  color: "#666",
  background: "#fff",
  padding: "8px 16px",
  borderRadius: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const emptyCartStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
};

const emptyCartIconStyle = {
  fontSize: "80px",
  marginBottom: "20px"
};

const emptyCartTitleStyle = {
  fontSize: "24px",
  color: "#333",
  marginBottom: "10px"
};

const emptyCartTextStyle = {
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

const cartContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 350px",
  gap: "30px"
};

const cartItemsSectionStyle = {
  background: "#fff",
  borderRadius: "15px",
  padding: "25px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
};

const cartActionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px"
};

const continueShoppingButtonStyle = {
  padding: "8px 16px",
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

const clearCartButtonStyle = {
  padding: "8px 16px",
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

const cartItemsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const cartItemStyle = {
  display: "flex",
  gap: "20px",
  padding: "20px",
  background: "#f8f9fa",
  borderRadius: "10px",
  position: "relative"
};

const cartItemImageStyle = {
  width: "100px",
  height: "120px",
  objectFit: "cover",
  borderRadius: "8px"
};

const cartItemDetailsStyle = {
  flex: 1
};

const cartItemNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "5px"
};

const cartItemAttributesStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "10px",
  fontSize: "12px",
  color: "#666"
};

const attributeStyle = {
  background: "#fff",
  padding: "3px 10px",
  borderRadius: "15px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const cartItemPriceStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px"
};

const currentPriceStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#C4A962"
};

const originalPriceStyle = {
  fontSize: "14px",
  color: "#999",
  textDecoration: "line-through"
};

const quantityControlStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px"
};

const quantityButtonStyle = {
  width: "30px",
  height: "30px",
  border: "1px solid #e0e0e0",
  background: "#fff",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease"
};

const quantityStyle = {
  fontSize: "16px",
  fontWeight: "500",
  minWidth: "30px",
  textAlign: "center"
};

const removeButtonStyle = {
  width: "30px",
  height: "30px",
  border: "1px solid #dc3545",
  background: "#fff",
  borderRadius: "5px",
  cursor: "pointer",
  color: "#dc3545",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "10px",
  transition: "all 0.3s ease"
};

const itemTotalStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333"
};

const orderSummaryStyle = {
  background: "#fff",
  borderRadius: "15px",
  padding: "25px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  height: "fit-content",
  position: "sticky",
  top: "100px"
};

const summaryTitleStyle = {
  fontSize: "20px",
  color: "#333",
  marginBottom: "20px",
  paddingBottom: "15px",
  borderBottom: "1px solid #e0e0e0"
};

const priceBreakdownStyle = {
  marginBottom: "20px"
};

const priceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "14px",
  color: "#666"
};

const discountTextStyle = {
  color: "#28a745"
};

const freeTextStyle = {
  color: "#28a745",
  fontWeight: "600"
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "2px solid #e0e0e0",
  fontSize: "18px",
  fontWeight: "700",
  color: "#333"
};

const totalAmountStyle = {
  color: "#C4A962"
};

const promoSectionStyle = {
  marginBottom: "20px",
  padding: "15px",
  background: "#f8f9fa",
  borderRadius: "10px"
};

const promoTitleStyle = {
  fontSize: "16px",
  color: "#333",
  marginBottom: "10px"
};

const promoInputStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px"
};

const promoFieldStyle = {
  flex: 1,
  padding: "10px 15px",
  border: "1px solid #e0e0e0",
  borderRadius: "5px",
  fontSize: "14px",
  outline: "none"
};

const applyPromoButtonStyle = {
  padding: "10px 20px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s ease"
};

const removePromoButtonStyle = {
  padding: "10px 20px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s ease"
};

const promoMessageStyle = {
  fontSize: "12px",
  marginBottom: "10px"
};

const optionsSectionStyle = {
  marginBottom: "20px"
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
  cursor: "pointer"
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  cursor: "pointer",
  accentColor: "#C4A962"
};

const checkboxTextStyle = {
  fontSize: "14px",
  color: "#333"
};

const optionPriceStyle = {
  color: "#666",
  fontSize: "12px"
};

const checkoutButtonStyle = {
  width: "100%",
  padding: "15px",
  background: "#C4A962",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

// Hover effects
const globalStyles = `
  ${shopNowButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
    boxShadow: 0 5px 15px rgba(196, 169, 98, 0.3);
  }
  
  ${continueShoppingButtonStyle}:hover {
    background: #C4A962;
    color: white;
  }
  
  ${clearCartButtonStyle}:hover {
    background: #dc3545;
    color: white;
  }
  
  ${quantityButtonStyle}:hover {
    background: #C4A962;
    color: white;
    border-color: #C4A962;
  }
  
  ${removeButtonStyle}:hover {
    background: #dc3545;
    color: white;
  }
  
  ${applyPromoButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
  }
  
  ${removePromoButtonStyle}:hover {
    background: #c82333;
    transform: translateY(-2px);
  }
  
  ${checkoutButtonStyle}:hover {
    background: #b39550;
    transform: translateY(-2px);
    boxShadow: 0 5px 15px rgba(196, 169, 98, 0.3);
  }
`;

export default Cart;