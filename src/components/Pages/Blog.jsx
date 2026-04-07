import React, { useState, useEffect } from "react";
import "./blog.css";

function Blog() {
  const [activeBlog, setActiveBlog] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      setIsSuccess(false);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setMessage("Thank you for subscribing. You will receive exclusive content shortly.");
    setIsSuccess(true);
    setEmail("");
    setTimeout(() => setMessage(""), 4000);
  };

  const blogPosts = [
    {
      id: 1,
      title: "THE FUTURE OF FASHION",
      subtitle: "2026 Trend Forecast",
      category: "trends",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format",
      author: "ISABELLA ROSSI",
      authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "MARCH 15, 2026",
      readTime: "8 MIN READ",
      excerpt: "Discover the avant-garde trends reshaping the fashion landscape this year.",
      content: "The fashion world is witnessing a renaissance of creativity. Designers are embracing sustainable luxury, with recycled materials meeting haute couture craftsmanship. Oversized silhouettes dominate runways, while metallic accents add futuristic touches. Pastel tones blend with bold neons, creating unexpected harmonies. The key takeaway? Fashion in 2026 is about fearless self-expression meets environmental consciousness.",
      featured: true
    },
    {
      id: 2,
      title: "THE ART OF STYLING",
      subtitle: "Mastering Everyday Elegance",
      category: "styling",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format",
      author: "ALEXANDRA CHEN",
      authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
      date: "MARCH 12, 2026",
      readTime: "6 MIN READ",
      excerpt: "Transform your wardrobe with expert styling techniques for any occasion.",
      content: "Elevate your daily style with these insider tips from top fashion editors. The power of layering cannot be overstated—mix textures like silk with cashmere for depth. Accessories should tell a story; invest in statement pieces that spark conversation. For office attire, try unexpected combinations like tailored blazers with sneakers. Evening events call for bold choices—think architectural silhouettes and dramatic jewelry."
    },
    {
      id: 3,
      title: "SUSTAINABLE LUXURY",
      subtitle: "The New Standard",
      category: "sustainability",
      image: "/assets/images/img17.jpg",
      author: "MARCUS WELLINGTON",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "MARCH 10, 2026",
      readTime: "10 MIN READ",
      excerpt: "How luxury fashion is embracing eco-consciousness without compromising elegance.",
      content: "Luxury and sustainability are no longer mutually exclusive. Leading fashion houses are pioneering innovative materials—from pineapple leather to recycled ocean plastics. The focus is on timeless pieces that transcend seasonal trends. Building a sustainable wardrobe means investing in quality over quantity, choosing pieces that will remain elegant for decades. We explore the brands leading this ethical revolution."
    },
    {
      id: 4,
      title: "COUTURE CRAFTSMANSHIP",
      subtitle: "Behind the Seams",
      category: "craftsmanship",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format",
      author: "VICTORIA HART",
      authorImage: "https://randomuser.me/api/portraits/women/90.jpg",
      date: "MARCH 8, 2026",
      readTime: "12 MIN READ",
      excerpt: "An exclusive look into the ateliers where fashion masterpieces are born.",
      content: "Step inside the world's most exclusive fashion ateliers, where garments require hundreds of hours of hand-finishing. From intricate embroidery to perfect draping, master artisans preserve techniques passed down through generations. We interview the craftspeople behind the scenes, revealing the dedication required to create true wearable art."
    },
    {
      id: 5,
      title: "ACCESSORY TRENDS",
      subtitle: "The Finishing Touch",
      category: "accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format",
      author: "SOPHIA GRANT",
      authorImage: "https://randomuser.me/api/portraits/women/42.jpg",
      date: "MARCH 5, 2026",
      readTime: "5 MIN READ",
      excerpt: "The accessories defining the season's most memorable looks.",
      content: "This season, accessories take center stage. Oversized gold jewelry makes a bold statement, while sculptural handbags become conversation pieces. Belts return as defining elements, cinching waists and adding structure. We curate the must-have pieces that will elevate any ensemble from simple to spectacular."
    }
  ];

  const categories = [
    { id: "all", label: "ALL ARTICLES", count: blogPosts.length },
    { id: "trends", label: "TRENDS", count: blogPosts.filter(p => p.category === "trends").length },
    { id: "styling", label: "STYLING", count: blogPosts.filter(p => p.category === "styling").length },
    { id: "sustainability", label: "SUSTAINABILITY", count: blogPosts.filter(p => p.category === "sustainability").length },
    { id: "craftsmanship", label: "CRAFTSMANSHIP", count: blogPosts.filter(p => p.category === "craftsmanship").length },
    { id: "accessories", label: "ACCESSORIES", count: blogPosts.filter(p => p.category === "accessories").length }
  ];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  if (isLoading) {
    return (
      <div className="blog-preloader">
        <div className="preloader-logo">INCHUCART</div>
        <div className="preloader-line"></div>
      </div>
    );
  }

  return (
    <div className="luxury-blog">
      
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content-blog">
          <span className="hero-eyebrow">THE JOURNAL</span>
          <h1 className="hero-title-blog">
            FASHION <span className="gold-text">INSIGHTS</span>
          </h1>
          <p className="hero-description-blog">
            Discover the intersection of luxury, style, and culture through 
            the lens of industry experts.
          </p>
          <div className="hero-metadata">
            <div className="metadata-item">
              <span className="metadata-label">CURATED BY</span>
              <span className="metadata-value">EDITORS AT INCHUCART</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">UPDATED</span>
              <span className="metadata-value">MARCH 2026</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>EXPLORE</span>
          <div className="scroll-line-gold"></div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="featured-article">
          <div className="featured-container">
            <div className="featured-content" data-aos="fade-right">
              <span className="featured-badge">FEATURED</span>
              <h2 className="featured-title">{featuredPost.title}</h2>
              <h3 className="featured-subtitle">{featuredPost.subtitle}</h3>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              <div className="featured-meta">
                <img src={featuredPost.authorImage} alt={featuredPost.author} className="meta-author-image" />
                <div className="meta-details">
                  <span className="meta-author">{featuredPost.author}</span>
                  <span className="meta-date">{featuredPost.date} · {featuredPost.readTime}</span>
                </div>
              </div>
              <button className="btn-featured" onClick={() => setActiveBlog(featuredPost.id)}>
                READ FEATURE
              </button>
            </div>
            <div className="featured-image" data-aos="fade-left">
              <img src={featuredPost.image} alt={featuredPost.title} />
              <div className="image-accent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation */}
      <section className="category-nav">
        <div className="category-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-label">{category.label}</span>
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section">
        <div className="blog-grid-container">
          {filteredPosts.map((post, index) => (
            <article 
              key={post.id} 
              className={`blog-card ${activeBlog === post.id ? 'expanded' : ''}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card-image-wrapper">
                <img src={post.image} alt={post.title} className="card-image" />
                <div className="card-category">{post.category}</div>
              </div>
              
              <div className="card-content-blog">
                <div className="card-meta">
                  <span className="card-date">{post.date}</span>
                  <span className="card-read-time">{post.readTime}</span>
                </div>
                
                <h3 className="card-title">{post.title}</h3>
                <h4 className="card-subtitle">{post.subtitle}</h4>
                <p className="card-excerpt">{post.excerpt}</p>
                
                {activeBlog === post.id && (
                  <div className="card-expanded-content">
                    <p className="full-content">{post.content}</p>
                    <div className="author-section">
                      <img src={post.authorImage} alt={post.author} className="expanded-author-image" />
                      <div className="author-details">
                        <span className="author-name">{post.author}</span>
                        <span className="author-title">FASHION EDITOR</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  className="card-read-more"
                  onClick={() => setActiveBlog(activeBlog === post.id ? null : post.id)}
                >
                  {activeBlog === post.id ? 'READ LESS' : 'READ MORE'}
                  <svg className="read-more-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter - Exclusive */}
      <section className="newsletter-luxury">
        <div className="newsletter-backdrop"></div>
        <div className="newsletter-content-luxury">
          <span className="newsletter-eyebrow">EXCLUSIVE ACCESS</span>
          <h2 className="newsletter-title">THE INNER CIRCLE</h2>
          <p className="newsletter-description">
            Join our private mailing list for curated fashion insights, 
            early access to collections, and invitation-only events.
          </p>
          
          <form className="newsletter-form-luxury" onSubmit={handleSubscribe}>
            <div className="form-group-luxury">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                SUBSCRIBE
              </button>
            </div>
            {message && (
              <p className={`form-message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
            <p className="privacy-note">
              By subscribing, you agree to our Privacy Policy and consent to receive exclusive updates.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="blog-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h3 className="footer-logo">INCHUCART</h3>
            <p className="footer-tagline">The Journal of Luxury Fashion</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>EXPLORE</h4>
              <ul>
                <li><a href="#">All Articles</a></li>
                <li><a href="#">Trends</a></li>
                <li><a href="#">Styling</a></li>
                <li><a href="#">Sustainability</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>INFORMATION</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>FOLLOW</h4>
              <div className="social-links-blog">
                <a href="#" className="social-link">IG</a>
                <a href="#" className="social-link">TW</a>
                <a href="#" className="social-link">FB</a>
                <a href="#" className="social-link">YT</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 INCHUCART. All rights reserved. Crafted with excellence.</p>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        className="blog-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}

export default Blog;