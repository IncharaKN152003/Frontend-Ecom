import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar, FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";

function Women() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  // ========== HARDCODED BASE PRODUCTS ==========
  const hardcodedProducts = [
    { id: 1, name: "Princess Party Dress", category: "girls", subCategory: "girls", ageGroup: "Preschool (3-5Y)", price: 2499, originalPrice: 3999, rating: 4.8, reviews: 124, image: "/assets/images/i11.png", badge: "Best Seller", colors: ["#FF69B4","#FFB6C1","#FFD700"], sizes: ["2T","3T","4T","5T"] },
    { id: 1, name: "Elegant Evening Gown", category: "dresses", subCategory: "party", price: 8999, originalPrice: 12999, rating: 4.8, reviews: 124, image: "/assets/images/i12.png", badge: "Best Seller", colors: ["#000000", "#8B4513", "#800020"], sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Floral Summer Dress", category: "dresses", subCategory: "casual", price: 3499, originalPrice: 4999, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446", badge: "New Arrival", colors: ["#FF69B4", "#87CEEB", "#FFFFFF"], sizes: ["XS", "S", "M", "L"] },
    { id: 4, name: "Designer Silk Saree", category: "traditional", subCategory: "traditional", price: 15999, originalPrice: 24999, rating: 4.9, reviews: 167, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b", badge: "Premium", colors: ["#FF0000", "#800080", "#FFD700"], sizes: ["One Size"] },
    { id: 5, name: "Embroidered Kurti Set", category: "traditional", subCategory: "traditional", price: 3999, originalPrice: 5999, rating: 4.7, reviews: 98, image: "/assets/images/i6.png", badge: "Sale", colors: ["#87CEEB", "#98FB98", "#FFB6C1"], sizes: ["S", "M", "L", "XL"] },
    { id: 6, name: "Lehenga Choli", category: "traditional", subCategory: "party", price: 24999, originalPrice: 35999, rating: 4.9, reviews: 245, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b", badge: "Exclusive", colors: ["#800020", "#FFD700", "#800080"], sizes: ["S", "M", "L"] },
    { id: 7, name: "Designer Top", category: "casual", subCategory: "casual", price: 1999, originalPrice: 2999, rating: 4.5, reviews: 156, image: "/assets/images/i17.png", badge: "Trending", colors: ["#FFFFFF", "#000000", "#808080"], sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 8, name: "Slim Fit Jeans", category: "casual", subCategory: "casual", price: 2999, originalPrice: 3999, rating: 4.6, reviews: 134, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246", badge: "Best Seller", colors: ["#00008B", "#000000", "#808080"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: 9, name: "Casual Blazer", category: "casual", subCategory: "party", price: 5999, originalPrice: 8999, rating: 4.7, reviews: 78, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea", badge: "New", colors: ["#000000", "#808080", "#8B4513"], sizes: ["S", "M", "L", "XL"] }
  ];

  const [products, setProducts] = useState(hardcodedProducts);

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products?category=Women");
      if (response.data.success) {
        const dbProducts = response.data.products.map(p => ({
          ...p,
          id: p._id,
          category: p.subCategory || "casual",
          subCategory: p.subCategory || "casual",
          originalPrice: p.originalPrice || Math.round((p.price || 0) * 1.2),
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["#000000", "#FFFFFF"],
          sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S", "M", "L"],
          badge: p.badge || "New",
          image: p.image || null
        }));

        if (dbProducts.length > 0) {
          console.log(`✅ Loaded ${dbProducts.length} admin-added women's products from MongoDB`);
          setProducts([...hardcodedProducts, ...dbProducts]);
        } else {
          setProducts(hardcodedProducts);
        }
      }
    } catch (error) {
      console.error("Error loading products from MongoDB:", error);
      // Fallback to hardcoded only
      setProducts(hardcodedProducts);
    }
  };

  const loadWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistItems(savedWishlist);
    } catch (error) { console.error("Error loading wishlist:", error); }
  };

  useEffect(() => {
    loadWishlist();
    loadProductsFromDB();

    window.addEventListener('wishlistUpdated', loadWishlist);
    window.addEventListener('productsUpdated', loadProductsFromDB);

    return () => {
      window.removeEventListener('wishlistUpdated', loadWishlist);
      window.removeEventListener('productsUpdated', loadProductsFromDB);
    };
  }, []);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");

  const colors = ["#000000", "#8B4513", "#800020", "#FF69B4", "#87CEEB", "#FFFFFF", "#FF0000", "#800080", "#FFD700", "#98FB98", "#FFB6C1", "#00008B", "#808080"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const badges = ["Best Seller", "New Arrival", "Trending", "Premium", "Sale", "Exclusive", "New"];
  const subCategories = [
    { id: "all", name: "All Types" },
    { id: "party", name: "Party Wear" },
    { id: "casual", name: "Casual Wear" },
    { id: "traditional", name: "Traditional" }
  ];

  const isInWishlist = (productId) => wishlistItems.some(item => item.id === productId);

  const handleCollectionClick = (collection) => {
    setSelectedCategory(collection);
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setMessageType("error"); setNewsletterMessage("Please enter your email address ❌"); }
    else if (!emailRegex.test(email)) { setMessageType("error"); setNewsletterMessage("Please enter a valid email address ❌"); }
    else {
      const subscribers = JSON.parse(localStorage.getItem("newsletter_subscribers")) || [];
      if (!subscribers.includes(email)) { subscribers.push(email); localStorage.setItem("newsletter_subscribers", JSON.stringify(subscribers)); }
      setMessageType("success");
      setNewsletterMessage(`🎉 Thank you for subscribing! Check your inbox for 10% off.`);
      setEmail("");
    }
    setTimeout(() => { setNewsletterMessage(""); setMessageType(""); }, 5000);
  };

  const handleColorToggle = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleSizeToggle = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const handleBadgeToggle = (badge) => setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  const clearAllFilters = () => { setPriceRange({ min: 0, max: 50000 }); setSelectedColors([]); setSelectedSizes([]); setSelectedBadges([]); setSelectedSubCategory("all"); };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (selectedSubCategory !== "all" && product.subCategory !== selectedSubCategory) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedColors.length > 0 && !product.colors.some(color => selectedColors.includes(color))) return false;
    if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) return false;
    if (selectedBadges.length > 0 && !selectedBadges.includes(product.badge)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  });

  const categories = [
    { id: "all", name: "All Items" },
    { id: "dresses", name: "Dresses" },
    { id: "traditional", name: "Traditional" },
    { id: "casual", name: "Casual Wear" }
  ];

  const addToCart = (product) => {
    try {
      let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
      } else {
        existingCart.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, colors: product.colors, sizes: product.sizes, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert(`${product.name} added to cart! 🛍️`);
    } catch (error) { console.error("❌ Error adding to cart:", error); }
  };

  const addToWishlist = (product) => {
    try {
      let existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const existingItemIndex = existingWishlist.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        existingWishlist.splice(existingItemIndex, 1);
        alert(`${product.name} removed from wishlist!`);
      } else {
        existingWishlist.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, colors: product.colors, sizes: product.sizes, rating: product.rating, reviews: product.reviews });
        alert(`${product.name} added to wishlist! ❤️`);
      }
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
      setWishlistItems(existingWishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) { console.error("❌ Error updating wishlist:", error); }
  };

  return (
    <div style={pageStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>Women's <span style={heroSpanStyle}>Luxury</span> Collection</h1>
          <p style={heroTextStyle}>Discover the finest curated collection of women's fashion. From elegant evening wear to casual chic, experience luxury like never before.</p>
          <div style={heroStatsStyle}>
            <div style={statItemStyle}><span style={statNumberStyle}>{products.length}+</span><span style={statLabelStyle}>Products</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>50k+</span><span style={statLabelStyle}>Happy Customers</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>4.8</span><span style={statLabelStyle}>Rating</span></div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b" alt="Fashion Hero" style={heroImgStyle} />
        </div>
      </div>

      {/* Category Pills */}
      <div style={categoryContainerStyle}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ ...categoryPillStyle, ...(selectedCategory === cat.id ? activeCategoryPillStyle : {}) }}>{cat.name}</button>
        ))}
      </div>

      {/* Filters Bar */}
      <div style={filterBarStyle}>
        <div style={filterLeftStyle}>
          <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}><FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}</button>
          <span style={resultCountStyle}>{sortedProducts.length} Products Found</span>
          {(selectedColors.length > 0 || selectedSizes.length > 0 || selectedBadges.length > 0 || selectedSubCategory !== "all" || priceRange.min > 0 || priceRange.max < 50000) && (
            <button style={clearAllButtonStyle} onClick={clearAllFilters}>Clear All Filters</button>
          )}
        </div>
        <div style={filterRightStyle}>
          <select style={sortSelectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={filtersPanelStyle}>
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Product Type</h4>
            <div style={filterOptionsStyle}>
              {subCategories.map(sub => (
                <label key={sub.id} style={filterLabelStyle}>
                  <input type="radio" name="subCategory" value={sub.id} checked={selectedSubCategory === sub.id} onChange={() => setSelectedSubCategory(sub.id)} style={radioStyle} />
                  {sub.name}
                </label>
              ))}
            </div>
          </div>
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Price Range</h4>
            <div style={priceRangeStyle}>
              <div style={priceInputsStyle}>
                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={priceInputStyle} />
                <span style={priceSeparatorStyle}>-</span>
                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={priceInputStyle} />
              </div>
              <input type="range" min="0" max="50000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={rangeSliderStyle} />
            </div>
          </div>
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Colors</h4>
            <div style={colorGridStyle}>
              {colors.map(color => (
                <button key={color} onClick={() => handleColorToggle(color)} style={{ ...colorSwatchStyle, backgroundColor: color, border: selectedColors.includes(color) ? '3px solid #C4A962' : '1px solid #e0e0e0', transform: selectedColors.includes(color) ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Sizes</h4>
            <div style={sizeGridStyle}>
              {sizes.map(size => (
                <button key={size} onClick={() => handleSizeToggle(size)} style={{ ...sizeButtonStyle, backgroundColor: selectedSizes.includes(size) ? '#C4A962' : 'white', color: selectedSizes.includes(size) ? 'white' : '#333', borderColor: selectedSizes.includes(size) ? '#C4A962' : '#e0e0e0' }}>{size}</button>
              ))}
            </div>
          </div>
          <div style={filterSectionStyle}>
            <h4 style={filterTitleStyle}>Collections</h4>
            <div style={badgeGridStyle}>
              {badges.map(badge => (
                <button key={badge} onClick={() => handleBadgeToggle(badge)} style={{ ...badgeButtonStyle, backgroundColor: selectedBadges.includes(badge) ? '#C4A962' : 'white', color: selectedBadges.includes(badge) ? 'white' : '#333' }}>{badge}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div id="products-section" style={productsGridStyle}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} style={productCardStyle}>
              {product.badge && (
                <span style={{ ...badgeStyle, backgroundColor: product.badge === "Premium" ? "#C4A962" : product.badge === "Sale" ? "#dc3545" : product.badge === "New" ? "#28a745" : product.badge === "New Arrival" ? "#28a745" : product.badge === "Exclusive" ? "#8B4513" : "#d63384" }}>
                  {product.badge}
                </span>
              )}
              <button style={{ ...wishlistButtonStyle, color: isInWishlist(product.id) ? "#dc3545" : "#666", backgroundColor: isInWishlist(product.id) ? "#fff0f0" : "white" }} onClick={() => addToWishlist(product)}>
                <FaHeart />
              </button>
              <img
                src={product.image || null}
                alt={product.name}
                style={productImageStyle}
                onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
              />
              <div style={productInfoStyle}>
                <h3 style={productNameStyle}>{product.name}</h3>
                <div style={ratingStyle}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? "#FFD700" : "#e0e0e0", fontSize: "14px" }} />
                  ))}
                  <span style={reviewCountStyle}>({product.reviews})</span>
                </div>
                <div style={priceContainerStyle}>
                  <span style={currentPriceStyle}>₹{product.price.toLocaleString()}</span>
                  <span style={originalPriceStyle}>₹{(product.originalPrice || product.price).toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span style={discountStyle}>{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>
                  )}
                </div>
                <div style={colorContainerStyle}>
                  {product.colors.map((color, index) => (
                    <span key={index} style={{ ...colorDotStyle, backgroundColor: color }} />
                  ))}
                </div>
                <button style={addToCartButtonStyle} onClick={() => addToCart(product)}>
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={noProductsStyle}>
            <h3>No products found matching your filters</h3>
            <button style={clearAllButtonStyle} onClick={clearAllFilters}>Clear All Filters</button>
          </div>
        )}
      </div>

      {/* Featured Collections */}
      <div style={featuredCollectionsStyle}>
        <h2 style={sectionTitleStyle}>Shop By Collection</h2>
        <div style={collectionGridStyle}>
          <div style={collectionCardStyle}>
            <img src="/assets/images/i1.png" alt="Party Wear" style={collectionImageStyle} />
            <div style={collectionOverlayStyle}><h3>Party Wear</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("dresses")}>Shop Now</button></div>
          </div>
          <div style={collectionCardStyle}>
            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b" alt="Traditional" style={collectionImageStyle} />
            <div style={collectionOverlayStyle}><h3>Traditional</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("traditional")}>Shop Now</button></div>
          </div>
          <div style={collectionCardStyle}>
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" alt="Casual" style={collectionImageStyle} />
            <div style={collectionOverlayStyle}><h3>Casual</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("casual")}>Shop Now</button></div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={newsletterStyle}>
        <h2 style={newsletterTitleStyle}>Join the VIP List</h2>
        <p style={newsletterTextStyle}>Get 10% off your first purchase and exclusive access to new collections</p>
        <form onSubmit={handleNewsletterSubmit} style={newsletterInputStyle}>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={newsletterInputFieldStyle} />
          <button type="submit" style={newsletterButtonStyle}>Subscribe</button>
        </form>
        {newsletterMessage && (
          <div style={{ ...newsletterMessageStyle, backgroundColor: messageType === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)", color: messageType === "success" ? "#28a745" : "#dc3545", border: messageType === "success" ? "1px solid #28a745" : "1px solid #dc3545" }}>
            {newsletterMessage}
          </div>
        )}
      </div>

      <div style={footerStyle}><p>© 2026 Women's Luxury Fashion. All Rights Reserved.</p></div>
    </div>
  );
}

const pageStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: "#ffffff" };
const heroStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 80px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "500px", position: "relative", overflow: "hidden" };
const heroContentStyle = { flex: 1, color: "white", zIndex: 2 };
const heroTitleStyle = { fontSize: "48px", marginBottom: "20px", fontWeight: "700" };
const heroSpanStyle = { color: "#FFD700" };
const heroTextStyle = { fontSize: "18px", lineHeight: "1.6", marginBottom: "30px", maxWidth: "500px" };
const heroStatsStyle = { display: "flex", gap: "40px" };
const statItemStyle = { display: "flex", flexDirection: "column" };
const statNumberStyle = { fontSize: "28px", fontWeight: "700" };
const statLabelStyle = { fontSize: "14px", opacity: "0.8" };
const heroImageStyle = { flex: 1, zIndex: 2 };
const heroImgStyle = { width: "100%", height: "400px", objectFit: "cover", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" };
const categoryContainerStyle = { display: "flex", justifyContent: "center", gap: "15px", padding: "40px 80px 20px", flexWrap: "wrap" };
const categoryPillStyle = { padding: "12px 30px", border: "2px solid #e0e0e0", borderRadius: "30px", background: "white", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s ease" };
const activeCategoryPillStyle = { background: "#C4A962", borderColor: "#C4A962", color: "white" };
const filterBarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 80px", borderBottom: "1px solid #e0e0e0" };
const filterLeftStyle = { display: "flex", alignItems: "center", gap: "20px" };
const filterButtonStyle = { padding: "10px 20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
const resultCountStyle = { color: "#666" };
const clearAllButtonStyle = { padding: "8px 16px", border: "1px solid #dc3545", borderRadius: "8px", background: "white", color: "#dc3545", cursor: "pointer", fontSize: "14px" };
const filterRightStyle = {};
const sortSelectStyle = { padding: "10px 20px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px" };
const filtersPanelStyle = { padding: "30px 80px", background: "#f8f9fa", borderBottom: "1px solid #e0e0e0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" };
const filterSectionStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const filterTitleStyle = { fontSize: "16px", fontWeight: "600", color: "#333", margin: 0 };
const filterOptionsStyle = { display: "flex", flexDirection: "column", gap: "8px" };
const filterLabelStyle = { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#666", cursor: "pointer" };
const radioStyle = { width: "16px", height: "16px", cursor: "pointer", accentColor: "#C4A962" };
const priceRangeStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const priceInputsStyle = { display: "flex", alignItems: "center", gap: "10px" };
const priceInputStyle = { flex: 1, padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px" };
const priceSeparatorStyle = { color: "#666" };
const rangeSliderStyle = { width: "100%", accentColor: "#C4A962" };
const colorGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" };
const colorSwatchStyle = { width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", transition: "all 0.3s ease" };
const sizeGridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" };
const sizeButtonStyle = { padding: "8px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "white", cursor: "pointer" };
const badgeGridStyle = { display: "flex", flexWrap: "wrap", gap: "8px" };
const badgeButtonStyle = { padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "20px", background: "white", cursor: "pointer", fontSize: "12px" };
const productsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", padding: "40px 80px", minHeight: "400px" };
const productCardStyle = { background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease", position: "relative", cursor: "pointer" };
const badgeStyle = { position: "absolute", top: "15px", left: "15px", padding: "5px 15px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "600", zIndex: 2 };
const wishlistButtonStyle = { position: "absolute", top: "15px", right: "15px", background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 2 };
const productImageStyle = { width: "100%", height: "300px", objectFit: "cover" };
const productInfoStyle = { padding: "20px" };
const productNameStyle = { fontSize: "16px", marginBottom: "10px", fontWeight: "600" };
const ratingStyle = { display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" };
const reviewCountStyle = { color: "#666", fontSize: "12px", marginLeft: "5px" };
const priceContainerStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" };
const currentPriceStyle = { fontSize: "18px", fontWeight: "700", color: "#C4A962" };
const originalPriceStyle = { fontSize: "14px", color: "#999", textDecoration: "line-through" };
const discountStyle = { fontSize: "12px", color: "#28a745", fontWeight: "600" };
const colorContainerStyle = { display: "flex", gap: "8px", marginBottom: "15px" };
const colorDotStyle = { width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", border: "1px solid #e0e0e0" };
const addToCartButtonStyle = { width: "100%", padding: "12px", background: "#C4A962", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" };
const noProductsStyle = { gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "15px" };
const featuredCollectionsStyle = { padding: "60px 80px", background: "#f8f9fa" };
const sectionTitleStyle = { textAlign: "center", fontSize: "32px", marginBottom: "40px", color: "#333" };
const collectionGridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" };
const collectionCardStyle = { position: "relative", height: "300px", borderRadius: "15px", overflow: "hidden", cursor: "pointer" };
const collectionImageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const collectionOverlayStyle = { position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "white", padding: "30px", textAlign: "center" };
const collectionButtonStyle = { padding: "10px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "25px", marginTop: "10px", cursor: "pointer", fontWeight: "600" };
const newsletterStyle = { padding: "60px 80px", textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" };
const newsletterTitleStyle = { fontSize: "32px", marginBottom: "15px" };
const newsletterTextStyle = { fontSize: "16px", marginBottom: "30px" };
const newsletterInputStyle = { display: "flex", justifyContent: "center", gap: "10px", maxWidth: "500px", margin: "0 auto" };
const newsletterInputFieldStyle = { flex: 1, padding: "15px 20px", border: "none", borderRadius: "30px", fontSize: "16px", outline: "none" };
const newsletterButtonStyle = { padding: "15px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "600" };
const newsletterMessageStyle = { marginTop: "20px", padding: "12px 20px", borderRadius: "30px", maxWidth: "500px", margin: "20px auto 0", fontWeight: "500" };
const footerStyle = { textAlign: "center", padding: "30px", background: "#333", color: "white" };

export default Women;
