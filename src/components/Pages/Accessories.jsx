// Accessories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar, FaFilter } from "react-icons/fa";

function Accessories() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");

  const colors = ["#000000", "#8B4513", "#800020", "#FF69B4", "#87CEEB", "#FFFFFF", "#FF0000", "#800080", "#FFD700", "#98FB98", "#FFB6C1", "#C0C0C0", "#808080"];
  const materials = ["Gold", "Silver", "Rose Gold", "Stainless Steel", "Leather", "Ceramic", "Titanium", "Platinum", "Brass", "Copper"];
  const badges = ["Best Seller", "New Arrival", "Trending", "Premium", "Sale", "Exclusive", "Limited Edition", "New"];
  const subCategories = [
    { id: "all", name: "All Accessories" },
    { id: "watches", name: "Watches" },
    { id: "jewelry", name: "Jewelry" },
    { id: "bags", name: "Handbags" },
    { id: "sunglasses", name: "Sunglasses" },
    { id: "belts", name: "Belts" },
    { id: "scarves", name: "Scarves" }
  ];

  const hardcodedProducts = [
    { id: 1, name: "Luxury Diamond Watch", category: "watches", subCategory: "watches", price: 24999, originalPrice: 35999, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314", badge: "Premium", colors: ["#C0C0C0", "#FFD700", "#000000"], materials: ["Stainless Steel", "Gold"] },
    { id: 2, name: "Classic Leather Strap Watch", category: "watches", subCategory: "watches", price: 8999, originalPrice: 12999, rating: 4.7, reviews: 156, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49", badge: "Best Seller", colors: ["#8B4513", "#000000"], materials: ["Leather", "Stainless Steel"] },
    { id: 3, name: "Rose Gold Chronograph", category: "watches", subCategory: "watches", price: 15999, originalPrice: 19999, rating: 4.8, reviews: 67, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa", badge: "Trending", colors: ["#FF69B4", "#C0C0C0"], materials: ["Rose Gold", "Stainless Steel"] },
    { id: 4, name: "Diamond Pendant Necklace", category: "jewelry", subCategory: "jewelry", price: 18999, originalPrice: 25999, rating: 4.9, reviews: 234, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f", badge: "Exclusive", colors: ["#C0C0C0", "#FFD700"], materials: ["Silver", "Gold"] },
    { id: 5, name: "Pearl Stud Earrings", category: "jewelry", subCategory: "jewelry", price: 5999, originalPrice: 8999, rating: 4.8, reviews: 178, image: "/assets/images/g2.png", badge: "New Arrival", colors: ["#FFFFFF"], materials: ["Silver"] },
    { id: 6, name: "Gold Bangle Set", category: "jewelry", subCategory: "jewelry", price: 12999, originalPrice: 16999, rating: 4.7, reviews: 92, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a", badge: "Best Seller", colors: ["#FFD700"], materials: ["Gold"] },
    { id: 7, name: "Tennis Bracelet", category: "jewelry", subCategory: "jewelry", price: 34999, originalPrice: 44999, rating: 4.9, reviews: 145, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e", badge: "Premium", colors: ["#C0C0C0"], materials: ["Silver", "Platinum"] },
    { id: 8, name: "Designer Leather Handbag", category: "bags", subCategory: "bags", price: 15999, originalPrice: 22999, rating: 4.8, reviews: 167, image: "/assets/images/g22.png", badge: "Trending", colors: ["#8B4513", "#000000", "#800020"], materials: ["Leather"] },
    { id: 9, name: "Crossbody Mini Bag", category: "bags", subCategory: "bags", price: 6999, originalPrice: 9999, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c", badge: "Sale", colors: ["#FF69B4", "#000000", "#87CEEB"], materials: ["Leather"] },
    { id: 10, name: "Tote Bag", category: "bags", subCategory: "bags", price: 8999, originalPrice: 11999, rating: 4.7, reviews: 112, image: "https://images.unsplash.com/photo-1591561954555-607968c989ab", badge: "New Arrival", colors: ["#808080", "#000000", "#8B4513"], materials: ["Leather"] },
    { id: 11, name: "Cat Eye Sunglasses", category: "sunglasses", subCategory: "sunglasses", price: 3999, originalPrice: 5999, rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083", badge: "Trending", colors: ["#000000", "#8B4513", "#800020"], materials: ["Stainless Steel"] },
    { id: 12, name: "Aviator Sunglasses", category: "sunglasses", subCategory: "sunglasses", price: 4999, originalPrice: 6999, rating: 4.7, reviews: 134, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f", badge: "Best Seller", colors: ["#C0C0C0", "#FFD700", "#000000"], materials: ["Stainless Steel"] },
    { id: 13, name: "Leather Belt with Gold Buckle", category: "belts", subCategory: "belts", price: 2999, originalPrice: 3999, rating: 4.6, reviews: 78, image: "/assets/images/g3.png", badge: "New Arrival", colors: ["#8B4513", "#000000"], materials: ["Leather", "Gold"] },
    { id: 14, name: "Designer Chain Belt", category: "belts", subCategory: "belts", price: 4499, originalPrice: 5999, rating: 4.5, reviews: 45, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc", badge: "Trending", colors: ["#FFD700", "#C0C0C0"], materials: ["Gold", "Silver"] },
    { id: 15, name: "Silk Scarf", category: "scarves", subCategory: "scarves", price: 1999, originalPrice: 2999, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26", badge: "Sale", colors: ["#FF0000", "#800080", "#87CEEB"], materials: ["Silk"] },
    { id: 16, name: "Cashmere Wrap", category: "scarves", subCategory: "scarves", price: 5999, originalPrice: 7999, rating: 4.8, reviews: 34, image:"/assets/images/g.png", badge: "Premium", colors: ["#8B4513", "#808080", "#800020"], materials: ["Cashmere"] }
  ];

  const [products, setProducts] = useState(hardcodedProducts);

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products?category=Accessories");
      if (response.data.success) {
        const dbProducts = response.data.products.map(p => ({
          ...p,
          id: p._id,
          category: p.subCategory || "accessories",
          subCategory: p.subCategory || "accessories",
          originalPrice: p.originalPrice || Math.round((p.price || 0) * 1.2),
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["#000000", "#FFFFFF"],
          materials: Array.isArray(p.materials) ? p.materials : [],
          badge: p.badge || "New",
          image: p.image || null
        }));
        if (dbProducts.length > 0) {
          console.log(`✅ Loaded ${dbProducts.length} admin-added accessories from MongoDB`);
          setProducts([...hardcodedProducts, ...dbProducts]);
        } else {
          setProducts(hardcodedProducts);
        }
      }
    } catch (error) {
      console.error("Error loading accessories from MongoDB:", error);
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
      setMessageType("success"); setNewsletterMessage("🎉 Thank you for subscribing! Check your inbox for 10% off."); setEmail("");
    }
    setTimeout(() => { setNewsletterMessage(""); setMessageType(""); }, 5000);
  };

  const handleColorToggle = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleMaterialToggle = (mat) => setSelectedMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);
  const handleBadgeToggle = (badge) => setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  const clearAllFilters = () => { setPriceRange({ min: 0, max: 50000 }); setSelectedColors([]); setSelectedMaterials([]); setSelectedBadges([]); setSelectedSubCategory("all"); };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (selectedSubCategory !== "all" && product.subCategory !== selectedSubCategory) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c))) return false;
    if (selectedMaterials.length > 0 && product.materials?.length > 0 && !product.materials.some(m => selectedMaterials.includes(m))) return false;
    if (selectedBadges.length > 0 && !selectedBadges.includes(product.badge)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const categories = [
    { id: "all", name: "All Accessories" }, { id: "watches", name: "Watches" },
    { id: "jewelry", name: "Jewelry" }, { id: "bags", name: "Handbags" },
    { id: "sunglasses", name: "Sunglasses" }, { id: "belts", name: "Belts" }, { id: "scarves", name: "Scarves" }
  ];

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = cart.findIndex(item => item.id === product.id);
      if (idx >= 0) { cart[idx].quantity = (cart[idx].quantity || 1) + 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, colors: product.colors, quantity: 1 }); }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart! 🛍️");
    } catch (e) { alert("Error adding to cart. Please try again."); }
  };

  const addToWishlist = (product) => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const idx = wishlist.findIndex(item => item.id === product.id);
      if (idx >= 0) { wishlist.splice(idx, 1); alert(product.name + " removed from wishlist!"); }
      else { wishlist.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, colors: product.colors, rating: product.rating, reviews: product.reviews }); alert(product.name + " added to wishlist! ❤️"); }
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
          <h1 style={heroTitleStyle}>Women's <span style={heroSpanStyle}>Accessories</span></h1>
          <p style={heroTextStyle}>Elevate your style with our curated collection of premium accessories. From timeless watches to elegant jewelry, find the perfect finishing touch.</p>
          <div style={heroStatsStyle}>
            <div style={statItemStyle}><span style={statNumberStyle}>{products.length}+</span><span style={statLabelStyle}>Products</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>25k+</span><span style={statLabelStyle}>Happy Customers</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>4.8</span><span style={statLabelStyle}>Rating</span></div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d" alt="Accessories Hero" style={heroImgStyle} />
        </div>
      </div>

      <div style={categoryContainerStyle}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ ...categoryPillStyle, ...(selectedCategory === cat.id ? activeCategoryPillStyle : {}) }}>{cat.name}</button>
        ))}
      </div>

      <div style={filterBarStyle}>
        <div style={filterLeftStyle}>
          <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}><FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}</button>
          <span style={resultCountStyle}>{sortedProducts.length} Products Found</span>
          {(selectedColors.length > 0 || selectedMaterials.length > 0 || selectedBadges.length > 0 || selectedSubCategory !== "all" || priceRange.min > 0 || priceRange.max < 50000) && (
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
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Product Type</h4><div style={filterOptionsStyle}>{subCategories.map(sub => (<label key={sub.id} style={filterLabelStyle}><input type="radio" name="subCategory" value={sub.id} checked={selectedSubCategory === sub.id} onChange={() => setSelectedSubCategory(sub.id)} style={radioStyle} />{sub.name}</label>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Price Range</h4><div style={priceRangeStyle}><div style={priceInputsStyle}><input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={priceInputStyle} /><span style={priceSeparatorStyle}>-</span><input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={priceInputStyle} /></div><input type="range" min="0" max="50000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={rangeSliderStyle} /></div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Colors</h4><div style={colorGridStyle}>{colors.map(color => (<button key={color} onClick={() => handleColorToggle(color)} style={{ ...colorSwatchStyle, backgroundColor: color, border: selectedColors.includes(color) ? '3px solid #C4A962' : '1px solid #e0e0e0', transform: selectedColors.includes(color) ? 'scale(1.1)' : 'scale(1)' }} />))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Materials</h4><div style={badgeGridStyle}>{materials.map(material => (<button key={material} onClick={() => handleMaterialToggle(material)} style={{ ...badgeButtonStyle, backgroundColor: selectedMaterials.includes(material) ? '#C4A962' : 'white', color: selectedMaterials.includes(material) ? 'white' : '#333' }}>{material}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Collections</h4><div style={badgeGridStyle}>{badges.map(badge => (<button key={badge} onClick={() => handleBadgeToggle(badge)} style={{ ...badgeButtonStyle, backgroundColor: selectedBadges.includes(badge) ? '#C4A962' : 'white', color: selectedBadges.includes(badge) ? 'white' : '#333' }}>{badge}</button>))}</div></div>
        </div>
      )}

      <div id="products-section" style={productsGridStyle}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} style={productCardStyle}>
              {product.badge && (
                <span style={{ ...badgeStyle, backgroundColor: product.badge === "Premium" ? "#C4A962" : product.badge === "Sale" ? "#dc3545" : product.badge === "New Arrival" ? "#28a745" : product.badge === "New" ? "#28a745" : product.badge === "Exclusive" ? "#8B4513" : product.badge === "Limited Edition" ? "#800080" : "#d63384" }}>{product.badge}</span>
              )}
              <button style={{ ...wishlistButtonStyle, color: isInWishlist(product.id) ? "#dc3545" : "#666", backgroundColor: isInWishlist(product.id) ? "#fff0f0" : "white" }} onClick={() => addToWishlist(product)}><FaHeart /></button>
              <img src={product.image || PLACEHOLDER} alt={product.name} style={productImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} />
              <div style={productInfoStyle}>
                <h3 style={productNameStyle}>{product.name}</h3>
                <div style={ratingStyle}>{[...Array(5)].map((_, i) => <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? "#FFD700" : "#e0e0e0", fontSize: "14px" }} />)}<span style={reviewCountStyle}>({product.reviews})</span></div>
                <div style={priceContainerStyle}>
                  <span style={currentPriceStyle}>₹{product.price.toLocaleString()}</span>
                  <span style={originalPriceStyle}>₹{(product.originalPrice || product.price).toLocaleString()}</span>
                  {product.originalPrice > product.price && <span style={discountStyle}>{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>}
                </div>
                <div style={colorContainerStyle}>{product.colors.map((color, index) => <span key={index} style={{ ...colorDotStyle, backgroundColor: color }} />)}</div>
                {product.materials && product.materials.length > 0 && <div style={materialInfoStyle}><span style={materialLabelStyle}>Material: </span>{product.materials.join(", ")}</div>}
                <button style={addToCartButtonStyle} onClick={() => addToCart(product)}><FaShoppingCart /> Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <div style={noProductsStyle}><h3>No products found matching your filters</h3><button style={clearAllButtonStyle} onClick={clearAllFilters}>Clear All Filters</button></div>
        )}
      </div>

      <div style={featuredCollectionsStyle}>
        <h2 style={sectionTitleStyle}>Shop By Category</h2>
        <div style={collectionGridStyle}>
          <div style={collectionCardStyle}><img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314" alt="Watches" style={collectionImageStyle} /><div style={collectionOverlayStyle}><h3>Luxury Watches</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("watches")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f" alt="Jewelry" style={collectionImageStyle} /><div style={collectionOverlayStyle}><h3>Fine Jewelry</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("jewelry")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="/assets/images/b1.png" alt="Handbags" style={collectionImageStyle} /><div style={collectionOverlayStyle}><h3>Designer Bags</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("bags")}>Shop Now</button></div></div>
        </div>
      </div>

      <div style={newsletterStyle}>
        <h2 style={newsletterTitleStyle}>Stay in Style</h2>
        <p style={newsletterTextStyle}>Subscribe for 10% off your first accessory purchase</p>
        <form onSubmit={handleNewsletterSubmit} style={newsletterInputStyle}>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={newsletterInputFieldStyle} />
          <button type="submit" style={newsletterButtonStyle}>Subscribe</button>
        </form>
        {newsletterMessage && <div style={{ ...newsletterMessageStyle, backgroundColor: messageType === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)", color: messageType === "success" ? "#28a745" : "#dc3545", border: messageType === "success" ? "1px solid #28a745" : "1px solid #dc3545" }}>{newsletterMessage}</div>}
      </div>
      <div style={footerStyle}><p>© 2026 Women's Luxury Accessories. All Rights Reserved.</p></div>
    </div>
  );
}

const materialInfoStyle = { fontSize: "12px", color: "#666", marginBottom: "15px", padding: "5px 0" };
const materialLabelStyle = { fontWeight: "600", color: "#333" };
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
const filterButtonStyle = { padding: "10px 20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease" };
const resultCountStyle = { color: "#666" };
const clearAllButtonStyle = { padding: "8px 16px", border: "1px solid #dc3545", borderRadius: "8px", background: "white", color: "#dc3545", cursor: "pointer", fontSize: "14px", transition: "all 0.3s ease" };
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
const badgeGridStyle = { display: "flex", flexWrap: "wrap", gap: "8px" };
const badgeButtonStyle = { padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "20px", background: "white", cursor: "pointer", fontSize: "12px", transition: "all 0.3s ease" };
const productsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", padding: "40px 80px", minHeight: "400px" };
const productCardStyle = { background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease", position: "relative", cursor: "pointer" };
const badgeStyle = { position: "absolute", top: "15px", left: "15px", padding: "5px 15px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "600", zIndex: 2 };
const wishlistButtonStyle = { position: "absolute", top: "15px", right: "15px", background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 2, color: "#666", transition: "all 0.3s ease" };
const productImageStyle = { width: "100%", height: "300px", objectFit: "cover", transition: "transform 0.3s ease" };
const productInfoStyle = { padding: "20px" };
const productNameStyle = { fontSize: "16px", marginBottom: "10px", fontWeight: "600" };
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
const sectionTitleStyle = { textAlign: "center", fontSize: "32px", marginBottom: "40px", color: "#333" };
const collectionGridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" };
const collectionCardStyle = { position: "relative", height: "300px", borderRadius: "15px", overflow: "hidden", cursor: "pointer" };
const collectionImageStyle = { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" };
const collectionOverlayStyle = { position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "white", padding: "30px", textAlign: "center" };
const collectionButtonStyle = { padding: "10px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "25px", marginTop: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s ease" };
const newsletterStyle = { padding: "60px 80px", textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" };
const newsletterTitleStyle = { fontSize: "32px", marginBottom: "15px" };
const newsletterTextStyle = { fontSize: "16px", marginBottom: "30px" };
const newsletterInputStyle = { display: "flex", justifyContent: "center", gap: "10px", maxWidth: "500px", margin: "0 auto" };
const newsletterInputFieldStyle = { flex: 1, padding: "15px 20px", border: "none", borderRadius: "30px", fontSize: "16px", outline: "none" };
const newsletterButtonStyle = { padding: "15px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s ease" };
const newsletterMessageStyle = { marginTop: "20px", padding: "12px 20px", borderRadius: "30px", maxWidth: "500px", margin: "20px auto 0", fontWeight: "500" };
const footerStyle = { textAlign: "center", padding: "30px", background: "#333", color: "white" };

export default Accessories;
