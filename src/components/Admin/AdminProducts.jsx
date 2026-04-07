// src/components/Admin/AdminProducts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSearch,
  FaTimes,
  FaSave,
  FaUpload
} from "react-icons/fa";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    stock: "10",
    image: "",
    colors: [],
    sizes: [],
    features: [],
    badge: ""
  });

  // Load products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showMessage("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  useEffect(() => {
    const filtered = products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      description: "",
      category: "",
      subCategory: "",
      brand: "",
      stock: "10",
      image: "",
      colors: [],
      sizes: [],
      features: [],
      badge: ""
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      brand: product.brand || "",
      stock: product.stock || "10",
      image: product.image || product.images?.[0] || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      features: product.features || [],
      badge: product.badge || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
          }
        );
        
        if (response.data.success) {
          showMessage("success", "Product deleted successfully");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        showMessage("error", "Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        images: formData.image ? [formData.image] : []
      };

      let response;
      
      if (editingProduct) {
        // Update existing product
        response = await axios.put(
          `http://localhost:8080/api/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
          }
        );
      } else {
        // Create new product
        response = await axios.post(
          "http://localhost:8080/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
          }
        );
      }

      if (response.data.success) {
        showMessage(
          "success", 
          editingProduct ? "Product updated successfully" : "Product created successfully"
        );
        setShowModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showMessage("error", "Failed to save product");
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Products</h2>
        <button style={styles.addButton} onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24",
          border: message.type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb"
        }}>
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search products by name, category, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Products Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} style={styles.tr}>
                <td style={styles.td}>
                  <img 
                    src={product.image || product.images?.[0] || "https://via.placeholder.com/50x60"} 
                    alt={product.name}
                    style={styles.productImage}
                  />
                </td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={{...styles.td, fontWeight: "600", color: "#C4A962"}}>
                  {formatPrice(product.price)}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.stockBadge,
                    backgroundColor: product.stock > 10 ? "#28a745" : "#ffc107"
                  }}>
                    {product.stock} units
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: product.isActive !== false ? "#28a745" : "#dc3545"
                  }}>
                    {product.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button 
                      style={styles.viewButton}
                      onClick={() => window.open(`/product/${product._id}`, '_blank')}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button 
                      style={styles.editButton}
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div style={styles.noData}>
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <button style={styles.closeButton} onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              <FaTimes />
            </button>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Enter product name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={styles.input}
                    placeholder="Enter price"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    style={styles.input}
                    placeholder="Enter original price (optional)"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="e.g., Women, Men, Kids"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Sub Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="e.g., Dresses, Suits, Watches"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter brand name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Badge</label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                    <option value="Premium">Premium</option>
                    <option value="Best Seller">Best Seller</option>
                  </select>
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Enter product description"
                  />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter image URL"
                  />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Colors (comma separated)</label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => handleArrayInput(e, 'colors')}
                    style={styles.input}
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => handleArrayInput(e, 'sizes')}
                    style={styles.input}
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Features (comma separated)</label>
                  <input
                    type="text"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleArrayInput(e, 'features')}
                    style={styles.input}
                    placeholder="e.g., Water resistant, Leather, Automatic"
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  <FaSave /> {editingProduct ? "Update" : "Save"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  title: {
    fontSize: "24px",
    color: "#333",
    margin: 0
  },
  addButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600"
  },
  message: {
    padding: "12px 20px",
    borderRadius: "5px",
    marginBottom: "20px"
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    marginBottom: "20px"
  },
  searchIcon: {
    color: "#666"
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#333"
  },
  tableContainer: {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #e0e0e0",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px"
  },
  tr: {
    borderBottom: "1px solid #e0e0e0"
  },
  td: {
    padding: "12px",
    color: "#333",
    fontSize: "14px"
  },
  productImage: {
    width: "50px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "5px"
  },
  stockBadge: {
    padding: "3px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "11px"
  },
  statusBadge: {
    padding: "3px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "11px"
  },
  actions: {
    display: "flex",
    gap: "5px"
  },
  viewButton: {
    padding: "5px",
    background: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  editButton: {
    padding: "5px",
    background: "#ffc107",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "5px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    color: "#666"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "20px"
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #C4A962",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative"
  },
  modalTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "20px"
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  formGroupFull: {
    gridColumn: "span 2",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333"
  },
  input: {
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    fontSize: "14px",
    color: "#333",
    outline: "none"
  },
  textarea: {
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    fontSize: "14px",
    color: "#333",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Inter', sans-serif"
  },
  modalActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "20px"
  },
  cancelButton: {
    padding: "10px 20px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  },
  submitButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }
};

export default AdminProducts;