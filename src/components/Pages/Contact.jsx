import React, { useState, useEffect } from "react";
import "./contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
    appointmentDate: ""
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ""
  });

  const [activeTab, setActiveTab] = useState("message");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Please fill in all required fields."
      });
      
      setTimeout(() => {
        setFormStatus({ ...formStatus, submitted: false });
      }, 3000);
      
      return;
    }

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for reaching out. Our concierge team will respond within 24 hours."
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "email",
      appointmentDate: ""
    });

    setTimeout(() => {
      setFormStatus({ ...formStatus, submitted: false });
    }, 5000);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "PRIVATE APPOINTMENTS",
      details: ["787 Fifth Avenue", "New York, NY 10022", "United States"],
      link: "https://maps.google.com"
    },
    {
      icon: "📞",
      title: "CONCIERGE LINE",
      details: ["+1 (212) 555-7890", "+1 (888) 555-1234", "24/7 Personal Assistance"],
      link: "tel:+12125557890"
    },
    {
      icon: "✉️",
      title: "EMAIL INQUIRIES",
      details: ["concierge@inchucart.com", "privateclient@inchucart.com", "press@inchucart.com"],
      link: "mailto:concierge@inchucart.com"
    },
    {
      icon: "⏰",
      title: "ATELIER HOURS",
      details: ["Monday - Friday: 10am - 7pm", "Saturday: By Appointment", "Sunday: Closed"],
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "How do I schedule a private appointment?",
      answer: "Our concierge team is available to arrange personalized appointments at our atelier. Please select 'Private Appointment' in the subject line, and we will contact you within 24 hours."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we provide worldwide shipping with insured delivery. Shipping costs and delivery times vary by location. Our team will provide detailed information upon request."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days of delivery for unworn items in original condition. Custom and personalized pieces are final sale. Please contact our concierge team for assistance."
    },
    {
      question: "How can I become a private client?",
      answer: "Private client status is extended to our most valued customers. Please inquire through our concierge service for more information about exclusive benefits and invitations."
    }
  ];

  if (isLoading) {
    return (
      <div className="contact-preloader">
        <div className="preloader-logo">INCHUCART</div>
        <div className="preloader-line"></div>
      </div>
    );
  }

  return (
    <div className="luxury-contact">
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content-contact">
          <span className="hero-eyebrow">CONCIERGE SERVICES</span>
          <h1 className="hero-title-contact">
            LET US <span className="gold-text">ASSIST YOU</span>
          </h1>
          <p className="hero-description-contact">
            Experience unparalleled personal service. Our dedicated concierge team 
            is available to address your inquiries, schedule private appointments, 
            and provide personalized assistance.
          </p>
          <div className="hero-badges">
            <span className="hero-badge">PRIVATE CLIENT ACCESS</span>
            <span className="hero-badge">24/7 CONCIERGE</span>
            <span className="hero-badge">BY APPOINTMENT ONLY</span>
          </div>
        </div>
        <div className="hero-scroll">
          <span>DISCOVER</span>
          <div className="scroll-line-gold"></div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="info-grid-section">
        <div className="info-grid-container">
          {contactInfo.map((info, index) => (
            <a 
              key={index} 
              href={info.link} 
              className="info-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <span className="info-icon">{info.icon}</span>
              <h3 className="info-title">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="info-detail">{detail}</p>
              ))}
              <span className="info-link">CONNECT →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="main-contact-section">
        <div className="contact-container">
          
          {/* Form and Tabs */}
          <div className="contact-form-wrapper" data-aos="fade-right">
            <div className="form-header">
              <h2 className="form-title">SEND AN INQUIRY</h2>
              <div className="form-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
                  onClick={() => setActiveTab('message')}
                >
                  GENERAL INQUIRY
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointment')}
                >
                  PRIVATE APPOINTMENT
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="luxury-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Private Appointment</option>
                    <option value="order">Order Assistance</option>
                    <option value="press">Press Inquiry</option>
                    <option value="private">Private Client Services</option>
                  </select>
                </div>
              </div>

              {activeTab === 'appointment' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Contact Method</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleChange}
                        />
                        <span>Email</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleChange}
                        />
                        <span>Phone</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="form-group full-width">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                  rows="5"
                  className="form-textarea"
                />
              </div>

              {formStatus.submitted && (
                <div className={`form-message ${formStatus.success ? 'success' : 'error'}`}>
                  {formStatus.message}
                </div>
              )}

              <button type="submit" className="form-submit-btn">
                <span>SEND INQUIRY</span>
                <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>

              <p className="form-note">
                By submitting this form, you agree to our Privacy Policy and consent to being contacted by our concierge team.
              </p>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="faq-wrapper" data-aos="fade-left">
            <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
            
            <div className="faq-container">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-number">0{index + 1}</span>
                    <h3>{faq.question}</h3>
                  </div>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="concierge-note">
              <span className="note-icon">👑</span>
              <p>
                For immediate assistance, our private client line is available 24/7.
                <br />
                <strong>+1 (212) 555-7890</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215617194169!2d-73.973844923564!3d40.7588967713865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f9b2f3f2c3%3A0x7b3b4e3a4c3b4f3!2s787%20Fifth%20Ave%2C%20New%20York%2C%20NY%2010022!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="map-iframe"
          ></iframe>
          <div className="map-overlay">
            <span className="map-marker">📍</span>
            <h3>VISIT OUR ATELIER</h3>
            <p>787 Fifth Avenue, New York, NY 10022</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
              GET DIRECTIONS
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h3 className="footer-logo">INCHUCART</h3>
            <p className="footer-tagline">Maison de Couture</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>EXPLORE</h4>
              <ul>
                <li><a href="#">Collections</a></li>
                <li><a href="#">Atelier</a></li>
                <li><a href="#">Journal</a></li>
                <li><a href="#">Private Client</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>SUPPORT</h4>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Size Guide</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>LEGAL</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 INCHUCART. All rights reserved. Crafted with excellence in New York.</p>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        className="contact-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}

export default Contact;