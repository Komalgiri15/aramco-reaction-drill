import React, { useState, useEffect } from 'react';
import './index.css';
import ReactionDrill from './components/ReactionDrill';
import ReflectionWorksheet from './components/ReflectionWorksheet';
import BehavioralQuiz from './components/BehavioralQuiz';
import AiChatbot from './components/AiChatbot';
import { FaGamepad, FaClipboardList, FaBrain, FaRegCheckCircle, FaHandPointer } from 'react-icons/fa';
import initialVideo from './assets/video.mp4';

import card1Gif from './assets/card1.gif';
import card2Gif from './assets/Card2.gif';
import card3Gif from './assets/card3.gif';
import aramcoLogo from './assets/aramco-1.svg';

function App() {
  const [appPhase, setAppPhase] = useState('video'); // 'video', 'dashboard', 'module'
  const [activeTab, setActiveTab] = useState(0);
  const [completedModules, setCompletedModules] = useState([false, false, false]);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const tabs = [
    { 
      title: lang === 'en' ? "REACTION SPEED DRILL" : "تدريب سرعة رد الفعل", 
      imageUrl: card1Gif, 
      component: ReactionDrill, 
      desc: lang === 'en' ? "Testing your instinctive biological reflex." : "اختبار رد الفعل البيولوجي الغريزي." 
    },
    { 
      title: lang === 'en' ? "COGNITIVE ASSESSMENT" : "التقييم المعرفي", 
      imageUrl: card2Gif, 
      component: BehavioralQuiz, 
      desc: lang === 'en' ? "Measuring your feedback intelligence." : "قياس ذكاء ردود الفعل." 
    },
    {
      title: lang === 'en' ? "BEHAVIORAL REWIRE" : "إعادة البرمجة السلوكية",
      imageUrl: card3Gif,
      component: ReflectionWorksheet,
      desc: lang === 'en' ? "Reframing the internal reaction chain." : "إعادة صياغة سلسلة رد الفعل الداخلية."
    }
  ];

  const handleModuleComplete = (index) => {
    const updated = [...completedModules];
    updated[index] = true;
    setCompletedModules(updated);

    // Auto-initialize the next mission
    if (index < tabs.length - 1) {
      setActiveTab(index + 1);
      // We stay in 'module' phase, but changing activeTab will swap the component thanks to the 'key'
    } else {
      setAppPhase('dashboard');
    }
  };

  const [pendingModuleIndex, setPendingModuleIndex] = useState(null);

  const instructions = [
    {
      label: lang === 'en' ? "BIOLOGICAL REFLEX" : "رد الفعل البيولوجي",
      title: lang === 'en' ? "Mission 01: Reaction Speed Drill" : "المهمة ٠١: تدريب سرعة رد الفعل",
      subtitle: lang === 'en' ? "Feedback comes in. Reaction comes out. Thinking comes later. React instantly—no thinking allowed." : "الملاحظات تدخل، رد الفعل يخرج، والتفكير يأتي لاحقاً. تفاعل فوراً - لا يسمح بالتفكير.",
      pills: lang === 'en' ? ["RAPID FIRE", "NO FILTER", "AUTOMATIC"] : ["إطلاق سريع", "بدون تصفية", "تلقائي"]
    },
    { 
      label: lang === 'en' ? "COGNITIVE MAPPING" : "رسم الخرائط المعرفية",
      title: lang === 'en' ? "Mission 02: Intelligence Check" : "المهمة ٠٢: فحص الذكاء",
      subtitle: lang === 'en' ? "Test your knowledge of the brain's reaction patterns and feedback neuroscience." : "اختبر معلوماتك حول أنماط ردود فعل الدماغ وعلم الأعصاب للملاحظات.",
      pills: lang === 'en' ? ["10 QUESTIONS", "BRAIN SCIENCE", "IQ CHECK"] : ["١٠ أسئلة", "علوم الدماغ", "فحص الذكاء"]
    },
    {
      label: lang === 'en' ? "BEHAVIORAL REWIRE" : "إعادة البرمجة السلوكية",
      title: lang === 'en' ? "Mission 03: The Reframe" : "المهمة ٠٣: إعادة الصياغة",
      subtitle: lang === 'en' ? "Feedback triggers emotion. Emotion drives thinking. Thinking drives reaction. Let's slow down and reflect." : "الملاحظات تثير العاطفة، العاطفة تحرك التفكير، والتفكير يوجه رد الفعل. دعونا نبطئ ونتأمل.",
      pills: lang === 'en' ? ["DEEP REFLECTION", "ROADMAP", "COMMITMENT"] : ["تأمل عميق", "خارطة طريق", "التزام"]
    }
  ];

  const startModulePress = (index) => {
    setPendingModuleIndex(index);
  };

  const confirmStartModule = (index) => {
    setActiveTab(index);
    setAppPhase('module');
    setPendingModuleIndex(null);
  };

  if (appPhase === 'video') {
    return (
      <div className="fullscreen-video-container">
        <video
          src={initialVideo}
          autoPlay
          muted
          playsInline
          onEnded={() => setAppPhase('dashboard')}
        />
        <button className="skip-btn" onClick={() => setAppPhase('dashboard')}>
          {lang === 'en' ? "Skip Video" : "تخطي الفيديو"}
        </button>
      </div>
    );
  }

  const ActiveComponent = tabs[activeTab].component;
  const completedCount = completedModules.filter(c => c).length;
  const progressPercent = (completedCount / tabs.length) * 100;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-area" style={{ cursor: 'pointer' }} onClick={() => setAppPhase('dashboard')}>
          <div className="logo-arca">
            <img src={aramcoLogo} alt="Aramco" style={{ height: '35px', marginRight: '10px' }} />
          </div>
          <div className="logo-subtitle">ARAMCO | LEARNING & DEVELOPMENT</div>
        </div>
        <div className="header-title">
          <div style={{ fontSize: '20px', fontWeight: '800' }}>{lang === 'en' ? "Welcome to the Reaction Speed Drill" : "مرحباً بك في تدريب سرعة رد الفعل"}</div>
          <div style={{ fontSize: '11px', fontWeight: '500', opacity: 0.9, textTransform: 'none', letterSpacing: '0.5px', marginTop: '4px' }}>
            {lang === 'en'
              ? "Master your emotional response through our 3-step cognitive training module."
              : "أتقن استجابتك العاطفية من خلال وحدة التدريب المعرفي المكونة من 3 خطوات."}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>L&D Series | 2026</div>
          <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}>
            {lang === 'en' ? "عربي" : "English"}
          </button>
        </div>
      </header>

      {/* Progress Tracker Vertical Sidebar */}
      <div className="progress-container">
        <div className="progress-tracker">
          <div className="progress-bar" style={{ height: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-text">
          {lang === 'en' ? `Modules Completed: ${completedCount} / 3` : `الوحدات المكتملة: ${completedCount} / 3`}
        </div>
      </div>

      {appPhase === 'dashboard' ? (
        <div className="dashboard-container text-fade-in" style={{ paddingTop: '20px' }}>
          <div className="mission-map">
            {/* Smooth Horizontal Organic Path SVG */}
            <svg className="mission-path" viewBox="0 0 1000 400" fill="none" preserveAspectRatio="none">
              <path
                d="M100 230 C 300 100, 600 50, 900 250"
                stroke="var(--secondary-color)"
                strokeWidth="4"
                strokeDasharray="15 15"
                opacity="0.8"
              />
            </svg>

            <div className="mission-grid">
              {tabs.map((tab, index) => {
                const tilts = ['-3deg', '4deg', '-2deg'];
                const positions = [
                  { left: '5%', top: '120px' },
                  { left: '40%', top: '40px' },
                  { left: '75%', top: '150px' }
                ];

                return (
                  <div
                    key={index}
                    className={`mission-card-wrapper ${completedModules[index] ? 'completed' : ''}`}
                    style={{
                      position: 'absolute',
                      ...positions[index],
                      transform: `rotate(${tilts[index]})`,
                      width: '220px'
                    }}
                    onClick={() => startModulePress(index)}
                  >
                    <div className="mission-polaroid">
                      <div className="polaroid-image">
                        <img
                          src={tab.imageUrl}
                          alt={tab.title}
                        />
                        {completedModules[index] && (
                          <div className="mission-status-stamp">COMPLETED</div>
                        )}
                      </div>
                      <div className="polaroid-content">
                        <div className="mission-id">MISSION 0{index + 1}</div>
                        <h3 className="mission-title">{tab.title}</h3>
                        <p className="mission-desc">{tab.desc}</p>
                      </div>

                      <div className="pin-marker"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav className="nav-tabs">
            {tabs.map((tab, index) => {
              return (
                <button
                  key={index}
                  className={`nav-tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => startModulePress(index)}
                >
                  <img src={tab.imageUrl} alt="" style={{ height: '24px', marginRight: lang === 'ar' ? '0' : '10px', marginLeft: lang === 'ar' ? '10px' : '0' }} />
                  {tab.title}
                  {completedModules[index] && <FaRegCheckCircle style={{ color: 'var(--success-color)' }} />}
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className="main-content">
            <div className="module-container">
              <ActiveComponent 
                key={activeTab} 
                onComplete={() => handleModuleComplete(activeTab)} 
                lang={lang} 
              />
            </div>
          </main>
        </>
      )}

      {/* Persistent AI Chatbot */}
      <AiChatbot lang={lang} />

      {/* Footer */}
      <footer className="app-footer" style={{ justifyContent: 'center' }}>
        <div>© 2026 Aramco | Learning & Development Division</div>
      </footer>

      {/* Instruction Modal Overlay */}
      {pendingModuleIndex !== null && (
        <div className="modal-overlay text-fade-in" onClick={() => setPendingModuleIndex(null)}>
          <div className="instruction-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-pills-container">
              {instructions[pendingModuleIndex].pills.map((pill, i) => (
                <div key={i} className={`modal-pill ${i === 1 ? 'modal-pill-active' : ''}`}>
                  {pill}
                  {i === 1 && <FaRegCheckCircle style={{ marginLeft: lang === 'ar' ? '0' : '8px', marginRight: lang === 'ar' ? '8px' : '0' }} />}
                </div>
              ))}
            </div>

            <div className="modal-label">{instructions[pendingModuleIndex].label}</div>

            <h2 className="modal-title">{instructions[pendingModuleIndex].title}</h2>
            <p className="modal-subtitle">{instructions[pendingModuleIndex].subtitle}</p>

            <button className="modal-start-btn" onClick={() => confirmStartModule(pendingModuleIndex)}>
              {lang === 'en' ? "ENTER MISSION" : "بـدء المهمـة"}
            </button>

            <div className="hand-indicator">
              <FaHandPointer />
            </div>

            <div className="modal-footer-text">
              {lang === 'en' ? "LINK ACTIVE IN 5S" : "الرابط نشط في 5 ثوانٍ"}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
