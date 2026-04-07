// Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaTruck, 
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

// ✅ Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [savedInvoice, setSavedInvoice] = useState(null);
  
  const { cartItems, subtotal, discount, total, giftWrap, expressDelivery } = location.state || {};
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "card"
  });

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) { navigate("/cart"); }
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.fullName?.split(" ")[0] || user.name?.split(" ")[0] || "",
        lastName: user.fullName?.split(" ")[1] || user.name?.split(" ")[1] || "",
        email: user.email || ""
      }));
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;

  // ─────────────────────────────────────────
  // SHARED: Save order + invoice to MongoDB
  // ─────────────────────────────────────────
  const saveOrderAndInvoice = async ({ paymentMethod, paymentStatus, razorpayPaymentId = null, razorpayOrderId = null }) => {
    const userId = loggedInUser?._id || loggedInUser?.id;
    const deliveryCharges = subtotal > 5000 ? 0 : 99;
    const deliveryDays = expressDelivery ? 2 : 5;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    const shippingAddress = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      zipCode: formData.zipCode
    };

    const orderItems = cartItems.map(item => ({
      productId: item.id || item._id || "",
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || "",
      category: item.category || "",
      brand: item.brand || "",
      size: item.size || "",
      color: item.color || ""
    }));

    // Step 1: Save Order
    const orderResponse = await axios.post(`${API_URL}/api/orders`, {
      userId,
      items: orderItems,
      totalAmount: Number(total),
      deliveryStatus: "ordered",
      estimatedDelivery: estimatedDelivery.toISOString(),
      shippingAddress,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
    });

    if (!orderResponse.data.success) throw new Error("Order save failed");
    const savedOrder = orderResponse.data.order;
    console.log("✅ Order saved:", savedOrder._id);

    // Step 2: Save Invoice
    const invoiceResponse = await axios.post(`${API_URL}/api/invoices`, {
      userId,
      orderId: savedOrder._id,
      items: orderItems,
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      giftWrap: giftWrap || false,
      expressDelivery: expressDelivery || false,
      deliveryCharges: Number(deliveryCharges),
      totalAmount: Number(total),
      shippingAddress,
      paymentMethod,
      paymentStatus,
      deliveryStatus: "ordered",
      estimatedDelivery: estimatedDelivery.toISOString(),
      razorpayPaymentId,
      razorpayOrderId,
    });

    if (!invoiceResponse.data.success) throw new Error(invoiceResponse.data.message || "Invoice save failed");
    const realInvoice = invoiceResponse.data.invoice;
    console.log("✅ Invoice saved:", realInvoice.invoiceNumber);

    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]));
    window.dispatchEvent(new Event("cartUpdated"));

    setSavedInvoice(realInvoice);
    setOrderPlaced(true);
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // RAZORPAY PAYMENT FLOW
  // ─────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create Razorpay order on backend
      const { data } = await axios.post(`${API_URL}/api/payment/create-order`, {
        amount: total,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      if (!data.success) throw new Error(data.message || "Failed to create payment order");

      const razorpayOrder = data.order;

      // Step 2: Open Razorpay popup
      const options = {
        key: "rzp_test_qUmhUFElBiSNIs",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "InchuCart",
        description: "Luxury Fashion Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyRes = await axios.post(`${API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              console.log("✅ Payment verified:", response.razorpay_payment_id);
              // Step 4: Save order + invoice
              await saveOrderAndInvoice({
                paymentMethod: formData.paymentMethod,
                paymentStatus: "paid",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            setLoading(false);
            alert(`Payment verification failed: ${err.message}`);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#C4A962" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled. Your order was not placed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      setLoading(false);
      alert(`Payment failed: ${error.message}`);
    }
  };

  // ─────────────────────────────────────────
  // FORM SUBMIT
  // ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert("Please fill in all fields");
      return;
    }

    const userId = loggedInUser?._id || loggedInUser?.id || null;
    console.log("👤 loggedInUser:", loggedInUser);
    console.log("🆔 userId:", userId);

    if (!userId) {
      alert("You must be logged in to place an order. Please log in and try again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      if (formData.paymentMethod === "cod") {
        // ── Cash on Delivery ──
        await saveOrderAndInvoice({ paymentMethod: "cod", paymentStatus: "pending" });
      } else {
        // ── Card or UPI → Razorpay ──
        await handleRazorpayPayment();
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.error("❌ Server error:", error.response.status, error.response.data);
        alert(`Order failed: ${error.response.data?.message || "Server error. Check backend logs."}`);
      } else if (error.request) {
        console.error("❌ No response from server");
        alert("Cannot connect to server. Make sure backend is running on port 8080.");
      } else {
        console.error("❌ Error:", error.message);
        alert(`Something went wrong: ${error.message}`);
      }
    }
  };

  // ─────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────
  if (orderPlaced && savedInvoice) {
    return (
      <div style={successStyle}>
        <div style={successCardStyle}>
          <FaCheckCircle style={successIconStyle} />
          <h1 style={successTitleStyle}>Order Placed Successfully!</h1>
          <p style={successTextStyle}>Thank you for your purchase. Your order has been confirmed.</p>
          <p style={successTextStyle}>Confirmation sent to <strong>{formData.email}</strong></p>
          <p style={{ color: "#C4A962", fontWeight: "700", fontSize: "16px", margin: "10px 0" }}>
            Invoice No: {savedInvoice.invoiceNumber}
          </p>
          <p style={{ color: savedInvoice.paymentStatus === "paid" ? "#28a745" : "#888", fontSize: "14px", marginBottom: "10px" }}>
            Payment: {savedInvoice.paymentStatus === "paid" ? "✅ Paid via Razorpay" : "💵 Cash on Delivery"}
          </p>
          <div style={successActionsStyle}>
            <button style={continueButtonStyle} onClick={() => navigate("/invoice", { state: { order: savedInvoice } })}>
              View Invoice
            </button>
            <button style={continueButtonStyle} onClick={() => navigate("/orders")}>
              View My Orders
            </button>
            <button style={shopMoreButtonStyle} onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced && !savedInvoice) {
    return (
      <div style={successStyle}>
        <div style={successCardStyle}><p>Loading your invoice...</p></div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // CHECKOUT FORM
  // ─────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate("/cart")}>
          <FaArrowLeft /> Back to Cart
        </button>
        <h1 style={titleStyle}>Checkout</h1>
        <div style={headerRightStyle}></div>
      </div>

      <div style={checkoutContainerStyle}>
        {/* Left Column - Form */}
        <div style={formSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaUser style={sectionIconStyle} /> Shipping Information
          </h2>
          
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter first name" />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter last name" />
              </div>
            </div>

            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}><FaEnvelope style={inputIconStyle} /> Email *</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter email address" />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}><FaPhone style={inputIconStyle} /> Phone *</label>
                <input type="tel" name="phone" value={formData.phone}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter phone number" />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}><FaMapMarkerAlt style={inputIconStyle} /> Address *</label>
              <input type="text" name="address" value={formData.address}
                onChange={handleInputChange} required style={inputStyle} placeholder="Enter street address" />
            </div>

            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>City *</label>
                <input type="text" name="city" value={formData.city}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter city" />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>State *</label>
                <input type="text" name="state" value={formData.state}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter state" />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>ZIP Code *</label>
                <input type="text" name="zipCode" value={formData.zipCode}
                  onChange={handleInputChange} required style={inputStyle} placeholder="Enter ZIP code" />
              </div>
            </div>

            {/* Payment Methods */}
            <h2 style={{...sectionTitleStyle, marginTop: "30px"}}>
              <FaCreditCard style={sectionIconStyle} /> Payment Method
            </h2>

            <div style={paymentOptionsStyle}>
              {/* Card */}
              <label style={{
                ...paymentOptionStyle,
                borderColor: formData.paymentMethod === "card" ? "#C4A962" : "#e0e0e0",
                background: formData.paymentMethod === "card" ? "#fffbf0" : "white"
              }}>
                <input type="radio" name="paymentMethod" value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleInputChange} style={radioStyle} />
                <div>
                  <span style={{ fontWeight: "600" }}>Credit / Debit Card</span>
                  <p style={paymentSubtextStyle}>Visa, Mastercard, RuPay — via Razorpay 🔒</p>
                </div>
              </label>

              {/* UPI */}
              <label style={{
                ...paymentOptionStyle,
                borderColor: formData.paymentMethod === "upi" ? "#C4A962" : "#e0e0e0",
                background: formData.paymentMethod === "upi" ? "#fffbf0" : "white"
              }}>
                <input type="radio" name="paymentMethod" value="upi"
                  checked={formData.paymentMethod === "upi"}
                  onChange={handleInputChange} style={radioStyle} />
                <div>
                  <span style={{ fontWeight: "600" }}>UPI</span>
                  <p style={paymentSubtextStyle}>Google Pay, PhonePe, Paytm — via Razorpay 🔒</p>
                </div>
              </label>

              {/* COD */}
              <label style={{
                ...paymentOptionStyle,
                borderColor: formData.paymentMethod === "cod" ? "#C4A962" : "#e0e0e0",
                background: formData.paymentMethod === "cod" ? "#fffbf0" : "white"
              }}>
                <input type="radio" name="paymentMethod" value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange} style={radioStyle} />
                <div>
                  <span style={{ fontWeight: "600" }}>Cash on Delivery</span>
                  <p style={paymentSubtextStyle}>Pay when your order arrives</p>
                </div>
              </label>
            </div>

            <button type="submit" style={{
              ...placeOrderButtonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }} disabled={loading}>
              {loading
                ? "Processing..."
                : formData.paymentMethod === "cod"
                  ? `Place Order • ${formatPrice(total)}`
                  : `Pay Now • ${formatPrice(total)}`}
            </button>

            {formData.paymentMethod !== "cod" && (
              <p style={razorpayNoteStyle}>🔒 Payments securely processed by Razorpay</p>
            )}
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div style={orderSummarySectionStyle}>
          <h2 style={summaryTitleStyle}>Order Summary</h2>
          <div style={itemsListStyle}>
            {cartItems?.map((item) => (
              <div key={item.id || item._id} style={summaryItemStyle}>
                <img
                  src={item.image || "https://via.placeholder.com/60x70?text=No+Image"}
                  alt={item.name}
                  style={summaryItemImageStyle}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/60x70?text=No+Image"; }}
                />
                <div style={summaryItemDetailsStyle}>
                  <h4 style={summaryItemNameStyle}>{item.name}</h4>
                  <p style={summaryItemQuantityStyle}>Qty: {item.quantity}</p>
                  <p style={summaryItemPriceStyle}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={priceBreakdownStyle}>
            <div style={priceRowStyle}>
              <span>Subtotal ({cartItems?.length || 0} items)</span>
              <span>{formatPrice(subtotal || 0)}</span>
            </div>
            {discount > 0 && (
              <div style={priceRowStyle}>
                <span>Discount</span>
                <span style={discountTextStyle}>-{formatPrice(discount)}</span>
              </div>
            )}
            {giftWrap && <div style={priceRowStyle}><span>Gift Wrap</span><span>{formatPrice(99)}</span></div>}
            {expressDelivery && <div style={priceRowStyle}><span>Express Delivery</span><span>{formatPrice(199)}</span></div>}
            <div style={priceRowStyle}>
              <span>Delivery</span>
              <span>{subtotal > 5000 ? "FREE" : formatPrice(99)}</span>
            </div>
            <div style={totalRowStyle}>
              <span>Total</span>
              <span style={totalAmountStyle}>{formatPrice(total || 0)}</span>
            </div>
          </div>

          <div style={deliveryInfoStyle}>
            <FaTruck style={deliveryIconStyle} />
            <div style={deliveryTextStyle}>
              <h4 style={deliveryTitleStyle}>Estimated Delivery</h4>
              <p style={deliverySubtextStyle}>{expressDelivery ? "1-2 business days" : "3-5 business days"}</p>
            </div>
          </div>

          <div style={secureBadgeStyle}>
            <FaCheckCircle style={secureIconStyle} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const pageStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 80px" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" };
const backButtonStyle = { padding: "10px 20px", background: "transparent", border: "1px solid #C4A962", borderRadius: "8px", color: "#C4A962", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", transition: "all 0.3s ease" };
const titleStyle = { fontSize: "32px", color: "#333", margin: 0 };
const headerRightStyle = { width: "100px" };
const checkoutContainerStyle = { display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px" };
const formSectionStyle = { background: "#fff", borderRadius: "15px", padding: "30px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" };
const sectionTitleStyle = { fontSize: "20px", color: "#333", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" };
const sectionIconStyle = { color: "#C4A962", fontSize: "20px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const formRowStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" };
const formGroupStyle = { display: "flex", flexDirection: "column", gap: "5px" };
const labelStyle = { fontSize: "14px", fontWeight: "500", color: "#333", display: "flex", alignItems: "center", gap: "5px" };
const inputIconStyle = { color: "#C4A962", fontSize: "14px" };
const inputStyle = { padding: "12px 15px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", outline: "none", transition: "border-color 0.3s ease" };
const paymentOptionsStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const paymentOptionStyle = { display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "14px", color: "#333", padding: "15px", border: "2px solid #e0e0e0", borderRadius: "10px", transition: "all 0.2s ease" };
const paymentSubtextStyle = { fontSize: "12px", color: "#888", margin: "3px 0 0 0" };
const radioStyle = { width: "18px", height: "18px", cursor: "pointer", accentColor: "#C4A962" };
const placeOrderButtonStyle = { width: "100%", padding: "15px", background: "#C4A962", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", marginTop: "10px" };
const razorpayNoteStyle = { textAlign: "center", fontSize: "13px", color: "#888", margin: "8px 0 0 0" };
const orderSummarySectionStyle = { background: "#fff", borderRadius: "15px", padding: "25px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: "100px" };
const summaryTitleStyle = { fontSize: "20px", color: "#333", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #e0e0e0" };
const itemsListStyle = { maxHeight: "300px", overflowY: "auto", marginBottom: "20px" };
const summaryItemStyle = { display: "flex", gap: "15px", padding: "15px 0", borderBottom: "1px solid #f0f0f0" };
const summaryItemImageStyle = { width: "60px", height: "70px", objectFit: "cover", borderRadius: "8px" };
const summaryItemDetailsStyle = { flex: 1 };
const summaryItemNameStyle = { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "5px" };
const summaryItemQuantityStyle = { fontSize: "12px", color: "#666", marginBottom: "5px" };
const summaryItemPriceStyle = { fontSize: "14px", fontWeight: "600", color: "#C4A962" };
const priceBreakdownStyle = { marginBottom: "20px" };
const priceRowStyle = { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#666" };
const discountTextStyle = { color: "#28a745" };
const totalRowStyle = { display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", borderTop: "2px solid #e0e0e0", fontSize: "18px", fontWeight: "700", color: "#333" };
const totalAmountStyle = { color: "#C4A962" };
const deliveryInfoStyle = { display: "flex", gap: "15px", padding: "15px", background: "#f8f9fa", borderRadius: "10px", marginBottom: "15px" };
const deliveryIconStyle = { color: "#C4A962", fontSize: "24px" };
const deliveryTextStyle = { flex: 1 };
const deliveryTitleStyle = { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "5px" };
const deliverySubtextStyle = { fontSize: "12px", color: "#666" };
const secureBadgeStyle = { display: "flex", alignItems: "center", gap: "8px", padding: "10px", background: "#e8f5e9", borderRadius: "8px", color: "#2e7d32", fontSize: "13px", fontWeight: "500" };
const secureIconStyle = { color: "#2e7d32", fontSize: "16px" };
const successStyle = { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" };
const successCardStyle = { background: "#fff", borderRadius: "15px", padding: "50px", textAlign: "center", boxShadow: "0 5px 30px rgba(0,0,0,0.1)", maxWidth: "600px" };
const successIconStyle = { fontSize: "80px", color: "#28a745", marginBottom: "20px" };
const successTitleStyle = { fontSize: "28px", color: "#333", marginBottom: "15px" };
const successTextStyle = { fontSize: "16px", color: "#666", marginBottom: "10px", lineHeight: "1.6" };
const successActionsStyle = { display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" };
const continueButtonStyle = { padding: "12px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", minWidth: "150px" };
const shopMoreButtonStyle = { padding: "12px 30px", background: "transparent", border: "2px solid #C4A962", borderRadius: "8px", color: "#C4A962", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", minWidth: "150px" };

export default Checkout;
