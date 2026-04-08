// KidsAccessories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar, FaFilter } from "react-icons/fa";

function KidsAccessories() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 8000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);

  const colors = ["#FF69B4","#87CEEB","#98FB98","#FFB6C1","#FFD700","#FFA07A","#E6E6FA","#F0E68C","#DDA0DD","#B0E0E6","#F08080","#9ACD32","#FFFFFF","#000000"];
  const ageGroups = ["Infant (0-12M)","Toddler (1-3Y)","Preschool (3-5Y)","Kids (5-8Y)","Preteen (8-12Y)","Teen (12-14Y)"];
  const badges = ["Best Seller","New Arrival","Trending","Premium","Sale","Exclusive","New","Eco-Friendly","Handmade","Personalized"];
  const subCategories = [
    { id: "all", name: "All Accessories" },
    { id: "hair", name: "Hair Accessories" },
    { id: "hats", name: "Hats & Caps" },
    { id: "sunglasses", name: "Sunglasses" },
    { id: "bags", name: "Bags & Backpacks" },
    { id: "belts", name: "Belts" },
    { id: "hairbands", name: "Hairbands & Bows" }
  ];

  const hardcodedProducts = [
    { id: 1, name: "Sparkly Hair Bows Set", category: "hair", subCategory: "hair", ageGroup: "Kids (5-8Y)", price: 499, originalPrice: 799, rating: 4.7, reviews: 234, image: "/assets/images/C2.png", badge: "Best Seller", colors: ["#FF69B4","#FFB6C1","#FFD700","#DDA0DD"], features: ["Set of 6","Non-slip grip","Soft fabric"] },
    { id: 2, name: "Glitter Hair Clips", category: "hair", subCategory: "hair", ageGroup: "Preschool (3-5Y)", price: 299, originalPrice: 499, rating: 4.6, reviews: 167, image: "/assets/images/C4.png", badge: "New Arrival", colors: ["#FFD700","#FF69B4","#87CEEB","#98FB98"], features: ["Set of 10","Glitter finish","Safe for kids"] },
    { id: 3, name: "Floral Hairbands", category: "hairbands", subCategory: "hairbands", ageGroup: "Toddler (1-3Y)", price: 399, originalPrice: 599, rating: 4.8, reviews: 98, image: "/assets/images/C2.png", badge: "Trending", colors: ["#FFB6C1","#E6E6FA","#F0E68C"], features: ["Adjustable","Soft elastic","Fabric flowers"] },
    { id: 4, name: "Character Hair Ties", category: "hair", subCategory: "hair", ageGroup: "Kids (5-8Y)", price: 249, originalPrice: 399, rating: 4.5, reviews: 145, image: "/assets/images/C12.png", badge: "Sale", colors: ["#FF69B4","#9ACD32","#FFA07A"], features: ["Set of 12","No-damage","Colorful"] },
    { id: 5, name: "Sun Protection Hat", category: "hats", subCategory: "hats", ageGroup: "Infant (0-12M)", price: 899, originalPrice: 1299, rating: 4.8, reviews: 156, image: "/assets/images/C5.png", badge: "Best Seller", colors: ["#FFB6C1","#87CEEB","#98FB98","#FFFFFF"], features: ["UPF 50+","Adjustable strap","Breathable"] },
    { id: 6, name: "Baseball Cap", category: "hats", subCategory: "hats", ageGroup: "Kids (5-8Y)", price: 699, originalPrice: 999, rating: 4.7, reviews: 112, image: "/assets/images/C14.png", badge: "New Arrival", colors: ["#FF69B4","#87CEEB","#9ACD32","#FFD700"], features: ["Adjustable","Cotton material","Curved brim"] },
    { id: 7, name: "Winter Beanie", category: "hats", subCategory: "hats", ageGroup: "Toddler (1-3Y)", price: 599, originalPrice: 899, rating: 4.6, reviews: 89, image: "/assets/images/C6.png", badge: "Premium", colors: ["#FF69B4","#87CEEB","#98FB98","#DDA0DD"], features: ["Fleece lined","Pom-pom","Warm & cozy"] },
    { id: 8, name: "Kids UV Protection Sunglasses", category: "sunglasses", subCategory: "sunglasses", ageGroup: "Preschool (3-5Y)", price: 899, originalPrice: 1499, rating: 4.8, reviews: 134, image: "/assets/images/C8.png", badge: "Best Seller", colors: ["#FF69B4","#87CEEB","#9ACD32","#FFD700"], features: ["UV400 protection","Shockproof","Flexible frame"] },
    { id: 9, name: "Character Sunglasses", category: "sunglasses", subCategory: "sunglasses", ageGroup: "Kids (5-8Y)", price: 699, originalPrice: 1199, rating: 4.7, reviews: 98, image: "/assets/images/C7.png", badge: "Trending", colors: ["#FF69B4","#87CEEB","#FFD700"], features: ["Polarized","Scratch resistant","Fun designs"] },
    { id: 10, name: "Preschool Backpack", category: "bags", subCategory: "bags", ageGroup: "Preschool (3-5Y)", price: 1499, originalPrice: 2199, rating: 4.8, reviews: 189, image: "/assets/images/C11.png", badge: "Best Seller", colors: ["#FF69B4","#87CEEB","#9ACD32","#FFD700"], features: ["Lightweight","Adjustable straps","Multiple pockets"] },
    { id: 11, name: "School Backpack", category: "bags", subCategory: "bags", ageGroup: "Kids (5-8Y)", price: 1999, originalPrice: 2999, rating: 4.7, reviews: 156, image: "/assets/images/C13.png", badge: "New Arrival", colors: ["#FF69B4","#87CEEB","#9ACD32","#FFA07A"], features: ["Ergonomic design","Water resistant","Padded straps"] },
    { id: 12, name: "Lunch Bag", category: "bags", subCategory: "bags", ageGroup: "Kids (5-8Y)", price: 899, originalPrice: 1299, rating: 4.6, reviews: 98, image: "/assets/images/C10.png", badge: "Trending", colors: ["#FF69B4","#87CEEB","#9ACD32"], features: ["Insulated","Easy clean","Compact"] },
    { id: 13, name: "Adjustable Kids Belt", category: "belts", subCategory: "belts", ageGroup: "Kids (5-8Y)", price: 599, originalPrice: 899, rating: 4.6, reviews: 78, image: "/assets/images/C4.png", badge: "New Arrival", colors: ["#FF69B4","#87CEEB","#000000","#8B4513"], features: ["Adjustable","Easy buckle","Durable"] }
  ];

  const [products, setProducts] = useState(hardcodedProducts);

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products?category=Kids%20Accessories");
      if (response.data.success) {
        const dbProducts = response.data.products.map(p => ({
          ...p,
          id: p._id,
          category: p.subCategory || p.category || "hair",
          subCategory: p.subCategory || p.category || "hair",
          ageGroup: p.ageGroup || "Kids (5-8Y)",
          originalPrice: p.originalPrice || Math.round((p.price || 0) * 1.2),
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["#FF69B4","#87CEEB","#FFD700"],
          features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Premium Quality"],
          badge: p.badge || "New",
          image: p.image || null
        }));
        if (dbProducts.length > 0) {
          console.log(`✅ Loaded ${dbProducts.length} admin-added kids accessories from MongoDB`);
          setProducts([...hardcodedProducts, ...dbProducts]);
        } else {
          setProducts(hardcodedProducts);
        }
      }
    } catch (error) {
      console.error("Error loading kids accessories from MongoDB:", error);
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
  const handleAgeGroupToggle = (ag) => setSelectedAgeGroup(prev => prev.includes(ag) ? prev.filter(a => a !== ag) : [...prev, ag]);
  const handleBadgeToggle = (badge) => setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  const clearAllFilters = () => { setPriceRange({ min: 0, max: 8000 }); setSelectedColors([]); setSelectedAgeGroup([]); setSelectedBadges([]); setSelectedSubCategory("all"); };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (selectedSubCategory !== "all" && product.subCategory !== selectedSubCategory) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c))) return false;
    if (selectedAgeGroup.length > 0 && !selectedAgeGroup.includes(product.ageGroup)) return false;
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
    { id: "all", name: "All Accessories" },
    { id: "hair", name: "Hair Accessories" },
    { id: "hats", name: "Hats & Caps" },
    { id: "sunglasses", name: "Sunglasses" },
    { id: "bags", name: "Bags" }
  ];

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = cart.findIndex(item => item.id === product.id);
      if (idx >= 0) { cart[idx].quantity = (cart[idx].quantity || 1) + 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, ageGroup: product.ageGroup, colors: product.colors, features: product.features, quantity: 1 }); }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart! 🛍️");
    } catch (e) { alert("There was an error adding to cart. Please try again."); }
  };

  const addToWishlist = (product) => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const idx = wishlist.findIndex(item => item.id === product.id);
      if (idx >= 0) { wishlist.splice(idx, 1); alert(product.name + " removed from wishlist!"); }
      else { wishlist.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, ageGroup: product.ageGroup, colors: product.colors, features: product.features, rating: product.rating, reviews: product.reviews }); alert(product.name + " added to wishlist! ❤️"); }
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
          <h1 style={heroTitleStyle}>Kids' <span style={heroSpanStyle}>Accessories</span></h1>
          <p style={heroTextStyle}>Discover our delightful collection of kids' accessories. From cute hair bows to stylish backpacks, add the perfect finishing touch to your little one's outfit.</p>
          <div style={heroStatsStyle}>
            <div style={statItemStyle}><span style={statNumberStyle}>{products.length}+</span><span style={statLabelStyle}>Products</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>8k+</span><span style={statLabelStyle}>Happy Parents</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>4.8</span><span style={statLabelStyle}>Rating</span></div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src="/assets/images/C3.png" alt="Kids Accessories Hero" style={heroImgStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} />
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
          {(selectedColors.length > 0 || selectedAgeGroup.length > 0 || selectedBadges.length > 0 || selectedSubCategory !== "all" || priceRange.min > 0 || priceRange.max < 8000) && (
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
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Price Range</h4><div style={priceRangeStyle}><div style={priceInputsStyle}><input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={priceInputStyle} /><span style={priceSeparatorStyle}>-</span><input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={priceInputStyle} /></div><input type="range" min="0" max="8000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={rangeSliderStyle} /></div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Colors</h4><div style={colorGridStyle}>{colors.map(color => (<button key={color} onClick={() => handleColorToggle(color)} style={{ ...colorSwatchStyle, backgroundColor: color, border: selectedColors.includes(color) ? '3px solid #C4A962' : '1px solid #e0e0e0', transform: selectedColors.includes(color) ? 'scale(1.1)' : 'scale(1)' }} />))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Age Group</h4><div style={badgeGridStyle}>{ageGroups.map(ag => (<button key={ag} onClick={() => handleAgeGroupToggle(ag)} style={{ ...badgeButtonStyle, backgroundColor: selectedAgeGroup.includes(ag) ? '#C4A962' : 'white', color: selectedAgeGroup.includes(ag) ? 'white' : '#333' }}>{ag}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Collections</h4><div style={badgeGridStyle}>{badges.map(badge => (<button key={badge} onClick={() => handleBadgeToggle(badge)} style={{ ...badgeButtonStyle, backgroundColor: selectedBadges.includes(badge) ? '#C4A962' : 'white', color: selectedBadges.includes(badge) ? 'white' : '#333' }}>{badge}</button>))}</div></div>
        </div>
      )}

      <div id="products-section" style={productsGridStyle}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} style={productCardStyle}>
              {product.badge && (
                <span style={{ ...badgeStyle, backgroundColor: product.badge === "Premium" ? "#C4A962" : product.badge === "Sale" ? "#dc3545" : product.badge === "New Arrival" ? "#28a745" : product.badge === "New" ? "#28a745" : product.badge === "Exclusive" ? "#8B4513" : product.badge === "Eco-Friendly" ? "#2E8B57" : product.badge === "Handmade" ? "#FF8C00" : product.badge === "Personalized" ? "#9370DB" : "#d63384" }}>{product.badge}</span>
              )}
              <button style={{ ...wishlistButtonStyle, color: isInWishlist(product.id) ? "#dc3545" : "#666", backgroundColor: isInWishlist(product.id) ? "#fff0f0" : "white" }} onClick={() => addToWishlist(product)}><FaHeart /></button>
              <img src={product.image || PLACEHOLDER} alt={product.name} style={productImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} />
              <div style={productInfoStyle}>
                <h3 style={productNameStyle}>{product.name}</h3>
                <div style={ageGroupStyle}><span style={ageGroupLabelStyle}>Age: </span>{product.ageGroup}</div>
                <div style={ratingStyle}>{[...Array(5)].map((_, i) => <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? "#FFD700" : "#e0e0e0", fontSize: "14px" }} />)}<span style={reviewCountStyle}>({product.reviews})</span></div>
                <div style={priceContainerStyle}>
                  <span style={currentPriceStyle}>₹{product.price.toLocaleString()}</span>
                  <span style={originalPriceStyle}>₹{(product.originalPrice || product.price).toLocaleString()}</span>
                  {product.originalPrice > product.price && <span style={discountStyle}>{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>}
                </div>
                <div style={colorContainerStyle}>{product.colors.map((color, index) => <span key={index} style={{ ...colorDotStyle, backgroundColor: color }} />)}</div>
                {product.features && product.features.length > 0 && <div style={featuresStyle}><span style={featuresLabelStyle}>Features: </span>{product.features.slice(0, 3).join(" • ")}</div>}
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
          <div style={collectionCardStyle}><img src="/assets/images/C1.png" alt="Hair Accessories" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Hair Accessories</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("hair")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="/assets/images/C9.png" alt="Bags" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Bags & Backpacks</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("bags")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="/assets/images/C3.png" alt="Sunglasses" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Sunglasses</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("sunglasses")}>Shop Now</button></div></div>
        </div>
      </div>

      <div style={newsletterStyle}>
        <h2 style={newsletterTitleStyle}>Join Our Parent Club</h2>
        <p style={newsletterTextStyle}>Get 10% off your first accessory purchase and exclusive access to new collections</p>
        <form onSubmit={handleNewsletterSubmit} style={newsletterInputStyle}>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={newsletterInputFieldStyle} />
          <button type="submit" style={newsletterButtonStyle}>Subscribe</button>
        </form>
        {newsletterMessage && <div style={{ ...newsletterMessageStyle, backgroundColor: messageType === "success" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)", color: "#FFFFFF", border: messageType === "success" ? "1px solid #28a745" : "1px solid #dc3545" }}>{newsletterMessage}</div>}
      </div>
      <div style={footerStyle}><p>© 2026 Kids' Accessories. All Rights Reserved.</p></div>
    </div>
  );
}

const featuresStyle = { fontSize: "12px", color: "#666", marginBottom: "15px", lineHeight: "1.4" };
const featuresLabelStyle = { fontWeight: "600", color: "#333" };
const ageGroupStyle = { fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "500" };
const ageGroupLabelStyle = { color: "#333", fontWeight: "600" };
const pageStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: "#ffffff" };
const heroStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 80px", background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", minHeight: "500px", position: "relative", overflow: "hidden" };
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
const priceContainerStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" };
const currentPriceStyle = { fontSize: "18px", fontWeight: "700", color: "#C4A962" };
const originalPriceStyle = { fontSize: "14px", color: "#999", textDecoration: "line-through" };
const discountStyle = { fontSize: "12px", color: "#28a745", fontWeight: "600" };
const colorContainerStyle = { display: "flex", gap: "8px", marginBottom: "8px" };
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
const newsletterStyle = { padding: "60px 80px", textAlign: "center", background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", color: "white" };
const newsletterTitleStyle = { fontSize: "32px", marginBottom: "15px" };
const newsletterTextStyle = { fontSize: "16px", marginBottom: "30px" };
const newsletterInputStyle = { display: "flex", justifyContent: "center", gap: "10px", maxWidth: "500px", margin: "0 auto" };
const newsletterInputFieldStyle = { flex: 1, padding: "15px 20px", border: "none", borderRadius: "30px", fontSize: "16px", outline: "none" };
const newsletterButtonStyle = { padding: "15px 30px", background: "#C4A962", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s ease" };
const newsletterMessageStyle = { marginTop: "20px", padding: "12px 20px", borderRadius: "30px", maxWidth: "500px", margin: "20px auto 0", fontWeight: "500" };
const footerStyle = { textAlign: "center", padding: "30px", background: "#333", color: "white" };

export default KidsAccessories;
