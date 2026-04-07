import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [activeCollection, setActiveCollection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    // Ultra-luxury AOS configuration
    AOS.init({
      duration: 1500,
      once: false,
      mirror: true,
      offset: 100,
      easing: 'cubic-bezier(0.86, 0, 0.07, 1)'
    });

    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Auto-rotate collections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCollection((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Welcome to the Inner Circle. You will receive exclusive access shortly.`);
      setEmail("");
    }
  };

  const masterpieces = [
    {
      id: 1,
      name: "THE SOVEREIGN GOWN",
      price: "$12,900",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format",
      category: "Haute Couture",
      description: "Hand-embroidered with 5,000 Swarovski crystals on duchesse satin",
      exclusivity: "Limited to 10 pieces worldwide"
    },
    {
      id: 2,
      name: "THE IMPERIAL BLOUSE",
      price: "$4,900",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format",
      category: "Ready-to-Wear",
      description: "24-karat gold thread embroidery on pure Italian silk",
      exclusivity: "Bespoke service available"
    },
    {
      id: 3,
      name: "THE REGAL JACKET",
      price: "$8,900",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format",
      category: "Limited Edition",
      description: "Hand-tailored vicuña wool with mink collar",
      exclusivity: "Made-to-measure only"
    },
    {
      id: 4,
      name: "THE CROWN JEWEL CLUTCH",
      price: "$15,900",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format",
      category: "Accessories",
      description: "18K gold-plated hardware with genuine python skin",
      exclusivity: "Numbered edition"
    }
  ];

  const collections = [
    {
      season: "AUTUMN/WINTER 2026",
      title: "Midnight Opulence",
      description: "Inspired by the gilded age of Hollywood glamour",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format",
      color: "#D4AF37"
    },
    {
      season: "SPRING/SUMMER 2026",
      title: "Golden Horizon",
      description: "Where the sun meets the sea in a dance of light",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format",
      color: "#F0E68C"
    },
    {
      season: "RESORT 2026",
      title: "White Gold Paradise",
      description: "The epitome of coastal luxury redefined",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1600&auto=format",
      color: "#E5E4E2"
    },
    {
      season: "THE ICONS",
      title: "Eternal Elegance",
      description: "Timeless pieces that transcend seasons",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format",
      color: "#996515"
    }
  ];

  const testimonials = [
    {
      text: "The pinnacle of luxury fashion. Every piece is a masterpiece of craftsmanship and design.",
      author: "VICTORIA BECKHAM",
      publication: "VOGUE",
      rating: 5
    },
    {
      text: "Exceptional quality that rivals the great fashion houses of Milan and Paris.",
      author: "ANNA WINTOUR",
      publication: "THE NEW YORK TIMES",
      rating: 5
    },
    {
      text: "A new standard in luxury. The attention to detail is simply unparalleled.",
      author: "GIORGIO ARMANI",
      publication: "W MAGAZINE",
      rating: 5
    }
  ];

  if (isLoading) {
    return (
      <div className="royal-preloader">
        <div className="preloader-crown">👑</div>
        <div className="preloader-text-container">
          <span className="preloader-title">THE HOUSE OF LUXURY</span>
          <div className="preloader-progress">
            <div className="preloader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="royal-home">
      {/* Floating Gold Particles */}
      <div className="gold-particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`
            }}
          />
        ))}
      </div>

      {/* Royal Cursor - Removed due to error */}

      {/* HERO SECTION - Opulent Cinema */}
      <section ref={heroRef} className="royal-hero">
        <div className="hero-backdrop">
          <div className="backdrop-layer layer-1"></div>
          <div className="backdrop-layer layer-2"></div>
          <div className="backdrop-layer layer-3"></div>
        </div>
        
        <div className="hero-dimmed-light"></div>
        
        <div className="hero-content-royal">
          <div className="hero-badge" data-aos="fade-down">
            <span className="badge-line"></span>
            <span className="badge-text">EST. 2020</span>
            <span className="badge-line"></span>
          </div>
          
          <h1 className="hero-title-royal" data-aos="fade-up" data-aos-delay="200">
            <span className="title-line">THE ART OF</span>
            <span className="title-line gold">REFINED LUXURY</span>
          </h1>
          
          <p className="hero-description-royal" data-aos="fade-up" data-aos-delay="400">
            Where exceptional craftsmanship meets timeless elegance. 
            Each creation is a testament to the pursuit of perfection.
          </p>
          
          <div className="hero-actions" data-aos="fade-up" data-aos-delay="600">
            <button className="btn-royal-primary" onClick={() => navigate("/women")}>
              <span>ENTER THE ATELIER</span>
              <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
            <button className="btn-royal-secondary" onClick={() => navigate("/collections")}>
              <span>VIEW COLLECTIONS</span>
            </button>
          </div>
        </div>

        <div className="hero-indicator">
          <span className="indicator-text">SCROLL TO DISCOVER</span>
          <div className="indicator-line"></div>
        </div>

        <div className="hero-metadata">
          <div className="metadata-item">
            <span className="metadata-label">EXCLUSIVE</span>
            <span className="metadata-value">BY APPOINTMENT</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">CRAFTED IN</span>
            <span className="metadata-value">ITALY · FRANCE</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">PRIVATE CLIENTS</span>
            <span className="metadata-value">WORLDWIDE</span>
          </div>
        </div>
      </section>

      {/* THE HOUSE SECTION */}
      <section className="house-section">
        <div className="house-container">
          <div className="house-grid">
            <div className="house-content" data-aos="fade-right">
              <span className="section-supreme">THE HOUSE</span>
              <h2 className="section-heading-royal">
                A Legacy of<br />
                <span className="gold-underline">Excellence</span>
              </h2>
              <div className="house-text">
                <p className="house-paragraph">
                  For over two decades, we have dedicated ourselves to the pursuit of 
                  perfection. Our master artisans combine centuries-old techniques with 
                  contemporary vision to create pieces that transcend time.
                </p>
                <p className="house-paragraph">
                  Each garment undergoes 200 hours of meticulous hand-finishing, 
                  ensuring that every detail meets our exacting standards of excellence.
                </p>
              </div>
              <div className="house-signature">
                <div className="signature-line"></div>
                <div className="signature-content">
                  <span className="signature-name">JONATHAN REYNOLDS</span>
                  <span className="signature-title">FOUNDER & CREATIVE DIRECTOR</span>
                </div>
              </div>
            </div>
            
            <div className="house-visual" data-aos="fade-left">
              <div className="visual-frame frame-1">
                <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format" alt="Atelier" />
                <div className="frame-overlay"></div>
              </div>
              <div className="visual-frame frame-2">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format" alt="Craftsmanship" />
                <div className="frame-overlay"></div>
              </div>
              <div className="gold-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS SHOWCASE */}
      <section className="collections-royal">
        <div className="collections-header" data-aos="fade-up">
          <span className="section-supreme">CURATED COLLECTIONS</span>
          <h2 className="section-heading-royal">
            Masterful <span className="gold-gradient">Creations</span>
          </h2>
        </div>

        <div className="showcase-royal">
          <div className="showcase-navigation" data-aos="fade-right">
            {collections.map((collection, index) => (
              <button
                key={index}
                className={`nav-item-royal ${activeCollection === index ? 'active' : ''}`}
                onClick={() => setActiveCollection(index)}
                style={{ '--active-color': collection.color }}
              >
                <span className="nav-index">0{index + 1}</span>
                <span className="nav-season">{collection.season}</span>
                <span className="nav-title">{collection.title}</span>
              </button>
            ))}
          </div>

          <div className="showcase-visual-royal" data-aos="fade-left">
            <div className="showcase-stage">
              {collections.map((collection, index) => (
                <div
                  key={index}
                  className={`stage-card ${activeCollection === index ? 'active' : ''}`}
                  style={{
                    backgroundImage: `url(${collection.image})`,
                    Index: activeCollection === index ? 10 : 0
                  }}
                >
                  <div className="stage-overlay"></div>
                  <div className="stage-content">
                    <h3>{collection.title}</h3>
                    <p>{collection.description}</p>
                    <button className="btn-royal-outline" onClick={() => navigate("/collections")}>
                      EXPLORE COLLECTION
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MASTERPIECES GALLERY */}
      <section className="masterpieces-gallery">
        <div className="gallery-header" data-aos="fade-up">
          <span className="section-supreme">THE COLLECTION</span>
          <h2 className="section-heading-royal">
            Exceptional <span className="gold-gradient">Masterpieces</span>
          </h2>
        </div>

        <div className="gallery-grid">
          {masterpieces.map((piece, index) => (
            <div
              key={piece.id}
              className="gallery-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card-image">
                <img src={piece.image} alt={piece.name} />
                <div className="image-overlay-royal">
                  <div className="overlay-content">
                    <span className="exclusivity-badge">{piece.exclusivity}</span>
                    <button className="btn-quick-view-royal" onClick={() => navigate(`/product/${piece.id}`)}>
                      REQUEST DETAILS
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-info-royal">
                <span className="piece-category">{piece.category}</span>
                <h3 className="piece-name">{piece.name}</h3>
                <p className="piece-description">{piece.description}</p>
                <div className="piece-footer">
                  <span className="piece-price">{piece.price}</span>
                  <button className="btn-inquire" onClick={() => navigate("/private-sales")}>
                    PRIVATE INQUIRY
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-footer" data-aos="fade-up">
          <button className="btn-royal-primary" onClick={() => navigate("/women")}>
            <span>VIEW ENTIRE COLLECTION</span>
          </button>
        </div>
      </section>

      {/* OPULENT STATISTICS */}
      <section className="opulent-stats">
        <div className="stats-container">
          <div className="stat-block" data-aos="zoom-in" data-aos-delay="100">
            <span className="stat-icon">👑</span>
            <span className="stat-number-royal">25+</span>
            <span className="stat-label-royal">Years of Excellence</span>
          </div>
          <div className="stat-block" data-aos="zoom-in" data-aos-delay="200">
            <span className="stat-icon">✨</span>
            <span className="stat-number-royal">10,000+</span>
            <span className="stat-label-royal">Handcrafted Pieces</span>
          </div>
          <div className="stat-block" data-aos="zoom-in" data-aos-delay="300">
            <span className="stat-icon">🌍</span>
            <span className="stat-number-royal">47</span>
            <span className="stat-label-royal">Countries Served</span>
          </div>
          <div className="stat-block" data-aos="zoom-in" data-aos-delay="400">
            <span className="stat-icon">⭐</span>
            <span className="stat-number-royal">100+</span>
            <span className="stat-label-royal">Industry Awards</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - PRESS */}
      <section className="royal-testimonials">
        <div className="testimonials-header" data-aos="fade-up">
          <span className="section-supreme">ACCOLADES</span>
          <h2 className="section-heading-royal">
            Recognized by the <span className="gold-gradient">World's Best</span>
          </h2>
        </div>

        <div className="testimonials-grid-royal">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card-royal"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="rating-star">★</span>
                ))}
              </div>
              <p className="testimonial-quote">"{testimonial.text}"</p>
              <div className="testimonial-author-royal">
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <span>{testimonial.publication}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXCLUSIVE NEWSLETTER */}
      <section className="royal-newsletter">
        <div className="newsletter-canvas">
          <div className="canvas-pattern"></div>
          <div className="canvas-content" data-aos="zoom-in">
            <span className="section-supreme light">INNER CIRCLE</span>
            <h2 className="section-heading-royal light">
              Join the <span className="gold-gradient">Private Client</span> List
            </h2>
            <p className="newsletter-text">
              Receive exclusive access to new collections, private sales, 
              and VIP events. Limited memberships available.
            </p>
            <form className="newsletter-form-royal" onSubmit={handleSubscribe}>
              <div className="input-group-royal">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-royal-primary">
                  <span>SECURE ACCESS</span>
                </button>
              </div>
              <p className="form-disclaimer">
                By joining, you agree to receive exclusive communications and 
                agree to our privacy policy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ROYAL FOOTER */}
      <footer className="royal-footer">
        <div className="footer-upper">
          <div className="footer-brand-royal">
            <h2 className="footer-logo-royal">THE HOUSE OF LUXURY</h2>
            <p className="footer-tagline-royal">Where Excellence Meets Elegance</p>
            <div className="footer-social-royal">
              <a href="#" className="social-icon-royal">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M22 2L15 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M22 2L15 9" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(90 12 12)"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </a>
              <a href="#" className="social-icon-royal">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M23 3C22 4 21 5 20 5C21 6 22 8 22 11C22 17 17 22 11 22C8 22 5 21 3 20C2 19 1 18 1 17C5 18 9 17 11 15C8 14 5 12 4 9C5 10 7 11 8 11C6 9 5 6 6 3C9 6 13 8 17 8C17 7 17 5 18 4C19 3 21 2 23 3Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </a>
              <a href="#" className="social-icon-royal">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="6" r="1" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-links-royal">
            <div className="link-column">
              <h4>THE HOUSE</h4>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Craftsmanship</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>COLLECTIONS</h4>
              <ul>
                <li><a href="#">Haute Couture</a></li>
                <li><a href="#">Ready-to-Wear</a></li>
                <li><a href="#">Accessories</a></li>
                <li><a href="#">Limited Editions</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>CLIENT SERVICES</h4>
              <ul>
                <li><a href="#">Private Appointments</a></li>
                <li><a href="#">Bespoke Service</a></li>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>CONTACT</h4>
              <ul>
                <li><a href="tel:+12125551234">+1 (212) 555-1234</a></li>
                <li><a href="mailto:concierge@theluxuryhouse.com">concierge@theluxuryhouse.com</a></li>
                <li>787 Fifth Avenue<br />New York, NY 10022</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-lower">
          <div className="footer-copyright-royal">
            <span>© 2026 THE HOUSE OF LUXURY. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="footer-legal-royal">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">TERMS OF USE</a>
            <a href="#">ACCESSIBILITY</a>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        className="back-to-top-royal"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Return to top"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>
    </div>
  );
}

export default Home;