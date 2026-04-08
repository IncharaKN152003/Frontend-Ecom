import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen, FaArrowRight, FaTwitter, FaLinkedin, FaYoutube,
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock,
  FaHeadset, FaCheck
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", category: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "General Enquiry", "Course Support", "Payment & Billing",
    "Certificate Issue", "Technical Problem",
    "Partnership / Business", "Feedback", "Other",
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email address";
    if (!form.category) e.category = "Please select a category";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // ── Save query to localStorage so AdminDashboard picks it up in real-time ──
    const newQuery = {
      id:          Date.now(),
      user:        form.name.trim(),
      email:       form.email.trim(),
      subject:     form.subject.trim(),
      message:     form.message.trim(),
      category:    form.category,
      status:      "open",
      priority:    ["Payment & Billing","Technical Problem","Certificate Issue"].includes(form.category) ? "high" : "medium",
      date:        new Date().toISOString().slice(0, 10),
      submittedAt: new Date().toISOString(),
      reply:       "",
    };
    try {
      const existing = JSON.parse(localStorage.getItem("wisdomwave_queries") || "[]");
      const updated  = [newQuery, ...existing];
      localStorage.setItem("wisdomwave_queries", JSON.stringify(updated));
      // Notify AdminDashboard (same tab via custom event, cross-tab via StorageEvent)
      window.dispatchEvent(new StorageEvent("storage", { key: "wisdomwave_queries", newValue: JSON.stringify(updated) }));
    } catch {}
    setSubmitted(true);
  };
  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => ({ ...p, [f]: undefined })); };

  return (
    <div className="ct">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        :root{
          --white:#ffffff;--off:#fafaf8;--off2:#f4f3ef;--off3:#eeece7;
          --border:#e8e5de;--border2:#d4d0c8;
          --ink:#1a1814;--ink2:#4a4640;--ink3:#8c8880;
          --accent:#2563eb;--accent-dim:rgba(37,99,235,0.08);
          --green:#16a34a;--green-dim:rgba(22,163,74,0.1);--red:#dc2626;
        }
        .ct{font-family:'Outfit',sans-serif;background:var(--white);color:var(--ink);overflow-x:hidden;}

        /* NAV */
        .ct-nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:68px;background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
        .ct-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
        .ct-logo-mark{width:34px;height:34px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;color:white;}
        .ct-logo-text{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);letter-spacing:-0.3px;}
        .ct-logo-text em{color:var(--accent);font-style:normal;}
        .ct-nav-links{display:flex;gap:36px;}
        .ct-nav-links a{text-decoration:none;color:var(--ink2);font-size:14px;font-weight:500;transition:color 0.2s;}
        .ct-nav-links a:hover{color:var(--ink);}
        .ct-nav-links a.active{color:var(--ink);font-weight:600;}
        .ct-nav-actions{display:flex;gap:10px;align-items:center;}
        .ct-btn-ghost{padding:8px 20px;background:transparent;border:1px solid var(--border);border-radius:100px;color:var(--ink2);font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;font-family:'Outfit',sans-serif;}
        .ct-btn-ghost:hover{border-color:var(--border2);color:var(--ink);}
        .ct-btn-dark{padding:8px 20px;background:var(--ink);border:none;border-radius:100px;color:white;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:7px;font-family:'Outfit',sans-serif;}
        .ct-btn-dark:hover{background:#2d2a25;transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,24,20,0.2);}

        /* HERO */
        .ct-hero{padding:160px 60px 80px;background:linear-gradient(160deg,var(--white) 0%,#eef2ff 50%,#f0fdf4 100%);border-bottom:1px solid var(--border);text-align:center;position:relative;overflow:hidden;}
        .ct-hero::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%);pointer-events:none;}
        .ct-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:var(--off2);border:1px solid var(--border);border-radius:100px;font-size:12px;font-weight:600;color:var(--ink2);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:28px;position:relative;z-index:1;}
        .ct-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 2s ease infinite;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .ct-hero-title{font-family:'Fraunces',serif;font-size:68px;font-weight:300;line-height:1.0;color:var(--ink);letter-spacing:-2px;margin-bottom:20px;position:relative;z-index:1;}
        .ct-hero-title strong{font-weight:700;display:block;}
        .ct-hero-title em{font-style:italic;color:var(--accent);}
        .ct-hero-sub{font-size:17px;color:var(--ink2);line-height:1.75;max-width:520px;margin:0 auto;position:relative;z-index:1;}

        /* CARDS ROW */
        .ct-cards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .ct-card{background:var(--white);padding:40px 32px;text-align:center;transition:background 0.3s;}
        .ct-card:hover{background:var(--off);}
        .ct-card-icon{width:52px;height:52px;border-radius:14px;background:var(--accent-dim);border:1.5px solid rgba(37,99,235,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--accent);margin:0 auto 18px;transition:all 0.2s;}
        .ct-card:hover .ct-card-icon{background:var(--accent);color:white;border-color:var(--accent);}
        .ct-card-title{font-size:16px;font-weight:700;color:var(--ink);margin-bottom:8px;}
        .ct-card-desc{font-size:13px;color:var(--ink2);line-height:1.6;margin-bottom:12px;}
        .ct-card-value{font-size:14px;font-weight:600;color:var(--accent);}

        /* MAIN */
        .ct-main{padding:100px 60px;display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:start;}
        .ct-eyebrow-line{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:14px;}
        .ct-eyebrow-line::before{content:'';width:28px;height:1.5px;background:var(--ink3);}
        .ct-h2{font-family:'Fraunces',serif;font-size:46px;font-weight:300;color:var(--ink);line-height:1.08;letter-spacing:-1.5px;margin-bottom:16px;}
        .ct-h2 strong{font-weight:700;}
        .ct-h2 em{font-style:italic;color:var(--accent);}
        .ct-body{font-size:15px;color:var(--ink2);line-height:1.8;margin-bottom:32px;}
        .ct-info-list{display:flex;flex-direction:column;gap:14px;margin-bottom:40px;}
        .ct-info-item{display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:var(--off);border:1.5px solid var(--border);border-radius:14px;transition:all 0.2s;}
        .ct-info-item:hover{border-color:var(--accent);background:white;transform:translateX(4px);}
        .ct-info-icon{width:40px;height:40px;border-radius:10px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--accent);flex-shrink:0;}
        .ct-info-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink3);margin-bottom:4px;}
        .ct-info-value{font-size:15px;font-weight:600;color:var(--ink);}
        .ct-info-sub{font-size:12px;color:var(--ink3);margin-top:2px;}
        .ct-social-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);margin-bottom:12px;}
        .ct-social-row{display:flex;gap:10px;}
        .ct-soc{width:40px;height:40px;border:1.5px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink2);font-size:15px;text-decoration:none;transition:all 0.2s;}
        .ct-soc:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-dim);}

        /* FORM */
        .ct-form-wrap{background:var(--off);border:1.5px solid var(--border);border-radius:24px;padding:40px;}
        .ct-form-title{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:6px;}
        .ct-form-sub{font-size:14px;color:var(--ink2);margin-bottom:28px;}
        .ct-field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
        .ct-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
        .ct-label{font-size:13px;font-weight:600;color:var(--ink2);}
        .ct-input{padding:12px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink);outline:none;transition:all 0.2s;width:100%;}
        .ct-input::placeholder{color:var(--ink3);}
        .ct-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
        .ct-input-err{border-color:var(--red)!important;}
        .ct-err{font-size:12px;color:var(--red);font-weight:600;}
        .ct-select{padding:12px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink);outline:none;transition:all 0.2s;width:100%;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%238c8880' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
        .ct-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
        .ct-textarea{padding:12px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink);outline:none;transition:all 0.2s;width:100%;resize:vertical;min-height:130px;line-height:1.6;}
        .ct-textarea::placeholder{color:var(--ink3);}
        .ct-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
        .ct-submit-btn{width:100%;margin-top:24px;padding:14px;background:var(--accent);border:none;border-radius:12px;color:white;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 16px rgba(37,99,235,0.25);}
        .ct-submit-btn:hover{background:#1d4ed8;transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,99,235,0.35);}

        /* SUCCESS */
        .ct-success{text-align:center;padding:48px 24px;}
        .ct-success-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--green),#15803d);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 8px 28px rgba(22,163,74,0.3);animation:popIn .4s cubic-bezier(.175,.885,.32,1.275) both;}
        @keyframes popIn{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        .ct-success-icon{font-size:32px;color:white;}
        .ct-success-title{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--ink);margin-bottom:10px;}
        .ct-success-sub{font-size:15px;color:var(--ink2);line-height:1.7;max-width:320px;margin:0 auto 28px;}
        .ct-success-btn{padding:12px 28px;background:var(--accent);border:none;border-radius:100px;color:white;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .ct-success-btn:hover{background:#1d4ed8;transform:translateY(-1px);}

        /* MAP */
        .ct-map-strip{background:var(--off);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:72px 60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
        .ct-map-visual{background:var(--white);border:1.5px solid var(--border);border-radius:20px;height:280px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
        .ct-map-bg{position:absolute;inset:0;background:linear-gradient(135deg,#eef2ff,#f0fdf4);}
        .ct-map-pin{position:relative;z-index:1;text-align:center;}
        .ct-map-pin-icon{font-size:48px;margin-bottom:12px;}
        .ct-map-pin-label{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:4px;}
        .ct-map-pin-sub{font-size:13px;color:var(--ink3);}

        /* FOOTER */
        .ct-footer{background:var(--off);border-top:1px solid var(--border);padding:72px 60px 36px;}
        .ct-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:56px;margin-bottom:56px;}
        .ct-footer-brand p{font-size:14px;color:var(--ink2);line-height:1.75;margin:18px 0;max-width:280px;}
        .ct-footer-socials{display:flex;gap:8px;}
        .ct-footer-col h5{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink);margin-bottom:20px;}
        .ct-footer-col ul{list-style:none;}
        .ct-footer-col li{margin-bottom:12px;}
        .ct-footer-col a{text-decoration:none;font-size:14px;color:var(--ink2);transition:color 0.2s;}
        .ct-footer-col a:hover{color:var(--accent);}
        .ct-nl h5{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink);margin-bottom:8px;}
        .ct-nl p{font-size:13px;color:var(--ink2);margin-bottom:16px;}
        .ct-nl-form{display:flex;gap:8px;}
        .ct-nl-input{flex:1;padding:11px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink);outline:none;transition:all 0.2s;}
        .ct-nl-input::placeholder{color:var(--ink3);}
        .ct-nl-input:focus{border-color:var(--accent);}
        .ct-nl-btn{padding:11px 18px;background:var(--ink);border:none;border-radius:10px;color:white;cursor:pointer;font-size:14px;transition:all 0.2s;}
        .ct-nl-btn:hover{background:#2d2a25;}
        .ct-footer-base{display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid var(--border);font-size:13px;color:var(--ink3);}
        .ct-footer-base a{color:var(--ink3);text-decoration:none;transition:color 0.2s;}
        .ct-footer-base a:hover{color:var(--accent);}

        /* RESPONSIVE */
        @media(max-width:1100px){
          .ct-main{grid-template-columns:1fr;gap:48px;}
          .ct-cards-row{grid-template-columns:1fr 1fr;}
          .ct-map-strip{grid-template-columns:1fr;gap:32px;}
        }
        @media(max-width:900px){
          .ct-nav{padding:0 28px;}
          .ct-nav-links{display:none;}
          .ct-hero{padding:120px 28px 60px;}
          .ct-hero-title{font-size:44px;}
          .ct-main{padding:72px 28px;}
          .ct-map-strip{padding:56px 28px;}
          .ct-footer{padding:56px 28px 28px;}
          .ct-footer-grid{grid-template-columns:1fr 1fr;gap:32px;}
          .ct-field-row{grid-template-columns:1fr;}
        }
        @media(max-width:600px){
          .ct-hero-title{font-size:34px;}
          .ct-cards-row{grid-template-columns:1fr;}
          .ct-footer-grid{grid-template-columns:1fr;}
          .ct-h2{font-size:34px;}
        }
      `}</style>

      {/* NAV */}
      <nav className="ct-nav">
        <Link to="/" className="ct-logo">
          <div className="ct-logo-mark"><FaBookOpen /></div>
          <span className="ct-logo-text">Wisdom<em>Wave</em></span>
        </Link>
        <div className="ct-nav-links">
          <Link to="/about">About</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/tutors">Tutors</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/my-certificates">My Certificates</Link>
          <Link to="/contact" className="active">Contact</Link>
        </div>
        <div className="ct-nav-actions">
          <Link to="/login" className="ct-btn-ghost">Sign in</Link>
          <Link to="/register" className="ct-btn-dark">Get started <FaArrowRight /></Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-eyebrow"><span className="ct-eyebrow-dot" /> Get in touch</div>
        <h1 className="ct-hero-title">
          We'd love to
          <strong>hear from you.</strong>
          <em>We're here to help.</em>
        </h1>
        <p className="ct-hero-sub">
          Whether you have a question about a course, need help with a certificate,
          or just want to say hello — our team typically responds within 2 hours.
        </p>
      </section>

      {/* CONTACT CARDS */}
      <div className="ct-cards-row">
        {[
          { icon: <FaEnvelope />, title: "Email Us",      desc: "Send us a message anytime",         value: "support@wisdomwave.in" },
          { icon: <FaPhoneAlt />, title: "Call Us",       desc: "Mon–Sat, 9 AM – 7 PM IST",         value: "+91 80 4567 8900" },
          { icon: <FaHeadset />,  title: "Live Chat",     desc: "Available 24/7 for Plus members",   value: "Start a chat →" },
          { icon: <FaClock />,    title: "Response Time", desc: "We aim to reply within",            value: "< 2 hours" },
        ].map((c, i) => (
          <div key={i} className="ct-card">
            <div className="ct-card-icon">{c.icon}</div>
            <div className="ct-card-title">{c.title}</div>
            <div className="ct-card-desc">{c.desc}</div>
            <div className="ct-card-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <section className="ct-main">

        {/* LEFT */}
        <div>
          <div className="ct-eyebrow-line">Contact details</div>
          <h2 className="ct-h2">Let's start a<br /><strong>conversation.</strong></h2>
          <p className="ct-body">
            Our support team is made up of real people who care about your learning journey.
            Reach out for anything — we respond fast and genuinely try to help.
          </p>
          <div className="ct-info-list">
            {[
              { icon: <FaEnvelope />,     label: "Email",    value: "support@wisdomwave.in",      sub: "For course & account support" },
              { icon: <FaEnvelope />,     label: "Business", value: "partnerships@wisdomwave.in", sub: "For B2B & partnership enquiries" },
              { icon: <FaPhoneAlt />,     label: "Phone",    value: "+91 80 4567 8900",           sub: "Mon–Sat, 9 AM – 7 PM IST" },
              { icon: <FaMapMarkerAlt />, label: "Office",   value: "Bengaluru, Karnataka",       sub: "India — 560001" },
            ].map((info, i) => (
              <div key={i} className="ct-info-item">
                <div className="ct-info-icon">{info.icon}</div>
                <div>
                  <div className="ct-info-label">{info.label}</div>
                  <div className="ct-info-value">{info.value}</div>
                  <div className="ct-info-sub">{info.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="ct-social-label">Follow us</div>
          <div className="ct-social-row">
            <a href="#" className="ct-soc"><FaTwitter /></a>
            <a href="#" className="ct-soc"><FaLinkedin /></a>
            <a href="#" className="ct-soc"><FaYoutube /></a>
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="ct-form-wrap">
          {!submitted ? (
            <>
              <div className="ct-form-title">Send us a message</div>
              <div className="ct-form-sub">Fill in the form and we'll get back to you within 2 hours.</div>
              <div className="ct-field-row">
                <div className="ct-field">
                  <label className="ct-label">Full Name *</label>
                  <input className={`ct-input ${errors.name?"ct-input-err":""}`} placeholder="Your full name" value={form.name} onChange={e=>inp("name",e.target.value)} />
                  {errors.name && <span className="ct-err">{errors.name}</span>}
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email Address *</label>
                  <input className={`ct-input ${errors.email?"ct-input-err":""}`} placeholder="you@email.com" value={form.email} onChange={e=>inp("email",e.target.value)} />
                  {errors.email && <span className="ct-err">{errors.email}</span>}
                </div>
              </div>
              <div className="ct-field">
                <label className="ct-label">Category *</label>
                <select className={`ct-select ${errors.category?"ct-input-err":""}`} value={form.category} onChange={e=>inp("category",e.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map((c,i)=><option key={i} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="ct-err">{errors.category}</span>}
              </div>
              <div className="ct-field">
                <label className="ct-label">Subject *</label>
                <input className={`ct-input ${errors.subject?"ct-input-err":""}`} placeholder="What is this about?" value={form.subject} onChange={e=>inp("subject",e.target.value)} />
                {errors.subject && <span className="ct-err">{errors.subject}</span>}
              </div>
              <div className="ct-field">
                <label className="ct-label">Message *</label>
                <textarea className={`ct-textarea ${errors.message?"ct-input-err":""}`} placeholder="Tell us as much as you'd like..." value={form.message} onChange={e=>inp("message",e.target.value)} />
                {errors.message && <span className="ct-err">{errors.message}</span>}
              </div>
              <button className="ct-submit-btn" onClick={handleSubmit}>
                Send Message <FaArrowRight style={{fontSize:13}} />
              </button>
            </>
          ) : (
            <div className="ct-success">
              <div className="ct-success-circle">
                <FaCheck style={{fontSize:32,color:"white"}} />
              </div>
              <div className="ct-success-title">Message sent!</div>
              <div className="ct-success-sub">
                Thanks {form.name.split(" ")[0]}! We've received your message and will reply to <strong>{form.email}</strong> within 2 hours.
              </div>
              <button className="ct-success-btn" onClick={()=>{setSubmitted(false);setForm({name:"",email:"",subject:"",category:"",message:""});}}>
                Send another message
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MAP / OFFICE */}
      <section className="ct-map-strip">
        <div>
          <div className="ct-eyebrow-line">Our office</div>
          <h2 className="ct-h2" style={{fontSize:38}}>Based in<br /><strong>Bengaluru, India.</strong></h2>
          <p style={{fontSize:15,color:"var(--ink2)",lineHeight:1.75,marginBottom:24}}>
            We're a remote-first company headquartered in India's tech capital. Our team works
            across Bengaluru, Mumbai, and Chennai — always happy to meet in person.
          </p>
          {[
            { label:"Headquarters", value:"Koramangala, Bengaluru — 560034" },
            { label:"Working Hours", value:"Mon–Sat, 9:00 AM – 7:00 PM IST" },
            { label:"Support Hours", value:"24/7 for Plus & Business members" },
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:12,fontSize:14}}>
              <span style={{fontWeight:700,color:"var(--ink)",minWidth:130}}>{r.label}</span>
              <span style={{color:"var(--ink2)"}}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className="ct-map-visual">
          <div className="ct-map-bg" />
          <div className="ct-map-pin">
            <div className="ct-map-pin-icon">📍</div>
            <div className="ct-map-pin-label">WisdomWave HQ</div>
            <div className="ct-map-pin-sub">Koramangala, Bengaluru</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ct-footer">
        <div className="ct-footer-grid">
          <div className="ct-footer-brand">
            <Link to="/" className="ct-logo">
              <div className="ct-logo-mark"><FaBookOpen /></div>
              <span className="ct-logo-text">Wisdom<em>Wave</em></span>
            </Link>
            <p>The premium e-learning platform for professionals who want to stay ahead. Expert-led, certificate-backed, career-focused.</p>
            <div className="ct-footer-socials">
              <a href="#" className="ct-soc"><FaTwitter /></a>
              <a href="#" className="ct-soc"><FaLinkedin /></a>
              <a href="#" className="ct-soc"><FaYoutube /></a>
            </div>
          </div>
          <div className="ct-footer-col">
            <h5>Platform</h5>
            <ul>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/benefits">Benefits</Link></li>
              <li><Link to="/my-certificates">My Certificates</Link></li>
            </ul>
          </div>
          <div className="ct-footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="ct-nl">
            <h5>Stay in the loop</h5>
            <p>New courses and exclusive offers, delivered to you.</p>
            <div className="ct-nl-form">
              <input className="ct-nl-input" type="email" placeholder="Your email" />
              <button className="ct-nl-btn"><FaArrowRight /></button>
            </div>
          </div>
        </div>
        <div className="ct-footer-base">
          <span>© 2025 WisdomWave. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
