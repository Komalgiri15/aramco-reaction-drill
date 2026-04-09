import React, { useState, useEffect } from 'react';
import './index.css';
import ReactionDrill from './components/ReactionDrill';
import ReflectionWorksheet from './components/ReflectionWorksheet';
import BehavioralQuiz from './components/BehavioralQuiz';
import AiChatbot from './components/AiChatbot';
import { FaGamepad, FaClipboardList, FaBrain, FaRegCheckCircle } from 'react-icons/fa';
import initialVideo from './assets/video.mp4';

function App() {
  const [appPhase, setAppPhase] = useState('video'); // 'video', 'dashboard', 'module'
  const [activeTab, setActiveTab] = useState(0);
  const [completedModules, setCompletedModules] = useState([false, false, false]);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const tabs = [
    { title: lang === 'en' ? "REACTION DRILL" : "تدريب رد الفعل", icon: FaGamepad, component: ReactionDrill, desc: lang === 'en' ? "Test your emotional reflexes to tough feedback." : "اختبر ردود أفعالك العاطفية تجاه الملاحظات الصعبة." },
    { title: lang === 'en' ? "REFLECTION WORKSHEET" : "ورقة التأمل", icon: FaClipboardList, component: ReflectionWorksheet, desc: lang === 'en' ? "Analyze and restructure your defensive habits." : "قم بتحليل وإعادة هيكلة عاداتك الدفاعية." },
    { title: lang === 'en' ? "BEHAVIORAL MCQ QUIZ" : "اختبار متعدد الخيارات", icon: FaBrain, component: BehavioralQuiz, desc: lang === 'en' ? "Assess your feedback neuroscience knowledge." : "قم بتقييم معرفتك بعلم أعصاب الملاحظات." }
  ];

  const handleModuleComplete = (index) => {
    const updated = [...completedModules];
    updated[index] = true;
    setCompletedModules(updated);
  };

  const startModule = (index) => {
    setActiveTab(index);
    setAppPhase('module');
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="var(--primary-color)"/>
              <path d="M12 8L7 18H17L12 8Z" fill="white"/>
            </svg>
            ARAMCO
          </div>
          <div className="logo-subtitle">ARAMCO INDIA | LEARNING & DEVELOPMENT</div>
        </div>
        <div className="header-title">
          {lang === 'en' ? "REACTION SPEED DRILL" : "تدريب سرعة رد الفعل"}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>L&D Series | 2026</div>
          <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}>
            {lang === 'en' ? "عربي" : "English"}
          </button>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className="progress-container">
        <div className="progress-tracker">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-text">
          {lang === 'en' ? `Modules Completed: ${completedCount} / 3` : `الوحدات المكتملة: ${completedCount} / 3`}
        </div>
      </div>

      {appPhase === 'dashboard' ? (
        <div className="dashboard-container text-fade-in">
          <div className="text-center">
            <h1 style={{ color: 'var(--primary-color)' }}>
               {lang === 'en' ? "Welcome to the Reaction Speed Drill" : "مرحباً بك في تدريب سرعة رد الفعل"}
            </h1>
            <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
               {lang === 'en' 
                 ? "Master your emotional response to critical feedback through our 3-step cognitive training module."
                 : "أتقن استجابتك العاطفية للملاحظات النقدية من خلال وحدة التدريب المعرفي المكونة من 3 خطوات."}
            </p>
          </div>
          
          <div className="steps-grid">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <div key={index} className="step-card" onClick={() => startModule(index)}>
                  <div>
                    <div className="step-number">{index + 1}</div>
                    <Icon style={{ fontSize: '48px', color: completedModules[index] ? 'var(--success-color)' : 'var(--primary-color)', marginBottom: '15px' }} />
                    <h3 style={{ color: 'var(--primary-color)' }}>{tab.title}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>{tab.desc}</p>
                  </div>
                  <button className={`btn mt-3 ${completedModules[index] ? 'btn-secondary' : 'btn-accent'}`} style={{ width: '100%' }}>
                    {completedModules[index] 
                      ? (lang === 'en' ? "Review" : "مراجعة") 
                      : (lang === 'en' ? "Start Step" : "ابدأ الخطوة")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav className="nav-tabs">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={index} 
                  className={`nav-tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <Icon style={{ fontSize: '18px' }} />
                  {tab.title} 
                  {completedModules[index] && <FaRegCheckCircle style={{ color: 'var(--success-color)' }} />}
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className="main-content">
             <div className="module-container">
               <ActiveComponent onComplete={() => handleModuleComplete(activeTab)} lang={lang} />
             </div>
          </main>
        </>
      )}

      {/* Persistent AI Chatbot */}
      <AiChatbot lang={lang} />

      {/* Footer */}
      <footer className="app-footer">
        <div>© 2026 Aramco Asia India Pvt. Ltd. | Learning & Development Division</div>
        <div className="footer-links">
          <a href="#">{lang === 'en' ? "Privacy" : "الخصوصية"}</a>
          <a href="#">{lang === 'en' ? "Terms" : "الشروط"}</a>
          <a href="#">{lang === 'en' ? "Contact HR" : "اتصل بالموارد البشرية"}</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
