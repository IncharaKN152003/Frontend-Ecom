// Invoice.jsx — shows ALL invoices for logged-in user
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaDownload, FaPrint, FaArrowLeft, FaGem, FaUser,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt,
  FaCheckCircle, FaTruck, FaBox, FaStore, FaShoppingBag,
  FaFileInvoice, FaSearch
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API_URL = "http://localhost:8080";

function Invoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const invoiceRef = useRef();

  const [allInvoices, setAllInvoices] = useState([]);   // ALL invoices list
  const [selectedInvoice, setSelectedInvoice] = useState(null); // invoice being viewed
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      @media print {
        body * { visibility: hidden; }
        #invoice-card, #invoice-card * { visibility: visible; }
        #invoice-card { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [location.state]);

  const loadInvoices = async () => {
    setLoading(true);

    // ── Case 1: Came from Checkout or Orders page with a specific order ──
    if (location.state?.order) {
      const order = location.state.order;
      setAllInvoices([order]);
      setSelectedInvoice(order);
      setLoading(false);
      return;
    }

    // ── Case 2: Direct URL /invoice — fetch ALL invoices for user ──
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userId = user._id || user.id || user.userId;
      console.log("🧾 Fetching ALL invoices for userId:", userId);

      const response = await axios.get(`${API_URL}/api/invoices/user/${userId}`);
      console.log("🧾 Invoices response:", response.data);

      if (response.data.success) {
        const invoices = response.data.invoices || [];
        // Sort newest first
        invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllInvoices(invoices);
        // Auto-select the latest one
        if (invoices.length > 0) setSelectedInvoice(invoices[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching invoices:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "₹0";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch { return "N/A"; }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ordered":     return "#C4A962";
      case "processing":  return "#ffc107";
      case "shipped":     return "#17a2b8";
      case "delivered":   return "#28a745";
      case "cancelled":   return "#dc3545";
      default:            return "#C4A962";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "ordered":     return <FaShoppingBag />;
      case "processing":  return <FaBox />;
      case "shipped":     return <FaTruck />;
      case "delivered":   return <FaCheckCircle />;
      default:            return <FaShoppingBag />;
    }
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, backgroundColor: "#ffffff", logging: false, windowWidth: 1200
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`invoice-${selectedInvoice?.invoiceNumber || "order"}.pdf`);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  const filteredInvoices = allInvoices.filter(inv =>
    (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(inv._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.deliveryStatus || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── LOADING ──
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading your invoices...</p>
      </div>
    );
  }

  // ── NO INVOICES ──
  if (allInvoices.length === 0) {
    return (
      <div style={styles.errorContainer}>
        <FaShoppingBag size={60} color="#C4A962" />
        <h2>No Invoices Found</h2>
        <p>You haven't placed any orders yet.</p>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>

      {/* ── TOP ACTION BAR ── */}
      <div style={styles.actionBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 style={styles.pageTitle}>My Invoices</h1>
        {selectedInvoice && (
          <div style={styles.actionButtons}>
            <button style={styles.printBtn} onClick={handlePrint} disabled={downloading}>
              <FaPrint /> Print
            </button>
            <button style={styles.downloadBtn} onClick={downloadPDF} disabled={downloading}>
              <FaDownload /> {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        )}
      </div>

      <div style={styles.mainLayout}>

        {/* ── LEFT: Invoice List ── */}
        <div style={styles.invoiceList}>
          <div style={styles.listHeader}>
            <span style={styles.listTitle}>
              <FaFileInvoice /> All Invoices ({allInvoices.length})
            </span>
            <div style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.invoiceItems}>
            {filteredInvoices.map((inv) => {
              const isSelected = (selectedInvoice?._id || selectedInvoice?.id) === (inv._id || inv.id);
              return (
                <div
                  key={inv._id || inv.id}
                  style={{ ...styles.invoiceItem, ...(isSelected ? styles.invoiceItemActive : {}) }}
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <div style={styles.invoiceItemTop}>
                    <span style={styles.invoiceNum}>{inv.invoiceNumber || `INV-${String(inv._id).slice(-6).toUpperCase()}`}</span>
                    <span style={{ ...styles.invoiceStatusDot, backgroundColor: getStatusColor(inv.deliveryStatus) }}>
                      {(inv.deliveryStatus || "ordered").charAt(0).toUpperCase() + (inv.deliveryStatus || "ordered").slice(1)}
                    </span>
                  </div>
                  <div style={styles.invoiceItemBottom}>
                    <span style={styles.invoiceDate}>{formatDateShort(inv.createdAt)}</span>
                    <span style={styles.invoiceAmount}>{formatPrice(inv.totalAmount || inv.total)}</span>
                  </div>
                  <div style={styles.invoiceItemItems}>
                    {(inv.items || []).slice(0, 2).map((item, i) => (
                      <span key={i} style={styles.invoiceItemName}>• {item.name}</span>
                    ))}
                    {(inv.items || []).length > 2 && (
                      <span style={styles.invoiceItemName}>+{inv.items.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Invoice Detail ── */}
        {selectedInvoice && (() => {
          const inv = selectedInvoice;
          const currentStatus = inv.deliveryStatus || inv.status || "ordered";
          const invoiceNumber = inv.invoiceNumber || `INV-${String(inv._id || inv.id).slice(-8).toUpperCase()}`;
          const orderDate = formatDate(inv.createdAt || inv.date);
          const estimatedDelivery = inv.estimatedDelivery ? formatDate(inv.estimatedDelivery) : "N/A";
          const deliveryCharges = inv.deliveryCharges ?? (inv.subtotal > 5000 ? 0 : 99);
          const subtotal = inv.subtotal || 0;
          const total = inv.total || inv.totalAmount || 0;

          return (
            <div style={styles.invoiceDetail}>
              <div ref={invoiceRef} id="invoice-card" style={styles.invoiceCard}>
                <div style={styles.watermark}>INCHU CART</div>

                {/* Header */}
                <div style={styles.invoiceHeader}>
                  <div style={styles.logoSection}>
                    <FaGem style={styles.logoIcon} />
                    <h1 style={styles.logoText}>INCHU<span style={styles.logoHighlight}>CART</span></h1>
                    <p style={styles.logoSubtext}>Luxury Fashion Store</p>
                    <p style={styles.gstInfo}>GSTIN: 27ABCDE1234F1Z5</p>
                  </div>
                  <div style={styles.invoiceInfo}>
                    <h2 style={styles.invoiceTitle}>TAX INVOICE</h2>
                    <div style={styles.invoiceDetails}>
                      <p><span style={styles.detailLabel}>Invoice No:</span> <span style={styles.detailValue}>{invoiceNumber}</span></p>
                      <p><span style={styles.detailLabel}>Order ID:</span> <span style={styles.detailValue}>{String(inv._id || inv.id).slice(-12)}</span></p>
                      <p><span style={styles.detailLabel}>Date:</span> <span style={styles.detailValue}>{orderDate}</span></p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div style={styles.statusSection}>
                  <div style={{ ...styles.statusBadge, backgroundColor: getStatusColor(currentStatus) }}>
                    {getStatusIcon(currentStatus)}
                    <span style={styles.statusText}>{currentStatus.toUpperCase()}</span>
                  </div>
                </div>

                {/* Billing Info */}
                <div style={styles.billingSection}>
                  <div style={styles.billingAddress}>
                    <h3 style={styles.sectionTitle}><FaUser /> Billing Address</h3>
                    <div style={styles.addressDetails}>
                      <p style={styles.name}>
                        {inv.shippingAddress?.fullName ||
                         `${inv.shippingAddress?.firstName || ""} ${inv.shippingAddress?.lastName || ""}`.trim()}
                      </p>
                      <p><FaEnvelope style={styles.iconSmall} />{inv.shippingAddress?.email || "N/A"}</p>
                      <p><FaPhone style={styles.iconSmall} />{inv.shippingAddress?.phone || "N/A"}</p>
                      <p><FaMapMarkerAlt style={styles.iconSmall} />{inv.shippingAddress?.address || "N/A"}</p>
                      <p>{inv.shippingAddress?.city}, {inv.shippingAddress?.state} - {inv.shippingAddress?.pincode || inv.shippingAddress?.zipCode || "N/A"}</p>
                    </div>
                  </div>

                  <div style={styles.orderSummary}>
                    <h3 style={styles.sectionTitle}><FaCalendarAlt /> Order Summary</h3>
                    <div style={styles.summaryDetails}>
                      <p>
                        <span style={styles.summaryLabel}>Payment:</span>
                        <span style={styles.summaryValue}>
                          {inv.paymentMethod === "card" ? "💳 Credit/Debit Card" :
                           inv.paymentMethod === "upi" ? "📱 UPI" :
                           inv.paymentMethod === "cod" ? "💵 Cash on Delivery" :
                           inv.paymentMethod || "N/A"}
                        </span>
                      </p>
                      <p>
                        <span style={styles.summaryLabel}>Status:</span>
                        <span style={{ fontWeight: "600", color: inv.paymentStatus === "paid" ? "#28a745" : "#ffc107" }}>
                          {inv.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
                        </span>
                      </p>
                      <p>
                        <span style={styles.summaryLabel}>Est. Delivery:</span>
                        <span style={styles.summaryValue}>{estimatedDelivery}</span>
                      </p>
                      {inv.giftWrap && <p><span style={styles.summaryLabel}>Gift Wrap:</span><span style={styles.summaryValue}>Yes (+₹99)</span></p>}
                      {inv.expressDelivery && <p><span style={styles.summaryLabel}>Express:</span><span style={styles.summaryValue}>Yes (+₹199)</span></p>}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div style={styles.itemsSection}>
                  <h3 style={styles.sectionTitle}>Order Items</h3>
                  <table style={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Item</th>
                        <th style={styles.tableHeader}>Description</th>
                        <th style={styles.tableHeader}>Qty</th>
                        <th style={styles.tableHeader}>Unit Price</th>
                        <th style={styles.tableHeader}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(inv.items || []).map((item, index) => (
                        <tr key={index} style={styles.tableRow}>
                          <td style={styles.tableCell}>
                            <img
                              src={item.image || "https://via.placeholder.com/50x60?text=No+Image"}
                              alt={item.name}
                              style={styles.itemImage}
                              onError={e => { e.target.src = "https://via.placeholder.com/50x60?text=No+Image"; }}
                            />
                          </td>
                          <td style={styles.tableCell}>
                            <div style={styles.itemName}>{item.name || item.productName}</div>
                            {item.brand && <div style={styles.itemMeta}>Brand: {item.brand}</div>}
                            {item.size && <div style={styles.itemMeta}>Size: {item.size}</div>}
                            {item.color && <div style={styles.itemMeta}>Color: {item.color}</div>}
                          </td>
                          <td style={styles.tableCell}>{item.quantity || 1}</td>
                          <td style={styles.tableCell}>{formatPrice(item.price)}</td>
                          <td style={styles.tableCell}>{formatPrice(item.price * (item.quantity || 1))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Breakdown */}
                <div style={styles.priceSection}>
                  <div style={styles.priceBreakdown}>
                    <div style={styles.priceRow}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    {inv.discount > 0 && (
                      <div style={styles.priceRow}><span>Discount</span><span style={{ color: "#28a745" }}>-{formatPrice(inv.discount)}</span></div>
                    )}
                    {inv.giftWrap && <div style={styles.priceRow}><span>Gift Wrap</span><span>+₹99</span></div>}
                    {inv.expressDelivery && <div style={styles.priceRow}><span>Express Delivery</span><span>+₹199</span></div>}
                    <div style={styles.priceRow}>
                      <span>Delivery Charges</span>
                      <span style={deliveryCharges === 0 ? { color: "#28a745", fontWeight: "600" } : {}}>
                        {deliveryCharges === 0 ? "FREE" : `+₹${deliveryCharges}`}
                      </span>
                    </div>
                    <div style={styles.totalRow}>
                      <span>Total Amount</span>
                      <span style={styles.totalAmount}>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.invoiceFooter}>
                  <p>Thank you for shopping with INCHU CART!</p>
                  <p style={styles.footerNote}>This is a computer generated invoice. No signature required.</p>
                  <p style={styles.footerNote}>For queries: support@inchucart.com | +91 12345 67890</p>
                  <div style={styles.storeInfo}><FaStore /> INCHU CART - Luxury Fashion Store</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { fontFamily: "'Inter',sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "30px 40px" },
  actionBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  backBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #C4A962", borderRadius: "8px", color: "#C4A962", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" },
  pageTitle: { fontSize: "28px", color: "#333", margin: 0 },
  actionButtons: { display: "flex", gap: "10px" },
  printBtn: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" },
  downloadBtn: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" },
  mainLayout: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "25px", alignItems: "start" },
  // Invoice List (left panel)
  invoiceList: { background: "white", borderRadius: "15px", boxShadow: "0 5px 20px rgba(0,0,0,0.07)", overflow: "hidden", position: "sticky", top: "20px" },
  listHeader: { padding: "15px", borderBottom: "1px solid #f0f0f0" },
  listTitle: { display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "10px" },
  searchBox: { position: "relative" },
  searchIcon: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "13px" },
  searchInput: { width: "100%", padding: "8px 8px 8px 30px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" },
  invoiceItems: { maxHeight: "70vh", overflowY: "auto" },
  invoiceItem: { padding: "15px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", transition: "background 0.2s" },
  invoiceItemActive: { background: "#fffbf0", borderLeft: "3px solid #C4A962" },
  invoiceItemTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  invoiceNum: { fontSize: "13px", fontWeight: "600", color: "#333" },
  invoiceStatusDot: { fontSize: "10px", padding: "2px 8px", borderRadius: "10px", color: "white", fontWeight: "600" },
  invoiceItemBottom: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  invoiceDate: { fontSize: "11px", color: "#999" },
  invoiceAmount: { fontSize: "13px", fontWeight: "700", color: "#C4A962" },
  invoiceItemItems: { display: "flex", flexDirection: "column", gap: "2px" },
  invoiceItemName: { fontSize: "11px", color: "#666" },
  // Invoice Detail (right panel)
  invoiceDetail: { flex: 1 },
  invoiceCard: { background: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "40px", position: "relative", overflow: "hidden" },
  watermark: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: "80px", fontWeight: "bold", color: "rgba(196,169,98,0.06)", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 0 },
  invoiceHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f0f0", position: "relative", zIndex: 1 },
  logoSection: { textAlign: "left" },
  logoIcon: { fontSize: "40px", color: "#C4A962", marginBottom: "10px" },
  logoText: { fontSize: "24px", color: "#333", margin: 0, fontFamily: "'Playfair Display',serif" },
  logoHighlight: { color: "#C4A962" },
  logoSubtext: { fontSize: "12px", color: "#666", margin: "5px 0 2px" },
  gstInfo: { fontSize: "11px", color: "#999", margin: 0 },
  invoiceInfo: { textAlign: "right" },
  invoiceTitle: { fontSize: "28px", color: "#C4A962", margin: "0 0 15px", fontWeight: "600", letterSpacing: "1px" },
  invoiceDetails: { fontSize: "13px", color: "#666", lineHeight: "1.8" },
  detailLabel: { color: "#999", marginRight: "8px" },
  detailValue: { color: "#333", fontWeight: "500" },
  statusSection: { marginBottom: "30px", textAlign: "right", position: "relative", zIndex: 1 },
  statusBadge: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", borderRadius: "30px", color: "white", fontSize: "14px", fontWeight: "600" },
  statusText: { marginLeft: "5px" },
  billingSection: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px", position: "relative", zIndex: 1 },
  sectionTitle: { fontSize: "15px", color: "#333", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" },
  billingAddress: {},
  addressDetails: { fontSize: "14px", color: "#666", lineHeight: "1.8" },
  name: { fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "8px" },
  iconSmall: { marginRight: "8px", color: "#C4A962", fontSize: "12px" },
  orderSummary: {},
  summaryDetails: { fontSize: "14px", color: "#666", lineHeight: "2.2" },
  summaryLabel: { display: "inline-block", width: "130px", color: "#999" },
  summaryValue: { color: "#333", fontWeight: "500" },
  itemsSection: { marginBottom: "30px", position: "relative", zIndex: 1 },
  itemsTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  tableHeader: { padding: "12px", textAlign: "left", borderBottom: "2px solid #C4A962", color: "#333", fontWeight: "600", backgroundColor: "#f8f9fa" },
  tableRow: { borderBottom: "1px solid #f0f0f0" },
  tableCell: { padding: "12px", color: "#333", verticalAlign: "middle" },
  itemImage: { width: "50px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #f0f0f0" },
  itemName: { fontWeight: "500", marginBottom: "4px", color: "#333" },
  itemMeta: { fontSize: "11px", color: "#999", marginTop: "2px" },
  priceSection: { marginBottom: "30px", paddingTop: "20px", borderTop: "2px solid #f0f0f0", position: "relative", zIndex: 1 },
  priceBreakdown: { maxWidth: "400px", marginLeft: "auto" },
  priceRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px", color: "#666" },
  totalRow: { display: "flex", justifyContent: "space-between", padding: "15px 0", marginTop: "10px", borderTop: "2px solid #C4A962", fontSize: "18px", fontWeight: "600", color: "#333" },
  totalAmount: { color: "#C4A962", fontSize: "22px" },
  invoiceFooter: { marginTop: "40px", paddingTop: "20px", borderTop: "2px solid #f0f0f0", textAlign: "center", position: "relative", zIndex: 1, color: "#666", fontSize: "14px" },
  footerNote: { fontSize: "11px", color: "#999", marginTop: "5px" },
  storeInfo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", color: "#C4A962", padding: "10px", background: "#fafafa", borderRadius: "8px", marginTop: "10px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px" },
  loader: { width: "50px", height: "50px", border: "3px solid #f3f3f3", borderTop: "3px solid #C4A962", borderRadius: "50%", animation: "spin 1s linear infinite" },
  errorContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px", textAlign: "center", padding: "20px" },
  backButton: { padding: "12px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "20px" },
};

export default Invoice;
