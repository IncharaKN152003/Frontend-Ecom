// Watches.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar, FaFilter } from "react-icons/fa";

function Watches() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState([]);

  const colors = ["#000000", "#C0C0C0", "#FFD700", "#8B4513", "#00008B", "#808080", "#2F4F4F", "#4A4A4A"];
  const materials = ["Stainless Steel", "Titanium", "Leather", "Gold", "Rose Gold", "Platinum", "Ceramic", "Carbon Fiber"];
  const movements = ["Automatic", "Manual Wind", "Quartz", "Chronograph", "Perpetual Calendar", "Tourbillon"];
  const brands = ["Rolex", "Omega", "Tag Heuer", "Breitling", "IWC", "Panerai", "Hublot", "Vacheron Constantin"];
  const badges = ["Best Seller", "New Arrival", "Limited Edition", "Premium", "Sale", "Exclusive", "Swiss Made", "Automatic", "New", "Trending"];

  const hardcodedProducts = [
    { id: 1, name: "Rolex Submariner Date", brand: "Rolex", price: 850000, originalPrice: 950000, rating: 5.0, reviews: 234, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa", badge: "Limited Edition", colors: ["#000000", "#C0C0C0"], materials: ["Stainless Steel"], movement: "Automatic", features: ["Date Display", "Ceramic Bezel", "Water Resistant 300m", "Chronometer Certified"], caseSize: "40mm", waterResistance: "300m" },
    { id: 2, name: "Omega Speedmaster Moonwatch", brand: "Omega", price: 620000, originalPrice: 720000, rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d", badge: "Best Seller", colors: ["#000000", "#C0C0C0"], materials: ["Stainless Steel"], movement: "Manual Wind", features: ["Chronograph", "Tachymeter", "Hesalite Crystal", "Moonwatch Legacy"], caseSize: "42mm", waterResistance: "50m" },
    { id: 3, name: "Tag Heuer Carrera Chronograph", brand: "Tag Heuer", price: 245000, originalPrice: 295000, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3", badge: "Premium", colors: ["#000000", "#C0C0C0"], materials: ["Stainless Steel"], movement: "Automatic", features: ["Chronograph", "Date Display", "Sapphire Crystal", "60 Hours Power Reserve"], caseSize: "44mm", waterResistance: "100m" },
    { id: 4, name: "Audemars Piguet Royal Oak", brand: "Audemars Piguet", price: 2850000, originalPrice: 3250000, rating: 5.0, reviews: 89, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0", badge: "Swiss Made", colors: ["#C0C0C0", "#FFD700"], materials: ["Stainless Steel"], movement: "Automatic", features: ["Date", "Tapisserie Dial", "Integrated Bracelet", "50 Hours Power Reserve"], caseSize: "41mm", waterResistance: "50m" },
    { id: 5, name: "Breitling Navitimer", brand: "Breitling", price: 395000, originalPrice: 450000, rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49", badge: "Premium", colors: ["#000000", "#C0C0C0", "#8B4513"], materials: ["Stainless Steel", "Leather"], movement: "Automatic", features: ["Chronograph", "Slide Rule Bezel", "Date", "70 Hours Power Reserve"], caseSize: "43mm", waterResistance: "30m" },
    { id: 6, name: "IWC Portugieser", brand: "IWC", price: 425000, originalPrice: 495000, rating: 4.9, reviews: 78, image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a", badge: "New Arrival", colors: ["#C0C0C0", "#FFD700", "#000000"], materials: ["Stainless Steel", "Leather"], movement: "Automatic", features: ["Chronograph", "Date", "60 Hours Power Reserve", "Sapphire Crystal"], caseSize: "41mm", waterResistance: "30m" },
    { id: 7, name: "Panerai Luminor Marina", brand: "Panerai", price: 375000, originalPrice: 425000, rating: 4.7, reviews: 95, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa", badge: "Trending", colors: ["#000000", "#8B4513"], materials: ["Stainless Steel", "Leather"], movement: "Automatic", features: ["Date", "Small Seconds", "Luminous Markers", "72 Hours Power Reserve"], caseSize: "44mm", waterResistance: "300m" },
    { id: 8, name: "Hublot Big Bang", brand: "Hublot", price: 895000, originalPrice: 995000, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3", badge: "Limited Edition", colors: ["#000000", "#FFD700"], materials: ["Ceramic", "Gold"], movement: "Automatic", features: ["Chronograph", "Date", "72 Hours Power Reserve", "Skeleton Dial"], caseSize: "44mm", waterResistance: "100m" },
    { id: 9, name: "Vacheron Constantin Overseas", brand: "Vacheron Constantin", price: 1850000, originalPrice: 2150000, rating: 5.0, reviews: 34, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0", badge: "Exclusive", colors: ["#C0C0C0", "#FFD700"], materials: ["Gold", "Leather"], movement: "Automatic", features: ["Date", "Three Interchangeable Bracelets", "60 Hours Power Reserve"], caseSize: "41mm", waterResistance: "150m" }
  ];

  const [products, setProducts] = useState(hardcodedProducts);

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products?category=Watches");
      if (response.data.success) {
        const dbProducts = response.data.products.map(p => ({
          ...p,
          id: p._id,
          brand: p.brand || p.name || "Unknown",
          originalPrice: p.originalPrice || Math.round((p.price || 0) * 1.2),
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["#000000", "#C0C0C0"],
          materials: Array.isArray(p.materials) ? p.materials : ["Stainless Steel"],
          movement: p.movement || "Automatic",
          features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Premium Quality"],
          caseSize: p.caseSize || "40mm",
          waterResistance: p.waterResistance || "50m",
          badge: p.badge || "New",
          image: p.image || null
        }));
        if (dbProducts.length > 0) {
          console.log(`✅ Loaded ${dbProducts.length} admin-added watches from MongoDB`);
          setProducts([...hardcodedProducts, ...dbProducts]);
        } else {
          setProducts(hardcodedProducts);
        }
      }
    } catch (error) {
      console.error("Error loading watches from MongoDB:", error);
      setProducts(hardcodedProducts);
    }
  };

  const loadWishlist = () => {
    try { setWishlistItems(JSON.parse(localStorage.getItem("wishlist")) || []); } catch (e) {}
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

  const isInWishlist = (productId) => wishlistItems.some(item => item.id === productId);

  const handleCollectionClick = (brand) => {
    setSelectedBrand([brand]);
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
      setMessageType("success"); setNewsletterMessage("🎉 Thank you for subscribing! Check your inbox for 10% off."); setEmail("");
    }
    setTimeout(() => { setNewsletterMessage(""); setMessageType(""); }, 5000);
  };

  const handleColorToggle = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleMaterialToggle = (mat) => setSelectedMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);
  const handleBrandToggle = (brand) => setSelectedBrand(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const handleMovementToggle = (mov) => setSelectedMovement(prev => prev.includes(mov) ? prev.filter(m => m !== mov) : [...prev, mov]);
  const handleBadgeToggle = (badge) => setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  const clearAllFilters = () => { setPriceRange({ min: 0, max: 5000000 }); setSelectedColors([]); setSelectedMaterials([]); setSelectedBrand([]); setSelectedMovement([]); setSelectedBadges([]); };

  const filteredProducts = products.filter(product => {
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c))) return false;
    if (selectedMaterials.length > 0 && product.materials?.length > 0 && !product.materials.some(m => selectedMaterials.includes(m))) return false;
    if (selectedBrand.length > 0 && !selectedBrand.includes(product.brand)) return false;
    if (selectedMovement.length > 0 && !selectedMovement.includes(product.movement)) return false;
    if (selectedBadges.length > 0 && !selectedBadges.includes(product.badge)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = cart.findIndex(item => item.id === product.id);
      if (idx >= 0) { cart[idx].quantity = (cart[idx].quantity || 1) + 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, brand: product.brand, badge: product.badge, colors: product.colors, materials: product.materials, movement: product.movement, caseSize: product.caseSize, waterResistance: product.waterResistance, features: product.features, quantity: 1 }); }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart! 🛍️");
    } catch (e) { alert("There was an error adding to cart. Please try again."); }
  };

  const addToWishlist = (product) => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const idx = wishlist.findIndex(item => item.id === product.id);
      if (idx >= 0) { wishlist.splice(idx, 1); alert(product.name + " removed from wishlist!"); }
      else { wishlist.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, brand: product.brand, badge: product.badge, colors: product.colors, materials: product.materials, movement: product.movement, caseSize: product.caseSize, waterResistance: product.waterResistance, features: product.features, rating: product.rating, reviews: product.reviews }); alert(product.name + " added to wishlist! ❤️"); }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistItems(wishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (e) { console.error("Error updating wishlist:", e); }
  };

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>Luxury <span style={heroSpanStyle}>Watches</span></h1>
          <p style={heroTextStyle}>Discover the world's finest timepieces. From iconic Rolex to exquisite Vacheron Constantin, each watch tells a story of precision, craftsmanship, and timeless elegance.</p>
          <div style={heroStatsStyle}>
            <div style={statItemStyle}><span style={statNumberStyle}>{products.length}+</span><span style={statLabelStyle}>Watches</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>10k+</span><span style={statLabelStyle}>Happy Customers</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>4.9</span><span style={statLabelStyle}>Rating</span></div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d" alt="Luxury Watches Hero" style={heroImgStyle} />
        </div>
      </div>

      <div style={brandContainerStyle}>
        <button onClick={() => setSelectedBrand([])} style={{ ...brandPillStyle, ...(selectedBrand.length === 0 ? activeBrandPillStyle : {}) }}>All Brands</button>
        {brands.slice(0, 8).map(brand => (
          <button key={brand} onClick={() => setSelectedBrand([brand])} style={{ ...brandPillStyle, ...(selectedBrand.includes(brand) ? activeBrandPillStyle : {}) }}>{brand}</button>
        ))}
      </div>

      <div style={filterBarStyle}>
        <div style={filterLeftStyle}>
          <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}><FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}</button>
          <span style={resultCountStyle}>{sortedProducts.length} Watches Found</span>
          {(selectedColors.length > 0 || selectedMaterials.length > 0 || selectedBrand.length > 0 || selectedMovement.length > 0 || selectedBadges.length > 0 || priceRange.min > 0 || priceRange.max < 5000000) && (
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

      {showFilters && (
        <div style={filtersPanelStyle}>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Price Range (₹)</h4><div style={priceRangeStyle}><div style={priceInputsStyle}><input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={priceInputStyle} /><span style={priceSeparatorStyle}>-</span><input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={priceInputStyle} /></div><input type="range" min="0" max="5000000" step="100000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={rangeSliderStyle} /></div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Brands</h4><div style={badgeGridStyle}>{brands.map(brand => (<button key={brand} onClick={() => handleBrandToggle(brand)} style={{ ...badgeButtonStyle, backgroundColor: selectedBrand.includes(brand) ? '#C4A962' : 'white', color: selectedBrand.includes(brand) ? 'white' : '#333' }}>{brand}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Movement</h4><div style={badgeGridStyle}>{movements.map(mov => (<button key={mov} onClick={() => handleMovementToggle(mov)} style={{ ...badgeButtonStyle, backgroundColor: selectedMovement.includes(mov) ? '#C4A962' : 'white', color: selectedMovement.includes(mov) ? 'white' : '#333' }}>{mov}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Materials</h4><div style={badgeGridStyle}>{materials.map(mat => (<button key={mat} onClick={() => handleMaterialToggle(mat)} style={{ ...badgeButtonStyle, backgroundColor: selectedMaterials.includes(mat) ? '#C4A962' : 'white', color: selectedMaterials.includes(mat) ? 'white' : '#333' }}>{mat}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Colors</h4><div style={colorGridStyle}>{colors.map(color => (<button key={color} onClick={() => handleColorToggle(color)} style={{ ...colorSwatchStyle, backgroundColor: color, border: selectedColors.includes(color) ? '3px solid #C4A962' : '1px solid #e0e0e0', transform: selectedColors.includes(color) ? 'scale(1.1)' : 'scale(1)' }} />))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Collections</h4><div style={badgeGridStyle}>{badges.map(badge => (<button key={badge} onClick={() => handleBadgeToggle(badge)} style={{ ...badgeButtonStyle, backgroundColor: selectedBadges.includes(badge) ? '#C4A962' : 'white', color: selectedBadges.includes(badge) ? 'white' : '#333' }}>{badge}</button>))}</div></div>
        </div>
      )}

      <div id="products-section" style={productsGridStyle}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} style={productCardStyle}>
              {product.badge && (
                <span style={{ ...badgeStyle, backgroundColor: product.badge === "Premium" ? "#C4A962" : product.badge === "Sale" ? "#dc3545" : product.badge === "New Arrival" ? "#28a745" : product.badge === "New" ? "#28a745" : product.badge === "Exclusive" ? "#8B4513" : product.badge === "Limited Edition" ? "#800080" : product.badge === "Swiss Made" ? "#00008B" : "#d63384" }}>{product.badge}</span>
              )}
              <button style={{ ...wishlistButtonStyle, color: isInWishlist(product.id) ? "#dc3545" : "#666", backgroundColor: isInWishlist(product.id) ? "#fff0f0" : "white" }} onClick={() => addToWishlist(product)}><FaHeart /></button>
              <img src={product.image || PLACEHOLDER} alt={product.name} style={productImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} />
              <div style={productInfoStyle}>
                <h3 style={productNameStyle}>{product.name}</h3>
                <div style={brandStyle}><span style={brandLabelStyle}>{product.brand}</span></div>
                <div style={ratingStyle}>{[...Array(5)].map((_, i) => <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? "#FFD700" : "#e0e0e0", fontSize: "14px" }} />)}<span style={reviewCountStyle}>({product.reviews})</span></div>
                <div style={priceContainerStyle}>
                  <span style={currentPriceStyle}>₹{product.price.toLocaleString()}</span>
                  <span style={originalPriceStyle}>₹{(product.originalPrice || product.price).toLocaleString()}</span>
                  {product.originalPrice > product.price && <span style={discountStyle}>{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>}
                </div>
                <div style={specsContainerStyle}>
                  {product.movement && <div style={specItemStyle}><span style={specLabelStyle}>Movement:</span> {product.movement}</div>}
                  {product.caseSize && <div style={specItemStyle}><span style={specLabelStyle}>Case:</span> {product.caseSize}</div>}
                  {product.waterResistance && <div style={specItemStyle}><span style={specLabelStyle}>Water Resistant:</span> {product.waterResistance}</div>}
                </div>
                {product.materials && product.materials.length > 0 && <div style={materialInfoStyle}><span style={materialLabelStyle}>Materials: </span>{product.materials.join(", ")}</div>}
                <div style={colorContainerStyle}>{product.colors.map((color, index) => <span key={index} style={{ ...colorDotStyle, backgroundColor: color }} />)}</div>
                {product.features && product.features.length > 0 && <div style={featuresStyle}><span style={featuresLabelStyle}>Features: </span>{product.features.slice(0, 3).join(" • ")}</div>}
                <button style={addToCartButtonStyle} onClick={() => addToCart(product)}><FaShoppingCart /> Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <div style={noProductsStyle}><h3>No watches found matching your filters</h3><button style={clearAllButtonStyle} onClick={clearAllFilters}>Clear All Filters</button></div>
        )}
      </div>

      <div style={featuredCollectionsStyle}>
        <h2 style={sectionTitleStyle}>Featured Brands</h2>
        <div style={brandGridStyle}>
          <div style={brandCardStyle} onClick={() => handleCollectionClick("Rolex")}><h3 style={brandCardTitleStyle}>Rolex</h3><p style={brandCardTextStyle}>The pinnacle of prestige</p></div>
          <div style={brandCardStyle} onClick={() => handleCollectionClick("Omega")}><h3 style={brandCardTitleStyle}>Omega</h3><p style={brandCardTextStyle}>Moonwatch legacy</p></div>
          <div style={brandCardStyle} onClick={() => handleCollectionClick("Audemars Piguet")}><h3 style={brandCardTitleStyle}>Audemars Piguet</h3><p style={brandCardTextStyle}>Royal Oak excellence</p></div>
          <div style={brandCardStyle} onClick={() => handleCollectionClick("Vacheron Constantin")}><h3 style={brandCardTitleStyle}>Vacheron Constantin</h3><p style={brandCardTextStyle}>Overseas elegance</p></div>
        </div>
      </div>

      <div style={newsletterStyle}>
        <h2 style={newsletterTitleStyle}>Join The Horology Club</h2>
        <p style={newsletterTextStyle}>Subscribe for exclusive access to new collections and limited editions</p>
        <form onSubmit={handleNewsletterSubmit} style={newsletterInputStyle}>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={newsletterInputFieldStyle} />
          <button type="submit" style={newsletterButtonStyle}>Subscribe</button>
        </form>
        {newsletterMessage && <div style={{ ...newsletterMessageStyle, backgroundColor: messageType === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)", color: messageType === "success" ? "#28a745" : "#dc3545", border: messageType === "success" ? "1px solid #28a745" : "1px solid #dc3545" }}>{newsletterMessage}</div>}
      </div>
      <div style={footerStyle}><p>© 2026 Luxury Watches. All Rights Reserved.</p></div>
    </div>
  );
}

const brandStyle = { fontSize: "14px", color: "#C4A962", marginBottom: "8px", fontWeight: "600" };
const brandLabelStyle = { fontWeight: "700" };
const specsContainerStyle = { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px", fontSize: "12px", color: "#666" };
const specItemStyle = { display: "flex", gap: "5px" };
const specLabelStyle = { fontWeight: "600", color: "#333" };
const materialInfoStyle = { fontSize: "12px", color: "#666", marginBottom: "8px" };
const materialLabelStyle = { fontWeight: "600", color: "#333" };
const featuresStyle = { fontSize: "12px", color: "#666", marginBottom: "15px", lineHeight: "1.4" };
const featuresLabelStyle = { fontWeight: "600", color: "#333" };
const brandContainerStyle = { display: "flex", justifyContent: "center", gap: "15px", padding: "30px 80px 10px", flexWrap: "wrap" };
const brandPillStyle = { padding: "10px 25px", border: "2px solid #e0e0e0", borderRadius: "30px", background: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s ease" };
const activeBrandPillStyle = { background: "#C4A962", borderColor: "#C4A962", color: "white" };
const brandGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "30px" };
const brandCardStyle = { background: "white", padding: "30px", borderRadius: "10px", textAlign: "center", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", transition: "all 0.3s ease", border: "1px solid #e0e0e0" };
const brandCardTitleStyle = { margin: "0 0 10px 0", color: "#333", fontSize: "18px", fontWeight: "600" };
const brandCardTextStyle = { margin: 0, color: "#666", fontSize: "14px" };
const pageStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: "#ffffff" };
const heroStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 80px", background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)", minHeight: "500px", position: "relative", overflow: "hidden" };
const heroContentStyle = { flex: 1, color: "white", zIndex: 2 };
const heroTitleStyle = { fontSize: "48px", marginBottom: "20px", fontWeight: "700" };
const heroSpanStyle = { color: "#C4A962" };
const heroTextStyle = { fontSize: "18px", lineHeight: "1.6", marginBottom: "30px", maxWidth: "500px" };
const heroStatsStyle = { display: "flex", gap: "40px" };
const statItemStyle = { display: "flex", flexDirection: "column" };
const statNumberStyle = { fontSize: "28px", fontWeight: "700" };
const statLabelStyle = { fontSize: "14px", opacity: "0.8" };
const heroImageStyle = { flex: 1, zIndex: 2 };
const heroImgStyle = { width: "100%", height: "400px", objectFit: "cover", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" };
const filterBarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 80px", borderBottom: "1px solid #e0e0e0" };
const filterLeftStyle = { display: "flex", alignItems: "center", gap: "20px" };
const filterButtonStyle = { padding: "10px 20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease" };
const resultCountStyle = { color: "#666" };
const clearAllButtonStyle = { padding: "8px 16px", border: "1px solid #dc3545", borderRadius: "8px", background: "white", color: "#dc3545", cursor: "pointer", fontSize: "14px", transition: "all 0.3s ease" };
const filterRightStyle = {};
const sortSelectStyle = { padding: "10px 20px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px" };
const filtersPanelStyle = { padding: "30px 80px", background: "#f8f9fa", borderBottom: "1px solid #e0e0e0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" };
const filterSectionStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const filterTitleStyle = { fontSize: "16px", fontWeight: "600", color: "#333", margin: 0 };
const priceRangeStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const priceInputsStyle = { display: "flex", alignItems: "center", gap: "10px" };
const priceInputStyle = { flex: 1, padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px" };
const priceSeparatorStyle = { color: "#666" };
const rangeSliderStyle = { width: "100%", accentColor: "#C4A962" };
const colorGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" };
const colorSwatchStyle = { width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", transition: "all 0.3s ease" };
const badgeGridStyle = { display: "flex", flexWrap: "wrap", gap: "8px" };
const badgeButtonStyle = { padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "20px", background: "white", cursor: "pointer", fontSize: "12px", transition: "all 0.3s ease" };
const productsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", padding: "40px 80px", minHeight: "400px" };
const productCardStyle = { background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease", position: "relative", cursor: "pointer" };
const badgeStyle = { position: "absolute", top: "15px", left: "15px", padding: "5px 15px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "600", zIndex: 2 };
const wishlistButtonStyle = { position: "absolute", top: "15px", right: "15px", background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 2, transition: "all 0.3s ease" };
const productImageStyle = { width: "100%", height: "300px", objectFit: "cover", transition: "transform 0.3s ease" };
const productInfoStyle = { padding: "20px" };
const productNameStyle = { fontSize: "16px", marginBottom: "5px", fontWeight: "600" };
const ratingStyle = { display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" };
const reviewCountStyle = { color: "#666", fontSize: "12px", marginLeft: "5px" };
const priceContainerStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" };
const currentPriceStyle = { fontSize: "18px", fontWeight: "700", color: "#C4A962" };
const originalPriceStyle = { fontSize: "14px", color: "#999", textDecoration: "line-through" };
const discountStyle = { fontSize: "12px", color: "#28a745", fontWeight: "600" };
const colorContainerStyle = { display: "flex", gap: "8px", marginBottom: "10px" };
const colorDotStyle = { width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", border: "1px solid #e0e0e0" };
const addToCartButtonStyle = { width: "100%", padding: "12px", background: "#C4A962", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s ease" };
const noProductsStyle = { gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "15px" };
const featuredCollectionsStyle = { padding: "60px 80px", background: "#f8f9fa" };
const sectionTitleStyle = { textAlign: "center", fontSize: "32px", marginBottom: "20px", color: "#333" };
const newsletterStyle = { padding: "60px 80px", textAlign: "center", background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)", color: "white" };
const newsletterTitleStyle = { fontSize: "32px", marginBottom: "15px" };
const newsletterTextStyle = { fontSize: "16px", marginBottom: "30px" };
const newsletterInputStyle = { display: "flex", justifyContent: "center", gap: "10px", maxWidth: "500px", margin: "0 auto" };
const newsletterInputFieldStyle = { flex: 1, padding: "15px 20px", border: "none", borderRadius: "30px", fontSize: "16px", outline: "none" };
const newsletterButtonStyle = { padding: "15px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s ease" };
const newsletterMessageStyle = { marginTop: "20px", padding: "12px 20px", borderRadius: "30px", maxWidth: "500px", margin: "20px auto 0", fontWeight: "500" };
const footerStyle = { textAlign: "center", padding: "30px", background: "#333", color: "white" };

export default Watches;
