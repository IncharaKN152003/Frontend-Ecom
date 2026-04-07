import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaShoppingCart, 
  FaSearch,
  FaHeart,
  FaChevronDown,
  FaGem,
  FaUser,
  FaBox,
  FaHeart as FaHeartSolid,
  FaSignOutAlt,
  FaCog,
  FaFileAlt,
  FaTimes
} from "react-icons/fa";

function Header() {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ NEW
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const searchInputRef = useRef(null);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (error) { console.error("Error updating cart count:", error); }
  };

  const updateWishlistCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(wishlist.length);
    } catch (error) { console.error("Error updating wishlist count:", error); }
  };

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);

    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') updateCartCount();
      if (e.key === 'wishlist') updateWishlistCount();
      if (e.key === 'loggedInUser') setLoggedInUser(JSON.parse(e.newValue));
    });
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ✅ Focus input when search bar opens
  useEffect(() => {
    if (showSearch) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [showSearch]);

  // ✅ Smart category navigation based on search keywords
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    setShowSearch(false);
    setSearchQuery("");

    // Women
    if (q.includes("women") || q.includes("dress") || q.includes("gown") || q.includes("ladies") || q.includes("saree") || q.includes("kurta") || q.includes("lehenga") || q.includes("skirt") || q.includes("blouse") || q.includes("top") || q.includes("girl")) {
      // Women accessories
      if (q.includes("accessor") || q.includes("bag") || q.includes("belt") || q.includes("scarf") || q.includes("jewel") || q.includes("sunglass") || q.includes("handbag") || q.includes("purse")) {
        return navigate("/women/accessories");
      }
      return navigate("/women");
    }

    // Men
    if (q.includes("men") || q.includes("suit") || q.includes("blazer") || q.includes("shirt") || q.includes("trouser") || q.includes("jean") || q.includes("tuxedo") || q.includes("formal") || q.includes("chino") || q.includes("polo")) {
      // Watches
      if (q.includes("watch") || q.includes("rolex") || q.includes("omega") || q.includes("hublot") || q.includes("tag") || q.includes("breitling") || q.includes("iwc") || q.includes("panerai") || q.includes("audemars")) {
        return navigate("/men/watches");
      }
      return navigate("/men");
    }

    // Watches (standalone)
    if (q.includes("watch") || q.includes("rolex") || q.includes("omega") || q.includes("hublot") || q.includes("tag heuer") || q.includes("breitling") || q.includes("iwc") || q.includes("panerai") || q.includes("audemars") || q.includes("timepiece") || q.includes("luxury watch")) {
      return navigate("/men/watches");
    }

    // Kids
    if (q.includes("kids") || q.includes("kid") || q.includes("children") || q.includes("child") || q.includes("baby") || q.includes("toddler") || q.includes("boy") || q.includes("girl")) {
      if (q.includes("accessor") || q.includes("bag") || q.includes("bow") || q.includes("hat") || q.includes("cap")) {
        return navigate("/kids/accessories");
      }
      return navigate("/kids");
    }

    // Accessories (standalone)
    if (q.includes("accessor") || q.includes("bag") || q.includes("handbag") || q.includes("purse") || q.includes("belt") || q.includes("sunglass") || q.includes("scarf") || q.includes("jewel") || q.includes("necklace") || q.includes("bracelet") || q.includes("earring")) {
      return navigate("/women/accessories");
    }

    // Fallback → search results page
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // ✅ Handle Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
    if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setShowProfileDropdown(false);
    navigate("/register", { state: { message: "User has logged out successfully" } });
  };

  const handleProfileClick = () => {
    if (loggedInUser) setShowProfileDropdown(!showProfileDropdown);
    else navigate("/login");
  };

  return (
    <div style={{...headerStyle, ...(scrolled && headerScrolledStyle)}}>
      
      {/* Logo */}
      <div style={logoContainerStyle}>
        <FaGem style={gemIconStyle} />
        <h2 style={logoStyle} onClick={() => navigate("/")}>
          INCHU<span style={logoLightStyle}>CART</span>
        </h2>
      </div>

      {/* Navigation */}
      <div style={navStyle}>
        <span style={linkStyle} onClick={() => navigate("/")}>Home</span>

        {/* Collections Dropdown */}
        <div style={dropdownContainerStyle}>
          <span style={navLinkStyle} onClick={() => setShowDropdown(!showDropdown)}>
            Collections <FaChevronDown style={chevronStyle} />
          </span>
          {showDropdown && (
            <div style={luxuryDropdownStyle}>
              <div style={dropdownGridStyle}>
                <div style={dropdownColumnStyle}>
                  <h4 style={dropdownHeaderStyle}>Women</h4>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/women"); setShowDropdown(false); }}>Dresses</button>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/women/accessories"); setShowDropdown(false); }}>Accessories</button>
                </div>
                <div style={dropdownColumnStyle}>
                  <h4 style={dropdownHeaderStyle}>Men</h4>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/men"); setShowDropdown(false); }}>Suits</button>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/men/watches"); setShowDropdown(false); }}>Watches</button>
                </div>
                <div style={dropdownColumnStyle}>
                  <h4 style={dropdownHeaderStyle}>Kids</h4>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/kids"); setShowDropdown(false); }}>Designer Wear</button>
                  <button style={dropdownItemStyle} onClick={() => { navigate("/kids/accessories"); setShowDropdown(false); }}>Accessories</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <span style={linkStyle} onClick={() => navigate("/blog")}>Journal</span>
        <span style={linkStyle} onClick={() => navigate("/contact")}>Concierge</span>
        <span style={linkStyle} onClick={() => navigate("/myproduct")}>My Product</span>
        <span style={linkStyle} onClick={() => navigate("/invoice")}>Invoice</span>
      </div>

      {/* Right Side Icons */}
      <div style={rightStyle}>

        {/* ✅ SEARCH - expanded input or icon */}
        {showSearch ? (
          <form onSubmit={handleSearch} style={searchContainerStyle}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search watches, dresses, bags..."
              style={searchInputStyle}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button type="submit" style={searchSubmitBtnStyle}>
              <FaSearch size={13} />
            </button>
            <button type="button" style={searchCloseBtnStyle} onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
              <FaTimes size={13} />
            </button>
          </form>
        ) : (
          <FaSearch size={18} style={iconStyle} onClick={() => setShowSearch(true)} />
        )}

        {/* Wishlist */}
        <div style={wishlistIconContainerStyle} onClick={() => navigate("/wishlist")}>
          <FaHeart size={18} style={iconStyle} />
          {wishlistCount > 0 && <span style={wishlistCountStyle}>{wishlistCount}</span>}
        </div>

        {/* Cart */}
        <div style={cartIconContainerStyle} onClick={() => navigate("/cart")}>
          <FaShoppingCart size={18} style={iconStyle} />
          {cartCount > 0 && <span style={cartCountStyle}>{cartCount}</span>}
        </div>

        {/* Profile */}
        <div style={profileContainerStyle}>
          <div style={profileIconWrapperStyle} onClick={handleProfileClick}>
            <FaUserCircle size={22} style={iconStyle} />
            {loggedInUser && <div style={userBadgeStyle}></div>}
          </div>
          {showProfileDropdown && loggedInUser && (
            <div style={profileDropdownStyle}>
              <div style={profileHeaderStyle}>
                <FaUserCircle size={40} style={profileAvatarStyle} />
                <div style={profileInfoStyle}>
                  <div style={profileNameStyle}>{loggedInUser.fullName || loggedInUser.name || "User"}</div>
                  <div style={profileEmailStyle}>{loggedInUser.email || "user@example.com"}</div>
                </div>
              </div>
              <div style={profileMenuStyle}>
                <button style={profileMenuItemStyle} onClick={() => { navigate("/profile"); setShowProfileDropdown(false); }}>
                  <FaUser style={profileMenuIconStyle} /><span>My Profile</span>
                </button>
                <button style={profileMenuItemStyle} onClick={() => { navigate("/orders"); setShowProfileDropdown(false); }}>
                  <FaBox style={profileMenuIconStyle} /><span>My Orders</span>
                </button>
                <button style={profileMenuItemStyle} onClick={() => { navigate("/wishlist"); setShowProfileDropdown(false); }}>
                  <FaHeartSolid style={profileMenuIconStyle} /><span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                </button>
                <button style={profileMenuItemStyle} onClick={() => { navigate("/invoice"); setShowProfileDropdown(false); }}>
                  <FaFileAlt style={profileMenuIconStyle} /><span>Invoice</span>
                </button>
                <button style={profileMenuItemStyle} onClick={() => { navigate("/settings"); setShowProfileDropdown(false); }}>
                  <FaCog style={profileMenuIconStyle} /><span>Settings</span>
                </button>
                <div style={profileDividerStyle}></div>
                <button style={{...profileMenuItemStyle, color: "#dc3545"}} onClick={handleLogout}>
                  <FaSignOutAlt style={profileMenuIconStyle} /><span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {!loggedInUser && (
          <button style={loginStyle} onClick={() => navigate("/login")}>Sign In</button>
        )}
      </div>
    </div>
  );
}

/* ── STYLES ── */
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 80px", backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", boxShadow: "0 2px 20px rgba(0,0,0,0.05)", position: "sticky", top: "0", zIndex: "1000", transition: "all 0.3s ease", fontFamily: "'Playfair Display','Inter',sans-serif" };
const headerScrolledStyle = { padding: "12px 80px", backgroundColor: "rgba(255,255,255,0.98)", boxShadow: "0 4px 30px rgba(0,0,0,0.1)" };
const logoContainerStyle = { display: "flex", alignItems: "center", gap: "8px" };
const gemIconStyle = { color: "#C4A962", fontSize: "24px" };
const logoStyle = { margin: 0, color: "#1a1a1a", fontWeight: "600", cursor: "pointer", fontSize: "28px", letterSpacing: "2px" };
const logoLightStyle = { color: "#C4A962", fontWeight: "300", marginLeft: "2px" };
const navStyle = { display: "flex", gap: "50px", alignItems: "center" };
const linkStyle = { color: "#333", fontWeight: "400", cursor: "pointer", fontSize: "15px", letterSpacing: "0.5px", position: "relative", padding: "5px 0", transition: "color 0.3s ease" };
const navLinkStyle = { ...linkStyle, display: "flex", alignItems: "center", gap: "5px" };
const chevronStyle = { fontSize: "12px", color: "#C4A962" };
const dropdownContainerStyle = { position: "relative" };
const luxuryDropdownStyle = { position: "absolute", top: "35px", left: "-100px", backgroundColor: "white", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", borderRadius: "12px", padding: "25px", minWidth: "450px", border: "1px solid rgba(196,169,98,0.2)", zIndex: 100 };
const dropdownGridStyle = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "25px" };
const dropdownColumnStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const dropdownHeaderStyle = { margin: "0 0 10px 0", color: "#C4A962", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" };
const dropdownItemStyle = { padding: "8px 0", border: "none", backgroundColor: "transparent", cursor: "pointer", fontWeight: "400", fontSize: "14px", color: "#666", textAlign: "left", transition: "color 0.3s ease" };
const rightStyle = { display: "flex", gap: "25px", alignItems: "center" };
const iconStyle = { cursor: "pointer", color: "#333", transition: "color 0.3s ease" };
const userBadgeStyle = { position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", backgroundColor: "#C4A962", borderRadius: "50%" };

// ✅ Search styles
const searchContainerStyle = { display: "flex", alignItems: "center", gap: "4px", animation: "slideIn 0.2s ease" };
const searchInputStyle = { padding: "8px 15px", border: "2px solid #C4A962", borderRadius: "30px 0 0 30px", fontSize: "14px", width: "220px", outline: "none", fontFamily: "'Inter',sans-serif" };
const searchSubmitBtnStyle = { padding: "8px 12px", background: "#C4A962", border: "none", color: "white", cursor: "pointer", borderRadius: "0", display: "flex", alignItems: "center" };
const searchCloseBtnStyle = { padding: "8px 12px", background: "#f0f0f0", border: "none", color: "#666", cursor: "pointer", borderRadius: "0 30px 30px 0", display: "flex", alignItems: "center" };

const wishlistIconContainerStyle = { position: "relative", cursor: "pointer", display: "flex", alignItems: "center" };
const wishlistCountStyle = { position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#dc3545", color: "white", fontSize: "10px", fontWeight: "600", minWidth: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" };
const cartIconContainerStyle = { position: "relative", cursor: "pointer", display: "flex", alignItems: "center" };
const cartCountStyle = { position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#C4A962", color: "white", fontSize: "10px", fontWeight: "600", minWidth: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" };
const profileContainerStyle = { position: "relative" };
const profileIconWrapperStyle = { cursor: "pointer", position: "relative", display: "flex", alignItems: "center" };
const profileDropdownStyle = { position: "absolute", top: "35px", right: "0", backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", borderRadius: "12px", padding: "15px", minWidth: "250px", border: "1px solid rgba(196,169,98,0.2)", zIndex: 1000 };
const profileHeaderStyle = { display: "flex", alignItems: "center", gap: "15px", padding: "10px 0", borderBottom: "1px solid #f0f0f0", marginBottom: "10px" };
const profileAvatarStyle = { color: "#C4A962", fontSize: "40px" };
const profileInfoStyle = { flex: 1 };
const profileNameStyle = { fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "3px" };
const profileEmailStyle = { fontSize: "12px", color: "#666" };
const profileMenuStyle = { display: "flex", flexDirection: "column", gap: "5px" };
const profileMenuItemStyle = { padding: "10px 15px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "14px", color: "#333", textAlign: "left", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.3s ease", width: "100%" };
const profileMenuIconStyle = { fontSize: "16px", color: "#C4A962" };
const profileDividerStyle = { height: "1px", backgroundColor: "#f0f0f0", margin: "8px 0" };
const loginStyle = { padding: "10px 25px", borderRadius: "30px", border: "none", backgroundColor: "#C4A962", color: "white", fontWeight: "500", cursor: "pointer", fontSize: "13px", letterSpacing: "1px", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(196,169,98,0.3)" };

export default Header;
