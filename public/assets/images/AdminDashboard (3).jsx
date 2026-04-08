import { useState, useEffect } from "react";

const W = {
  pageBg: "#F5F7FA", white: "#FFFFFF", border: "#E4E8EF", borderMid: "#CBD5E1",
  textPrimary: "#111827", textSec: "#6B7280", textHint: "#9CA3AF",
  blue: "#1D4ED8", blueBg: "#EFF6FF", blueText: "#1D4ED8",
  green: "#15803D", greenBg: "#F0FDF4", greenText: "#15803D",
  amber: "#92400E", amberBg: "#FFFBEB", amberText: "#92400E",
  red: "#B91C1C", redBg: "#FEF2F2", redText: "#B91C1C",
  gray: "#374151", grayBg: "#F9FAFB", grayText: "#374151",
};

const MOCK_COURSES = [
  { id:1, title:"React Mastery",         category:"Frontend", instructor:"Arjun Mehta",  students:142, status:"active",   duration:"32h", thumb:"R" },
  { id:2, title:"Node.js Backend",       category:"Backend",  instructor:"Priya Sharma", students:98,  status:"active",   duration:"28h", thumb:"N" },
  { id:3, title:"UI/UX Foundations",     category:"Design",   instructor:"Sneha Patel",  students:76,  status:"active",   duration:"20h", thumb:"U" },
  { id:4, title:"Data Science Bootcamp", category:"Data",     instructor:"Rahul Nair",   students:55,  status:"inactive", duration:"40h", thumb:"D" },
];

// ── EmailJS config ─────────────────────────────────────────────────────────────
// 1. Sign up FREE at https://www.emailjs.com  (200 emails/month free)
// 2. Dashboard → Email Services → Add Service (Gmail/Outlook) → copy Service ID
// 3. Email Templates → Create → use these variables in template body:
//       Hi {{to_name}}, ... {{reply_message}} ... Regards, WisdomWave Team
//    Set "To Email" field to: {{to_email}}
//    Set "Subject" to: Re: {{subject}}
// 4. Account → General → copy Public Key
// 5. Replace the three values below with yours:
const EMAILJS_SERVICE_ID  = "service_zwgwtdp";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_u09yI29";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "NiWfZQzyCT62TIhz3PioF";   // e.g. "abcDEFghiJKL"
// ──────────────────────────────────────────────────────────────────────────────

// Seed data shown on first load (before any real Contact-form submissions)
const SEED_QUERIES = [
  { id:1, user:"Kavya Reddy", email:"kavya@email.com", subject:"Certificate not received",       message:"I completed the React course 2 weeks ago but still haven't received my certificate. Please help.", status:"open",     date:"2025-03-20", priority:"high",   reply:"", submittedAt:"2025-03-20T09:00:00Z" },
  { id:2, user:"Amit Singh",  email:"amit@email.com",  subject:"Video not loading in Module 4",  message:"The video in Node.js Backend course Module 4 is not loading at all. I've tried multiple browsers.", status:"open",     date:"2025-03-21", priority:"medium", reply:"", submittedAt:"2025-03-21T11:00:00Z" },
  { id:3, user:"Divya Menon", email:"divya@email.com", subject:"Wrong quiz answers marked",      message:"In the UI/UX quiz, question 7's correct answer is marked wrong. Please review.",                    status:"resolved", date:"2025-03-15", priority:"low",    reply:"Thank you for reporting. We have corrected the quiz answer. Your score has been updated.", submittedAt:"2025-03-15T08:00:00Z" },
  { id:4, user:"Rohan Gupta", email:"rohan@email.com", subject:"Payment deducted no enrollment", message:"I paid for Data Science Bootcamp but I'm not enrolled. Transaction ID: TXN2025031988.",             status:"open",     date:"2025-03-22", priority:"high",   reply:"", submittedAt:"2025-03-22T14:00:00Z" },
  { id:5, user:"Nisha Verma", email:"nisha@email.com", subject:"Request for refund",             message:"The course content is outdated. I'd like a refund as the description mentioned 2024 updates.",      status:"open",     date:"2025-03-23", priority:"medium", reply:"", submittedAt:"2025-03-23T16:00:00Z" },
];
// Seed localStorage on very first load so admin sees example queries
try { if (!localStorage.getItem("wisdomwave_queries")) localStorage.setItem("wisdomwave_queries", JSON.stringify(SEED_QUERIES)); } catch {}

const STATS = [
  { label:"Total Students",    value:"1,284", change:"+12% this week", up:true,  color:"blue"  },
  { label:"Active Courses",    value:"24",    change:"+3 this week",   up:true,  color:"green" },
  { label:"Pending Queries",   value:"4",     change:"-2 this week",   up:false, color:"amber" },
  { label:"3rd Party Pending", value:"3",     change:"+1 this week",   up:true,  color:"red"   },
];

const STAT_COLORS = {
  blue:  { bg:W.blueBg,  text:W.blueText,  icon:"#BFDBFE" },
  green: { bg:W.greenBg, text:W.greenText, icon:"#BBF7D0" },
  amber: { bg:W.amberBg, text:W.amberText, icon:"#FDE68A" },
  red:   { bg:W.redBg,   text:W.redText,   icon:"#FECACA" },
};

const CATEGORIES = ["Frontend","Backend","Design","Data","Cloud","Security","DevOps"];

const CATEGORY_MAP = {
  "Frontend":"development","Backend":"development","Design":"design",
  "Data":"data-science","Cloud":"development","Security":"development","DevOps":"development",
};

const COURSE_GRADIENTS = [
  ["#4f46e5","#7c3aed"],["#059669","#0284c7"],["#db2777","#9333ea"],
  ["#0f4c81","#1a7431"],["#0f766e","#0369a1"],["#7c3aed","#be185d"],
  ["#1d4ed8","#0891b2"],["#c2410c","#b45309"],
];

const COURSE_EMOJIS = ["⚡","🧠","🎨","🚀","🖥️","⚙️","🐍","☕","🔬","🌐","📊","🎯"];

const EMPTY_MODULE = () => ({
  id:Date.now()+Math.random(), title:"", duration:"", ytId:"", about:"", task:"",
  quiz:[
    {q:"",opts:["","","",""],ans:0},{q:"",opts:["","","",""],ans:0},
    {q:"",opts:["","","",""],ans:0},{q:"",opts:["","","",""],ans:0},
    {q:"",opts:["","","",""],ans:0},
  ]
});

const badge = (label,type) => {
  const styles = {
    active:{bg:W.greenBg,color:W.greenText},inactive:{bg:W.grayBg,color:W.grayText},
    open:{bg:W.amberBg,color:W.amberText},resolved:{bg:W.greenBg,color:W.greenText},
    approved:{bg:W.greenBg,color:W.greenText},rejected:{bg:W.redBg,color:W.redText},
    pending:{bg:W.amberBg,color:W.amberText},high:{bg:W.redBg,color:W.redText},
    medium:{bg:W.amberBg,color:W.amberText},low:{bg:W.greenBg,color:W.greenText},
  };
  const s = styles[type]||{bg:W.grayBg,color:W.grayText};
  return <span style={{fontSize:11,padding:"3px 9px",borderRadius:20,fontWeight:500,background:s.bg,color:s.color,whiteSpace:"nowrap"}}>{label}</span>;
};

export default function AdminDashboard() {
  const [activeTab,setActiveTab]           = useState("overview");
  const [courses,setCourses]               = useState(MOCK_COURSES);
  const [queries,setQueries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wisdomwave_queries") || "null") || SEED_QUERIES; } catch { return SEED_QUERIES; }
  });
  const [emailjsReady,setEmailjsReady] = useState(false);
  const [showAddCourse,setShowAddCourse]   = useState(false);
  const [selectedQuery,setSelectedQuery]   = useState(null);
  const [replyText,setReplyText]           = useState("");
  const [toast,setToast]                   = useState(null);
  const [deleteConfirm,setDeleteConfirm]   = useState(null);
  const [showAppDetails,setShowAppDetails] = useState(false);
  const [selectedApp,setSelectedApp]       = useState(null);
  const [showTPDetail,setShowTPDetail]     = useState(false);
  const [selectedTP,setSelectedTP]         = useState(null);

  const [courseForm,setCourseForm] = useState({
    title:"",category:"Frontend",instructor:"",instructorRole:"",
    level:"All Levels",price:"",originalPrice:"",duration:"",
    description:"",badge:"Popular",emoji:"⚡",gradIndex:0,
    modules:[EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE()],
  });
  const [activeModuleIdx,setActiveModuleIdx] = useState(0);
  const [courseFormErrors,setCourseFormErrors] = useState({});

  const [adminCourses,setAdminCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wisdomwave_admin_courses")||"[]"); } catch { return []; }
  });

  const [thirdParty,setThirdParty] = useState(() => {
    try { const s=localStorage.getItem("wisdomwave_third_party"); return s?JSON.parse(s):[]; } catch { return []; }
  });

  useEffect(() => {
    const refresh = () => {
      try { const s=localStorage.getItem("wisdomwave_third_party"); if(s) setThirdParty(JSON.parse(s)); } catch {}
    };
    window.addEventListener("storage",refresh);
    const interval=setInterval(refresh,3000);
    return ()=>{ window.removeEventListener("storage",refresh); clearInterval(interval); };
  },[]);

  // ── Real-time queries: poll localStorage every 2s + storage event ──
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem("wisdomwave_queries");
        if (raw) setQueries(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener("storage", refresh);
    const iv = setInterval(refresh, 2000);
    return () => { window.removeEventListener("storage", refresh); clearInterval(iv); };
  }, []);

  // ── Load EmailJS SDK once ──
  useEffect(() => {
    if (window.emailjs) { setEmailjsReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      try { window.emailjs.init(EMAILJS_PUBLIC_KEY); setEmailjsReady(true); } catch {}
    };
    document.head.appendChild(s);
  }, []);

  const [applications,setApplications] = useState(() => {
    try { const s=localStorage.getItem("wisdomwave_tutor_applications"); return s?JSON.parse(s):[]; } catch { return []; }
  });

  useEffect(() => {
    const refresh = () => {
      try { const s=localStorage.getItem("wisdomwave_tutor_applications"); if(s) setApplications(JSON.parse(s)); } catch {}
    };
    window.addEventListener("storage",refresh);
    return ()=>window.removeEventListener("storage",refresh);
  },[]);

  useEffect(() => {
    localStorage.setItem("wisdomwave_tutor_applications",JSON.stringify(applications));
  },[applications]);

  const [payments,setPayments] = useState(() => {
    try { const s=localStorage.getItem("wisdomwave_payments"); return s?JSON.parse(s):[]; } catch { return []; }
  });

  useEffect(() => {
    const refresh = () => {
      try { const s=localStorage.getItem("wisdomwave_payments"); if(s) setPayments(JSON.parse(s)); } catch {}
    };
    window.addEventListener("storage",refresh);
    const interval=setInterval(refresh,3000);
    return ()=>{ window.removeEventListener("storage",refresh); clearInterval(interval); };
  },[]);

  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const updateModule = (idx,field,value) => {
    setCourseForm(prev=>{ const mods=[...prev.modules]; mods[idx]={...mods[idx],[field]:value}; return {...prev,modules:mods}; });
  };
  const updateQuiz = (modIdx,qIdx,field,value) => {
    setCourseForm(prev=>{ const mods=[...prev.modules]; const quiz=[...mods[modIdx].quiz]; quiz[qIdx]={...quiz[qIdx],[field]:value}; mods[modIdx]={...mods[modIdx],quiz}; return {...prev,modules:mods}; });
  };
  const updateQuizOpt = (modIdx,qIdx,optIdx,value) => {
    setCourseForm(prev=>{ const mods=[...prev.modules]; const quiz=[...mods[modIdx].quiz]; const opts=[...quiz[qIdx].opts]; opts[optIdx]=value; quiz[qIdx]={...quiz[qIdx],opts}; mods[modIdx]={...mods[modIdx],quiz}; return {...prev,modules:mods}; });
  };

  const validateCourse = () => {
    const e={};
    if(!courseForm.title.trim())       e.title="Title required";
    if(!courseForm.instructor.trim())  e.instructor="Instructor required";
    if(!courseForm.price||isNaN(courseForm.price)) e.price="Valid price required";
    if(!courseForm.duration.trim())    e.duration="Duration required";
    if(!courseForm.description.trim()) e.description="Description required";
    courseForm.modules.forEach((m,i)=>{
      if(!m.title.trim())    e[`mod_${i}_title`]   =`Module ${i+1}: title required`;
      if(!m.ytId.trim())     e[`mod_${i}_ytId`]    =`Module ${i+1}: YouTube ID required`;
      if(!m.duration.trim()) e[`mod_${i}_duration`]=`Module ${i+1}: duration required`;
    });
    setCourseFormErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSaveCourse = () => {
    if(!validateCourse()){ showToast("Please fill all required fields","error"); return; }
    const grad=COURSE_GRADIENTS[courseForm.gradIndex];
    const newCourse = {
      id:Date.now(),
      title:courseForm.title.trim(),instructor:courseForm.instructor.trim(),
      role:courseForm.instructorRole.trim()||"Instructor",
      av:courseForm.instructor.trim().split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2),
      duration:courseForm.duration.trim(),level:courseForm.level,
      price:Math.round(+courseForm.price/83),
      originalPrice:courseForm.originalPrice?Math.round(+courseForm.originalPrice/83):Math.round(+courseForm.price/83*1.5),
      category:CATEGORY_MAP[courseForm.category]||"development",
      rating:4.5,students:0,desc:courseForm.description.trim(),
      badge:courseForm.badge,skills:[courseForm.category],grad,emoji:courseForm.emoji,
      includes:[`5 modules · ${courseForm.duration} of video`,"Hands-on tasks every module","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
      modules:courseForm.modules.map((m,i)=>({
        id:i+1,title:m.title.trim(),duration:m.duration.trim(),ytId:m.ytId.trim(),
        about:m.about.trim()||`Learn about ${m.title}`,
        task:m.task.trim()||`Complete the ${m.title} task.`,
        quiz:m.quiz.map(q=>({q:q.q.trim()||"Sample question?",opts:q.opts.map(o=>o.trim()||"Option"),ans:q.ans})),
      })),
      adminAdded:true,
    };
    const updated=[...adminCourses,newCourse];
    setAdminCourses(updated);
    localStorage.setItem("wisdomwave_admin_courses",JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage",{key:"wisdomwave_admin_courses",newValue:JSON.stringify(updated)}));
    setCourseForm({title:"",category:"Frontend",instructor:"",instructorRole:"",level:"All Levels",price:"",originalPrice:"",duration:"",description:"",badge:"Popular",emoji:"⚡",gradIndex:0,modules:[EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE(),EMPTY_MODULE()]});
    setCourseFormErrors({}); setActiveModuleIdx(0); setShowAddCourse(false);
    showToast(`✅ "${newCourse.title}" published and visible to students!`);
  };

  const handleDeleteAdminCourse = (id) => {
    const updated=adminCourses.filter(c=>c.id!==id);
    setAdminCourses(updated);
    localStorage.setItem("wisdomwave_admin_courses",JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage",{key:"wisdomwave_admin_courses",newValue:JSON.stringify(updated)}));
    showToast("Course removed from student view.");
  };

  const handleDeleteCourse = (id) => { setCourses(courses.filter(c=>c.id!==id)); setDeleteConfirm(null); showToast("Course deleted."); };
  const handleToggleCourse = (id) => setCourses(courses.map(c=>c.id===id?{...c,status:c.status==="active"?"inactive":"active"}:c));

  const handleTPAction = (id,action) => {
    const updated=thirdParty.map(tp=>tp.id===id?{...tp,status:action}:tp);
    setThirdParty(updated);
    localStorage.setItem("wisdomwave_third_party",JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage",{key:"wisdomwave_third_party",newValue:JSON.stringify(updated)}));
    if(selectedTP&&selectedTP.id===id) setSelectedTP(prev=>({...prev,status:action}));
    showToast(`Course ${action} successfully.`);
  };

  // ── DELETE TP: removes course from platform & student Courses page immediately ──
  const handleDeleteTP = (id) => {
    const updated=thirdParty.filter(tp=>tp.id!==id);
    setThirdParty(updated);
    localStorage.setItem("wisdomwave_third_party",JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage",{key:"wisdomwave_third_party",newValue:JSON.stringify(updated)}));
    if(selectedTP&&selectedTP.id===id){ setShowTPDetail(false); setSelectedTP(null); }
    showToast("Course removed from platform.");
  };

  const handleReply = async (qid) => {
    if (!replyText.trim()) return;
    const target = queries.find(q => q.id === qid);
    if (!target) return;

    // 1. Update in state + localStorage
    const updated = queries.map(q => q.id === qid ? { ...q, status: "resolved", reply: replyText, resolvedAt: new Date().toISOString() } : q);
    setQueries(updated);
    try {
      localStorage.setItem("wisdomwave_queries", JSON.stringify(updated));
      window.dispatchEvent(new StorageEvent("storage", { key: "wisdomwave_queries", newValue: JSON.stringify(updated) }));
    } catch {}

    // 2. Send reply email via EmailJS (requires EMAILJS_* constants to be configured)
    let emailSent = false;
    if (emailjsReady && window.emailjs && EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID") {
      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_name:       target.user,
          to_email:      target.email,
          subject:       target.subject,
          reply_message: replyText,
          from_name:     "WisdomWave Support",
        });
        emailSent = true;
      } catch (err) {
        console.error("EmailJS error:", err);
      }
    }

    setReplyText("");
    setSelectedQuery(null);
    showToast(emailSent ? `✅ Reply sent & email delivered to ${target.email}!` : "Reply saved! (Configure EmailJS to send real emails)");
  };

  const getRandomGradient = () => {
    const g=["linear-gradient(135deg,#6366f1,#8b5cf6)","linear-gradient(135deg,#f59e0b,#ef4444)","linear-gradient(135deg,#10b981,#0ea5e9)","linear-gradient(135deg,#ec4899,#a855f7)"];
    return g[Math.floor(Math.random()*g.length)];
  };

  const handleApproveApplication = (app) => {
    const tutors=JSON.parse(localStorage.getItem("wisdomwave_tutors")||"[]");
    const newTutor={
      id:Date.now(),name:app.fullName,role:app.role,company:app.company,
      av:app.fullName.split(" ").map(n=>n[0]).join("").toUpperCase(),
      bg:getRandomGradient(),experience:parseInt(app.experience),rating:4.5,
      students:0,courses:app.courses?app.courses.split(",").map(c=>c.trim()):[],
      category:CATEGORY_MAP[app.category]||"development",
      phone:app.phone||"",email:app.email,qualification:app.qualification||"",bio:app.bio,
      skills:app.skills?app.skills.split(",").map(s=>s.trim()):[],certifications:[],languages:["English"],
    };
    localStorage.setItem("wisdomwave_tutors",JSON.stringify([newTutor,...tutors]));
    window.dispatchEvent(new StorageEvent("storage",{key:"wisdomwave_tutors"}));
    setApplications(applications.map(a=>a.id===app.id?{...a,status:"approved",approvedAt:new Date().toISOString()}:a));
    setShowAppDetails(false); setSelectedApp(null);
    showToast(`${app.fullName} approved and added as tutor!`);
  };

  const handleRejectApplication = (app) => {
    setApplications(applications.map(a=>a.id===app.id?{...a,status:"rejected",rejectedAt:new Date().toISOString()}:a));
    setShowAppDetails(false); setSelectedApp(null);
    showToast("Application rejected.","error");
  };

  const openQueries=queries.filter(q=>q.status==="open").length;
  const pendingTP=thirdParty.filter(tp=>tp.status==="pending").length;
  const pendingApps=applications.filter(app=>app.status==="pending").length;

  const tabs=[
    {id:"overview",  label:"Overview"},
    {id:"courses",   label:"Courses"},
    {id:"queries",   label:"User Queries",badge:openQueries},
    {id:"thirdparty",label:"3rd Party",  badge:pendingTP},
    {id:"tutor-apps",label:"Tutor Apps", badge:pendingApps},
    {id:"payments",  label:"Payments",   badge:payments.length},
  ];

  const inp = {
    width:"100%",boxSizing:"border-box",padding:"8px 12px",
    fontSize:13,borderRadius:8,border:`1px solid ${W.border}`,
    background:W.white,color:W.textPrimary,fontFamily:"inherit",outline:"none",
  };

  return (
    <div style={{fontFamily:"'Inter','Segoe UI',sans-serif",background:W.pageBg,minHeight:"100vh"}}>

      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?W.red:W.green,color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{background:W.white,borderBottom:`1px solid ${W.border}`,padding:"0 32px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:W.blue,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:15}}>W</div>
            <span style={{fontSize:16,fontWeight:600,color:W.textPrimary}}>WisdomWave</span>
            <span style={{fontSize:12,color:W.textHint,paddingLeft:10,borderLeft:`1px solid ${W.border}`}}>Admin Panel</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {pendingApps>0&&<span style={{background:W.amberBg,color:W.amberText,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{pendingApps} new tutor app{pendingApps>1?"s":""}</span>}
            <div style={{width:34,height:34,borderRadius:"50%",background:W.blueBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:W.blueText}}>A</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:"10px 16px",fontSize:13,fontWeight:activeTab===t.id?600:400,color:activeTab===t.id?W.blue:W.textSec,background:"transparent",border:"none",cursor:"pointer",borderBottom:activeTab===t.id?`2px solid ${W.blue}`:"2px solid transparent"}}>
              {t.label}
              {t.badge>0&&<span style={{marginLeft:6,background:t.id==="queries"?W.red:t.id==="payments"?W.green:W.amberText,color:"#fff",fontSize:10,padding:"1px 6px",borderRadius:10}}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"28px 32px"}}>

        {/* ══ OVERVIEW ══ */}
        {activeTab==="overview" && (
          <div>
            <p style={{fontSize:13,color:W.textSec,margin:"0 0 20px"}}>Welcome back, Admin. Here's a snapshot of your platform.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {STATS.map(s=>{ const c=STAT_COLORS[s.color]; return (
                <div key={s.label} style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:"18px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><p style={{fontSize:12,color:W.textSec,margin:"0 0 6px"}}>{s.label}</p><p style={{fontSize:28,fontWeight:700,margin:0,color:W.textPrimary}}>{s.value}</p></div>
                    <div style={{width:38,height:38,borderRadius:10,background:c.icon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:c.text}}>{s.label[0]}</div>
                  </div>
                  <p style={{margin:"10px 0 0",fontSize:12,color:(s.up&&s.color!=="amber")||(!s.up&&s.color==="amber")?W.green:W.red}}>{s.change}</p>
                </div>
              );})}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{fontSize:14,fontWeight:600,margin:0,color:W.textPrimary}}>Courses</p>
                  <button onClick={()=>setActiveTab("courses")} style={{fontSize:12,color:W.blue,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
                </div>
                {courses.slice(0,4).map((c,i)=>(
                  <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i===0?"none":`1px solid ${W.border}`}}>
                    <div style={{width:34,height:34,borderRadius:8,background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:13,flexShrink:0}}>{c.thumb}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:500,margin:0,color:W.textPrimary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.title}</p>
                      <p style={{fontSize:12,color:W.textSec,margin:0}}>{c.instructor} · {c.students} students</p>
                    </div>
                    {badge(c.status,c.status)}
                  </div>
                ))}
              </div>
              <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{fontSize:14,fontWeight:600,margin:0,color:W.textPrimary}}>Recent Tutor Applications</p>
                  <button onClick={()=>setActiveTab("tutor-apps")} style={{fontSize:12,color:W.blue,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
                </div>
                {applications.filter(a=>a.status==="pending").slice(0,4).map((app,i)=>(
                  <div key={app.id} style={{padding:"10px 0",borderTop:i===0?"none":`1px solid ${W.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><p style={{fontSize:13,fontWeight:500,margin:"0 0 2px",color:W.textPrimary}}>{app.fullName}</p><p style={{fontSize:12,color:W.textSec,margin:0}}>{app.role} · {app.company}</p></div>
                      {badge("Pending","pending")}
                    </div>
                  </div>
                ))}
                {applications.filter(a=>a.status==="pending").length===0&&<p style={{fontSize:12,color:W.textHint,textAlign:"center",padding:"20px 0"}}>No pending applications</p>}
              </div>
            </div>
          </div>
        )}

        {/* ══ COURSES ══ */}
        {activeTab==="courses" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>Course Management</p>
                <p style={{fontSize:13,color:W.textSec,margin:0}}>{courses.length+adminCourses.length} courses total · {adminCourses.length} admin-added</p>
              </div>
              <button onClick={()=>setShowAddCourse(v=>!v)} style={{background:showAddCourse?W.grayBg:W.blue,color:showAddCourse?W.textSec:"#fff",border:`1px solid ${showAddCourse?W.border:W.blue}`,borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:500,cursor:"pointer"}}>
                {showAddCourse?"✕ Cancel":"+ Add Course"}
              </button>
            </div>

            {/* ── RICH COURSE BUILDER ── */}
            {showAddCourse && (
              <div style={{background:W.white,border:`1.5px solid ${W.borderMid}`,borderRadius:16,marginBottom:24,overflow:"hidden"}}>
                <div style={{padding:"20px 24px",borderBottom:`1px solid ${W.border}`,background:W.grayBg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:16,fontWeight:700,margin:0,color:W.textPrimary}}>Add New Course</p>
                    <p style={{fontSize:12,color:W.textSec,margin:"3px 0 0"}}>Course will be visible to students immediately after saving</p>
                  </div>
                  <div style={{width:52,height:52,borderRadius:12,background:`linear-gradient(135deg,${COURSE_GRADIENTS[courseForm.gradIndex][0]},${COURSE_GRADIENTS[courseForm.gradIndex][1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                    {courseForm.emoji}
                  </div>
                </div>
                <div style={{padding:24}}>
                  <p style={{fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:W.textHint,marginBottom:14}}>Course Information</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                    <div style={{gridColumn:"1/-1"}}>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Course Title *</label>
                      <input value={courseForm.title} onChange={e=>setCourseForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Complete React Development Bootcamp" style={{...inp,borderColor:courseFormErrors.title?W.red:W.border}}/>
                      {courseFormErrors.title&&<span style={{fontSize:11,color:W.red}}>{courseFormErrors.title}</span>}
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Instructor Name *</label>
                      <input value={courseForm.instructor} onChange={e=>setCourseForm(p=>({...p,instructor:e.target.value}))} placeholder="e.g. Dr. Priya Nair" style={{...inp,borderColor:courseFormErrors.instructor?W.red:W.border}}/>
                      {courseFormErrors.instructor&&<span style={{fontSize:11,color:W.red}}>{courseFormErrors.instructor}</span>}
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Instructor Role</label>
                      <input value={courseForm.instructorRole} onChange={e=>setCourseForm(p=>({...p,instructorRole:e.target.value}))} placeholder="e.g. Senior Engineer @ Google" style={inp}/>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Category *</label>
                      <select value={courseForm.category} onChange={e=>setCourseForm(p=>({...p,category:e.target.value}))} style={inp}>
                        {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Level</label>
                      <select value={courseForm.level} onChange={e=>setCourseForm(p=>({...p,level:e.target.value}))} style={inp}>
                        {["Beginner","Intermediate","Advanced","All Levels"].map(l=><option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Total Duration *</label>
                      <input value={courseForm.duration} onChange={e=>setCourseForm(p=>({...p,duration:e.target.value}))} placeholder="e.g. 20h" style={{...inp,borderColor:courseFormErrors.duration?W.red:W.border}}/>
                      {courseFormErrors.duration&&<span style={{fontSize:11,color:W.red}}>{courseFormErrors.duration}</span>}
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Price (₹) *</label>
                      <input type="number" value={courseForm.price} onChange={e=>setCourseForm(p=>({...p,price:e.target.value}))} placeholder="e.g. 3999" style={{...inp,borderColor:courseFormErrors.price?W.red:W.border}}/>
                      {courseFormErrors.price&&<span style={{fontSize:11,color:W.red}}>{courseFormErrors.price}</span>}
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Original Price (₹) <span style={{color:W.textHint}}>(for discount)</span></label>
                      <input type="number" value={courseForm.originalPrice} onChange={e=>setCourseForm(p=>({...p,originalPrice:e.target.value}))} placeholder="e.g. 7999" style={inp}/>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Badge</label>
                      <select value={courseForm.badge} onChange={e=>setCourseForm(p=>({...p,badge:e.target.value}))} style={inp}>
                        {["Bestseller","Top Rated","Popular","Hot"].map(b=><option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div style={{gridColumn:"1/-1"}}>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Course Description *</label>
                      <textarea value={courseForm.description} onChange={e=>setCourseForm(p=>({...p,description:e.target.value}))} placeholder="Describe what students will learn..." rows={3} style={{...inp,resize:"vertical",borderColor:courseFormErrors.description?W.red:W.border}}/>
                      {courseFormErrors.description&&<span style={{fontSize:11,color:W.red}}>{courseFormErrors.description}</span>}
                    </div>
                  </div>

                  <p style={{fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:W.textHint,marginBottom:12,marginTop:8}}>Appearance</p>
                  <div style={{display:"flex",gap:24,marginBottom:20,flexWrap:"wrap"}}>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:8}}>Card Gradient</label>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {COURSE_GRADIENTS.map((g,i)=>(
                          <button key={i} onClick={()=>setCourseForm(p=>({...p,gradIndex:i}))} style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg,${g[0]},${g[1]})`,border:courseForm.gradIndex===i?`3px solid ${W.textPrimary}`:"3px solid transparent",cursor:"pointer"}}/>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:8}}>Course Emoji</label>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {COURSE_EMOJIS.map(e=>(
                          <button key={e} onClick={()=>setCourseForm(p=>({...p,emoji:e}))} style={{width:36,height:36,borderRadius:8,border:courseForm.emoji===e?`2px solid ${W.blue}`:`1px solid ${W.border}`,background:courseForm.emoji===e?W.blueBg:W.grayBg,fontSize:18,cursor:"pointer"}}>{e}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p style={{fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:W.textHint,marginBottom:12,marginTop:8}}>5 Course Modules</p>
                  <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:`1px solid ${W.border}`}}>
                    {courseForm.modules.map((m,i)=>{
                      const hasErr=Object.keys(courseFormErrors).some(k=>k.startsWith(`mod_${i}_`));
                      return <button key={i} onClick={()=>setActiveModuleIdx(i)} style={{padding:"8px 16px",background:"transparent",border:"none",cursor:"pointer",fontSize:13,fontWeight:activeModuleIdx===i?600:400,color:hasErr?W.red:activeModuleIdx===i?W.blue:W.textSec,borderBottom:activeModuleIdx===i?`2px solid ${W.blue}`:"2px solid transparent",whiteSpace:"nowrap"}}>Module {i+1} {hasErr&&"⚠"}</button>;
                    })}
                  </div>
                  {(()=>{
                    const m=courseForm.modules[activeModuleIdx]; const mi=activeModuleIdx;
                    return (
                      <div style={{background:W.grayBg,borderRadius:12,padding:20}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                          <div style={{gridColumn:"1/-1"}}>
                            <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Module Title *</label>
                            <input value={m.title} onChange={e=>updateModule(mi,"title",e.target.value)} placeholder={`e.g. Introduction to ${courseForm.category}`} style={{...inp,background:W.white,borderColor:courseFormErrors[`mod_${mi}_title`]?W.red:W.border}}/>
                            {courseFormErrors[`mod_${mi}_title`]&&<span style={{fontSize:11,color:W.red}}>Title required</span>}
                          </div>
                          <div>
                            <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>YouTube Video ID *</label>
                            <input value={m.ytId} onChange={e=>updateModule(mi,"ytId",e.target.value)} placeholder="e.g. KJgsSFOSQv0" style={{...inp,background:W.white,borderColor:courseFormErrors[`mod_${mi}_ytId`]?W.red:W.border}}/>
                            {courseFormErrors[`mod_${mi}_ytId`]&&<span style={{fontSize:11,color:W.red}}>YouTube ID required</span>}
                            {m.ytId&&<a href={`https://youtube.com/watch?v=${m.ytId}`} target="_blank" rel="noreferrer" style={{fontSize:11,color:W.blue,display:"block",marginTop:4}}>▶ Preview video</a>}
                          </div>
                          <div>
                            <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Duration *</label>
                            <input value={m.duration} onChange={e=>updateModule(mi,"duration",e.target.value)} placeholder="e.g. 45 min" style={{...inp,background:W.white,borderColor:courseFormErrors[`mod_${mi}_duration`]?W.red:W.border}}/>
                            {courseFormErrors[`mod_${mi}_duration`]&&<span style={{fontSize:11,color:W.red}}>Duration required</span>}
                          </div>
                          <div>
                            <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>About this module</label>
                            <input value={m.about} onChange={e=>updateModule(mi,"about",e.target.value)} placeholder="Brief description..." style={{...inp,background:W.white}}/>
                          </div>
                          <div style={{gridColumn:"1/-1"}}>
                            <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:5}}>Hands-on Task</label>
                            <input value={m.task} onChange={e=>updateModule(mi,"task",e.target.value)} placeholder="e.g. Build a to-do app..." style={{...inp,background:W.white}}/>
                          </div>
                        </div>
                        <p style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:W.textHint,marginBottom:12}}>5 Quiz Questions</p>
                        <div style={{display:"flex",flexDirection:"column",gap:14}}>
                          {m.quiz.map((q,qi)=>(
                            <div key={qi} style={{background:W.white,borderRadius:10,padding:14,border:`1px solid ${W.border}`}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                                <span style={{width:22,height:22,borderRadius:"50%",background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>Q{qi+1}</span>
                                <input value={q.q} onChange={e=>updateQuiz(mi,qi,"q",e.target.value)} placeholder={`Question ${qi+1}...`} style={{...inp,flex:1,fontSize:13}}/>
                              </div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                {q.opts.map((opt,oi)=>(
                                  <div key={oi} style={{display:"flex",alignItems:"center",gap:6}}>
                                    <button onClick={()=>updateQuiz(mi,qi,"ans",oi)} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${q.ans===oi?W.green:W.border}`,background:q.ans===oi?W.green:"transparent",flexShrink:0,cursor:"pointer"}}/>
                                    <input value={opt} onChange={e=>updateQuizOpt(mi,qi,oi,e.target.value)} placeholder={`Option ${oi+1}${q.ans===oi?" ✓ correct":""}`} style={{...inp,fontSize:12,background:q.ans===oi?"#f0fdf4":W.grayBg,borderColor:q.ans===oi?"#bbf7d0":W.border}}/>
                                  </div>
                                ))}
                              </div>
                              <p style={{fontSize:10,color:W.textHint,margin:"8px 0 0"}}>Click the circle next to the correct answer</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
                    <button onClick={()=>{setShowAddCourse(false);setCourseFormErrors({});}} style={{padding:"10px 22px",background:W.grayBg,border:`1px solid ${W.border}`,borderRadius:8,fontSize:13,color:W.textSec,cursor:"pointer"}}>Cancel</button>
                    <button onClick={handleSaveCourse} style={{padding:"10px 28px",background:W.blue,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>🚀 Publish Course to Students</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── ADMIN-ADDED COURSES (live, with Remove button) ── */}
            {adminCourses.length>0 && (
              <div style={{marginBottom:20}}>
                <p style={{fontSize:13,fontWeight:600,color:W.green,marginBottom:10}}>✓ Admin-Added Courses (visible to students)</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {adminCourses.map(c=>(
                    <div key={c.id} style={{background:W.white,border:"1.5px solid #BBF7D0",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${c.grad[0]},${c.grad[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{c.emoji}</div>
                        <div>
                          <p style={{fontSize:14,fontWeight:600,margin:0,color:W.textPrimary}}>{c.title}</p>
                          <p style={{fontSize:12,color:W.textSec,margin:"2px 0 0"}}>{c.instructor} · {c.modules.length} modules · {c.duration} · ₹{(c.price*83).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:W.greenBg,color:W.greenText,fontWeight:500}}>✓ Live</span>
                        {/* REMOVE BUTTON — removes from student Courses page immediately */}
                        <button onClick={()=>handleDeleteAdminCourse(c.id)} style={{padding:"7px 16px",background:W.redBg,color:W.redText,border:`1px solid #FECACA`,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STATIC COURSES TABLE ── */}
            <p style={{fontSize:13,fontWeight:600,color:W.textSec,marginBottom:10}}>Platform Courses</p>
            <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.2fr 80px 80px 110px",padding:"10px 20px",background:W.grayBg,borderBottom:`1px solid ${W.border}`}}>
                {["Course","Category","Instructor","Students","Status","Actions"].map(h=><span key={h} style={{fontSize:11,color:W.textSec,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</span>)}
              </div>
              {courses.map((c,i)=>(
                <div key={c.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.2fr 80px 80px 110px",padding:"14px 20px",borderTop:i===0?"none":`1px solid ${W.border}`,alignItems:"center",background:W.white}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:8,background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:13,flexShrink:0}}>{c.thumb}</div>
                    <div><p style={{fontSize:13,fontWeight:500,margin:0,color:W.textPrimary}}>{c.title}</p><p style={{fontSize:11,color:W.textHint,margin:0}}>{c.duration}</p></div>
                  </div>
                  <span style={{fontSize:13,color:W.textSec}}>{c.category}</span>
                  <span style={{fontSize:13,color:W.textSec}}>{c.instructor}</span>
                  <span style={{fontSize:13,fontWeight:600,color:W.textPrimary}}>{c.students}</span>
                  <button onClick={()=>handleToggleCourse(c.id)} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:"none",cursor:"pointer",background:c.status==="active"?W.greenBg:W.grayBg,color:c.status==="active"?W.greenText:W.grayText,fontWeight:500}}>{c.status}</button>
                  <button onClick={()=>setDeleteConfirm(c.id)} style={{fontSize:12,padding:"5px 12px",background:W.redBg,color:W.redText,border:"none",borderRadius:7,cursor:"pointer",fontWeight:500}}>Delete</button>
                </div>
              ))}
            </div>

            {deleteConfirm && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
                <div style={{background:W.white,borderRadius:14,padding:28,width:320,border:`1px solid ${W.border}`}}>
                  <p style={{fontSize:15,fontWeight:600,margin:"0 0 8px",color:W.textPrimary}}>Delete this course?</p>
                  <p style={{fontSize:13,color:W.textSec,margin:"0 0 20px",lineHeight:1.6}}>This action cannot be undone.</p>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>handleDeleteCourse(deleteConfirm)} style={{flex:1,background:W.red,color:"#fff",border:"none",borderRadius:8,padding:10,fontSize:13,fontWeight:500,cursor:"pointer"}}>Delete</button>
                    <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:W.grayBg,color:W.textSec,border:`1px solid ${W.border}`,borderRadius:8,padding:10,fontSize:13,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ QUERIES ══ */}
        {activeTab==="queries" && (
          <div>
            <div style={{marginBottom:20}}>
              <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>User Queries & Support</p>
              <p style={{fontSize:13,color:W.textSec,margin:0}}>{openQueries} open · {queries.filter(q=>q.status==="resolved").length} resolved</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:selectedQuery?"1fr 1fr":"1fr",gap:16}}>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {queries.map(q=>{
                  const isNew = q.submittedAt && (Date.now() - new Date(q.submittedAt).getTime()) < 24*60*60*1000 && !SEED_QUERIES.find(s=>s.id===q.id);
                  return (
                  <div key={q.id} onClick={()=>{setSelectedQuery(q);setReplyText("");}} style={{background:W.white,border:selectedQuery?.id===q.id?`2px solid ${W.blue}`:`1px solid ${W.border}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",position:"relative"}}>
                    {isNew && <span style={{position:"absolute",top:10,right:10,background:"#dc2626",color:"white",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,letterSpacing:0.5}}>NEW</span>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>{q.user[0]}</div>
                        <div><p style={{fontSize:13,fontWeight:500,margin:0,color:W.textPrimary}}>{q.user}</p><p style={{fontSize:11,color:W.textHint,margin:0}}>{q.email}</p></div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>{badge(q.priority,q.priority)}{badge(q.status,q.status)}</div>
                    </div>
                    <p style={{fontSize:13,fontWeight:500,margin:"0 0 3px",color:W.textPrimary}}>{q.subject}</p>
                    <p style={{fontSize:12,color:W.textSec,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.message}</p>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                      <p style={{fontSize:11,color:W.textHint,margin:0}}>{q.date}</p>
                      {q.category&&<p style={{fontSize:11,color:W.textHint,margin:0}}>📂 {q.category}</p>}
                    </div>
                  </div>
                  );
                })}
              </div>
              {selectedQuery && (
                <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:22,height:"fit-content"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <p style={{fontSize:14,fontWeight:600,margin:0,color:W.textPrimary}}>Query details</p>
                    <button onClick={()=>setSelectedQuery(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:W.textSec}}>×</button>
                  </div>
                  <div style={{background:W.grayBg,borderRadius:8,padding:14,marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>{selectedQuery.user[0]}</div>
                      <div><p style={{fontSize:13,fontWeight:500,margin:0,color:W.textPrimary}}>{selectedQuery.user}</p><p style={{fontSize:11,color:W.textHint,margin:0}}>{selectedQuery.email} · {selectedQuery.date}</p></div>
                    </div>
                    <p style={{fontSize:13,fontWeight:600,margin:"0 0 6px",color:W.textPrimary}}>{selectedQuery.subject}</p>
                    <p style={{fontSize:13,color:W.textSec,margin:0,lineHeight:1.6}}>{selectedQuery.message}</p>
                  </div>
                  {selectedQuery.reply && (
                    <div style={{background:W.greenBg,border:"1px solid #BBF7D0",borderRadius:8,padding:12,marginBottom:16}}>
                      <p style={{fontSize:11,color:W.greenText,fontWeight:600,margin:"0 0 4px"}}>✅ Reply sent — resolved{selectedQuery.resolvedAt?` on ${new Date(selectedQuery.resolvedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}`:""}</p>
                      <p style={{fontSize:13,color:W.green,margin:0}}>{selectedQuery.reply}</p>
                    </div>
                  )}
                  {selectedQuery.status==="open" && (
                    <div>
                      <label style={{fontSize:12,color:W.textSec,display:"block",marginBottom:6}}>Reply to <strong>{selectedQuery.user}</strong> <span style={{color:W.textHint,fontWeight:400}}>({selectedQuery.email})</span></label>
                      <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your reply here..." rows={4} style={{...inp,resize:"vertical",lineHeight:1.6}}/>
                      <button onClick={()=>handleReply(selectedQuery.id)} style={{marginTop:10,background:W.blue,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        ✉️ Send Reply & Mark Resolved
                      </button>
                      {EMAILJS_SERVICE_ID==="YOUR_SERVICE_ID" && (
                        <p style={{fontSize:11,color:W.textHint,marginTop:6,textAlign:"center",lineHeight:1.5}}>
                          ⚠️ EmailJS not configured — reply saved locally. Fill in <code style={{background:W.grayBg,padding:"1px 5px",borderRadius:4}}>EMAILJS_*</code> constants at top of file to send real emails.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ THIRD PARTY ══ */}
        {activeTab==="thirdparty" && (
          <div>
            <div style={{marginBottom:20}}>
              <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>3rd Party Course Integration</p>
              <p style={{fontSize:13,color:W.textSec,margin:0}}>Review, approve, reject, or remove external company course submissions</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
              {[
                {label:"Pending review",count:thirdParty.filter(t=>t.status==="pending").length, bg:W.amberBg,text:W.amberText,border:"#FDE68A"},
                {label:"Approved",      count:thirdParty.filter(t=>t.status==="approved").length,bg:W.greenBg,text:W.greenText,border:"#BBF7D0"},
                {label:"Rejected",      count:thirdParty.filter(t=>t.status==="rejected").length,bg:W.redBg,  text:W.redText,  border:"#FECACA"},
              ].map(s=>(
                <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:10,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:s.text,fontWeight:500}}>{s.label}</span>
                  <span style={{fontSize:26,fontWeight:700,color:s.text}}>{s.count}</span>
                </div>
              ))}
            </div>
            {thirdParty.length===0 ? (
              <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:48,textAlign:"center"}}>
                <p style={{fontSize:14,color:W.textSec}}>No third party proposals submitted yet.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {thirdParty.map(tp=>{
                  const dc={
                    pending: {bg:W.amberBg,color:W.amberText,border:"#FDE68A"},
                    approved:{bg:W.greenBg,color:W.greenText,border:"#BBF7D0"},
                    rejected:{bg:W.redBg,  color:W.redText,  border:"#FECACA"},
                  }[tp.status]||{bg:W.grayBg,color:W.grayText,border:W.border};
                  return (
                    <div key={tp.id} style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:"16px 20px"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:14,flex:1}}>
                          <div style={{width:44,height:44,borderRadius:10,background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0}}>
                            {tp.logo||tp.company?.[0]||"?"}
                          </div>
                          <div>
                            <p style={{fontSize:14,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>{tp.course}</p>
                            <p style={{fontSize:12,color:W.textSec,margin:"0 0 2px"}}>by <span style={{fontWeight:500,color:W.textPrimary}}>{tp.company}</span> · {tp.category}</p>
                            <div style={{display:"flex",gap:12,fontSize:11,color:W.textHint,flexWrap:"wrap",marginTop:2}}>
                              {tp.modules&&<span>📚 {Array.isArray(tp.modules)?tp.modules.length:tp.modules} modules</span>}
                              {tp.duration&&<span>⏱ {tp.duration}</span>}
                              {tp.price&&<span>💰 ₹{(+tp.price).toLocaleString("en-IN")}</span>}
                              <span>📅 {tp.submitted}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          {/* 👁 View */}
                          <button onClick={()=>{setSelectedTP(tp);setShowTPDetail(true);}} style={{padding:"7px 16px",background:W.blueBg,color:W.blueText,border:`1px solid ${W.blue}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            👁 View
                          </button>
                          {/* 🗑 Remove — deletes from localStorage → course disappears from student page */}
                          <button onClick={()=>handleDeleteTP(tp.id)} style={{padding:"7px 14px",background:W.redBg,color:W.redText,border:"1px solid #FECACA",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            🗑 Remove
                          </button>
                          {/* Status dropdown */}
                          <div style={{position:"relative"}}>
                            <select value={tp.status} onChange={e=>handleTPAction(tp.id,e.target.value)} style={{appearance:"none",WebkitAppearance:"none",padding:"7px 32px 7px 12px",fontSize:13,fontWeight:600,borderRadius:8,border:`1.5px solid ${dc.border}`,background:dc.bg,color:dc.color,cursor:"pointer",outline:"none",fontFamily:"inherit",minWidth:120}}>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:dc.color}}>▼</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TP Detail Modal ── */}
            {showTPDetail&&selectedTP && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
                <div style={{background:W.white,borderRadius:24,maxWidth:680,width:"100%",maxHeight:"88vh",overflow:"auto",boxShadow:"0 24px 48px rgba(0,0,0,0.2)"}}>
                  <div style={{padding:"22px 28px",borderBottom:`1px solid ${W.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:W.white,zIndex:1}}>
                    <div>
                      <h2 style={{fontSize:18,fontWeight:700,color:W.textPrimary,margin:0}}>Course Proposal Details</h2>
                      <p style={{fontSize:12,color:W.textSec,margin:"3px 0 0"}}>Submitted by {selectedTP.company}</p>
                    </div>
                    <button onClick={()=>{setShowTPDetail(false);setSelectedTP(null);}} style={{width:32,height:32,borderRadius:"50%",background:W.grayBg,border:"none",cursor:"pointer",fontSize:18,color:W.textSec}}>×</button>
                  </div>
                  <div style={{padding:"24px 28px"}}>
                    <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:24,padding:20,background:W.grayBg,borderRadius:14}}>
                      <div style={{width:60,height:60,borderRadius:14,background:W.blueBg,color:W.blueText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:24,flexShrink:0}}>
                        {selectedTP.logo||selectedTP.company?.[0]||"?"}
                      </div>
                      <div style={{flex:1}}>
                        <h3 style={{fontSize:20,fontWeight:700,color:W.textPrimary,margin:"0 0 4px"}}>{selectedTP.course}</h3>
                        <p style={{fontSize:13,color:W.textSec,margin:"0 0 8px"}}>by <strong style={{color:W.textPrimary}}>{selectedTP.company}</strong></p>
                        <span style={{display:"inline-block",fontSize:11,padding:"3px 12px",borderRadius:100,fontWeight:600,background:selectedTP.status==="approved"?W.greenBg:selectedTP.status==="rejected"?W.redBg:W.amberBg,color:selectedTP.status==="approved"?W.greenText:selectedTP.status==="rejected"?W.redText:W.amberText}}>
                          {selectedTP.status==="approved"?"✓ Approved":selectedTP.status==="rejected"?"✗ Rejected":"⏳ Pending Review"}
                        </span>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                      {[
                        {label:"Category", value:selectedTP.category||"—"},
                        {label:"Level",    value:selectedTP.level||"—"},
                        {label:"Modules",  value:selectedTP.modules?`${Array.isArray(selectedTP.modules)?selectedTP.modules.length:selectedTP.modules} modules`:"—"},
                        {label:"Duration", value:selectedTP.duration||"—"},
                        {label:"Price",    value:selectedTP.price?`₹${(+selectedTP.price).toLocaleString("en-IN")}`:"—"},
                        {label:"Submitted",value:selectedTP.submitted||"—"},
                      ].map(item=>(
                        <div key={item.label} style={{background:W.grayBg,padding:"12px 14px",borderRadius:10}}>
                          <p style={{fontSize:11,color:W.textHint,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{item.label}</p>
                          <p style={{fontSize:13,fontWeight:600,color:W.textPrimary,margin:0}}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {selectedTP.description && (
                      <div style={{marginBottom:24}}>
                        <p style={{fontSize:12,fontWeight:600,color:W.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Course Description</p>
                        <p style={{fontSize:13,color:W.textPrimary,lineHeight:1.7,margin:0,padding:"14px 16px",background:W.grayBg,borderRadius:10}}>{selectedTP.description}</p>
                      </div>
                    )}
                    <div style={{borderTop:`1px solid ${W.border}`,paddingTop:20}}>
                      <p style={{fontSize:12,fontWeight:600,color:W.textSec,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>Update Status</p>
                      <div style={{display:"flex",gap:10}}>
                        {[
                          {action:"approved",label:"✓ Approve", activeLabel:"✓ Approved",bg:W.green,  aBg:W.greenBg,aC:W.greenText,aB:"#BBF7D0"},
                          {action:"pending", label:"⏳ Pending",activeLabel:"⏳ Pending", bg:W.amberBg,aBg:W.amberBg,aC:W.amberText,aB:"#FDE68A"},
                          {action:"rejected",label:"✗ Reject",  activeLabel:"✗ Rejected", bg:W.red,   aBg:W.redBg,  aC:W.redText,  aB:"#FECACA"},
                        ].map(btn=>{
                          const ia=selectedTP.status===btn.action;
                          return <button key={btn.action} onClick={()=>!ia&&handleTPAction(selectedTP.id,btn.action)} disabled={ia} style={{flex:1,padding:"11px",background:ia?btn.aBg:btn.bg,color:ia?btn.aC:"#fff",border:`1.5px solid ${ia?btn.aB:btn.bg}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:ia?"default":"pointer"}}>{ia?btn.activeLabel:btn.label}</button>;
                        })}
                      </div>
                      {/* 🗑 Remove from Platform — deletes from localStorage immediately */}
                      <button onClick={()=>handleDeleteTP(selectedTP.id)} style={{width:"100%",marginTop:12,padding:"11px",background:W.redBg,color:W.redText,border:`1.5px solid #FECACA`,borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                        🗑 Remove Course from Platform
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TUTOR APPS ══ */}
        {activeTab==="tutor-apps" && (
          <div>
            <div style={{marginBottom:20}}>
              <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>Tutor Applications</p>
              <p style={{fontSize:13,color:W.textSec,margin:0}}>Review and manage tutor applications</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
              {[
                {label:"Pending Review",count:applications.filter(a=>a.status==="pending").length, bg:W.amberBg,text:W.amberText},
                {label:"Approved",      count:applications.filter(a=>a.status==="approved").length,bg:W.greenBg,text:W.greenText},
                {label:"Rejected",      count:applications.filter(a=>a.status==="rejected").length,bg:W.redBg,  text:W.redText  },
              ].map(s=>(
                <div key={s.label} style={{background:s.bg,borderRadius:10,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:s.text,fontWeight:500}}>{s.label}</span>
                  <span style={{fontSize:26,fontWeight:700,color:s.text}}>{s.count}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {applications.length===0 ? (
                <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:48,textAlign:"center"}}>
                  <p style={{fontSize:14,color:W.textSec}}>No tutor applications yet.</p>
                </div>
              ) : applications.map(app=>(
                <div key={app.id} style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
                    <div style={{display:"flex",gap:16,flex:1}}>
                      <div style={{width:56,height:56,borderRadius:12,background:`linear-gradient(135deg,${W.blue},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"white"}}>{app.fullName[0]}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                          <h3 style={{fontSize:16,fontWeight:700,color:W.textPrimary,margin:0}}>{app.fullName}</h3>
                          {badge(app.status,app.status)}
                        </div>
                        <p style={{fontSize:13,color:W.textSec,margin:"0 0 4px"}}>{app.role} · {app.company}</p>
                        <p style={{fontSize:12,color:W.textHint,margin:0}}>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={()=>{setSelectedApp(app);setShowAppDetails(true);}} style={{padding:"8px 20px",background:W.blue,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer"}}>Review Application</button>
                  </div>
                </div>
              ))}
            </div>

            {showAppDetails&&selectedApp && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"20px"}}>
                <div style={{background:W.white,borderRadius:24,maxWidth:700,width:"100%",maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 48px rgba(0,0,0,0.2)"}}>
                  <div style={{padding:"24px 32px",borderBottom:`1px solid ${W.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h2 style={{fontSize:20,fontWeight:700,color:W.textPrimary,margin:0}}>Tutor Application</h2>
                    <button onClick={()=>{setShowAppDetails(false);setSelectedApp(null);}} style={{width:32,height:32,borderRadius:"50%",background:W.grayBg,border:"none",cursor:"pointer",fontSize:18}}>×</button>
                  </div>
                  <div style={{padding:"28px 32px"}}>
                    <div style={{display:"flex",gap:20,marginBottom:24}}>
                      <div style={{width:80,height:80,borderRadius:20,background:`linear-gradient(135deg,${W.blue},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,color:"white"}}>{selectedApp.fullName[0]}</div>
                      <div>
                        <h3 style={{fontSize:22,fontWeight:700,color:W.textPrimary,marginBottom:4}}>{selectedApp.fullName}</h3>
                        <p style={{fontSize:14,color:W.textSec,marginBottom:2}}>{selectedApp.role}</p>
                        <p style={{fontSize:13,color:W.blueText,fontWeight:500}}>{selectedApp.company}</p>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                      {[{label:"Email",value:selectedApp.email},{label:"Phone",value:selectedApp.phone||"Not provided"},{label:"Experience",value:`${selectedApp.experience} years`},{label:"Category",value:selectedApp.category}].map(item=>(
                        <div key={item.label} style={{background:W.grayBg,padding:12,borderRadius:10}}>
                          <p style={{fontSize:11,color:W.textHint,marginBottom:4}}>{item.label}</p>
                          <p style={{fontSize:13,fontWeight:500,color:W.textPrimary,margin:0}}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{marginBottom:20}}>
                      <p style={{fontSize:12,fontWeight:600,color:W.textSec,marginBottom:8}}>BIO</p>
                      <p style={{fontSize:13,color:W.textPrimary,lineHeight:1.6,margin:0}}>{selectedApp.bio}</p>
                    </div>
                    {selectedApp.skills && (
                      <div style={{marginBottom:20}}>
                        <p style={{fontSize:12,fontWeight:600,color:W.textSec,marginBottom:8}}>SKILLS</p>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {selectedApp.skills.split(",").map((s,i)=><span key={i} style={{fontSize:12,padding:"4px 12px",background:W.blueBg,color:W.blueText,borderRadius:20}}>{s.trim()}</span>)}
                        </div>
                      </div>
                    )}
                    {selectedApp.status==="pending" && (
                      <div style={{display:"flex",gap:12,marginTop:16}}>
                        <button onClick={()=>handleApproveApplication(selectedApp)} style={{flex:1,padding:"12px",background:W.green,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>Approve & Add to Tutors</button>
                        <button onClick={()=>handleRejectApplication(selectedApp)} style={{flex:1,padding:"12px",background:W.red,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>Reject Application</button>
                      </div>
                    )}
                    {selectedApp.status!=="pending" && (
                      <div style={{marginTop:16,padding:12,background:selectedApp.status==="approved"?W.greenBg:W.redBg,borderRadius:10,textAlign:"center"}}>
                        <p style={{fontSize:13,fontWeight:500,margin:0,color:selectedApp.status==="approved"?W.greenText:W.redText}}>Application {selectedApp.status} on {new Date(selectedApp.approvedAt||selectedApp.rejectedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ PAYMENTS ══ */}
        {activeTab==="payments" && (
          <div>
            <div style={{marginBottom:20}}>
              <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:W.textPrimary}}>Payment Records</p>
              <p style={{fontSize:13,color:W.textSec,margin:0}}>Course proposal fees paid by third-party partners</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
              {[
                {label:"Total Received",    value:`₹${payments.reduce((a,p)=>a+p.amount,0).toLocaleString("en-IN")}`,bg:W.greenBg,color:W.greenText,border:"#BBF7D0"},
                {label:"Total Transactions",value:payments.length,bg:W.blueBg,color:W.blueText,border:"#BFDBFE"},
                {label:"Pending Payments",  value:thirdParty.filter(tp=>tp.status==="approved"&&tp.payment_status!=="paid").length,bg:W.amberBg,color:W.amberText,border:"#FDE68A"},
              ].map(s=>(
                <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:10,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:s.color,fontWeight:500}}>{s.label}</span>
                  <span style={{fontSize:26,fontWeight:700,color:s.color}}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{background:W.white,border:`1px solid ${W.border}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${W.border}`}}>
                <p style={{fontSize:14,fontWeight:600,margin:0,color:W.textPrimary}}>Payment History</p>
              </div>
              {payments.length===0 ? (
                <div style={{padding:48,textAlign:"center"}}>
                  <p style={{fontSize:14,color:W.textSec}}>No payments received yet.</p>
                  <p style={{fontSize:12,color:W.textHint,marginTop:4}}>Payments will appear here once partners pay for approved courses.</p>
                </div>
              ) : (
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 1fr 1fr 1fr",padding:"10px 20px",background:W.grayBg,borderBottom:`1px solid ${W.border}`}}>
                    {["Course","Company","Amount","Method","Transaction ID","Date"].map(h=><span key={h} style={{fontSize:11,color:W.textSec,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</span>)}
                  </div>
                  {payments.map((pay,i)=>(
                    <div key={pay.txnId} style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 1fr 1fr 1fr",padding:"14px 20px",borderTop:i===0?"none":`1px solid ${W.border}`,alignItems:"center",background:W.white}}>
                      <p style={{fontSize:13,fontWeight:500,margin:0,color:W.textPrimary}}>{pay.courseName}</p>
                      <div><p style={{fontSize:13,margin:0,color:W.textSec}}>{pay.company}</p><p style={{fontSize:11,color:W.textHint,margin:"2px 0 0"}}>{pay.email}</p></div>
                      <span style={{fontSize:14,fontWeight:700,color:W.greenText}}>₹{(+pay.amount).toLocaleString("en-IN")}</span>
                      <div>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:500,background:pay.method==="card"?W.blueBg:W.greenBg,color:pay.method==="card"?W.blueText:W.greenText}}>{pay.method==="card"?"💳 Card":"📱 UPI"}</span>
                        {pay.maskedCard&&<p style={{fontSize:11,color:W.textHint,margin:"4px 0 0"}}>{pay.maskedCard}</p>}
                        {pay.upiId&&<p style={{fontSize:11,color:W.textHint,margin:"4px 0 0"}}>{pay.upiId}</p>}
                      </div>
                      <span style={{fontSize:11,fontFamily:"monospace",color:W.greenText,fontWeight:600}}>{pay.txnId}</span>
                      <span style={{fontSize:12,color:W.textSec}}>{new Date(pay.paidAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                    </div>
                  ))}
                  <div style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:W.grayBg,borderTop:`2px solid ${W.border}`}}>
                    <span style={{fontSize:13,fontWeight:600,color:W.textPrimary,gridColumn:"1/3"}}>Total Received</span>
                    <span style={{fontSize:14,fontWeight:700,color:W.greenText}}>₹{payments.reduce((a,p)=>a+p.amount,0).toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
