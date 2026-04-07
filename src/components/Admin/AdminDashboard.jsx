// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = "http://localhost:8080/api";
import { 
  FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaChartBar,
  FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye,
  FaSearch, FaFilter, FaDownload, FaPrint, FaUserShield,
  FaStar, FaTimes, FaCheck, FaTruck, FaClock, FaCheckCircle,
  FaExclamationTriangle, FaRupeeSign, FaCalendarAlt, FaChartLine,
  FaStore, FaTags, FaSave, FaUndo, FaEnvelope, FaPhone,
  FaUser, FaUpload, FaImage
} from "react-icons/fa";

const PLACEHOLDER_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='50' viewBox='0 0 40 50'%3E%3Crect width='40' height='50' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='8' fill='%23999'%3ENo Img%3C/text%3E%3C/svg%3E`;

function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [settingsMessage, setSettingsMessage] = useState({ type: "", text: "" });
  const [adminInfo, setAdminInfo] = useState({ name: "Administrator", email: "", role: "admin" });
  
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0,
    pendingOrders: 0, lowStock: 0, todayOrders: 0, todayRevenue: 0,
    averageOrderValue: 0, topSellingCategory: "", conversionRate: 0
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  
  const [newProduct, setNewProduct] = useState({
    id: "", name: "", price: "", category: "", description: "",
    stock: 10, image: "", badge: "New", colors: [], sizes: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadMode, setImageUploadMode] = useState("upload");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [settings, setSettings] = useState({
    storeName: "INCHU CART", storeEmail: "admin@inchucart.com", currency: "INR",
    paymentCOD: true, paymentCard: true, paymentUPI: true,
    freeShippingThreshold: 500, standardShipping: 50, expressShipping: 150,
    emailNotifications: true, orderConfirmation: true, smsNotifications: false
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (!isAdmin) navigate("/admin/login");
    setAdminInfo({
      name: localStorage.getItem("adminName") || "Administrator",
      email: localStorage.getItem("adminEmail") || "",
      role: localStorage.getItem("adminRole") || "admin"
    });
    loadSettings();
  }, [navigate]);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => { loadAllData(); setLastUpdated(new Date()); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("adminSettings"));
      if (savedSettings) setSettings(savedSettings);
    } catch (error) { console.error("Error loading settings:", error); }
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      setSettingsMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setSettingsMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setSettingsMessage({ type: "error", text: "Failed to save settings" });
      setTimeout(() => setSettingsMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      storeName: "INCHU CART", storeEmail: "admin@inchucart.com", currency: "INR",
      paymentCOD: true, paymentCard: true, paymentUPI: true,
      freeShippingThreshold: 500, standardShipping: 50, expressShipping: 150,
      emailNotifications: true, orderConfirmation: true, smsNotifications: false
    };
    setSettings(defaultSettings);
    setSettingsMessage({ type: "info", text: "Settings reset to default" });
    setTimeout(() => setSettingsMessage({ type: "", text: "" }), 3000);
  };

  const handleSettingChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  const handleCheckboxChange = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const loadAllData = async () => {
    setLoading(true);
    await loadProducts();
    loadOrders();
    await loadUsers();
    loadChartData();
    setTimeout(() => setLoading(false), 500);
  };

  // ========== LOAD STATS FROM MONGODB ==========
  const loadStats = async (productList, userList) => {
    try {
      const ordersData = JSON.parse(localStorage.getItem("orders")) || [];
      const allProducts = productList || products;
      const allUsers = userList || users;
      const today = new Date().toDateString();
      const pendingOrders = ordersData.filter(o => o.status === "processing" || o.status === "ordered").length;
      const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
      const todayOrders = ordersData.filter(o => new Date(o.date).toDateString() === today).length;
      const todayRevenue = ordersData.filter(o => new Date(o.date).toDateString() === today).reduce((sum, o) => sum + (o.total || 0), 0);
      const averageOrderValue = ordersData.length > 0 ? Math.round(totalRevenue / ordersData.length) : 0;
      const uniqueUsers = new Set(ordersData.map(o => o.userId)).size;
      const conversionRate = allUsers.length > 0 ? Math.round((uniqueUsers / allUsers.length) * 100) : 0;
      setStats({
        totalProducts: allProducts.length,
        totalOrders: ordersData.length,
        totalUsers: allUsers.length,
        totalRevenue, pendingOrders,
        lowStock: allProducts.filter(p => (p.stock || 10) < 10).length,
        todayOrders, todayRevenue, averageOrderValue,
        topSellingCategory: "N/A", conversionRate
      });
    } catch (error) { console.error("Error loading stats:", error); }
  };

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      if (response.data.success) {
        const allProducts = response.data.products;
        setProducts(allProducts);
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        applyProductFilters(allProducts, searchTerm, categoryFilter);
        await loadStats(allProducts, null);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(allOrders);
      applyOrderFilters(allOrders, statusFilter, dateFilter);
    } catch (error) { console.error("Error loading orders:", error); }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users`);
      const raw = response.data;
      const apiUsers = Array.isArray(raw) ? raw : Array.isArray(raw?.users) ? raw.users : Array.isArray(raw?.data) ? raw.data : [];
      const normalized = apiUsers.map(u => ({
        ...u,
        name: u.fullName || u.name || "Unknown",
        phone: u.phoneNumber || u.phone || u.phone_number || u.mobile || null,
        email: u.email,
        createdAt: u.createdAt || u.registeredAt || null,
      }));
      setUsers(normalized);
      applyUserFilters(normalized, userSearchTerm);
      await loadStats(null, normalized);
    } catch (apiError) {
      console.warn("⚠️ API unavailable, falling back to localStorage:", apiError.message);
      try {
        const localUsers = JSON.parse(localStorage.getItem("users")) || [];
        const normalized = localUsers.map(u => ({ ...u, name: u.fullName || u.name || "Unknown", phone: u.phoneNumber || u.phone || null }));
        setUsers(normalized);
        applyUserFilters(normalized, userSearchTerm);
      } catch (localError) { console.error("Error loading users from localStorage:", localError); }
    }
  };

  const loadChartData = () => {
    try {
      const ordersData = JSON.parse(localStorage.getItem("orders")) || [];
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const dayOrders = ordersData.filter(order => new Date(order.date).toDateString() === date.toDateString());
        const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        last7Days.push({ date: dateString, revenue, orders: dayOrders.length });
      }
      setSalesData(last7Days);
      const productSales = {};
      ordersData.forEach(order => {
        order.items?.forEach(item => {
          if (!productSales[item.id]) productSales[item.id] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        });
      });
      setTopProducts(Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5));
    } catch (error) { console.error("Error loading chart data:", error); }
  };

  const applyProductFilters = (productList, search, category) => {
    let filtered = [...productList];
    if (search) filtered = filtered.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") filtered = filtered.filter(p => p.category === category);
    setFilteredProducts(filtered);
  };

  const applyOrderFilters = (orderList, status, dateRange) => {
    let filtered = [...orderList];
    if (status !== "all") filtered = filtered.filter(o => o.status === status);
    if (dateRange !== "all") {
      const today = new Date();
      const startDate = new Date();
      switch(dateRange) {
        case "today": startDate.setHours(0, 0, 0, 0); filtered = filtered.filter(o => new Date(o.date) >= startDate); break;
        case "week": startDate.setDate(today.getDate() - 7); filtered = filtered.filter(o => new Date(o.date) >= startDate); break;
        case "month": startDate.setMonth(today.getMonth() - 1); filtered = filtered.filter(o => new Date(o.date) >= startDate); break;
        default: break;
      }
    }
    setFilteredOrders(filtered);
  };

  const applyUserFilters = (userList, search) => {
    let filtered = [...userList];
    if (search) filtered = filtered.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    setFilteredUsers(filtered);
  };

  useEffect(() => { applyProductFilters(products, searchTerm, categoryFilter); }, [searchTerm, categoryFilter, products]);
  useEffect(() => { applyOrderFilters(orders, statusFilter, dateFilter); }, [statusFilter, dateFilter, orders]);
  useEffect(() => { applyUserFilters(users, userSearchTerm); }, [userSearchTerm, users]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select a valid image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image size must be less than 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      setNewProduct(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => { setImagePreview(null); setNewProduct(prev => ({ ...prev, image: "" })); };

  // ========== ADD PRODUCT → MONGODB ✅ ==========
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill all required fields"); return;
    }
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        originalPrice: Math.round(parseFloat(newProduct.price) * 1.2),
        description: newProduct.description || "",
        category: newProduct.category,
        brand: "",
        stock: parseInt(newProduct.stock) || 10,
        image: newProduct.image || "",
        images: newProduct.image ? [newProduct.image] : [],
        badge: newProduct.badge || "New",
        colors: newProduct.colors.length ? newProduct.colors : [],
        sizes: newProduct.sizes.length ? newProduct.sizes : [],
        features: newProduct.description ? [newProduct.description] : ["Premium Quality"],
        isActive: true
      };
      const response = await axios.post(`${API_BASE}/products`, productData);
      if (response.data.success) {
        window.dispatchEvent(new Event('productsUpdated'));
        await loadProducts();
        setShowAddModal(false);
        setNewProduct({ id: "", name: "", price: "", category: "", description: "", stock: 10, image: "", badge: "New", colors: [], sizes: [] });
        setImagePreview(null);
        alert(`✅ Product added to MongoDB successfully!`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      id: product._id || product.id,
      name: product.name, price: product.price,
      category: product.category?.toLowerCase() || "",
      description: product.description || "",
      stock: product.stock || 10,
      image: product.image || "",
      badge: product.badge || "New",
      colors: product.colors || [],
      sizes: product.sizes || []
    });
    setImagePreview(product.image || null);
    setImageUploadMode("upload");
    setShowAddModal(true);
  };

  // ========== UPDATE PRODUCT → MONGODB ✅ ==========
  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill all required fields"); return;
    }
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        originalPrice: editingProduct?.originalPrice || Math.round(parseFloat(newProduct.price) * 1.2),
        description: newProduct.description || "",
        category: newProduct.category,
        stock: parseInt(newProduct.stock) || 10,
        image: newProduct.image || editingProduct?.image || "",
        images: newProduct.image ? [newProduct.image] : [],
        badge: newProduct.badge || "New",
        colors: newProduct.colors.length ? newProduct.colors : (editingProduct?.colors || []),
        sizes: newProduct.sizes.length ? newProduct.sizes : (editingProduct?.sizes || []),
        features: editingProduct?.features || ["Premium Quality"],
        isActive: true
      };
      const productId = editingProduct._id || editingProduct.id;
      const response = await axios.put(`${API_BASE}/products/${productId}`, productData);
      if (response.data.success) {
        window.dispatchEvent(new Event('productsUpdated'));
        await loadProducts();
        setShowAddModal(false);
        setEditingProduct(null);
        setNewProduct({ id: "", name: "", price: "", category: "", description: "", stock: 10, image: "", badge: "New", colors: [], sizes: [] });
        setImagePreview(null);
        alert("✅ Product updated in MongoDB successfully!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Failed to update product: " + (error.response?.data?.message || error.message));
    }
  };

  // ========== DELETE PRODUCT → MONGODB ✅ ==========
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const product = products.find(p => p._id === productId || p.id === productId);
        const mongoId = product?._id || productId;
        const response = await axios.delete(`${API_BASE}/products/${mongoId}`);
        if (response.data.success) {
          await loadProducts();
          alert("✅ Product deleted from MongoDB successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("❌ Failed to delete product: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const updatedOrders = allOrders.filter(o => o.id !== orderId);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        applyOrderFilters(updatedOrders, statusFilter, dateFilter);
        alert("✅ Order deleted successfully!");
      } catch (error) { console.error("Error deleting order:", error); }
    }
  };

  const handleDeleteUser = async (userEmail) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const userToDelete = users.find(u => u.email === userEmail);
        if (userToDelete?.id || userToDelete?._id) {
          await axios.delete(`${API_BASE}/users/${userToDelete.id || userToDelete._id}`);
        }
        const localUsers = JSON.parse(localStorage.getItem("users")) || [];
        localStorage.setItem("users", JSON.stringify(localUsers.filter(u => u.email !== userEmail)));
        const updated = users.filter(u => u.email !== userEmail);
        setUsers(updated);
        applyUserFilters(updated, userSearchTerm);
        alert("✅ User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        const updated = users.filter(u => u.email !== userEmail);
        setUsers(updated);
        applyUserFilters(updated, userSearchTerm);
        alert("⚠️ User removed from view.");
      }
    }
  };

  const getUserPhone = (user) => user.phone || user.mobile || user.phoneNumber || user.phone_number || user.contactNumber || user.contact || user.mobileNumber || null;

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (status) => {
    switch(status) {
      case "ordered": return "#17a2b8"; case "processing": return "#ffc107";
      case "shipped": return "#C4A962"; case "delivered": return "#28a745";
      case "cancelled": return "#dc3545"; default: return "#6c757d";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "ordered": return <FaShoppingBag />; case "processing": return <FaClock />;
      case "shipped": return <FaTruck />; case "delivered": return <FaCheckCircle />;
      case "cancelled": return <FaTimes />; default: return <FaBox />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleRefresh = () => { loadAllData(); setLastUpdated(new Date()); };

  const renderDashboard = () => (
    <div style={styles.dashboardContent}>
      <div style={styles.dashboardHeader}>
        <h2 style={styles.pageTitle}>Dashboard Overview</h2>
        <div style={styles.headerControls}>
          <span style={styles.lastUpdated}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button style={styles.refreshButton} onClick={handleRefresh}><FaChartLine /> Refresh Data</button>
        </div>
      </div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><div style={statIconStyle("#C4A962")}><FaBox /></div><div style={styles.statInfo}><h3 style={styles.statValue}>{stats.totalProducts}</h3><p style={styles.statLabel}>Total Products</p></div></div>
        <div style={styles.statCard}><div style={statIconStyle("#28a745")}><FaShoppingBag /></div><div style={styles.statInfo}><h3 style={styles.statValue}>{stats.totalOrders}</h3><p style={styles.statLabel}>Total Orders</p></div></div>
        <div style={styles.statCard}><div style={statIconStyle("#17a2b8")}><FaUsers /></div><div style={styles.statInfo}><h3 style={styles.statValue}>{stats.totalUsers}</h3><p style={styles.statLabel}>Total Users</p></div></div>
        <div style={styles.statCard}><div style={statIconStyle("#ffc107")}><FaRupeeSign /></div><div style={styles.statInfo}><h3 style={styles.statValue}>{formatPrice(stats.totalRevenue)}</h3><p style={styles.statLabel}>Total Revenue</p></div></div>
      </div>
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}><FaCalendarAlt /> Today's Performance</h3>
        <div style={styles.todayStats}>
          <div style={styles.todayStat}><span style={styles.todayLabel}>Today's Orders</span><span style={styles.todayValue}>{stats.todayOrders}</span></div>
          <div style={styles.todayStat}><span style={styles.todayLabel}>Today's Revenue</span><span style={styles.todayValue}>{formatPrice(stats.todayRevenue)}</span></div>
          <div style={styles.todayStat}><span style={styles.todayLabel}>Avg. Order Value</span><span style={styles.todayValue}>{formatPrice(stats.averageOrderValue)}</span></div>
          <div style={styles.todayStat}><span style={styles.todayLabel}>Conversion Rate</span><span style={styles.todayValue}>{stats.conversionRate}%</span></div>
        </div>
      </div>
      {(stats.pendingOrders > 0 || stats.lowStock > 0) && (
        <div style={styles.alertsCard}>
          <h3 style={{...styles.sectionTitle, color: "#856404"}}><FaExclamationTriangle color="#856404" /> Alerts</h3>
          <div style={styles.alertsList}>
            {stats.pendingOrders > 0 && <div style={styles.alert}><FaClock color="#856404" /><span style={{color: "#856404", fontWeight: "500"}}>{stats.pendingOrders} pending orders need attention</span></div>}
            {stats.lowStock > 0 && <div style={styles.alert}><FaExclamationTriangle color="#721c24" /><span style={{color: "#721c24", fontWeight: "500"}}>{stats.lowStock} products running low on stock</span></div>}
          </div>
        </div>
      )}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}><FaChartLine /> Last 7 Days Sales</h3>
        <div style={styles.chartContainer}>
          {salesData.map((day, index) => (
            <div key={index} style={styles.chartBar}>
              <div style={styles.barLabel}>{day.date}</div>
              <div style={styles.barContainer}><div style={{ ...styles.bar, height: `${Math.max((day.revenue / (stats.totalRevenue || 1)) * 100, 5)}px`, backgroundColor: "#C4A962" }} /></div>
              <div style={styles.barValue}>{formatPrice(day.revenue)}</div>
              <div style={styles.barOrders}>({day.orders} orders)</div>
            </div>
          ))}
        </div>
      </div>
      {topProducts.length > 0 && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}><FaTags /> Top Selling Products</h3>
          <div style={styles.topProductsList}>
            {topProducts.map((product, index) => (
              <div key={index} style={styles.topProduct}>
                <div style={styles.topProductRank}>#{index + 1}</div>
                <img src={product.image || PLACEHOLDER_IMG} alt={product.name} style={styles.topProductImage} />
                <div style={styles.topProductInfo}><div style={styles.topProductName}>{product.name}</div><div style={styles.topProductStats}>Sold: {product.quantity} units | Revenue: {formatPrice(product.revenue)}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Recent Orders</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead><tr><th style={styles.tableHeader}>Order ID</th><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Customer</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map((order, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{order.id}</td>
                  <td style={styles.tableCell}>{formatDate(order.date)}</td>
                  <td style={styles.tableCell}>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                  <td style={{...styles.tableCell, color: "#C4A962", fontWeight: "600"}}>{formatPrice(order.total)}</td>
                  <td style={styles.tableCell}><span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status), color: "white", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>{getStatusIcon(order.status)} {order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div style={styles.dashboardContent}>
      <div style={styles.headerWithActions}>
        <h2 style={styles.pageTitle}>Manage Products</h2>
        <div style={styles.headerControls}>
          <button style={styles.refreshButton} onClick={handleRefresh}><FaChartLine /> Refresh</button>
          <button style={styles.addButton} onClick={() => { setEditingProduct(null); setNewProduct({ id: "", name: "", price: "", category: "", description: "", stock: 10, image: "", badge: "New", colors: [], sizes: [] }); setImagePreview(null); setImageUploadMode("upload"); setShowAddModal(true); }}>
            <FaPlus /> Add New Product
          </button>
        </div>
      </div>
      <div style={styles.filtersBar}>
        <div style={styles.searchBar}><FaSearch style={styles.searchIcon} /><input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} /></div>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button style={styles.filterButton}><FaFilter /> Filter</button>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead><tr><th style={styles.tableHeader}>Image</th><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Category</th><th style={styles.tableHeader}>Price</th><th style={styles.tableHeader}>Stock</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id || index} style={styles.tableRow}>
                <td style={styles.tableCell}><img src={product.image || PLACEHOLDER_IMG} alt={product.name} style={styles.tableImage} onError={(e) => { e.target.src = PLACEHOLDER_IMG; }} /></td>
                <td style={styles.tableCell}>{product.name}</td>
                <td style={styles.tableCell}>{product.category}</td>
                <td style={{...styles.tableCell, fontWeight: "600", color: "#C4A962"}}>{formatPrice(product.price)}</td>
                <td style={styles.tableCell}><span style={{ ...styles.stockBadge, backgroundColor: (product.stock || 10) > 10 ? "#28a745" : "#ffc107", color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px" }}>{product.stock || 10} units</span></td>
                <td style={styles.tableCell}><span style={{ backgroundColor: "#28a745", color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px" }}>Active</span></td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtons}>
                    <button style={styles.editButton} onClick={() => handleEditProduct(product)} title="Edit"><FaEdit /></button>
                    <button style={styles.viewButton} onClick={() => setSelectedProduct(product)} title="View"><FaEye /></button>
                    <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product._id || product.id)} title="Delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <div style={styles.noData}>No products found. Add products using "Add New Product" button.</div>}
      </div>

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <button style={styles.modalClose} onClick={() => { setShowAddModal(false); setEditingProduct(null); setImagePreview(null); }}>×</button>
            <div style={styles.modalForm}>
              <div style={styles.formGroup}><label style={styles.formLabel}>Product Name *</label><input type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Enter product name" style={styles.formInput} /></div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.formLabel}>Price *</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="Enter price" style={styles.formInput} /></div>
                <div style={styles.formGroup}><label style={styles.formLabel}>Stock</label><input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} placeholder="Stock quantity" style={styles.formInput} /></div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Category *</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={styles.formSelect}>
                  <option value="">Select Category</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Watches">Watches</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Kids Accessories">Kids Accessories</option>
                </select>
              </div>
              <div style={styles.formGroup}><label style={styles.formLabel}>Description</label><textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Enter product description" style={styles.formTextarea} rows="3" /></div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Product Image</label>
                <div style={{ display: "flex", gap: "0", marginBottom: "10px", borderRadius: "6px", overflow: "hidden", border: "1px solid #e0e0e0" }}>
                  <button type="button" style={{ flex: 1, padding: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: imageUploadMode === "upload" ? "#C4A962" : "#f8f9fa", color: imageUploadMode === "upload" ? "white" : "#555" }} onClick={() => setImageUploadMode("upload")}><FaUpload style={{ marginRight: "5px" }} /> Upload File</button>
                  <button type="button" style={{ flex: 1, padding: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: imageUploadMode === "url" ? "#C4A962" : "#f8f9fa", color: imageUploadMode === "url" ? "white" : "#555" }} onClick={() => setImageUploadMode("url")}><FaImage style={{ marginRight: "5px" }} /> Image URL</button>
                </div>
                {imageUploadMode === "upload" ? (
                  <div>
                    <label style={{ display: "block", cursor: "pointer" }}>
                      <div style={{ border: "2px dashed #C4A962", borderRadius: "8px", padding: "20px", textAlign: "center", background: imagePreview ? "#fffbf0" : "#fafafa" }}>
                        {imagePreview ? <img src={imagePreview} alt="Preview" style={{ maxHeight: "120px", maxWidth: "100%", borderRadius: "6px", objectFit: "contain" }} /> : <div><FaUpload size={28} color="#C4A962" /><p style={{ margin: "8px 0 4px", color: "#555", fontSize: "14px" }}>Click to upload image</p><p style={{ margin: 0, color: "#999", fontSize: "12px" }}>JPG, PNG, GIF, WebP · Max 5MB</p></div>}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                    {imagePreview && (<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}><label style={{ flex: 1, padding: "7px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer", textAlign: "center", fontSize: "13px", color: "#555" }}>Change Image<input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} /></label><button type="button" onClick={handleClearImage} style={{ flex: 1, padding: "7px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "13px" }}>Remove</button></div>)}
                  </div>
                ) : (
                  <div>
                    <input type="text" value={typeof newProduct.image === "string" && !newProduct.image.startsWith("data:") ? newProduct.image : ""} onChange={(e) => { setNewProduct({...newProduct, image: e.target.value}); setImagePreview(e.target.value || null); }} placeholder="https://example.com/image.jpg" style={styles.formInput} />
                    {imagePreview && typeof imagePreview === "string" && !imagePreview.startsWith("data:") && <img src={imagePreview} alt="Preview" style={{ marginTop: "8px", maxHeight: "80px", borderRadius: "5px", objectFit: "contain" }} onError={(e) => e.target.style.display = "none"} />}
                  </div>
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Badge</label>
                <select value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} style={styles.formSelect}>
                  <option value="New">New</option><option value="Sale">Sale</option><option value="Premium">Premium</option><option value="Best Seller">Best Seller</option><option value="Trending">Trending</option><option value="Exclusive">Exclusive</option>
                </select>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.formLabel}>Colors (comma separated)</label><input type="text" value={newProduct.colors.join(', ')} onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) })} placeholder="e.g., Red, Blue, Black" style={styles.formInput} /></div>
                <div style={styles.formGroup}><label style={styles.formLabel}>Sizes (comma separated)</label><input type="text" value={newProduct.sizes.join(', ')} onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) })} placeholder="e.g., S, M, L, XL" style={styles.formInput} /></div>
              </div>
              <div style={styles.modalActions}>
                <button style={styles.cancelButton} onClick={() => { setShowAddModal(false); setEditingProduct(null); setImagePreview(null); }}>Cancel</button>
                <button style={styles.saveButton} onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>{editingProduct ? "Update Product" : "Add Product"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={{ ...styles.modal, maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Product Details</h3>
            <button style={styles.modalClose} onClick={() => setSelectedProduct(null)}>×</button>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "#f8f9fa", borderRadius: "10px", marginBottom: "20px" }}>
              <img src={selectedProduct.image || PLACEHOLDER_IMG} alt={selectedProduct.name} onError={(e) => { e.target.src = PLACEHOLDER_IMG; }} style={{ width: "80px", height: "90px", objectFit: "cover", borderRadius: "8px" }} />
              <div><div style={{ fontSize: "20px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>{selectedProduct.name}</div>{selectedProduct.badge && <span style={{ backgroundColor: "#C4A962", color: "white", padding: "3px 12px", borderRadius: "12px", fontSize: "12px" }}>{selectedProduct.badge}</span>}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={styles.userInfoItem}><FaRupeeSign color="#C4A962" /><div><div style={styles.userInfoLabel}>Price</div><div style={styles.userInfoValue}>{formatPrice(selectedProduct.price)}</div></div></div>
              <div style={styles.userInfoItem}><FaTags color="#C4A962" /><div><div style={styles.userInfoLabel}>Category</div><div style={styles.userInfoValue}>{selectedProduct.category}</div></div></div>
              <div style={styles.userInfoItem}><FaBox color="#C4A962" /><div><div style={styles.userInfoLabel}>Stock</div><div style={{ ...styles.userInfoValue, color: (selectedProduct.stock || 10) < 10 ? "#dc3545" : "#28a745" }}>{selectedProduct.stock || 10} units</div></div></div>
              <div style={styles.userInfoItem}><FaStar color="#C4A962" /><div><div style={styles.userInfoLabel}>Rating</div><div style={styles.userInfoValue}>{selectedProduct.rating || "N/A"} ⭐</div></div></div>
            </div>
            {selectedProduct.colors?.length > 0 && <div style={{ marginBottom: "14px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}><div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>COLORS</div><div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{selectedProduct.colors.map((color, i) => <span key={i} style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: color, border: "1px solid #ddd", display: "inline-block" }} />)}</div></div>}
            {selectedProduct.sizes?.length > 0 && <div style={{ marginBottom: "14px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}><div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>SIZES</div><div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{selectedProduct.sizes.map((size, i) => <span key={i} style={{ padding: "3px 10px", border: "1px solid #C4A962", borderRadius: "5px", fontSize: "13px", color: "#C4A962" }}>{size}</span>)}</div></div>}
            {selectedProduct.description && <div style={{ marginBottom: "14px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}><div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>DESCRIPTION</div><div style={{ fontSize: "14px", color: "#333" }}>{selectedProduct.description}</div></div>}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: "10px" }}>
              <button style={{ ...styles.editButton, padding: "10px 20px", borderRadius: "5px", fontSize: "14px" }} onClick={() => { setSelectedProduct(null); handleEditProduct(selectedProduct); }}><FaEdit /> Edit</button>
              <button style={{ ...styles.deleteButton, padding: "10px 20px", borderRadius: "5px", fontSize: "14px" }} onClick={() => { setSelectedProduct(null); handleDeleteProduct(selectedProduct._id || selectedProduct.id); }}><FaTrash /> Delete</button>
              <button style={{ ...styles.saveButton, padding: "10px 20px" }} onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div style={styles.dashboardContent}>
      <div style={styles.headerWithActions}>
        <h2 style={styles.pageTitle}>Manage Orders</h2>
        <div style={styles.headerControls}>
          <button style={styles.refreshButton} onClick={handleRefresh}><FaChartLine /> Refresh</button>
          <div style={styles.headerButtons}><button style={styles.exportButton}><FaDownload /> Export</button><button style={styles.printButton}><FaPrint /> Print</button></div>
        </div>
      </div>
      <div style={styles.filtersBar}>
        <div style={styles.filterTabs}>
          {["all", "ordered", "processing", "shipped", "delivered", "cancelled"].map(s => (
            <button key={s} style={{...styles.filterTab, ...(statusFilter === s ? styles.activeFilterTab : {})}} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({s === "all" ? orders.length : orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>
        <select style={styles.filterSelect} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All Time</option><option value="today">Today</option><option value="week">Last 7 Days</option><option value="month">Last 30 Days</option>
        </select>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead><tr><th style={styles.tableHeader}>Order ID</th><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Customer</th><th style={styles.tableHeader}>Items</th><th style={styles.tableHeader}>Total</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Payment</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} style={styles.tableRow}>
                <td style={{...styles.tableCell, fontWeight: "600"}}>{order.id}</td>
                <td style={styles.tableCell}>{formatDate(order.date)}</td>
                <td style={styles.tableCell}>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                <td style={styles.tableCell}>{order.items?.length || 0}</td>
                <td style={{...styles.tableCell, fontWeight: "600", color: "#C4A962"}}>{formatPrice(order.total)}</td>
                <td style={styles.tableCell}><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} style={{ backgroundColor: getStatusColor(order.status), color: "white", padding: "5px 10px", borderRadius: "5px", border: "none", fontSize: "12px", cursor: "pointer" }}><option value="ordered">Ordered</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>
                <td style={styles.tableCell}>{order.paymentMethod === "card" ? "Card" : order.paymentMethod === "upi" ? "UPI" : "COD"}</td>
                <td style={styles.tableCell}><div style={styles.actionButtons}><button style={styles.viewButton} onClick={() => setSelectedOrder(order)}><FaEye /></button><button style={styles.deleteButton} onClick={() => handleDeleteOrder(order.id)}><FaTrash /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div style={styles.noData}>No orders found</div>}
      </div>
      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={{...styles.modal, maxWidth: "600px"}} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Order Details</h3>
            <button style={styles.modalClose} onClick={() => setSelectedOrder(null)}>×</button>
            <div style={styles.orderDetails}>
              <div style={styles.orderDetailRow}><strong>Order ID:</strong> {selectedOrder.id}</div>
              <div style={styles.orderDetailRow}><strong>Date:</strong> {formatDate(selectedOrder.date)}</div>
              <div style={styles.orderDetailRow}><strong>Status:</strong> <span style={{ backgroundColor: getStatusColor(selectedOrder.status), color: "white", marginLeft: "10px", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{selectedOrder.status}</span></div>
              <h4 style={{ margin: "20px 0 10px", color: "#333" }}>Customer Information</h4>
              <div style={styles.orderDetailRow}><strong>Name:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</div>
              <div style={styles.orderDetailRow}><strong>Email:</strong> {selectedOrder.shippingAddress?.email}</div>
              <div style={styles.orderDetailRow}><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</div>
              <div style={styles.orderDetailRow}><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</div>
              <h4 style={{ margin: "20px 0 10px", color: "#333" }}>Order Items</h4>
              <div style={styles.orderItemsList}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={styles.orderItemRow}>
                    <img src={item.image || PLACEHOLDER_IMG} alt={item.name} style={styles.orderItemImage} onError={(e) => { e.target.src = PLACEHOLDER_IMG; }} />
                    <div style={styles.orderItemInfo}><div><strong>{item.name}</strong></div><div style={{ fontSize: "12px", color: "#666" }}>Qty: {item.quantity}</div></div>
                    <div style={{ fontWeight: "600", color: "#C4A962" }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div style={styles.orderTotal}>
                <div style={styles.orderDetailRow}><strong>Subtotal:</strong> {formatPrice(selectedOrder.subtotal)}</div>
                {selectedOrder.discount > 0 && <div style={styles.orderDetailRow}><strong>Discount:</strong> <span style={{color: "#28a745"}}>-{formatPrice(selectedOrder.discount)}</span></div>}
                <div style={{...styles.orderDetailRow, fontSize: "18px", marginTop: "10px"}}><strong>Total:</strong> <span style={{color: "#C4A962", fontWeight: "700"}}>{formatPrice(selectedOrder.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div style={styles.dashboardContent}>
      <div style={styles.headerWithActions}><h2 style={styles.pageTitle}>Manage Users</h2><button style={styles.refreshButton} onClick={handleRefresh}><FaChartLine /> Refresh</button></div>
      <div style={styles.filtersBar}><div style={styles.searchBar}><FaSearch style={styles.searchIcon} /><input type="text" placeholder="Search users..." value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)} style={styles.searchInput} /></div></div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Email</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Orders</th><th style={styles.tableHeader}>Joined</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const userOrders = orders.filter(o => o.userId === user.email).length;
              return (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{user.name}</td>
                  <td style={styles.tableCell}>{user.email}</td>
                  <td style={styles.tableCell}>{getUserPhone(user) || "N/A"}</td>
                  <td style={styles.tableCell}>{userOrders}</td>
                  <td style={styles.tableCell}>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</td>
                  <td style={styles.tableCell}><span style={{ backgroundColor: "#28a745", color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px" }}>Active</span></td>
                  <td style={styles.tableCell}><div style={styles.actionButtons}><button style={styles.viewButton} onClick={() => setSelectedUser({ ...user, orderCount: userOrders })}><FaEye /></button><button style={styles.deleteButton} onClick={() => handleDeleteUser(user.email)}><FaTrash /></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <div style={styles.noData}>No users found</div>}
      </div>
      {selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div style={{ ...styles.modal, maxWidth: "480px" }} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>User Details</h3>
            <button style={styles.modalClose} onClick={() => setSelectedUser(null)}>×</button>
            <div style={styles.userAvatarWrapper}><div style={styles.userAvatar}><FaUser size={36} color="white" /></div><div><div style={{ fontSize: "20px", fontWeight: "700", color: "#333" }}>{selectedUser.name}</div><span style={{ backgroundColor: "#28a745", color: "white", padding: "3px 10px", borderRadius: "12px", fontSize: "12px" }}>Active</span></div></div>
            <div style={styles.userInfoGrid}>
              <div style={styles.userInfoItem}><FaEnvelope color="#C4A962" /><div><div style={styles.userInfoLabel}>Email</div><div style={styles.userInfoValue}>{selectedUser.email}</div></div></div>
              <div style={styles.userInfoItem}><FaPhone color="#C4A962" /><div><div style={styles.userInfoLabel}>Phone</div><div style={styles.userInfoValue}>{getUserPhone(selectedUser) || "Not provided"}</div></div></div>
              <div style={styles.userInfoItem}><FaShoppingBag color="#C4A962" /><div><div style={styles.userInfoLabel}>Total Orders</div><div style={styles.userInfoValue}>{selectedUser.orderCount}</div></div></div>
              <div style={styles.userInfoItem}><FaCalendarAlt color="#C4A962" /><div><div style={styles.userInfoLabel}>Joined</div><div style={styles.userInfoValue}>{selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "N/A"}</div></div></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
              <button style={{ ...styles.deleteButton, padding: "10px 20px", borderRadius: "5px", fontSize: "14px" }} onClick={() => { setSelectedUser(null); handleDeleteUser(selectedUser.email); }}><FaTrash /> Delete User</button>
              <button style={{ ...styles.saveButton, padding: "10px 20px" }} onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div style={styles.dashboardContent}>
      <h2 style={styles.pageTitle}>Settings</h2>
      {settingsMessage.text && <div style={{ padding: "12px 20px", borderRadius: "5px", marginBottom: "20px", backgroundColor: settingsMessage.type === "success" ? "#d4edda" : "#f8d7da", color: settingsMessage.type === "success" ? "#155724" : "#721c24" }}>{settingsMessage.text}</div>}
      <div style={styles.settingsGrid}>
        <div style={styles.settingsCard}>
          <h3 style={{color: "#333", marginBottom: "15px"}}>General Settings</h3>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Store Name</label><input type="text" value={settings.storeName} onChange={(e) => handleSettingChange("storeName", e.target.value)} style={styles.settingInput} /></div>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Store Email</label><input type="email" value={settings.storeEmail} onChange={(e) => handleSettingChange("storeEmail", e.target.value)} style={styles.settingInput} /></div>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Currency</label><select style={styles.settingInput} value={settings.currency} onChange={(e) => handleSettingChange("currency", e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></div>
        </div>
        <div style={styles.settingsCard}>
          <h3 style={{color: "#333", marginBottom: "15px"}}>Payment Settings</h3>
          {[["paymentCOD", "Cash on Delivery"], ["paymentCard", "Credit/Debit Cards"], ["paymentUPI", "UPI Payments"]].map(([key, label]) => (
            <div key={key} style={styles.settingItem}><label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#333" }}><input type="checkbox" checked={settings[key]} onChange={() => handleCheckboxChange(key)} /> {label}</label></div>
          ))}
        </div>
        <div style={styles.settingsCard}>
          <h3 style={{color: "#333", marginBottom: "15px"}}>Shipping Settings</h3>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Free Shipping Threshold (₹)</label><input type="number" value={settings.freeShippingThreshold} onChange={(e) => handleSettingChange("freeShippingThreshold", parseInt(e.target.value))} style={styles.settingInput} /></div>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Standard Shipping (₹)</label><input type="number" value={settings.standardShipping} onChange={(e) => handleSettingChange("standardShipping", parseInt(e.target.value))} style={styles.settingInput} /></div>
          <div style={styles.settingItem}><label style={styles.settingLabel}>Express Shipping (₹)</label><input type="number" value={settings.expressShipping} onChange={(e) => handleSettingChange("expressShipping", parseInt(e.target.value))} style={styles.settingInput} /></div>
        </div>
        <div style={styles.settingsCard}>
          <h3 style={{color: "#333", marginBottom: "15px"}}>Notification Settings</h3>
          {[["emailNotifications", "Email Notifications"], ["orderConfirmation", "Order Confirmation"], ["smsNotifications", "SMS Notifications"]].map(([key, label]) => (
            <div key={key} style={styles.settingItem}><label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#333" }}><input type="checkbox" checked={settings[key]} onChange={() => handleCheckboxChange(key)} /> {label}</label></div>
          ))}
        </div>
      </div>
      <div style={styles.settingsActions}>
        <button style={styles.resetSettingsButton} onClick={handleResetSettings}><FaUndo /> Reset to Default</button>
        <button style={styles.saveSettingsButton} onClick={handleSaveSettings}><FaSave /> Save Settings</button>
      </div>
    </div>
  );

  if (loading) return <div style={styles.loadingContainer}><div style={styles.loader}></div><p style={{color: "#333"}}>Loading dashboard...</p></div>;

  return (
    <div style={styles.adminLayout}>
      <div style={styles.sidebar}>
        <div style={styles.logo}><FaStore size={30} color="#C4A962" /><h2 style={{color: "white"}}>INCHU<span style={styles.logoHighlight}>CART</span></h2><p style={styles.adminLabel}>Admin Panel</p></div>
        <nav style={styles.nav}>
          {[{ tab: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" }, { tab: "products", icon: <FaBox />, label: "Products" }, { tab: "orders", icon: <FaShoppingBag />, label: "Orders" }, { tab: "users", icon: <FaUsers />, label: "Users" }, { tab: "settings", icon: <FaCog />, label: "Settings" }].map(({ tab, icon, label }) => (
            <button key={tab} style={{...styles.navItem, ...(activeTab === tab ? styles.activeNavItem : {})}} onClick={() => setActiveTab(tab)}>{icon} {label}</button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}><FaUserShield size={24} color="#C4A962" /><div><p style={styles.adminName}>{adminInfo.name}</p><p style={styles.adminEmail}>{adminInfo.email || "admin@inchucart.com"}</p></div></div>
          <button style={styles.logoutButton} onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </div>
      </div>
      <div style={styles.mainContent}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "settings" && renderSettings()}
      </div>
    </div>
  );
}

const styles = {
  adminLayout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  sidebar: { width: "280px", background: "#1a1a1a", color: "white", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", overflowY: "auto" },
  logo: { padding: "30px 20px", borderBottom: "1px solid #333", textAlign: "center" },
  logoHighlight: { color: "#C4A962" },
  adminLabel: { fontSize: "12px", color: "#888", marginTop: "5px" },
  nav: { flex: 1, padding: "20px 0" },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", width: "100%", borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "4px solid transparent", background: "none", color: "#888", cursor: "pointer", fontSize: "14px", textAlign: "left", transition: "all 0.3s ease" },
  activeNavItem: { background: "#C4A962", color: "white", borderLeft: "4px solid #fff" },
  sidebarFooter: { padding: "20px", borderTop: "1px solid #333" },
  adminInfo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" },
  adminName: { fontSize: "14px", fontWeight: "600", color: "white" },
  adminEmail: { fontSize: "12px", color: "#888" },
  logoutButton: { display: "flex", alignItems: "center", gap: "10px", padding: "10px", width: "100%", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  mainContent: { flex: 1, marginLeft: "280px", background: "#f8f9fa", minHeight: "100vh" },
  dashboardContent: { padding: "30px" },
  dashboardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  pageTitle: { fontSize: "24px", color: "#333", margin: 0 },
  headerControls: { display: "flex", gap: "10px", alignItems: "center" },
  lastUpdated: { fontSize: "12px", color: "#666" },
  refreshButton: { padding: "8px 15px", background: "#17a2b8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { background: "white", padding: "20px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  statInfo: { flex: 1 },
  statValue: { fontSize: "24px", fontWeight: "700", color: "#333", marginBottom: "5px" },
  statLabel: { fontSize: "14px", color: "#666" },
  sectionCard: { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "30px" },
  sectionTitle: { fontSize: "18px", color: "#333", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },
  todayStats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  todayStat: { display: "flex", flexDirection: "column", gap: "5px" },
  todayLabel: { fontSize: "13px", color: "#666" },
  todayValue: { fontSize: "20px", fontWeight: "600", color: "#333" },
  alertsCard: { background: "#fff3cd", padding: "20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #ffeeba" },
  alertsList: { display: "flex", flexDirection: "column", gap: "10px" },
  alert: { display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "white", borderRadius: "5px" },
  chartContainer: { display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "200px", marginTop: "20px" },
  chartBar: { display: "flex", flexDirection: "column", alignItems: "center", width: "60px" },
  barLabel: { fontSize: "11px", color: "#666", marginBottom: "5px" },
  barContainer: { width: "30px", height: "100px", background: "#f0f0f0", borderRadius: "5px", position: "relative", marginBottom: "5px" },
  bar: { width: "100%", position: "absolute", bottom: 0, borderRadius: "5px" },
  barValue: { fontSize: "11px", fontWeight: "600", color: "#333" },
  barOrders: { fontSize: "10px", color: "#666" },
  topProductsList: { display: "flex", flexDirection: "column", gap: "10px" },
  topProduct: { display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "#f8f9fa", borderRadius: "8px" },
  topProductRank: { width: "30px", height: "30px", background: "#C4A962", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" },
  topProductImage: { width: "40px", height: "50px", objectFit: "cover", borderRadius: "5px" },
  topProductInfo: { flex: 1 },
  topProductName: { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "3px" },
  topProductStats: { fontSize: "12px", color: "#666" },
  headerWithActions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  filtersBar: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  searchBar: { flex: 1, display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "8px 15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", minWidth: "250px" },
  searchIcon: { color: "#666" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: "14px", padding: "5px", color: "#333" },
  filterSelect: { padding: "8px 15px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", background: "white", color: "#333", minWidth: "150px" },
  filterButton: { padding: "8px 15px", background: "#f8f9fa", border: "1px solid #e0e0e0", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", color: "#333" },
  filterTabs: { display: "flex", gap: "5px", flexWrap: "wrap" },
  filterTab: { padding: "8px 12px", background: "white", border: "1px solid #e0e0e0", borderRadius: "5px", cursor: "pointer", fontSize: "12px", color: "#333" },
  activeFilterTab: { background: "#C4A962", color: "white", borderColor: "#C4A962" },
  tableContainer: { background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  tableHeader: { padding: "12px", textAlign: "left", borderBottom: "2px solid #e0e0e0", color: "#333", fontWeight: "600" },
  tableRow: { borderBottom: "1px solid #e0e0e0" },
  tableCell: { padding: "12px", color: "#333" },
  tableImage: { width: "40px", height: "50px", objectFit: "cover", borderRadius: "5px" },
  stockBadge: { padding: "3px 8px", borderRadius: "12px", fontSize: "11px" },
  statusBadge: { padding: "3px 8px", borderRadius: "12px", fontSize: "11px" },
  actionButtons: { display: "flex", gap: "5px" },
  editButton: { padding: "5px", background: "#ffc107", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" },
  viewButton: { padding: "5px", background: "#17a2b8", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" },
  deleteButton: { padding: "5px", background: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" },
  addButton: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600" },
  headerButtons: { display: "flex", gap: "10px" },
  exportButton: { padding: "8px 15px", background: "#17a2b8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" },
  printButton: { padding: "8px 15px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" },
  settingsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" },
  settingsCard: { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  settingItem: { marginBottom: "15px" },
  settingLabel: { display: "block", marginBottom: "5px", color: "#333", fontSize: "14px", fontWeight: "500" },
  settingInput: { width: "100%", padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: "5px", fontSize: "14px", color: "#333", marginTop: "5px" },
  settingsActions: { display: "flex", gap: "10px", justifyContent: "flex-end" },
  saveSettingsButton: { padding: "12px 30px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
  resetSettingsButton: { padding: "12px 30px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "white", padding: "30px", borderRadius: "10px", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto", position: "relative" },
  modalTitle: { fontSize: "20px", color: "#333", marginBottom: "20px" },
  modalClose: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" },
  modalForm: { display: "flex", flexDirection: "column", gap: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  formLabel: { fontSize: "14px", fontWeight: "500", color: "#333" },
  formInput: { padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px", fontSize: "14px", outline: "none", color: "#333" },
  formSelect: { padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px", fontSize: "14px", outline: "none", backgroundColor: "white", color: "#333" },
  formTextarea: { padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit", color: "#333" },
  modalActions: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" },
  cancelButton: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  saveButton: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  orderDetails: { padding: "10px" },
  orderDetailRow: { marginBottom: "10px", fontSize: "14px", color: "#333" },
  orderItemsList: { maxHeight: "200px", overflowY: "auto", marginBottom: "20px" },
  orderItemRow: { display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderBottom: "1px solid #f0f0f0" },
  orderItemImage: { width: "40px", height: "50px", objectFit: "cover", borderRadius: "5px" },
  orderItemInfo: { flex: 1 },
  orderTotal: { marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #e0e0e0" },
  noData: { textAlign: "center", padding: "40px", color: "#666", fontSize: "14px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px" },
  loader: { width: "50px", height: "50px", border: "3px solid #f3f3f3", borderTop: "3px solid #C4A962", borderRadius: "50%", animation: "spin 1s linear infinite" },
  userAvatarWrapper: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "10px" },
  userAvatar: { width: "70px", height: "70px", borderRadius: "50%", background: "#C4A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userInfoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  userInfoItem: { display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" },
  userInfoLabel: { fontSize: "11px", color: "#888", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" },
  userInfoValue: { fontSize: "14px", fontWeight: "600", color: "#333" },
};

const statIconStyle = (color) => ({ width: "50px", height: "50px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px" });

export default AdminDashboard;
