// Orders.jsx — fetches from MongoDB
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBox, FaTruck, FaCheckCircle, FaClock,
  FaArrowLeft, FaEye, FaStar, FaTimes, FaFileInvoice
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("👤 loggedInUser from localStorage:", user);

    if (!user) { navigate("/login"); return; }
    setLoggedInUser(user);
    loadOrders(user);
  }, [navigate]);

  const loadOrders = async (user) => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Try all possible userId fields
      const userId = user._id || user.id || user.userId;
      console.log("📦 Fetching orders for userId:", userId);

      if (!userId) {
        setError("User ID not found. Please log out and log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
      console.log("📦 Orders API response:", response.data);

      if (response.data.success) {
        const fetched = response.data.orders || [];
        fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(`✅ Loaded ${fetched.length} orders`);
        setOrders(fetched);
      } else {
        setError("Could not load orders: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error loading orders:", err.message);
      if (err.response) {
        console.error("❌ Server responded:", err.response.status, err.response.data);
        setError(`Server error ${err.response.status}: ${err.response.data?.message || err.message}`);
      } else {
        setError("Cannot connect to server. Make sure backend is running on port 8080.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":   return <FaCheckCircle style={{ color: "#28a745" }} />;
      case "shipped":     return <FaTruck style={{ color: "#C4A962" }} />;
      case "ordered":
      case "processing":  return <FaClock style={{ color: "#ffc107" }} />;
      case "cancelled":   return <FaTimes style={{ color: "#dc3545" }} />;
      default:            return <FaBox style={{ color: "#6c757d" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":   return "#28a745";
      case "shipped":     return "#C4A962";
      case "ordered":
      case "processing":  return "#ffc107";
      case "cancelled":   return "#dc3545";
      default:            return "#6c757d";
    }
  };

  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(`${API_URL}/api/orders/${orderId}`, { deliveryStatus: "cancelled" });
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, deliveryStatus: "cancelled" } : o))
      );
    } catch (err) {
      alert("Could not cancel order. Please try again.");
    }
  };

  const reorder = (order) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    (order.items || []).forEach(item => {
      const idx = cart.findIndex(c => c.id === (item.productId || item.id));
      if (idx >= 0) cart[idx].quantity += item.quantity;
      else cart.push({ ...item, id: item.productId || item.id });
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const viewInvoice = (order) => navigate("/invoice", { state: { order } });

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loaderStyle}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1 style={titleStyle}>My Orders</h1>
          <div />
        </div>
        <div style={emptyStateStyle}>
          <FaTimes style={{ fontSize: "60px", color: "#dc3545", marginBottom: "20px" }} />
          <h2 style={emptyTitleStyle}>Something went wrong</h2>
          <p style={emptyTextStyle}>{error}</p>
          <button style={shopNowButtonStyle} onClick={() => loadOrders(loggedInUser)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>

      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 style={titleStyle}>My Orders</h1>
        <span style={orderCountStyle}>
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <FaBox style={emptyIconStyle} />
          <h2 style={emptyTitleStyle}>No orders yet</h2>
          <p style={emptyTextStyle}>Looks like you haven't placed any orders</p>
          <button style={shopNowButtonStyle} onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={ordersContainerStyle}>
          {orders.map((order) => {
            const status = order.deliveryStatus || order.status || "ordered";
            const orderId = order._id || order.id;
            const orderDate = order.createdAt || order.date;
            const items = order.items || [];
            const total = order.totalAmount || order.total || 0;

            return (
              <div key={orderId} style={orderCardStyle}>
                <div style={orderHeaderStyle}>
                  <div style={orderInfoStyle}>
                    <span style={orderIdStyle}>Order #{String(orderId).slice(-8).toUpperCase()}</span>
                    <span style={orderDateStyle}>Placed on {formatDate(orderDate)}</span>
                    <span style={{ fontSize: "12px", color: order.paymentStatus === "paid" ? "#28a745" : "#ffc107", fontWeight: "600" }}>
                      {order.paymentStatus === "paid" ? "✅ Paid via Razorpay" : "💵 Cash on Delivery"}
                    </span>
                  </div>
                  <div style={{ ...orderStatusBadgeStyle, backgroundColor: `${getStatusColor(status)}20` }}>
                    {getStatusIcon(status)}
                    <span style={{ ...statusTextStyle, color: getStatusColor(status) }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>

                <div style={orderItemsStyle}>
                  {items.map((item, index) => (
                    <div key={index} style={orderItemStyle}>
                      <img
                        src={item.image || "https://via.placeholder.com/60x70?text=No+Image"}
                        alt={item.name}
                        style={orderItemImageStyle}
                        onError={e => { e.target.src = "https://via.placeholder.com/60x70?text=No+Image"; }}
                      />
                      <div style={orderItemDetailsStyle}>
                        <h4 style={orderItemNameStyle}>{item.name}</h4>
                        <p style={orderItemQuantityStyle}>Qty: {item.quantity}</p>
                        <p style={orderItemPriceStyle}>{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={orderFooterStyle}>
                  <div style={orderTotalStyle}>
                    <span>Total:</span>
                    <span style={totalAmountStyle}>{formatPrice(total)}</span>
                  </div>
                  <div style={orderActionsStyle}>
                    <button style={detailsButtonStyle} onClick={() => setSelectedOrder(order)}>
                      <FaEye /> Details
                    </button>
                    <button style={invoiceButtonStyle} onClick={() => viewInvoice(order)}>
                      <FaFileInvoice /> Invoice
                    </button>
                    {status === "delivered" && (
                      <button style={reviewButtonStyle}><FaStar /> Review</button>
                    )}
                    {(status === "ordered" || status === "processing") && (
                      <button style={cancelButtonStyle} onClick={() => cancelOrder(orderId)}>
                        <FaTimes /> Cancel
                      </button>
                    )}
                    <button style={reorderButtonStyle} onClick={() => reorder(order)}>
                      <FaBox /> Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitleStyle}>Order Details</h2>
            <button style={closeButtonStyle} onClick={() => setSelectedOrder(null)}>×</button>
            <div style={modalContentStyle}>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Order ID:</span>
                <span style={modalValueStyle}>#{String(selectedOrder._id || selectedOrder.id).slice(-8).toUpperCase()}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Date:</span>
                <span style={modalValueStyle}>{formatDate(selectedOrder.createdAt || selectedOrder.date)}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Status:</span>
                <span style={{ ...modalValueStyle, color: getStatusColor(selectedOrder.deliveryStatus) }}>
                  {getStatusIcon(selectedOrder.deliveryStatus)}
                  <span style={{ marginLeft: "5px" }}>{(selectedOrder.deliveryStatus || "ordered").charAt(0).toUpperCase() + (selectedOrder.deliveryStatus || "ordered").slice(1)}</span>
                </span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Payment:</span>
                <span style={modalValueStyle}>
                  {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" :
                   selectedOrder.paymentMethod === "card" ? "Credit/Debit Card" :
                   selectedOrder.paymentMethod === "upi" ? "UPI" :
                   selectedOrder.paymentMethod}
                  {" — "}
                  <span style={{ color: selectedOrder.paymentStatus === "paid" ? "#28a745" : "#ffc107", fontWeight: "600" }}>
                    {selectedOrder.paymentStatus === "paid" ? "Paid ✅" : "Pending 💵"}
                  </span>
                </span>
              </div>
              {selectedOrder.shippingAddress && (
                <>
                  <h3 style={modalSubtitleStyle}>Shipping Address</h3>
                  <div style={modalAddressStyle}>
                    <p>{selectedOrder.shippingAddress.fullName || `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName}`}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.pincode || selectedOrder.shippingAddress.zipCode}</p>
                    <p>📞 {selectedOrder.shippingAddress.phone}</p>
                    <p>✉️ {selectedOrder.shippingAddress.email}</p>
                  </div>
                </>
              )}
              <h3 style={modalSubtitleStyle}>Items</h3>
              <div style={modalItemsStyle}>
                {(selectedOrder.items || []).map((item, i) => (
                  <div key={i} style={modalItemStyle}>
                    <img src={item.image || "https://via.placeholder.com/50x60?text=No+Image"} alt={item.name} style={modalItemImageStyle}
                      onError={e => { e.target.src = "https://via.placeholder.com/50x60?text=No+Image"; }} />
                    <div style={modalItemDetailsStyle}>
                      <h4 style={modalItemNameStyle}>{item.name}</h4>
                      <p style={modalItemQuantityStyle}>Qty: {item.quantity}</p>
                      <p style={modalItemPriceStyle}>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={modalGrandTotalStyle}>
                <span>Total Amount:</span>
                <span style={modalTotalAmountStyle}>{formatPrice(selectedOrder.totalAmount || selectedOrder.total)}</span>
              </div>
              {selectedOrder.estimatedDelivery && (
                <div style={modalDeliveryStyle}>
                  <FaTruck /> Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STYLES ── */
const pageStyle = { fontFamily: "'Inter',sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 80px" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const backButtonStyle = { padding: "10px 20px", background: "transparent", border: "1px solid #C4A962", borderRadius: "8px", color: "#C4A962", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" };
const titleStyle = { fontSize: "32px", color: "#333", margin: 0 };
const orderCountStyle = { fontSize: "16px", color: "#666", background: "#fff", padding: "8px 16px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const loadingStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" };
const loaderStyle = { width: "50px", height: "50px", border: "3px solid #f3f3f3", borderTop: "3px solid #C4A962", borderRadius: "50%", animation: "spin 1s linear infinite" };
const emptyStateStyle = { textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "15px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" };
const emptyIconStyle = { fontSize: "80px", color: "#C4A962", marginBottom: "20px" };
const emptyTitleStyle = { fontSize: "24px", color: "#333", marginBottom: "10px" };
const emptyTextStyle = { fontSize: "16px", color: "#666", marginBottom: "30px" };
const shopNowButtonStyle = { padding: "12px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer" };
const ordersContainerStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const orderCardStyle = { background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const orderHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "15px", borderBottom: "1px solid #e0e0e0", marginBottom: "15px" };
const orderInfoStyle = { display: "flex", flexDirection: "column", gap: "4px" };
const orderIdStyle = { fontSize: "16px", fontWeight: "600", color: "#333" };
const orderDateStyle = { fontSize: "12px", color: "#666" };
const orderStatusBadgeStyle = { display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "20px" };
const statusTextStyle = { fontSize: "12px", fontWeight: "500" };
const orderItemsStyle = { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" };
const orderItemStyle = { display: "flex", gap: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "8px" };
const orderItemImageStyle = { width: "60px", height: "70px", objectFit: "cover", borderRadius: "5px" };
const orderItemDetailsStyle = { flex: 1 };
const orderItemNameStyle = { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "5px" };
const orderItemQuantityStyle = { fontSize: "12px", color: "#666", marginBottom: "5px" };
const orderItemPriceStyle = { fontSize: "14px", fontWeight: "600", color: "#C4A962" };
const orderFooterStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid #e0e0e0" };
const orderTotalStyle = { display: "flex", gap: "10px", fontSize: "14px", color: "#666", alignItems: "center" };
const totalAmountStyle = { fontSize: "16px", fontWeight: "600", color: "#C4A962" };
const orderActionsStyle = { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" };
const detailsButtonStyle = { padding: "8px 15px", background: "transparent", border: "1px solid #6c757d", borderRadius: "5px", color: "#6c757d", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const invoiceButtonStyle = { padding: "8px 15px", background: "#C4A962", border: "none", borderRadius: "5px", color: "white", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const reviewButtonStyle = { padding: "8px 15px", background: "#ffc107", border: "none", borderRadius: "5px", color: "#333", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const cancelButtonStyle = { padding: "8px 15px", background: "#dc3545", border: "none", borderRadius: "5px", color: "white", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const reorderButtonStyle = { padding: "8px 15px", background: "#28a745", border: "none", borderRadius: "5px", color: "white", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { background: "#fff", borderRadius: "15px", padding: "30px", maxWidth: "600px", width: "90%", maxHeight: "80vh", overflowY: "auto", position: "relative" };
const modalTitleStyle = { fontSize: "24px", color: "#333", marginBottom: "20px", paddingRight: "30px" };
const closeButtonStyle = { position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" };
const modalContentStyle = { marginBottom: "20px" };
const modalRowStyle = { display: "flex", marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #f0f0f0" };
const modalLabelStyle = { width: "120px", fontSize: "14px", color: "#666", flexShrink: 0 };
const modalValueStyle = { flex: 1, fontSize: "14px", color: "#333", fontWeight: "500", display: "flex", alignItems: "center", gap: "5px" };
const modalAddressStyle = { background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", color: "#333", lineHeight: "1.8" };
const modalSubtitleStyle = { fontSize: "16px", color: "#333", margin: "20px 0 10px", fontWeight: "600" };
const modalItemsStyle = { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", maxHeight: "200px", overflowY: "auto" };
const modalItemStyle = { display: "flex", gap: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "8px" };
const modalItemImageStyle = { width: "50px", height: "60px", objectFit: "cover", borderRadius: "5px" };
const modalItemDetailsStyle = { flex: 1 };
const modalItemNameStyle = { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "5px" };
const modalItemQuantityStyle = { fontSize: "12px", color: "#666", marginBottom: "5px" };
const modalItemPriceStyle = { fontSize: "14px", fontWeight: "600", color: "#C4A962" };
const modalGrandTotalStyle = { display: "flex", justifyContent: "space-between", padding: "15px 0", borderTop: "2px solid #e0e0e0", fontSize: "18px", fontWeight: "700", color: "#333" };
const modalTotalAmountStyle = { color: "#C4A962" };
const modalDeliveryStyle = { display: "flex", alignItems: "center", gap: "10px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", marginTop: "20px", fontSize: "14px", color: "#666" };

export default Orders;
