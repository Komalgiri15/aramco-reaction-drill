import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaBrain, FaBolt, FaShieldAlt, FaVolumeMute, FaCommentDots, FaQuestionCircle, FaCheckCircle, FaExclamationCircle, FaInbox } from 'react-icons/fa';

const STATEMENTS_EN = [
  "You interrupt people in meetings.",
  "Your tone sounds harsh sometimes.",
  "You don't keep others updated.",
  "You rush through tasks.",
  "You don't listen fully."
];

const STATEMENTS_AR = [
  "أنت تقاطع الناس في الاجتماعات.",
  "نبرة صوتك تبدو قاسية أحياناً.",
  "أنت لا تبقي الآخرين على اطلاع.",
  "أنت تتسرع في إنجاز المهام.",
  "أنت لا تستمع بالكامل."
];

const PHASE_START = 0;
const PHASE_FLASH = 1;
const PHASE_REACTION = 2;
const PHASE_QUICK_FEEDBACK = 3;
const PHASE_ANALYZING = 4;
const PHASE_RESULTS = 5;

function ReactionDrill({ onComplete, lang = 'en' }) {
  const [phase, setPhase] = useState(PHASE_START);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [lastPattern, setLastPattern] = useState(null);

  const TOTAL_ROUNDS = STATEMENTS_EN.length;
  const STATEMENTS = lang === 'ar' ? STATEMENTS_AR : STATEMENTS_EN;

  const handleStart = () => {
    setRound(0);
    setHistory([]);
    triggerNextRound(0);
  };

  const triggerNextRound = (currentRound) => {
    if (currentRound >= TOTAL_ROUNDS) {
      setPhase(PHASE_ANALYZING);
      // Simulate AI analysis for 3 seconds
      setTimeout(() => {
        setPhase(PHASE_RESULTS);
      }, 3000);
      return;
    }
    setPhase(PHASE_FLASH);
    // Increased to 2 seconds per user request
    setTimeout(() => {
      setPhase(PHASE_REACTION);
      setReactionStartTime(Date.now());
    }, 2000);
  };

  const handleReaction = (pattern) => {
    const time = (Date.now() - reactionStartTime) / 1000;
    setLastTime(time);
    setLastPattern(pattern);
    setHistory(prev => [...prev, { pattern, time }]);
    
    setPhase(PHASE_QUICK_FEEDBACK);
    
    // Auto advance after short feedback pulse
    setTimeout(() => {
      const nextR = round + 1;
      setRound(nextR);
      triggerNextRound(nextR);
    }, 1200);
  };

  const getPatternIcon = (p) => {
    if (p === 'defend') return <FaShieldAlt />;
    if (p === 'justify') return <FaQuestionCircle />;
    if (p === 'silent') return <FaVolumeMute />;
    if (p === 'explain') return <FaCommentDots />;
    return <FaBolt />;
  };

  const getPatternLabel = (p) => {
    if (lang === 'ar') {
      if (p === 'defend') return "دفاع";
      if (p === 'justify') return "تبرير";
      if (p === 'silent') return "صمت";
      if (p === 'explain') return "شرح";
    }
    return p.toUpperCase();
  };

  return (
    <div className="card text-center" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {phase === PHASE_START && (
        <div className="text-fade-in">
          <FaBrain style={{ fontSize: '64px', color: 'var(--accent-color)', marginBottom: '20px' }} />
          <h2 style={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: '800' }}>
            {lang === 'en' ? "RAPID REACTION DRILL" : "تدريب رد الفعل السريع"}
          </h2>
          <p style={{ maxWidth: '450px', margin: '15px auto 30px', color: '#666', fontSize: '14px' }}>
            {lang === 'en' 
              ? "Five harsh statements will flash. React instantly using the icons. No thinking allowed." 
              : "ستظهر خمس عبارات قاسية. تفاعل فوراً باستخدام الأيقونات. لا يسمح بالتفكير."}
          </p>
          <button className="btn btn-accent" onClick={handleStart} style={{ padding: '15px 50px', fontSize: '18px', borderRadius: '40px' }}>
            {lang === 'en' ? "START RAPID FIRE" : "بدء الوميض السريع"}
          </button>
        </div>
      )}

      {phase === PHASE_FLASH && (
        <div className="text-fade-in" style={{ padding: '40px' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>
                ROUND {round + 1} / {TOTAL_ROUNDS}
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--primary-color)', fontWeight: '900', lineHeight: '1.2' }}>
                "{STATEMENTS[round]}"
            </h1>
        </div>
      )}

      {phase === PHASE_REACTION && (
        <div className="text-fade-in">
          <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--warning-color)', marginBottom: '30px', letterSpacing: '1px' }}>
            {lang === 'en' ? "SELECT INSTINCTIVE RESPONSE" : "اختر الاستجابة الغريزية"}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <button className="reaction-icon-btn" onClick={() => handleReaction('defend')}>
                <FaShieldAlt />
                <span>{lang === 'en' ? "DEFEND" : "دفاع"}</span>
            </button>
            <button className="reaction-icon-btn" onClick={() => handleReaction('justify')}>
                <FaQuestionCircle />
                <span>{lang === 'en' ? "JUSTIFY" : "تبرير"}</span>
            </button>
            <button className="reaction-icon-btn" onClick={() => handleReaction('silent')}>
                <FaVolumeMute />
                <span>{lang === 'en' ? "SILENT" : "صمت"}</span>
            </button>
            <button className="reaction-icon-btn" onClick={() => handleReaction('explain')}>
                <FaCommentDots />
                <span>{lang === 'en' ? "EXPLAIN" : "شرح"}</span>
            </button>
          </div>
        </div>
      )}

      {phase === PHASE_QUICK_FEEDBACK && (
        <div className="text-fade-in">
            <div style={{ fontSize: '60px', color: 'var(--secondary-color)', marginBottom: '10px' }}>
                {getPatternIcon(lastPattern)}
            </div>
            <h2 style={{ color: 'var(--primary-color)', margin: '0' }}>{lastTime.toFixed(2)}s</h2>
            <p style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {getPatternLabel(lastPattern)}
            </p>
        </div>
      )}

      {phase === PHASE_ANALYZING && (
        <div className="text-fade-in">
           <div className="ai-scanner">
              <FaBrain className="scanning-icon" style={{ color: 'var(--accent-color)' }} />
              <div className="scan-line"></div>
           </div>
           <h3 style={{ color: 'var(--primary-color)', letterSpacing: '2px', fontWeight: '800' }}>
              {lang === 'en' ? "AI ANALYZING DATA..." : "الذكاء الاصطناعي يحلل البيانات..."}
           </h3>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <FaBolt className="pulse-icon" style={{ color: 'var(--warning-color)' }} />
              <FaCheckCircle className="pulse-icon" style={{ color: 'var(--secondary-color)', animationDelay: '0.2s' }} />
              <FaExclamationCircle className="pulse-icon" style={{ color: 'var(--accent-color)', animationDelay: '0.4s' }} />
           </div>
        </div>
      )}

      {phase === PHASE_RESULTS && (
        <div className="text-fade-in results-view">
          <h2 style={{ color: 'var(--primary-color)', fontWeight: '800', marginBottom: '30px' }}>{lang === 'en' ? "DRILL SUMMARY" : "ملخص التدريب"}</h2>
          
          <div className="insight-journey">
            <div className="journey-step">
               <div className="step-icon">
                  <FaInbox style={{ color: 'var(--secondary-color)' }} />
               </div>
               <div className="step-text">
                  <strong>{lang === 'en' ? "INPUT" : "مدخل"}</strong>
                  <p>{lang === 'en' ? "Feedback comes in" : "الملاحظات تدخل"}</p>
               </div>
            </div>
            <div className="journey-line"></div>
            <div className="journey-step">
               <div className="step-icon flash">
                  <FaBolt style={{ color: 'var(--warning-color)' }} />
               </div>
               <div className="step-text">
                  <strong>{lang === 'en' ? "IMPULSE" : "اندفاع"}</strong>
                  <p>{lang === 'en' ? "Reaction comes out" : "رد الفعل يخرج"}</p>
               </div>
            </div>
            <div className="journey-line"></div>
            <div className="journey-step">
               <div className="step-icon brain-glow">
                  <FaBrain style={{ color: 'var(--accent-color)' }} />
               </div>
               <div className="step-text">
                  <strong>{lang === 'en' ? "INSIGHT" : "بصيرة"}</strong>
                  <p>{lang === 'en' ? "Thinking comes later" : "التفكير يأتي لاحقاً"}</p>
               </div>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <button className="btn btn-accent" onClick={() => setPhase(PHASE_START)} style={{ borderRadius: '30px' }}>
              {lang === 'en' ? "RETRY DRILL" : "إعادة المحاولة"}
            </button>
            <button className="btn" onClick={onComplete} style={{ marginLeft: '10px', borderRadius: '30px', background: '#333', color: 'white' }}>
              {lang === 'en' ? "FINISH MODULE" : "إنهاء الوحدة"}
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .reaction-icon-btn {
            background: white;
            border: 2px solid #eee;
            border-radius: 20px;
            padding: 25px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s;
            color: #444;
        }
        .reaction-icon-btn svg {
            font-size: 32px;
            color: var(--primary-color);
        }
        .reaction-icon-btn span {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
        }
        .reaction-icon-btn:hover {
            border-color: var(--secondary-color);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            background: rgba(0, 166, 81, 0.02);
        }
        .reaction-icon-btn:active {
            transform: scale(0.95);
        }

        /* Insight Journey Timeline */
        .insight-journey {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 15px;
            margin: 40px 0;
            padding: 20px;
        }
        .journey-step {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            max-width: 140px;
        }
        .step-icon {
            width: 60px;
            height: 60px;
            background: #f8f8f8;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            border: 2px solid #eee;
            transition: all 0.3s;
        }
        .step-text strong {
            display: block;
            font-size: 11px;
            letter-spacing: 1px;
            color: var(--primary-color);
            margin-bottom: 4px;
        }
        .step-text p {
            font-size: 13px;
            line-height: 1.2;
            color: #666;
            margin: 0;
            font-weight: 700;
        }
        .journey-line {
            width: 30px;
            height: 2px;
            background: #eee;
            margin-top: 30px;
        }

        /* Animations */
        .flash {
            animation: flash-pulse 2s infinite;
            background: rgba(217, 79, 61, 0.1);
            border-color: var(--warning-color);
        }
        .brain-glow {
            animation: brain-pulse 2s infinite;
            background: rgba(200, 160, 74, 0.1);
            border-color: var(--accent-color);
        }

        @keyframes flash-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 79, 61, 0.4); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px 0 rgba(217, 79, 61, 0.2); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 79, 61, 0); }
        }
        @keyframes brain-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200, 160, 74, 0.4); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px 0 rgba(200, 160, 74, 0.2); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200, 160, 74, 0); }
        }

        /* AI Scanner Effects */
        .ai-scanner {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #eee;
            border-radius: 20px;
            overflow: hidden;
            background: #fdfdfd;
        }
        .scanning-icon {
            font-size: 60px;
            animation: scanner-pulse 2s infinite ease-in-out;
        }
        .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--accent-color);
            box-shadow: 0 0 15px var(--accent-color);
            animation: scan-move 2s infinite linear;
            z-index: 2;
        }
        .pulse-icon {
            font-size: 24px;
            animation: icon-pop 1.5s infinite ease-in-out;
        }

        @keyframes scan-move {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        @keyframes scanner-pulse {
            0% { opacity: 0.5; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.5; transform: scale(0.9); }
        }
        @keyframes icon-pop {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.3); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default ReactionDrill;
