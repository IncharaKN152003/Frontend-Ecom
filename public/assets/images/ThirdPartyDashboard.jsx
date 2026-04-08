import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBookOpen, FaArrowRight, FaPlus, FaCheck, FaClock, FaBan,
  FaUsers, FaRupeeSign, FaChartLine, FaTrash, FaSignOutAlt,
  FaGraduationCap, FaClipboardList, FaCreditCard, FaShieldAlt,
  FaCheckCircle, FaEye, FaPlay, FaTrophy, FaTimes, FaRedo
} from "react-icons/fa";

/* ── constants ── */
const RAZORPAY_KEY   = "rzp_test_qUmhUFElBiSNIs";
const PLATFORM_CUT   = 0.30;

const TABS = [
  { id:"overview",  label:"Overview",         icon:<FaChartLine />     },
  { id:"proposals", label:"My Proposals",      icon:<FaClipboardList /> },
  { id:"students",  label:"Enrolled Students", icon:<FaUsers />         },
  { id:"revenue",   label:"Revenue",           icon:<FaRupeeSign />     },
];

const STATUS_STYLE = {
  pending:  { bg:"#fffbeb", color:"#92400e", border:"#fde68a", icon:<FaClock />,  label:"Pending Review" },
  approved: { bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0", icon:<FaCheck />,  label:"Approved"       },
  rejected: { bg:"#fef2f2", color:"#b91c1c", border:"#fecaca", icon:<FaBan />,    label:"Rejected"       },
};

const MOCK_STUDENTS = [
  { id:1, name:"Arjun Sharma",  email:"arjun@gmail.com",   enrolled:"2025-03-01", progress:80,  paid:true  },
  { id:2, name:"Priya Menon",   email:"priya@gmail.com",   enrolled:"2025-03-05", progress:45,  paid:true  },
  { id:3, name:"Rohan Verma",   email:"rohan@gmail.com",   enrolled:"2025-03-08", progress:100, paid:true  },
  { id:4, name:"Sneha Nair",    email:"sneha@gmail.com",   enrolled:"2025-03-10", progress:20,  paid:true  },
  { id:5, name:"Karthik Reddy", email:"karthik@gmail.com", enrolled:"2025-03-14", progress:60,  paid:true  },
  { id:6, name:"Divya Pillai",  email:"divya@gmail.com",   enrolled:"2025-03-18", progress:35,  paid:false },
  { id:7, name:"Amit Gupta",    email:"amit@gmail.com",    enrolled:"2025-03-20", progress:90,  paid:true  },
  { id:8, name:"Nisha Kumar",   email:"nisha@gmail.com",   enrolled:"2025-03-22", progress:10,  paid:true  },
];

/* ── blank module template ── */
const EMPTY_MODULE = (i) => ({
  id: i + 1,
  title: "",
  duration: "",
  ytId: "",
  about: "",
  task: "",
  quiz: Array.from({ length: 5 }, () => ({
    q: "", opts: ["", "", "", ""], ans: 0
  })),
});

/* ── appearance options (same as AdminDashboard) ── */
const COURSE_GRADIENTS = [
  ["#4f46e5","#7c3aed"], ["#059669","#0284c7"], ["#db2777","#9333ea"],
  ["#0f4c81","#1a7431"], ["#0f766e","#0369a1"], ["#7c3aed","#be185d"],
  ["#1d4ed8","#0891b2"], ["#c2410c","#b45309"],
];
const COURSE_EMOJIS = ["⚡","🧠","🎨","🚀","🖥️","⚙️","🐍","☕","🔬","🌐","📊","🎯"];

/* ── load Razorpay script ── */
function loadRazorpayScript() {
  return new Promise(resolve => {
    if (document.getElementById("rzp-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* ════════════════════════════════════════════
   COURSE VIEWER MODAL
   ════════════════════════════════════════════ */
function CourseViewer({ proposal, onClose }) {
  const storageKey = `ww_tp_view_${proposal.id}`;
  const modules    = proposal.modules || [];

  const [modIdx,   setModIdx]   = useState(0);
  const [phase,    setPhase]    = useState("video"); // video | quiz | result
  const [selected, setSelected] = useState({});
  const [score,    setScore]    = useState(null);
  const [showCert, setShowCert] = useState(false);

  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null") ||
      modules.map((_, i) => ({ unlocked: i === 0, completed: false, passed: false, score: null }));
    } catch { return modules.map((_, i) => ({ unlocked: i === 0, completed: false, passed: false, score: null })); }
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {}
  }, [progress]);

  const mod        = modules[modIdx];
  const done       = progress.filter(p => p.completed).length;
  const pct        = modules.length > 0 ? Math.round(done / modules.length * 100) : 0;
  const allDone    = done === modules.length && modules.length > 0;

  const goModule = (i) => {
    if (!progress[i]?.unlocked) return;
    setModIdx(i); setPhase("video");
    setSelected({}); setScore(null);
  };

  const submitQuiz = () => {
    const q = mod.quiz;
    let correct = 0;
    q.forEach((item, i) => { if (selected[i] === item.ans) correct++; });
    const sc = Math.round(correct / q.length * 100);
    setScore(sc);
    const passed = sc >= 60;
    const np = [...progress];
    np[modIdx] = { ...np[modIdx], completed: passed, passed, score: sc };
    if (passed && modIdx + 1 < modules.length)
      np[modIdx + 1] = { ...np[modIdx + 1], unlocked: true };
    setProgress(np);
    setPhase("result");
  };

  if (!mod) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", zIndex:3000, display:"flex", flexDirection:"column", fontFamily:"'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=Outfit:wght@400;500;600;700&display=swap');
        .vw-opt{padding:12px 16px;border-radius:10px;border:1.5px solid #e5e7eb;background:#f9fafb;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .18s;}
        .vw-opt:hover:not(.vw-disabled){border-color:#2563eb;background:#eff6ff;}
        .vw-opt.vw-sel{border-color:#2563eb;background:#eff6ff;}
        .vw-opt.vw-disabled{cursor:default;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes popIn{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
      `}</style>

      {/* Top bar */}
      <div style={{ height:56, background:"rgba(26,24,20,0.95)", borderBottom:"1px solid #333", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
            <FaTimes /> Close
          </button>
          <span style={{ color:"white", fontWeight:600, fontSize:14 }}>{proposal.course}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ color:"rgba(255,255,255,.6)", fontSize:12 }}>{done}/{modules.length} modules</div>
          <div style={{ width:120, height:5, background:"rgba(255,255,255,.2)", borderRadius:100, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#2563eb,#16a34a)", borderRadius:100, transition:"width .5s" }} />
          </div>
          <span style={{ color:"rgba(255,255,255,.8)", fontSize:12, fontWeight:600 }}>{pct}%</span>
          {allDone && (
            <button onClick={() => setShowCert(true)}
              style={{ padding:"6px 16px", background:"linear-gradient(135deg,#b45309,#d97706)", border:"none", borderRadius:100, color:"white", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
              <FaTrophy /> Get Certificate
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Sidebar */}
        <div style={{ width:260, background:"rgba(26,24,20,0.97)", borderRight:"1px solid #333", overflowY:"auto", flexShrink:0 }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid #333" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#9ca3af", marginBottom:10 }}>Course Content</div>
          </div>
          {modules.map((m, i) => {
            const p = progress[i];
            const isActive = i === modIdx;
            const locked   = !p?.unlocked;
            return (
              <div key={i} onClick={() => goModule(i)}
                style={{ padding:"12px 16px", borderBottom:"1px solid #222", cursor: locked ? "not-allowed" : "pointer", background: isActive ? "rgba(37,99,235,.15)" : "transparent", borderLeft: isActive ? "3px solid #2563eb" : "3px solid transparent", opacity: locked ? 0.4 : 1, display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, background: p?.completed ? "rgba(22,163,74,.2)" : isActive ? "rgba(37,99,235,.3)" : "rgba(255,255,255,.08)", color: p?.completed ? "#4ade80" : isActive ? "#93c5fd" : "#9ca3af" }}>
                  {p?.completed ? "✓" : locked ? "🔒" : i+1}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color: isActive ? "white" : "#d1d5db", lineHeight:1.4, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.title || `Module ${i+1}`}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>{m.duration || "—"} · 5 MCQs</div>
                  {p?.score !== null && p?.score !== undefined && (
                    <div style={{ fontSize:10, marginTop:3, color: p.passed ? "#4ade80" : "#f87171", fontWeight:600 }}>
                      {p.passed ? `✓ ${p.score}%` : `✗ ${p.score}% — retry`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex:1, overflowY:"auto", background:"#111" }}>

          {/* Toggle bar */}
          <div style={{ padding:"10px 20px", background:"rgba(0,0,0,.4)", borderBottom:"1px solid #333", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:13, color:"#9ca3af" }}>Module {modIdx+1} of {modules.length} · </span>
            <span style={{ fontSize:13, color:"white", fontWeight:600 }}>{mod.title || `Module ${modIdx+1}`}</span>
          </div>

          {/* ── VIDEO PHASE ── */}
          {phase === "video" && (
            <div style={{ padding:28 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#2563eb", marginBottom:8 }}>🎬 Module {modIdx+1} · {mod.duration}</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:"white", marginBottom:8 }}>{mod.title || `Module ${modIdx+1}`}</h2>
              {mod.about && <p style={{ fontSize:14, color:"#9ca3af", lineHeight:1.7, marginBottom:20 }}>{mod.about}</p>}

              {mod.ytId ? (
                <div style={{ width:"100%", aspectRatio:"16/9", borderRadius:14, overflow:"hidden", background:"#000", marginBottom:20, boxShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${mod.ytId}?rel=0&modestbranding=1&color=white`}
                    style={{ width:"100%", height:"100%", border:"none" }}
                    allowFullScreen title={mod.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div style={{ width:"100%", aspectRatio:"16/9", borderRadius:14, background:"#1f2937", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <div style={{ textAlign:"center", color:"#6b7280" }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>🎬</div>
                    <div style={{ fontSize:14 }}>No YouTube video linked for this module</div>
                  </div>
                </div>
              )}

              {mod.task && (
                <div style={{ background:"rgba(180,83,9,.1)", border:"1px solid rgba(180,83,9,.3)", borderRadius:12, padding:"14px 18px", marginBottom:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#fbbf24", marginBottom:6 }}>📝 Hands-on Task</div>
                  <p style={{ fontSize:13, color:"#fde68a", lineHeight:1.65, margin:0 }}>{mod.task}</p>
                </div>
              )}

              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <button onClick={() => { setPhase("quiz"); setSelected({}); setScore(null); }}
                  style={{ padding:"12px 28px", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", border:"none", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(37,99,235,.35)" }}>
                  ✅ Mark as Watched & Take Quiz
                </button>
                <div style={{ display:"flex", gap:10 }}>
                  <button disabled={modIdx === 0} onClick={() => goModule(modIdx - 1)}
                    style={{ padding:"10px 20px", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:100, color: modIdx === 0 ? "#4b5563" : "white", cursor: modIdx === 0 ? "not-allowed" : "pointer", fontSize:13 }}>
                    ← Prev
                  </button>
                  <button disabled={modIdx === modules.length - 1 || !progress[modIdx + 1]?.unlocked} onClick={() => goModule(modIdx + 1)}
                    style={{ padding:"10px 20px", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:100, color: (modIdx === modules.length - 1 || !progress[modIdx + 1]?.unlocked) ? "#4b5563" : "white", cursor: (modIdx === modules.length - 1 || !progress[modIdx + 1]?.unlocked) ? "not-allowed" : "pointer", fontSize:13 }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── QUIZ PHASE ── */}
          {phase === "quiz" && (
            <div style={{ padding:28, maxWidth:720 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#2563eb", marginBottom:8 }}>❓ Module {modIdx+1} Quiz</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:"white", marginBottom:6 }}>Test Your Knowledge</h2>
              <p style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>Answer all 5 questions. Score 60%+ to pass and unlock the next module.</p>

              {mod.quiz.map((q, qi) => (
                <div key={qi} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:20, marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#6b7280", marginBottom:6 }}>Question {qi+1} of 5</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"white", marginBottom:14, lineHeight:1.5 }}>{q.q || `Question ${qi+1}`}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {q.opts.map((opt, oi) => (
                      <div key={oi} className={`vw-opt ${selected[qi]===oi?"vw-sel":""}`} onClick={() => setSelected(p => ({...p,[qi]:oi}))}>
                        <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${selected[qi]===oi?"#2563eb":"#4b5563"}`, background: selected[qi]===oi?"#2563eb":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"white", fontSize:11 }}>
                          {selected[qi]===oi && "✓"}
                        </div>
                        <span style={{ fontSize:14, color: selected[qi]===oi?"#2563eb":"#d1d5db" }}>{opt || `Option ${oi+1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={submitQuiz} disabled={Object.keys(selected).length < mod.quiz.length}
                style={{ padding:"13px 36px", background: Object.keys(selected).length < mod.quiz.length ? "#374151" : "linear-gradient(135deg,#2563eb,#1d4ed8)", border:"none", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor: Object.keys(selected).length < mod.quiz.length ? "not-allowed" : "pointer", boxShadow: Object.keys(selected).length < mod.quiz.length ? "none" : "0 4px 14px rgba(37,99,235,.35)", display:"flex", alignItems:"center", gap:8 }}>
                🚀 Submit Quiz
                {Object.keys(selected).length < mod.quiz.length && (
                  <span style={{ fontSize:11, opacity:.7 }}>({Object.keys(selected).length}/5 answered)</span>
                )}
              </button>
            </div>
          )}

          {/* ── RESULT PHASE ── */}
          {phase === "result" && score !== null && (
            <div style={{ padding:28, maxWidth:600 }}>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:36, textAlign:"center" }}>
                <div style={{ fontSize:60, marginBottom:16 }}>{score===100?"🏆":score>=60?"🎉":"😔"}</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:64, fontWeight:700, lineHeight:1, marginBottom:8, color: score>=60?"#4ade80":"#f87171" }}>{score}%</div>
                <div style={{ fontSize:20, fontWeight:700, color:"white", marginBottom:8 }}>
                  {score>=60 ? "Module Passed!" : "Not Passed"}
                </div>
                <p style={{ fontSize:14, color:"#9ca3af", marginBottom:28, lineHeight:1.6 }}>
                  {score>=60
                    ? `Great work! Module ${modIdx+1} is complete.${modIdx+1 < modules.length ? " Next module unlocked!" : ""}`
                    : "You need 60% to pass. Review the video and try again."}
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
                  {[
                    { label:"Correct",    val: Math.round(mod.quiz.length * score / 100) },
                    { label:"Wrong",      val: mod.quiz.length - Math.round(mod.quiz.length * score / 100) },
                    { label:"Done",       val: `${done}/${modules.length}` },
                  ].map((s,i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,.06)", borderRadius:12, padding:14 }}>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:"white" }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:1, marginTop:4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  {score < 60 && (
                    <button onClick={() => { setPhase("quiz"); setSelected({}); setScore(null); }}
                      style={{ padding:"10px 22px", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
                      <FaRedo /> Retry Quiz
                    </button>
                  )}
                  <button onClick={() => setPhase("video")}
                    style={{ padding:"10px 22px", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    🎬 Rewatch Video
                  </button>
                  {score >= 60 && (
                    allDone
                      ? <button onClick={() => setShowCert(true)}
                          style={{ padding:"10px 22px", background:"linear-gradient(135deg,#b45309,#d97706)", border:"none", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
                          <FaTrophy /> Get Certificate
                        </button>
                      : modIdx+1 < modules.length
                        ? <button onClick={() => goModule(modIdx+1)}
                            style={{ padding:"10px 22px", background:"linear-gradient(135deg,#16a34a,#15803d)", border:"none", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                            Next Module →
                          </button>
                        : null
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CERTIFICATE MODAL ── */}
      {showCert && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", backdropFilter:"blur(8px)", zIndex:4000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={() => setShowCert(false)}>
          <div style={{ background:"white", borderRadius:20, overflow:"hidden", maxWidth:680, width:"100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ background:"linear-gradient(160deg,#fffbf0,#fff8e1,#fef3c7)", position:"relative", padding:"0 0 0 0" }}>
              <div style={{ height:8, background:"linear-gradient(90deg,#b45309,#d97706,#f59e0b,#d97706,#b45309)" }} />
              <div style={{ padding:"32px 48px 28px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#b45309", letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>📚 WisdomWave</div>
                <div style={{ fontSize:12, color:"#6b7280", letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Certificate of Completion</div>
                <div style={{ width:60, height:2, background:"linear-gradient(90deg,transparent,#d97706,transparent)", margin:"0 auto 16px" }} />
                <div style={{ fontSize:12, color:"#6b7280", marginBottom:10 }}>This certificate is proudly presented to</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:700, color:"#111827", marginBottom:10 }}>{proposal.company}</div>
                <div style={{ fontSize:12, color:"#6b7280", marginBottom:10 }}>for successfully completing the course</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:"#b45309", marginBottom:20, lineHeight:1.3 }}>{proposal.course}</div>
                <div style={{ fontSize:18, letterSpacing:4, marginBottom:16 }}>⭐⭐⭐⭐⭐</div>
                <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 24px" }}>
                  <div style={{ textAlign:"center", flex:1 }}>
                    <div style={{ width:"100%", maxWidth:120, height:1.5, background:"#d1d5db", margin:"0 auto 6px" }} />
                    <div style={{ fontSize:11, fontWeight:700, color:"#374151" }}>{proposal.company}</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>Course Partner</div>
                  </div>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#b45309,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(180,83,9,.35)", flexShrink:0 }}>
                    <div style={{ textAlign:"center", color:"white", fontSize:20, fontWeight:800, lineHeight:1.2 }}>✓<br/><span style={{ fontSize:8, letterSpacing:1 }}>VERIFIED</span></div>
                  </div>
                  <div style={{ textAlign:"center", flex:1 }}>
                    <div style={{ width:"100%", maxWidth:120, height:1.5, background:"#d1d5db", margin:"0 auto 6px" }} />
                    <div style={{ fontSize:11, fontWeight:700, color:"#374151" }}>WisdomWave</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>Learning Platform</div>
                  </div>
                </div>
              </div>
              <div style={{ height:6, background:"linear-gradient(90deg,#b45309,#d97706,#f59e0b,#d97706,#b45309)" }} />
            </div>
            <div style={{ padding:"16px 24px", borderTop:"1px solid #e5e7eb", display:"flex", justifyContent:"space-between", alignItems:"center", background:"white" }}>
              <button onClick={() => setShowCert(false)} style={{ padding:"9px 18px", background:"transparent", border:"1.5px solid #e5e7eb", borderRadius:100, color:"#6b7280", fontFamily:"'Outfit',sans-serif", fontSize:13, cursor:"pointer" }}>✕ Close</button>
              <button onClick={() => window.print()} style={{ padding:"10px 22px", background:"linear-gradient(135deg,#b45309,#d97706)", border:"none", borderRadius:100, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer" }}>⬇ Download Certificate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════ */
export default function ThirdPartyDashboard() {
  const navigate = useNavigate();
  const [tab,        setTab]        = useState("overview");
  const [session,    setSession]    = useState(null);
  const [proposals,  setProposals]  = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [toast,      setToast]      = useState(null);
  const [payingId,   setPayingId]   = useState(null);
  const [viewingProposal, setViewingProposal] = useState(null);

  /* proposal form state */
  const [courseForm, setCourseForm] = useState({
    title: "", category: "development", description: "",
    price: "", duration: "", level: "Beginner",
    gradIndex: 0, emoji: "⚡",
    modules: Array.from({ length: 5 }, (_, i) => EMPTY_MODULE(i)),
  });
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [formErrors,   setFormErrors]   = useState({});

  /* ── Load session ── */
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("ww_tp_session") || "null");
      if (!s) { navigate("/thirdparty/login"); return; }
      setSession(s);
      loadProposals(s.companyName);
    } catch { navigate("/thirdparty/login"); }
  }, []);

  /* ── Poll for admin status changes every 3s ── */
  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => loadProposals(session.companyName), 3000);
    const onStorage = e => { if (e.key === "wisdomwave_third_party") loadProposals(session.companyName); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(iv); window.removeEventListener("storage", onStorage); };
  }, [session]);

  const loadProposals = (company) => {
    try {
      const all = JSON.parse(localStorage.getItem("wisdomwave_third_party") || "[]");
      setProposals(all.filter(p => p.company === company));
    } catch { setProposals([]); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Form helpers ── */
  const updateModule = (mi, field, value) => {
    setCourseForm(prev => {
      const mods = [...prev.modules];
      mods[mi] = { ...mods[mi], [field]: value };
      return { ...prev, modules: mods };
    });
  };

  const updateQuiz = (mi, qi, field, value) => {
    setCourseForm(prev => {
      const mods = [...prev.modules];
      const quiz = [...mods[mi].quiz];
      quiz[qi] = { ...quiz[qi], [field]: value };
      mods[mi] = { ...mods[mi], quiz };
      return { ...prev, modules: mods };
    });
  };

  const updateOpt = (mi, qi, oi, value) => {
    setCourseForm(prev => {
      const mods = [...prev.modules];
      const quiz = [...mods[mi].quiz];
      const opts = [...quiz[qi].opts];
      opts[oi] = value;
      quiz[qi] = { ...quiz[qi], opts };
      mods[mi] = { ...mods[mi], quiz };
      return { ...prev, modules: mods };
    });
  };

  /* ── Validate + Submit proposal ── */
  const validateForm = () => {
    const e = {};
    if (!courseForm.title.trim())       e.title       = "Course title required";
    if (!courseForm.description.trim()) e.description = "Description required";
    if (!courseForm.price || isNaN(courseForm.price) || +courseForm.price <= 0) e.price = "Valid price required";
    if (!courseForm.duration.trim())    e.duration    = "Duration required";
    courseForm.modules.forEach((m, i) => {
      if (!m.title.trim())    e[`mod_${i}_title`]    = `Module ${i+1}: title required`;
      if (!m.ytId.trim())     e[`mod_${i}_ytId`]     = `Module ${i+1}: YouTube ID required`;
      if (!m.duration.trim()) e[`mod_${i}_duration`] = `Module ${i+1}: duration required`;
    });
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) { showToast("Please fill all required fields.", "error"); return; }

    const proposal = {
      id:            Date.now(),
      company:       session.companyName,
      logo:          session.logo,
      course:        courseForm.title.trim(),
      category:      courseForm.category,
      description:   courseForm.description.trim(),
      price:         +courseForm.price,
      duration:      courseForm.duration.trim(),
      level:         courseForm.level,
      grad:          COURSE_GRADIENTS[courseForm.gradIndex],
      emoji:         courseForm.emoji,
      modules:       courseForm.modules.map((m, i) => ({
        id:       i + 1,
        title:    m.title.trim(),
        duration: m.duration.trim(),
        ytId:     m.ytId.trim(),
        about:    m.about.trim(),
        task:     m.task.trim(),
        quiz:     m.quiz.map(q => ({
          q:    q.q.trim() || `Question for ${m.title}`,
          opts: q.opts.map(o => o.trim() || "Option"),
          ans:  q.ans,
        })),
      })),
      status:         "pending",
      payment_status: "unpaid",
      submitted:      new Date().toISOString().slice(0, 10),
      enrolledStudents: 0,
    };

    const all = JSON.parse(localStorage.getItem("wisdomwave_third_party") || "[]");
    const updated = [proposal, ...all];
    localStorage.setItem("wisdomwave_third_party", JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage", { key:"wisdomwave_third_party", newValue:JSON.stringify(updated) }));

    setProposals([proposal, ...proposals]);
    setCourseForm({ title:"", category:"development", description:"", price:"", duration:"", level:"Beginner", gradIndex:0, emoji:"⚡", modules: Array.from({ length:5 }, (_,i) => EMPTY_MODULE(i)) });
    setFormErrors({});
    setActiveModIdx(0);
    setShowForm(false);
    showToast("Course proposal submitted! Admin will review it shortly.");
  };

  const handleDelete = (id) => {
    const all = JSON.parse(localStorage.getItem("wisdomwave_third_party") || "[]");
    const updated = all.filter(p => p.id !== id);
    localStorage.setItem("wisdomwave_third_party", JSON.stringify(updated));
    setProposals(proposals.filter(p => p.id !== id));
    showToast("Proposal withdrawn.", "info");
  };

  /* ── Razorpay ── */
  const handlePayNow = async (proposal) => {
    setPayingId(proposal.id);
    const loaded = await loadRazorpayScript();
    if (!loaded) { showToast("Failed to load payment gateway.", "error"); setPayingId(null); return; }

    const options = {
      key:         RAZORPAY_KEY,
      amount:      proposal.price * 100,
      currency:    "INR",
      name:        "WisdomWave",
      description: `Course listing fee: ${proposal.course}`,
      prefill:     { name: session.companyName, email: session.email },
      notes:       { course_id: String(proposal.id), company: session.companyName },
      theme:       { color: "#2563eb" },
      handler: function(response) {
        const all = JSON.parse(localStorage.getItem("wisdomwave_third_party") || "[]");
        const updated = all.map(p =>
          p.id === proposal.id
            ? { ...p, payment_status:"paid", payment_id:response.razorpay_payment_id, paid_at:new Date().toISOString() }
            : p
        );
        localStorage.setItem("wisdomwave_third_party", JSON.stringify(updated));
        window.dispatchEvent(new StorageEvent("storage", { key:"wisdomwave_third_party", newValue:JSON.stringify(updated) }));

        // ── Record in wisdomwave_payments so Admin Payments tab shows it ──
        try {
          const existing = JSON.parse(localStorage.getItem("wisdomwave_payments") || "[]");
          const newPayment = {
            txnId:      response.razorpay_payment_id || `TP${Date.now()}`,
            type:       "partner_listing",
            courseName: proposal.course,
            company:    session.companyName,
            email:      session.email,
            amount:     +proposal.price,
            method:     "razorpay",
            paidAt:     new Date().toISOString(),
          };
          const updatedPay = [newPayment, ...existing];
          localStorage.setItem("wisdomwave_payments", JSON.stringify(updatedPay));
          window.dispatchEvent(new StorageEvent("storage", { key:"wisdomwave_payments", newValue:JSON.stringify(updatedPay) }));
        } catch {}

        loadProposals(session.companyName);
        setPayingId(null);
        showToast(`✅ Payment successful! ID: ${response.razorpay_payment_id}`);
      },
      modal: { ondismiss: () => { setPayingId(null); showToast("Payment cancelled.", "info"); } },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", r => { setPayingId(null); showToast(`Payment failed: ${r.error.description}`, "error"); });
      rzp.open();
    } catch { setPayingId(null); showToast("Could not open payment gateway.", "error"); }
  };

  const handleLogout = () => { localStorage.removeItem("ww_tp_session"); navigate("/thirdparty/login"); };

  /* ── Derived ── */
  const approvedCourses = proposals.filter(p => p.status === "approved");
  const pendingCourses  = proposals.filter(p => p.status === "pending");
  const rejectedCourses = proposals.filter(p => p.status === "rejected");
  const paidCourses     = approvedCourses.filter(p => p.payment_status === "paid");
  const unpaidCourses   = approvedCourses.filter(p => p.payment_status !== "paid");
  const totalStudents   = paidCourses.reduce((a, p) => a + (p.enrolledStudents || MOCK_STUDENTS.length), 0);
  const grossRevenue    = paidCourses.reduce((a, p) => a + p.price * (p.enrolledStudents || MOCK_STUDENTS.length), 0);
  const netRevenue      = grossRevenue * (1 - PLATFORM_CUT);

  if (!session) return null;

  const toastBg = { success:"#16a34a", error:"#dc2626", info:"#1a1814" };

  /* shared input style */
  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e8e5de", borderRadius:9, fontFamily:"'Outfit',sans-serif", fontSize:13, color:"#1a1814", outline:"none", background:"white", transition:"border-color .2s" };

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:"#f5f7fa", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        .tab-btn{padding:10px 18px;background:transparent;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;color:#6b7280;border-bottom:2px solid transparent;display:flex;align-items:center;gap:7px;transition:all .2s;}
        .tab-btn.active{color:#2563eb;border-bottom-color:#2563eb;font-weight:600;}
        .tab-btn:hover{color:#1a1814;}
        .prop-card{background:white;border:1.5px solid #e8e5de;border-radius:16px;padding:24px;transition:all .2s;}
        .prop-card:hover{border-color:#d1d5db;box-shadow:0 4px 16px rgba(0,0,0,.06);}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;}
        .pay-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;background:linear-gradient(135deg,#2563eb,#1d4ed8);border:none;border-radius:10px;color:white;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;}
        .pay-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,.35);}
        .pay-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .view-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;color:#15803d;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;}
        .view-btn:hover{background:#dcfce7;transform:translateY(-1px);}
        .paid-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;color:#15803d;font-size:13px;font-weight:700;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spin{animation:spin .8s linear infinite;display:inline-block;}
        .mod-tab{padding:8px 16px;background:transparent;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;color:#6b7280;border-bottom:2px solid transparent;white-space:nowrap;transition:all .2s;}
        .mod-tab.active{color:#2563eb;border-bottom-color:#2563eb;font-weight:600;}
        .mod-tab.has-err{color:#dc2626;}
        .tp-inp-err{border-color:#dc2626!important;}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:9999, background:toastBg[toast.type]||"#16a34a", color:"white", padding:"13px 22px", borderRadius:10, fontSize:13, fontWeight:500, boxShadow:"0 6px 24px rgba(0,0,0,.18)", maxWidth:420 }}>
          {toast.msg}
        </div>
      )}

      {/* Course Viewer */}
      {viewingProposal && <CourseViewer proposal={viewingProposal} onClose={() => setViewingProposal(null)} />}

      {/* ── HEADER ── */}
      <div style={{ background:"white", borderBottom:"1px solid #e8e5de", padding:"0 32px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Link to="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
              <div style={{ width:32, height:32, background:"#1a1814", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14 }}><FaBookOpen /></div>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:"#1a1814" }}>Wisdom<em style={{ color:"#2563eb", fontStyle:"normal" }}>Wave</em></span>
            </Link>
            <span style={{ fontSize:12, color:"#9ca3af", paddingLeft:12, borderLeft:"1px solid #e8e5de" }}>Partner Dashboard</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {unpaidCourses.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:12, color:"#92400e", fontWeight:600 }}>
                ⚠️ {unpaidCourses.length} awaiting payment
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:14 }}>{session.logo}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1a1814" }}>{session.companyName}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>{session.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, color:"#dc2626", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab===t.id?"active":""}`}>
              {t.icon} {t.label}
              {t.id==="proposals" && pendingCourses.length > 0 && <span style={{ background:"#f59e0b", color:"white", fontSize:10, padding:"1px 6px", borderRadius:10 }}>{pendingCourses.length}</span>}
              {t.id==="proposals" && unpaidCourses.length > 0 && <span style={{ background:"#dc2626", color:"white", fontSize:10, padding:"1px 6px", borderRadius:10 }}>Pay</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"28px 32px" }}>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview" && (
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:700, color:"#1a1814", marginBottom:6 }}>Welcome back, {session.companyName}!</h2>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:28 }}>Here's a summary of your partnership with WisdomWave.</p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
              {[
                { label:"Total Proposals",  value:proposals.length,       color:"#2563eb", bg:"#eff6ff" },
                { label:"Approved Courses", value:approvedCourses.length, color:"#16a34a", bg:"#f0fdf4" },
                { label:"Total Students",   value:paidCourses.length>0?totalStudents:0, color:"#7c3aed", bg:"#faf5ff" },
                { label:"Net Revenue",      value:`₹${(paidCourses.length>0?netRevenue:0).toLocaleString("en-IN",{maximumFractionDigits:0})}`, color:"#d97706", bg:"#fffbeb" },
              ].map((s,i) => (
                <div key={i} style={{ background:"white", border:"1px solid #e8e5de", borderRadius:16, padding:"22px 24px" }}>
                  <p style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>{s.label}</p>
                  <p style={{ fontFamily:"'Fraunces',serif", fontSize:30, fontWeight:700, color:s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {unpaidCourses.length > 0 && (
              <div style={{ background:"#fffbeb", border:"1.5px solid #fde68a", borderRadius:16, padding:24, marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:22 }}>⚠️</span>
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:700, color:"#92400e", marginBottom:2 }}>Payment Required</h3>
                    <p style={{ fontSize:13, color:"#78350f" }}>{unpaidCourses.length} approved course{unpaidCourses.length>1?"s":""} need listing fee payment to go live.</p>
                  </div>
                </div>
                {unpaidCourses.map(c => (
                  <div key={c.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"white", borderRadius:10, padding:"12px 16px", border:"1px solid #fde68a", marginTop:8 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#1a1814", marginBottom:2 }}>{c.course}</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>Listing fee: ₹{(+c.price).toLocaleString("en-IN")}</div>
                    </div>
                    <button className="pay-btn" disabled={payingId===c.id} onClick={() => handlePayNow(c)}>
                      {payingId===c.id ? <><span className="spin">⟳</span> Processing...</> : <><FaCreditCard /> Pay ₹{(+c.price).toLocaleString("en-IN")}</>}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:"white", border:"1px solid #e8e5de", borderRadius:16, padding:24 }}>
                <h3 style={{ fontSize:15, fontWeight:600, color:"#1a1814", marginBottom:16 }}>Proposal Status</h3>
                {[
                  { label:"Pending Review",  count:pendingCourses.length,  bg:"#fffbeb", color:"#92400e" },
                  { label:"Approved",        count:approvedCourses.length, bg:"#f0fdf4", color:"#15803d" },
                  { label:"Payment Pending", count:unpaidCourses.length,   bg:"#fef2f2", color:"#b91c1c" },
                  { label:"Live (Paid)",     count:paidCourses.length,     bg:"#eff6ff", color:"#1d4ed8" },
                  { label:"Rejected",        count:rejectedCourses.length, bg:"#f3f4f6", color:"#374151" },
                ].map((s,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderTop:i===0?"none":"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:13, color:"#4a4640" }}>{s.label}</span>
                    <span style={{ padding:"3px 12px", borderRadius:100, fontSize:13, fontWeight:700, background:s.bg, color:s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"white", border:"1px solid #e8e5de", borderRadius:16, padding:24 }}>
                <h3 style={{ fontSize:15, fontWeight:600, color:"#1a1814", marginBottom:16 }}>Quick Actions</h3>
                <button onClick={() => { setShowForm(true); setTab("proposals"); }} style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", border:"none", borderRadius:10, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}>
                  <FaPlus /> Submit New Course Proposal
                </button>
                <button onClick={() => setTab("students")} style={{ width:"100%", padding:"12px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, color:"#15803d", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}>
                  <FaUsers /> View Enrolled Students
                </button>
                <button onClick={() => setTab("revenue")} style={{ width:"100%", padding:"12px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, color:"#92400e", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <FaRupeeSign /> Check Revenue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ PROPOSALS ══ */}
        {tab==="proposals" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:"#1a1814", marginBottom:4 }}>My Course Proposals</h2>
                <p style={{ fontSize:13, color:"#6b7280" }}>{proposals.length} proposal{proposals.length!==1?"s":""} submitted</p>
              </div>
              <button onClick={() => setShowForm(v=>!v)} style={{ padding:"10px 22px", background: showForm ? "#f3f4f6" : "#2563eb", border:`1px solid ${showForm?"#e5e7eb":"#2563eb"}`, borderRadius:10, color: showForm ? "#6b7280" : "white", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Proposal</>}
              </button>
            </div>

            {/* ── RICH PROPOSAL FORM ── */}
            {showForm && (
              <div style={{ background:"white", border:"1.5px solid #d1d5db", borderRadius:20, marginBottom:28, overflow:"hidden" }}>

                {/* Form header */}
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #e8e5de", background:"#f9fafb", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#1a1814" }}>Submit New Course Proposal</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:3 }}>Fill all 5 modules with YouTube video links and quiz questions</div>
                  </div>
                  <button onClick={() => { setShowForm(false); setFormErrors({}); }} style={{ background:"#f3f4f6", border:"none", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:14, color:"#6b7280" }}>✕</button>
                </div>

                <div style={{ padding:28 }}>
                  {/* ── BASIC INFO ── */}
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#9ca3af", marginBottom:14 }}>Course Information</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Course Title *</label>
                      <input value={courseForm.title} onChange={e => setCourseForm(p=>({...p,title:e.target.value}))}
                        placeholder="e.g., AWS Cloud Practitioner Complete Guide"
                        style={{ ...inp, borderColor: formErrors.title ? "#dc2626" : "#e8e5de" }} />
                      {formErrors.title && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>{formErrors.title}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Category *</label>
                      <select value={courseForm.category} onChange={e => setCourseForm(p=>({...p,category:e.target.value}))} style={inp}>
                        {["development","design","marketing","business","data-science","cloud","security","devops"].map(c => <option key={c} value={c}>{c.replace("-"," ")}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Level *</label>
                      <select value={courseForm.level} onChange={e => setCourseForm(p=>({...p,level:e.target.value}))} style={inp}>
                        {["Beginner","Intermediate","Advanced","All Levels"].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Total Duration *</label>
                      <input value={courseForm.duration} onChange={e => setCourseForm(p=>({...p,duration:e.target.value}))}
                        placeholder="e.g., 20h"
                        style={{ ...inp, borderColor: formErrors.duration ? "#dc2626" : "#e8e5de" }} />
                      {formErrors.duration && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>{formErrors.duration}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Proposed Price (₹) *</label>
                      <input type="number" min="1" value={courseForm.price} onChange={e => setCourseForm(p=>({...p,price:e.target.value}))}
                        placeholder="e.g., 3999"
                        style={{ ...inp, borderColor: formErrors.price ? "#dc2626" : "#e8e5de" }} />
                      {formErrors.price && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>{formErrors.price}</span>}
                    </div>

                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Course Description *</label>
                      <textarea value={courseForm.description} onChange={e => setCourseForm(p=>({...p,description:e.target.value}))}
                        rows={3} placeholder="Describe what students will learn, prerequisites, and why this course is valuable..."
                        style={{ ...inp, resize:"vertical", borderColor: formErrors.description ? "#dc2626" : "#e8e5de" }} />
                      {formErrors.description && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>{formErrors.description}</span>}
                    </div>
                  </div>

                  {/* ── APPEARANCE ── */}
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#9ca3af", marginBottom:12, marginTop:8 }}>Appearance</div>
                  <div style={{ display:"flex", gap:32, marginBottom:20, flexWrap:"wrap", background:"#f9fafb", borderRadius:12, padding:"18px 20px", border:"1px solid #e8e5de" }}>
                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:10, fontWeight:600 }}>Card Gradient</label>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {COURSE_GRADIENTS.map((g, i) => (
                          <button
                            key={i}
                            onClick={() => setCourseForm(p => ({ ...p, gradIndex: i }))}
                            style={{ width:36, height:36, borderRadius:8, background:`linear-gradient(135deg,${g[0]},${g[1]})`, border: courseForm.gradIndex===i ? "3px solid #1a1814" : "3px solid transparent", cursor:"pointer", transition:"border .15s" }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:10, fontWeight:600 }}>Course Emoji</label>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {COURSE_EMOJIS.map(e => (
                          <button
                            key={e}
                            onClick={() => setCourseForm(p => ({ ...p, emoji: e }))}
                            style={{ width:36, height:36, borderRadius:8, border: courseForm.emoji===e ? "2px solid #2563eb" : "1px solid #e8e5de", background: courseForm.emoji===e ? "#eff6ff" : "#f3f4f6", fontSize:18, cursor:"pointer", transition:"all .15s" }}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* live preview */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <label style={{ fontSize:12, color:"#4a4640", fontWeight:600 }}>Preview</label>
                      <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg,${COURSE_GRADIENTS[courseForm.gradIndex][0]},${COURSE_GRADIENTS[courseForm.gradIndex][1]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, boxShadow:"0 4px 14px rgba(0,0,0,.15)" }}>
                        {courseForm.emoji}
                      </div>
                    </div>
                  </div>

                  {/* ── MODULES ── */}
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#9ca3af", marginBottom:12, marginTop:8 }}>5 Course Modules</div>

                  {/* Module tab bar */}
                  <div style={{ display:"flex", gap:2, borderBottom:"1px solid #e8e5de", marginBottom:20 }}>
                    {courseForm.modules.map((_, i) => {
                      const hasErr = Object.keys(formErrors).some(k => k.startsWith(`mod_${i}_`));
                      return (
                        <button key={i} onClick={() => setActiveModIdx(i)}
                          className={`mod-tab ${activeModIdx===i?"active":""} ${hasErr?"has-err":""}`}>
                          Module {i+1} {hasErr && "⚠"}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active module editor */}
                  {(() => {
                    const m  = courseForm.modules[activeModIdx];
                    const mi = activeModIdx;
                    return (
                      <div style={{ background:"#f9fafb", borderRadius:14, padding:20 }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                          <div style={{ gridColumn:"1/-1" }}>
                            <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Module Title *</label>
                            <input value={m.title} onChange={e => updateModule(mi,"title",e.target.value)}
                              placeholder={`e.g., Introduction to Module ${mi+1}`}
                              style={{ ...inp, background:"white", borderColor: formErrors[`mod_${mi}_title`] ? "#dc2626" : "#e8e5de" }} />
                            {formErrors[`mod_${mi}_title`] && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>Title required</span>}
                          </div>

                          <div>
                            <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>YouTube Video ID *</label>
                            <input value={m.ytId} onChange={e => updateModule(mi,"ytId",e.target.value)}
                              placeholder="e.g., KJgsSFOSQv0"
                              style={{ ...inp, background:"white", borderColor: formErrors[`mod_${mi}_ytId`] ? "#dc2626" : "#e8e5de" }} />
                            {formErrors[`mod_${mi}_ytId`] && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>YouTube ID required</span>}
                            {m.ytId && (
                              <a href={`https://youtube.com/watch?v=${m.ytId}`} target="_blank" rel="noreferrer"
                                style={{ fontSize:11, color:"#2563eb", display:"block", marginTop:4 }}>▶ Preview video ↗</a>
                            )}
                            <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>Get this from youtube.com/watch?v=<strong>THIS_PART</strong></div>
                          </div>

                          <div>
                            <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Duration *</label>
                            <input value={m.duration} onChange={e => updateModule(mi,"duration",e.target.value)}
                              placeholder="e.g., 45 min"
                              style={{ ...inp, background:"white", borderColor: formErrors[`mod_${mi}_duration`] ? "#dc2626" : "#e8e5de" }} />
                            {formErrors[`mod_${mi}_duration`] && <span style={{ fontSize:11, color:"#dc2626", fontWeight:600 }}>Duration required</span>}
                          </div>

                          <div>
                            <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>About this module</label>
                            <input value={m.about} onChange={e => updateModule(mi,"about",e.target.value)}
                              placeholder="Brief description of what students learn..."
                              style={{ ...inp, background:"white" }} />
                          </div>

                          <div style={{ gridColumn:"1/-1" }}>
                            <label style={{ fontSize:12, color:"#4a4640", display:"block", marginBottom:5, fontWeight:600 }}>Hands-on Task (optional)</label>
                            <input value={m.task} onChange={e => updateModule(mi,"task",e.target.value)}
                              placeholder="e.g., Build a demo project using concepts from this module..."
                              style={{ ...inp, background:"white" }} />
                          </div>
                        </div>

                        {/* 5 Quiz Questions */}
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#9ca3af", marginBottom:12 }}>5 Quiz Questions</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                          {m.quiz.map((q, qi) => (
                            <div key={qi} style={{ background:"white", borderRadius:12, padding:16, border:"1px solid #e8e5de" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                                <span style={{ width:22, height:22, borderRadius:"50%", background:"#eff6ff", color:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>Q{qi+1}</span>
                                <input value={q.q} onChange={e => updateQuiz(mi,qi,"q",e.target.value)}
                                  placeholder={`Question ${qi+1}...`}
                                  style={{ ...inp, flex:1, fontSize:13 }} />
                              </div>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                                {q.opts.map((opt, oi) => (
                                  <div key={oi} style={{ display:"flex", alignItems:"center", gap:7 }}>
                                    <button onClick={() => updateQuiz(mi,qi,"ans",oi)}
                                      style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${q.ans===oi?"#16a34a":"#d1d5db"}`, background: q.ans===oi?"#16a34a":"transparent", flexShrink:0, cursor:"pointer", transition:"all .2s" }} />
                                    <input value={opt} onChange={e => updateOpt(mi,qi,oi,e.target.value)}
                                      placeholder={`Option ${oi+1}${q.ans===oi?" ✓ correct":""}`}
                                      style={{ ...inp, fontSize:12, background: q.ans===oi?"#f0fdf4":"#f9fafb", borderColor: q.ans===oi?"#bbf7d0":"#e8e5de" }} />
                                  </div>
                                ))}
                              </div>
                              <div style={{ fontSize:10, color:"#9ca3af", marginTop:6 }}>Click the ● circle next to the correct answer</div>
                            </div>
                          ))}
                        </div>

                        {/* Module nav */}
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
                          <button disabled={activeModIdx===0} onClick={() => setActiveModIdx(i=>i-1)}
                            style={{ padding:"8px 18px", background: activeModIdx===0?"#f3f4f6":"white", border:"1.5px solid #e8e5de", borderRadius:10, fontSize:13, color: activeModIdx===0?"#9ca3af":"#4a4640", cursor: activeModIdx===0?"not-allowed":"pointer" }}>
                            ← Previous Module
                          </button>
                          <button disabled={activeModIdx===4} onClick={() => setActiveModIdx(i=>i+1)}
                            style={{ padding:"8px 18px", background: activeModIdx===4?"#f3f4f6":"#2563eb", border:"none", borderRadius:10, fontSize:13, color: activeModIdx===4?"#9ca3af":"white", fontWeight:600, cursor: activeModIdx===4?"not-allowed":"pointer" }}>
                            Next Module →
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Submit */}
                  <div style={{ display:"flex", gap:10, marginTop:24, justifyContent:"flex-end", borderTop:"1px solid #e8e5de", paddingTop:20 }}>
                    <button onClick={() => { setShowForm(false); setFormErrors({}); setActiveModIdx(0); }}
                      style={{ padding:"11px 24px", background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:10, fontSize:13, color:"#6b7280", cursor:"pointer" }}>
                      Cancel
                    </button>
                    <button onClick={handleSubmit}
                      style={{ padding:"11px 28px", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", border:"none", borderRadius:10, color:"white", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(37,99,235,.3)" }}>
                      <FaArrowRight /> Submit Proposal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Proposals list */}
            {proposals.length === 0 && !showForm ? (
              <div style={{ textAlign:"center", padding:"56px 40px", background:"white", borderRadius:16, border:"1.5px dashed #d1d5db" }}>
                <div style={{ fontSize:48, marginBottom:16, opacity:.3 }}>📋</div>
                <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"#1a1814", marginBottom:8 }}>No proposals yet</h3>
                <p style={{ fontSize:14, color:"#6b7280" }}>Click "New Proposal" to submit your first course for review.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {proposals.map(p => {
                  const s       = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
                  const isPaid  = p.payment_status === "paid";
                  const needsPay = p.status === "approved" && !isPaid;
                  const hasModules = p.modules && p.modules.length > 0;
                  return (
                    <div key={p.id} className="prop-card" style={{ borderColor: needsPay ? "#fde68a" : "" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                        <div style={{ flex:1 }}>
                          {/* Badges */}
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                            <h3 style={{ fontSize:16, fontWeight:700, color:"#1a1814" }}>{p.course}</h3>
                            <span className="badge" style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                              {s.icon} {s.label}
                            </span>
                            {p.status === "approved" && (
                              isPaid
                                ? <span className="badge" style={{ background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe" }}><FaShieldAlt style={{ fontSize:10 }}/> Payment Verified</span>
                                : <span className="badge" style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fecaca" }}>⚠️ Payment Pending</span>
                            )}
                          </div>

                          {/* Meta */}
                          <div style={{ display:"flex", gap:14, fontSize:12, color:"#6b7280", flexWrap:"wrap", marginBottom:10 }}>
                            <span>📂 {p.category}</span>
                            {p.modules && <span>📚 {p.modules.length} modules</span>}
                            {p.duration && <span>⏱ {p.duration}</span>}
                            {p.level && <span>📶 {p.level}</span>}
                            <span>💰 ₹{(+p.price).toLocaleString("en-IN")}</span>
                            <span>📅 {p.submitted}</span>
                          </div>

                          {p.description && <p style={{ fontSize:13, color:"#4a4640", lineHeight:1.6, marginBottom:10 }}>{p.description}</p>}

                          {/* Approved + paid earnings */}
                          {p.status === "approved" && isPaid && (
                            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                              <span style={{ fontSize:12, fontWeight:600, color:"#15803d", background:"#f0fdf4", padding:"4px 12px", borderRadius:100 }}>
                                👥 {p.enrolledStudents || MOCK_STUDENTS.length} students
                              </span>
                              <span style={{ fontSize:12, fontWeight:600, color:"#92400e", background:"#fffbeb", padding:"4px 12px", borderRadius:100 }}>
                                ₹{((p.enrolledStudents||MOCK_STUDENTS.length) * p.price * (1-PLATFORM_CUT)).toLocaleString("en-IN",{maximumFractionDigits:0})} earned
                              </span>
                              {p.payment_id && (
                                <span style={{ fontSize:12, color:"#6b7280", background:"#f3f4f6", padding:"4px 12px", borderRadius:100 }}>
                                  Payment ID: {p.payment_id}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Unpaid warning */}
                          {needsPay && (
                            <div style={{ marginTop:8, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:12, color:"#92400e" }}>
                              ⚠️ <strong>Action required:</strong> Pay listing fee of <strong>₹{(+p.price).toLocaleString("en-IN")}</strong> to go live.
                            </div>
                          )}

                          {p.status === "rejected" && (
                            <p style={{ fontSize:12, color:"#b91c1c", marginTop:8, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>
                              ℹ️ Proposal not accepted. You may revise and resubmit.
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end", flexShrink:0 }}>
                          {/* View button — always shown for any proposal with modules */}
                          {hasModules && (
                            <button className="view-btn" onClick={() => setViewingProposal(p)}>
                              <FaPlay style={{ fontSize:10 }} /> View Course
                            </button>
                          )}
                          {needsPay && (
                            <button className="pay-btn" disabled={payingId===p.id} onClick={() => handlePayNow(p)}>
                              {payingId===p.id
                                ? <><span className="spin">⟳</span> Processing...</>
                                : <><FaCreditCard /> Pay ₹{(+p.price).toLocaleString("en-IN")}</>}
                            </button>
                          )}
                          {isPaid && <div className="paid-badge"><FaCheckCircle /> Paid</div>}
                          {p.status === "pending" && (
                            <button onClick={() => handleDelete(p.id)} style={{ padding:"7px 14px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, color:"#dc2626", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                              <FaTrash /> Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ STUDENTS ══ */}
        {tab==="students" && (
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:"#1a1814", marginBottom:6 }}>Enrolled Students</h2>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:24 }}>Students enrolled in your live (paid) courses.</p>
            {paidCourses.length === 0 ? (
              <div style={{ textAlign:"center", padding:"56px 40px", background:"white", borderRadius:16, border:"1.5px dashed #d1d5db" }}>
                <div style={{ fontSize:48, marginBottom:16, opacity:.3 }}><FaGraduationCap /></div>
                <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"#1a1814", marginBottom:8 }}>No live courses yet</h3>
                <p style={{ fontSize:14, color:"#6b7280" }}>
                  {approvedCourses.length>0 ? "Complete the listing fee payment to see enrolled students." : "Student data appears once your courses are approved and live."}
                </p>
              </div>
            ) : paidCourses.map(course => (
              <div key={course.id} style={{ background:"white", border:"1px solid #e8e5de", borderRadius:16, padding:24, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <h3 style={{ fontSize:16, fontWeight:700, color:"#1a1814", marginBottom:4 }}>{course.course}</h3>
                    <div style={{ display:"flex", gap:14, fontSize:12, color:"#6b7280" }}>
                      <span>👥 {MOCK_STUDENTS.length} students</span>
                      <span>💰 ₹{course.price}/student</span>
                    </div>
                  </div>
                  <span style={{ padding:"4px 14px", background:"#f0fdf4", color:"#15803d", border:"1px solid #bbf7d0", borderRadius:100, fontSize:12, fontWeight:600 }}>✓ Live</span>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
                        {["Student","Email","Enrolled Date","Progress","Payment"].map(h => (
                          <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:600, color:"#6b7280", textAlign:"left", textTransform:"uppercase", letterSpacing:".05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_STUDENTS.map((st,i) => (
                        <tr key={st.id} style={{ borderBottom:i===MOCK_STUDENTS.length-1?"none":"1px solid #f3f4f6" }}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ width:32, height:32, borderRadius:"50%", background:"#eff6ff", color:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{st.name[0]}</div>
                              <span style={{ fontSize:13, fontWeight:500, color:"#1a1814" }}>{st.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px", fontSize:13, color:"#6b7280" }}>{st.email}</td>
                          <td style={{ padding:"12px 14px", fontSize:13, color:"#6b7280" }}>{st.enrolled}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ flex:1, height:6, background:"#e5e7eb", borderRadius:100, overflow:"hidden", minWidth:80 }}>
                                <div style={{ height:"100%", width:`${st.progress}%`, background:st.progress===100?"#16a34a":"#2563eb", borderRadius:100 }} />
                              </div>
                              <span style={{ fontSize:12, fontWeight:600, color:st.progress===100?"#15803d":"#2563eb", minWidth:32 }}>{st.progress}%</span>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px" }}>
                            <span style={{ fontSize:11, padding:"3px 10px", borderRadius:100, fontWeight:600, background:st.paid?"#f0fdf4":"#fef2f2", color:st.paid?"#15803d":"#b91c1c" }}>
                              {st.paid ? "✓ Paid" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ REVENUE ══ */}
        {tab==="revenue" && (
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:"#1a1814", marginBottom:6 }}>Revenue</h2>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:24 }}>Earnings from your live courses. WisdomWave retains 30% as platform fee.</p>
            {paidCourses.length === 0 ? (
              <div style={{ textAlign:"center", padding:"56px 40px", background:"white", borderRadius:16, border:"1.5px dashed #d1d5db" }}>
                <div style={{ fontSize:48, marginBottom:16, opacity:.3 }}><FaRupeeSign /></div>
                <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"#1a1814", marginBottom:8 }}>No revenue yet</h3>
                <p style={{ fontSize:14, color:"#6b7280" }}>{approvedCourses.length>0?"Complete payment to start earning.":"Revenue appears once courses are live."}</p>
              </div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
                  {[
                    { label:"Gross Revenue",      value:`₹${grossRevenue.toLocaleString("en-IN",{maximumFractionDigits:0})}`,              sub:"Total from students", bg:"#eff6ff", color:"#1d4ed8" },
                    { label:"Platform Fee (30%)",  value:`₹${(grossRevenue*PLATFORM_CUT).toLocaleString("en-IN",{maximumFractionDigits:0})}`, sub:"WisdomWave's cut",     bg:"#fef2f2", color:"#b91c1c" },
                    { label:"Your Net Earnings",   value:`₹${netRevenue.toLocaleString("en-IN",{maximumFractionDigits:0})}`,                sub:"You receive (70%)",   bg:"#f0fdf4", color:"#15803d" },
                  ].map((s,i) => (
                    <div key={i} style={{ background:s.bg, borderRadius:16, padding:"24px 28px" }}>
                      <p style={{ fontSize:12, color:s.color, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>{s.label}</p>
                      <p style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:700, color:s.color, marginBottom:4 }}>{s.value}</p>
                      <p style={{ fontSize:12, color:s.color, opacity:.7 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:"white", border:"1px solid #e8e5de", borderRadius:16, padding:24 }}>
                  <h3 style={{ fontSize:15, fontWeight:600, color:"#1a1814", marginBottom:20 }}>Per-Course Breakdown</h3>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
                        {["Course","Price/Student","Enrolled","Gross","Platform (30%)","Your Earnings"].map(h => (
                          <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:600, color:"#6b7280", textAlign:"left", textTransform:"uppercase", letterSpacing:".05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paidCourses.map((c,i) => {
                        const st = c.enrolledStudents || MOCK_STUDENTS.length;
                        const gross = c.price * st;
                        const fee   = gross * PLATFORM_CUT;
                        const net   = gross - fee;
                        return (
                          <tr key={c.id} style={{ borderBottom:i===paidCourses.length-1?"none":"1px solid #f3f4f6" }}>
                            <td style={{ padding:"14px", fontSize:13, fontWeight:500, color:"#1a1814" }}>{c.course}</td>
                            <td style={{ padding:"14px", fontSize:13, color:"#4a4640" }}>₹{(+c.price).toLocaleString("en-IN")}</td>
                            <td style={{ padding:"14px", fontSize:13, color:"#4a4640" }}>{st}</td>
                            <td style={{ padding:"14px", fontSize:13, color:"#1d4ed8", fontWeight:600 }}>₹{gross.toLocaleString("en-IN")}</td>
                            <td style={{ padding:"14px", fontSize:13, color:"#b91c1c" }}>₹{fee.toLocaleString("en-IN",{maximumFractionDigits:0})}</td>
                            <td style={{ padding:"14px", fontSize:14, fontWeight:700, color:"#15803d" }}>₹{net.toLocaleString("en-IN",{maximumFractionDigits:0})}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop:"2px solid #e5e7eb", background:"#f9fafb" }}>
                        <td colSpan={3} style={{ padding:"14px", fontSize:13, fontWeight:700, color:"#1a1814" }}>Total</td>
                        <td style={{ padding:"14px", fontSize:13, fontWeight:700, color:"#1d4ed8" }}>₹{grossRevenue.toLocaleString("en-IN",{maximumFractionDigits:0})}</td>
                        <td style={{ padding:"14px", fontSize:13, fontWeight:700, color:"#b91c1c" }}>₹{(grossRevenue*PLATFORM_CUT).toLocaleString("en-IN",{maximumFractionDigits:0})}</td>
                        <td style={{ padding:"14px", fontSize:14, fontWeight:700, color:"#15803d" }}>₹{netRevenue.toLocaleString("en-IN",{maximumFractionDigits:0})}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div style={{ marginTop:16, padding:"16px 20px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, fontSize:13, color:"#92400e", lineHeight:1.6 }}>
                  💡 <strong>Payout Schedule:</strong> Earnings transferred on 1st & 15th of every month. Min payout ₹1,000. Contact <strong>partners@wisdomwave.in</strong> for setup.
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
