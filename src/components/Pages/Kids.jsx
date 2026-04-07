// Kids.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar, FaFilter } from "react-icons/fa";

function Kids() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 15000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);

  const colors = ["#FF69B4","#87CEEB","#98FB98","#FFB6C1","#FFD700","#FFA07A","#E6E6FA","#F0E68C","#DDA0DD","#B0E0E6","#F08080","#9ACD32"];
  const sizes = ["0-3M","3-6M","6-12M","12-18M","18-24M","2T","3T","4T","5T","6","7","8","10","12","14"];
  const ageGroups = ["Infant (0-12M)","Toddler (1-3Y)","Preschool (3-5Y)","Kids (5-8Y)","Preteen (8-12Y)","Teen (12-14Y)"];
  const badges = ["Best Seller","New Arrival","Trending","Premium","Sale","Exclusive","New","Eco-Friendly","Handmade"];
  const subCategories = [
    { id: "all", name: "All Types" },
    { id: "girls", name: "Girls" },
    { id: "boys", name: "Boys" },
    { id: "babies", name: "Babies" },
    { id: "party", name: "Party Wear" },
    { id: "casual", name: "Casual Wear" },
    { id: "traditional", name: "Traditional" }
  ];

  const hardcodedProducts = [
    { id: 1, name: "Princess Party Dress", category: "girls", subCategory: "girls", ageGroup: "Preschool (3-5Y)", price: 2499, originalPrice: 3999, rating: 4.8, reviews: 124, image: "/assets/images/d1.png", badge: "Best Seller", colors: ["#FF69B4","#FFB6C1","#FFD700"], sizes: ["2T","3T","4T","5T"] },
    { id: 2, name: "Floral Summer Dress", category: "girls", subCategory: "girls", ageGroup: "Kids (5-8Y)", price: 1899, originalPrice: 2799, rating: 4.7, reviews: 89, image: "/assets/images/d2.png", badge: "New Arrival", colors: ["#98FB98","#FFB6C1","#87CEEB"], sizes: ["5T","6","7","8"] },
    { id: 3, name: "Denim Skirt Set", category: "girls", subCategory: "girls", ageGroup: "Preteen (8-12Y)", price: 2199, originalPrice: 3299, rating: 4.6, reviews: 67, image: "/assets/images/d3.png", badge: "Trending", colors: ["#FFA07A","#E6E6FA","#F0E68C"], sizes: ["8","10","12"] },
    { id: 4, name: "Party Wear Lehenga", category: "girls", subCategory: "party", ageGroup: "Kids (5-8Y)", price: 3999, originalPrice: 5999, rating: 4.9, reviews: 156, image: "/assets/images/d4.png", badge: "Premium", colors: ["#FFD700","#FF69B4","#DDA0DD"], sizes: ["5T","6","7","8"] },
    { id: 5, name: "Mini Suit Set", category: "boys", subCategory: "boys", ageGroup: "Preschool (3-5Y)", price: 2999, originalPrice: 4499, rating: 4.8, reviews: 98, image: "/assets/images/d5.png", badge: "Best Seller", colors: ["#00008B","#2F4F4F","#808080"], sizes: ["2T","3T","4T","5T"] },
    { id: 6, name: "Casual Shirt & Jeans", category: "boys", subCategory: "boys", ageGroup: "Kids (5-8Y)", price: 1599, originalPrice: 2499, rating: 4.7, reviews: 112, image: "/assets/images/d6.png", badge: "New Arrival", colors: ["#87CEEB","#98FB98","#FFA07A"], sizes: ["5T","6","7","8"] },
    { id: 7, name: "Traditional Kurta Set", category: "boys", subCategory: "traditional", ageGroup: "Preteen (8-12Y)", price: 2799, originalPrice: 3999, rating: 4.8, reviews: 78, image: "/assets/images/d7.png", badge: "Premium", colors: ["#800020","#FFD700","#2F4F4F"], sizes: ["8","10","12"] },
    { id: 8, name: "Party Blazer Set", category: "boys", subCategory: "party", ageGroup: "Teen (12-14Y)", price: 4499, originalPrice: 6499, rating: 4.9, reviews: 45, image: "/assets/images/d8.png", badge: "Exclusive", colors: ["#000000","#191970","#4A4A4A"], sizes: ["12","14"] },
    { id: 9, name: "Baby Romper Set", category: "babies", subCategory: "babies", ageGroup: "Infant (0-12M)", price: 999, originalPrice: 1499, rating: 4.8, reviews: 234, image: "/assets/images/d9.png", badge: "Best Seller", colors: ["#FFB6C1","#87CEEB","#98FB98"], sizes: ["0-3M","3-6M","6-12M"] },
    { id: 10, name: "Onesie Gift Set", category: "babies", subCategory: "babies", ageGroup: "Infant (0-12M)", price: 1499, originalPrice: 2199, rating: 4.7, reviews: 167, image: "/assets/images/d10.png", badge: "New Arrival", colors: ["#F0E68C","#DDA0DD","#B0E0E6"], sizes: ["0-3M","3-6M","6-12M"] },
    { id: 11, name: "Baby Girl Dress", category: "babies", subCategory: "girls", ageGroup: "Toddler (1-3Y)", price: 1299, originalPrice: 1899, rating: 4.6, reviews: 89, image: "/assets/images/d11.png", badge: "Sale", colors: ["#FF69B4","#FFB6C1","#FFFFFF"], sizes: ["12-18M","18-24M","2T"] },
    { id: 12, name: "Baby Boy Suit", category: "babies", subCategory: "boys", ageGroup: "Toddler (1-3Y)", price: 1799, originalPrice: 2599, rating: 4.7, reviews: 67, image: "/assets/images/d12.png", badge: "Trending", colors: ["#87CEEB","#98FB98","#F08080"], sizes: ["12-18M","18-24M","2T"] },
    { id: 13, name: "Flower Girl Dress", category: "girls", subCategory: "party", ageGroup: "Kids (5-8Y)", price: 3499, originalPrice: 4999, rating: 4.9, reviews: 145, image: "/assets/images/d13.png", badge: "Premium", colors: ["#FFD700","#FF69B4","#FFFFFF"], sizes: ["5T","6","7","8"] },
    { id: 14, name: "Ring Bearer Suit", category: "boys", subCategory: "party", ageGroup: "Preschool (3-5Y)", price: 2999, originalPrice: 4499, rating: 4.8, reviews: 98, image: "/assets/images/d14.png", badge: "Best Seller", colors: ["#000000","#2F4F4F","#808080"], sizes: ["2T","3T","4T","5T"] },
    { id: 15, name: "Graphic T-Shirt & Shorts", category: "boys", subCategory: "casual", ageGroup: "Kids (5-8Y)", price: 1199, originalPrice: 1799, rating: 4.6, reviews: 178, image: "/assets/images/d15.png", badge: "New Arrival", colors: ["#87CEEB","#98FB98","#FFA07A"], sizes: ["5T","6","7","8"] },
    { id: 16, name: "Printed Leggings Set", category: "girls", subCategory: "casual", ageGroup: "Preteen (8-12Y)", price: 1399, originalPrice: 1999, rating: 4.7, reviews: 134, image: "/assets/images/d16.png", badge: "Trending", colors: ["#FFB6C1","#E6E6FA","#DDA0DD"], sizes: ["8","10","12"] },
    { id: 17, name: "Mini Lehenga Set", category: "girls", subCategory: "traditional", ageGroup: "Preschool (3-5Y)", price: 4499, originalPrice: 6499, rating: 4.9, reviews: 87, image: "/assets/images/d17.png", badge: "Exclusive", colors: ["#800020","#FFD700","#800080"], sizes: ["2T","3T","4T","5T"] },
    { id: 18, name: "Kids Kurta Pajama", category: "boys", subCategory: "traditional", ageGroup: "Kids (5-8Y)", price: 2199, originalPrice: 3299, rating: 4.7, reviews: 76, image: "/assets/images/d18.png", badge: "Premium", colors: ["#8B4513","#FFD700","#2F4F4F"], sizes: ["5T","6","7","8"] }
  ];

  const [products, setProducts] = useState(hardcodedProducts);

  // ========== LOAD PRODUCTS FROM MONGODB ✅ ==========
  const loadProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products?category=Kids");
      if (response.data.success) {
        const dbProducts = response.data.products.map(p => ({
          ...p,
          id: p._id,
          category: p.subCategory || "girls",
          subCategory: p.subCategory || "girls",
          ageGroup: p.ageGroup || "Kids (5-8Y)",
          originalPrice: p.originalPrice || Math.round((p.price || 0) * 1.2),
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["#FF69B4","#87CEEB","#98FB98"],
          sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S","M","L","XL"],
          badge: p.badge || "New",
          image: p.image || null
        }));
        if (dbProducts.length > 0) {
          console.log(`✅ Loaded ${dbProducts.length} admin-added kids products from MongoDB`);
          setProducts([...hardcodedProducts, ...dbProducts]);
        } else {
          setProducts(hardcodedProducts);
        }
      }
    } catch (error) {
      console.error("Error loading kids products from MongoDB:", error);
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
  const handleCollectionClick = (collection) => { setSelectedCategory(collection); document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' }); };

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
  const handleSizeToggle = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const handleAgeGroupToggle = (ag) => setSelectedAgeGroup(prev => prev.includes(ag) ? prev.filter(a => a !== ag) : [...prev, ag]);
  const handleBadgeToggle = (badge) => setSelectedBadges(prev => prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]);
  const clearAllFilters = () => { setPriceRange({ min: 0, max: 15000 }); setSelectedColors([]); setSelectedSizes([]); setSelectedAgeGroup([]); setSelectedBadges([]); setSelectedSubCategory("all"); };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (selectedSubCategory !== "all" && product.subCategory !== selectedSubCategory) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c))) return false;
    if (selectedSizes.length > 0 && !product.sizes.some(s => selectedSizes.includes(s))) return false;
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
    { id: "all", name: "All Items" },
    { id: "girls", name: "Girls" },
    { id: "boys", name: "Boys" },
    { id: "babies", name: "Babies" }
  ];

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = cart.findIndex(item => item.id === product.id);
      if (idx >= 0) { cart[idx].quantity = (cart[idx].quantity || 1) + 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, ageGroup: product.ageGroup, colors: product.colors, sizes: product.sizes, quantity: 1 }); }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart! 🛍️");
    } catch (e) { alert("There was an error adding to cart. Please try again."); }
  };

  const addToWishlist = (product) => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const idx = wishlist.findIndex(item => item.id === product.id);
      if (idx >= 0) { wishlist.splice(idx, 1); alert(product.name + " removed from wishlist!"); }
      else { wishlist.push({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image || null, category: product.category, badge: product.badge, ageGroup: product.ageGroup, colors: product.colors, sizes: product.sizes, rating: product.rating, reviews: product.reviews }); alert(product.name + " added to wishlist! ❤️"); }
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
          <h1 style={heroTitleStyle}>Kids' <span style={heroSpanStyle}>Designer</span> Collection</h1>
          <p style={heroTextStyle}>Discover our adorable collection of kids' designer wear. From precious newborn outfits to stylish party wear, dress your little ones in the finest fashion.</p>
          <div style={heroStatsStyle}>
            <div style={statItemStyle}><span style={statNumberStyle}>{products.length}+</span><span style={statLabelStyle}>Products</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>25k+</span><span style={statLabelStyle}>Happy Parents</span></div>
            <div style={statItemStyle}><span style={statNumberStyle}>4.8</span><span style={statLabelStyle}>Rating</span></div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src="/assets/images/d3.png" alt="Kids Fashion Hero" style={heroImgStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} />
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
          {(selectedColors.length > 0 || selectedSizes.length > 0 || selectedAgeGroup.length > 0 || selectedBadges.length > 0 || selectedSubCategory !== "all" || priceRange.min > 0 || priceRange.max < 15000) && (
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
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Price Range</h4><div style={priceRangeStyle}><div style={priceInputsStyle}><input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={priceInputStyle} /><span style={priceSeparatorStyle}>-</span><input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={priceInputStyle} /></div><input type="range" min="0" max="15000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={rangeSliderStyle} /></div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Colors</h4><div style={colorGridStyle}>{colors.map(color => (<button key={color} onClick={() => handleColorToggle(color)} style={{ ...colorSwatchStyle, backgroundColor: color, border: selectedColors.includes(color) ? '3px solid #C4A962' : '1px solid #e0e0e0', transform: selectedColors.includes(color) ? 'scale(1.1)' : 'scale(1)' }} />))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Sizes</h4><div style={sizeGridStyle}>{sizes.map(size => (<button key={size} onClick={() => handleSizeToggle(size)} style={{ ...sizeButtonStyle, backgroundColor: selectedSizes.includes(size) ? '#C4A962' : 'white', color: selectedSizes.includes(size) ? 'white' : '#333', borderColor: selectedSizes.includes(size) ? '#C4A962' : '#e0e0e0' }}>{size}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Age Group</h4><div style={badgeGridStyle}>{ageGroups.map(ag => (<button key={ag} onClick={() => handleAgeGroupToggle(ag)} style={{ ...badgeButtonStyle, backgroundColor: selectedAgeGroup.includes(ag) ? '#C4A962' : 'white', color: selectedAgeGroup.includes(ag) ? 'white' : '#333' }}>{ag}</button>))}</div></div>
          <div style={filterSectionStyle}><h4 style={filterTitleStyle}>Collections</h4><div style={badgeGridStyle}>{badges.map(badge => (<button key={badge} onClick={() => handleBadgeToggle(badge)} style={{ ...badgeButtonStyle, backgroundColor: selectedBadges.includes(badge) ? '#C4A962' : 'white', color: selectedBadges.includes(badge) ? 'white' : '#333' }}>{badge}</button>))}</div></div>
        </div>
      )}

      <div id="products-section" style={productsGridStyle}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} style={productCardStyle}>
              {product.badge && (
                <span style={{ ...badgeStyle, backgroundColor: product.badge === "Premium" ? "#C4A962" : product.badge === "Sale" ? "#dc3545" : product.badge === "New Arrival" ? "#28a745" : product.badge === "New" ? "#28a745" : product.badge === "Exclusive" ? "#8B4513" : product.badge === "Eco-Friendly" ? "#2E8B57" : product.badge === "Handmade" ? "#FF8C00" : "#d63384" }}>{product.badge}</span>
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
                <div style={sizeInfoStyle}><span style={sizeLabelStyle}>Sizes: </span>{product.sizes.join(", ")}</div>
                <button style={addToCartButtonStyle} onClick={() => addToCart(product)}><FaShoppingCart /> Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <div style={noProductsStyle}><h3>No products found matching your filters</h3><button style={clearAllButtonStyle} onClick={clearAllFilters}>Clear All Filters</button></div>
        )}
      </div>

      <div style={featuredCollectionsStyle}>
        <h2 style={sectionTitleStyle}>Shop By Collection</h2>
        <div style={collectionGridStyle}>
          <div style={collectionCardStyle}><img src="/assets/images/d7.png" alt="Girls" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Girls Collection</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("girls")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="/assets/images/d11.png" alt="Boys" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Boys Collection</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("boys")}>Shop Now</button></div></div>
          <div style={collectionCardStyle}><img src="/assets/images/d2.png" alt="Babies" style={collectionImageStyle} onError={(e) => { e.target.src = PLACEHOLDER; }} /><div style={collectionOverlayStyle}><h3>Baby Collection</h3><button style={collectionButtonStyle} onClick={() => handleCollectionClick("babies")}>Shop Now</button></div></div>
        </div>
      </div>

      <div style={newsletterStyle}>
        <h2 style={newsletterTitleStyle}>Join Our Parent Club</h2>
        <p style={newsletterTextStyle}>Get 10% off your first purchase and exclusive access to new collections</p>
        <form onSubmit={handleNewsletterSubmit} style={newsletterInputStyle}>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={newsletterInputFieldStyle} />
          <button type="submit" style={newsletterButtonStyle}>Subscribe</button>
        </form>
        {newsletterMessage && <div style={{ ...newsletterMessageStyle, backgroundColor: messageType === "success" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)", color: "#FFFFFF", border: messageType === "success" ? "1px solid #28a745" : "1px solid #dc3545" }}>{newsletterMessage}</div>}
      </div>
      <div style={footerStyle}><p>© 2026 Kids' Designer Wear. All Rights Reserved.</p></div>
    </div>
  );
}

const ageGroupStyle = { fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "500" };
const ageGroupLabelStyle = { color: "#333", fontWeight: "600" };
const sizeInfoStyle = { fontSize: "13px", color: "#666", marginBottom: "15px" };
const sizeLabelStyle = { color: "#333", fontWeight: "600" };
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
const sizeGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" };
const sizeButtonStyle = { padding: "8px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "white", cursor: "pointer", transition: "all 0.3s ease" };
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

export default Kids;
