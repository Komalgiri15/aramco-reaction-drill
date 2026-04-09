import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaBrain, FaBolt, FaShieldAlt } from 'react-icons/fa';

const STATEMENTS_EN = [
  "Your report had several errors.",
  "I think someone else should lead this.",
  "You didn't meet the deadline again.",
  "Your communication style can be off-putting.",
  "This work is below the standard we expect.",
  "I got feedback from the team about your attitude."
];

const STATEMENTS_AR = [
  "كان هناك عدة أخطاء في تقريرك.",
  "أعتقد أن شخصًا آخر يجب أن يقود هذا.",
  "لم تلتزم بالموعد النهائي مرة أخرى.",
  "أسلوب تواصلك يمكن أن يكون منفراً.",
  "هذا العمل أقل من المستوى الذي نتوقعه.",
  "تلقيت ملاحظات من الفريق حول موقفك."
];

const PHASE_START = 0;
const PHASE_PULSE = 1;
const PHASE_FLASH = 2;
const PHASE_REACTION = 3;
const PHASE_SPEED_SCORE = 4;
const PHASE_REWIRE = 5;
const PHASE_EXPLANATION = 6;
const PHASE_RESULTS = 7;

function ReactionDrill({ onComplete, lang = 'en' }) {
  const [phase, setPhase] = useState(PHASE_START);
  const [round, setRound] = useState(0);
  const [statementIdx, setStatementIdx] = useState(0);
  
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [instinctiveCounts, setInstinctiveCounts] = useState({ defend: 0, shutdown: 0, panic: 0, reflect: 0 });
  const [rewireScore, setRewireScore] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState('');

  const TOTAL_ROUNDS = 4;

  const STATEMENTS = lang === 'ar' ? STATEMENTS_AR : STATEMENTS_EN;

  useEffect(() => {
    if (phase === PHASE_PULSE) {
      setStatementIdx(Math.floor(Math.random() * STATEMENTS.length));
      const timer = setTimeout(() => setPhase(PHASE_FLASH), 1500);
      return () => clearTimeout(timer);
    }
    
    if (phase === PHASE_FLASH) {
      document.body.style.backgroundColor = '#2c0b0b';
      const timer = setTimeout(() => {
        setPhase(PHASE_REACTION);
        setReactionStartTime(Date.now());
      }, 1200);
      return () => {
        clearTimeout(timer);
        document.body.style.backgroundColor = 'var(--bg-light)';
      };
    }
  }, [phase, STATEMENTS.length]);

  const handleStartRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setPhase(PHASE_RESULTS);
      onComplete();
    } else {
      setPhase(PHASE_PULSE);
    }
  };

  const handleInstinctiveReaction = (type) => {
    const timeTaken = (Date.now() - reactionStartTime) / 1000;
    setReactionTime(timeTaken);
    setInstinctiveCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setPhase(PHASE_SPEED_SCORE);
  };

  const handleRewireChoice = (choice, points, explanation) => {
    setRewireScore(prev => prev + points);
    setCurrentExplanation(explanation);
    setPhase(PHASE_EXPLANATION);
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setPhase(PHASE_START);
  };

  let maxCount = -1;
  let patternLabelEn = "";
  let patternLabelAr = "";
  for (const [key, val] of Object.entries(instinctiveCounts)) {
    if (val > maxCount) {
      maxCount = val;
      if (key === 'defend') { patternLabelEn = "Ego Shield Mode"; patternLabelAr = "وضع درع الأنا"; }
      if (key === 'shutdown') { patternLabelEn = "Withdrawal Mode"; patternLabelAr = "وضع الانسحاب"; }
      if (key === 'panic') { patternLabelEn = "Threat Overdrive"; patternLabelAr = "تجاوز التهديد"; }
      if (key === 'reflect') { patternLabelEn = "Feedback Intelligence Active"; patternLabelAr = "ذكاء الملاحظات نشط"; }
    }
  }
  const patternLabel = lang === 'en' ? patternLabelEn : patternLabelAr;

  let badge = "";
  if (rewireScore <= 40) badge = lang === 'en' ? "🥉 Reactive Reflex" : "🥉 انعكاس تفاعلي";
  else if (rewireScore <= 70) badge = lang === 'en' ? "🥈 Aware Processor" : "🥈 معالج واعي";
  else badge = lang === 'en' ? "🥇 Feedback Agile" : "🥇 رشيق الملاحظات";

  return (
    <div className="card text-center" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {phase === PHASE_START && (
        <div className="text-fade-in" style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-color)' }}>
            <FaBrain style={{ fontSize: '48px', filter: 'drop-shadow(0 0 10px rgba(200,160,74,0.5))' }} />
          </div>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '32px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', textShadow: 'var(--glow-primary)' }}>
            {lang === 'en' ? "THE TRIGGER FLASH" : "وميض المحفز"}
          </h2>
          <p className="mb-2" style={{ maxWidth: '500px', margin: '0 auto 30px', fontSize: '15px', color: '#ccc' }}>
            {lang === 'en' ? "Simulate the speed at which we emotionally react to feedback before our rational brain can process it." : "محاكاة السرعة التي نتفاعل بها عاطفياً مع الملاحظات قبل أن يتمكن دماغنا العقلاني من معالجتها."}
          </p>
          
          <div className="mb-3" style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '150px', alignItems: 'center' }}>
            <div className="radar-sweep" style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 166, 81, 0.4) 100%)', border: '2px solid rgba(0, 166, 81, 0.2)' }}></div>
            <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(200, 160, 74, 0.3)' }}></div>
            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(200, 160, 74, 0.5)' }}></div>
            <FaBolt style={{ position: 'absolute', fontSize: '24px', color: 'var(--warning-color)', filter: 'drop-shadow(0 0 10px rgba(217, 79, 61, 0.8))' }} />
          </div>

          <button className="btn btn-accent" onClick={handleStartRound} style={{ padding: '20px 40px', fontSize: '18px', borderRadius: '30px', margin: '20px 0' }}>
            {round === 0 
              ? <><FaPlay /> {lang === 'en' ? "INITIATE DRILL" : "تفعيل التدريب"}</>
              : <><FaPlay /> {lang === 'en' ? `START ROUND ${round + 1} OF ${TOTAL_ROUNDS}` : `ابدأ الجولة ${round + 1} من ${TOTAL_ROUNDS}`}</>}
          </button>
        </div>
      )}

      {phase === PHASE_PULSE && (
        <div style={{ animation: 'pulse 1s infinite' }}>
          <h3>{lang === 'en' ? "Get Ready..." : "استعد..."}</h3>
          <p>{lang === 'en' ? "Read the statement that flashes next." : "اقرأ العبارة التي ستومض تالياً."}</p>
        </div>
      )}

      {phase === PHASE_FLASH && (
        <div style={{ backgroundColor: 'var(--bg-dark)', padding: '50px', borderRadius: '8px', border: '5px solid var(--warning-color)' }}>
          <h2 style={{ color: 'white', fontSize: '24px', letterSpacing: '1px' }}>"{STATEMENTS[statementIdx]}"</h2>
        </div>
      )}

      {phase === PHASE_REACTION && (
        <div>
          <h3 className="mb-2" style={{ color: 'var(--warning-color)' }}>{lang === 'en' ? "WHAT IS YOUR FIRST INSTINCT?" : "ما هي غريزتك الأولى؟"}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
            <button className="btn btn-secondary" onClick={() => handleInstinctiveReaction('defend')}>{lang === 'en' ? "😤 Defend" : "😤 الدفاع"}</button>
            <button className="btn btn-secondary" onClick={() => handleInstinctiveReaction('shutdown')}>{lang === 'en' ? "😶 Shut Down" : "😶 الانغلاق"}</button>
            <button className="btn btn-secondary" onClick={() => handleInstinctiveReaction('panic')}>{lang === 'en' ? "😰 Panic" : "😰 الذعر"}</button>
            <button className="btn btn-secondary" onClick={() => handleInstinctiveReaction('reflect')}>{lang === 'en' ? "🤔 Reflect" : "🤔 التأمل"}</button>
          </div>
        </div>
      )}

      {phase === PHASE_SPEED_SCORE && (
        <div>
          <h2 style={{ color: 'var(--primary-color)' }}>{lang === 'en' ? "SPEED SCORE" : "درجة السرعة"}</h2>
          <h1 style={{ fontSize: '48px', color: 'var(--warning-color)', margin: '20px 0' }}>{reactionTime.toFixed(2)}s</h1>
          <p className="mb-2">
            {lang === 'en' ? 
              <>Your brain reacted in <strong>{reactionTime.toFixed(2)} seconds</strong> &mdash; before your prefrontal cortex could fully process this.</> : 
              <>استجاب دماغك في <strong>{reactionTime.toFixed(2)} ثانية</strong> &mdash; قبل أن تتمكن قشرتك الجبهية من معالجة هذا بالكامل.</>}
          </p>
          <div className="mb-3" style={{ padding: '15px', background: 'rgba(217, 79, 61, 0.1)', borderRadius: '8px', display: 'inline-block' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)' }}>{lang === 'en' ? "Reaction Pattern" : "نمط رد الفعل"}:</span><br/>
            <strong style={{ fontSize: '18px', color: 'var(--warning-color)' }}>{patternLabel}</strong>
          </div>
          <div>
            <button className="btn" onClick={() => setPhase(PHASE_REWIRE)}>{lang === 'en' ? "Go to Re-wire Phase" : "انتقل إلى مرحلة إعادة البرمجة"}</button>
          </div>
        </div>
      )}

      {phase === PHASE_REWIRE && (
        <div>
           <div className="card-header-gradient" style={{ margin: '-30px -30px 20px -30px', padding: '20px' }}>
             <h3>{lang === 'en' ? "REWIRE THE REACTION" : "إعادة برمجة رد الفعل"}</h3>
             <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>{lang === 'en' ? "You have 5 full seconds. Let your prefrontal cortex take over." : "لديك 5 ثوان كاملة. دع قشرتك الجبهية تتولى الأمر."}</p>
           </div>
           
           <div style={{ padding: '30px', backgroundColor: 'var(--bg-light)', borderRadius: '8px', marginBottom: '20px', borderLeft: lang === 'en' ? '4px solid var(--secondary-color)' : 'none', borderRight: lang === 'ar' ? '4px solid var(--secondary-color)' : 'none' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>"{STATEMENTS[statementIdx]}"</h3>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
             <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', textAlign: lang === 'ar' ? 'right' : 'left' }}
               onClick={() => handleRewireChoice('ask', 25, lang === 'en' ? "Asking a clarifying question shifts your brain from threat detection to curiosity, reducing amygdala activation." : "طرح سؤال توضيحي يحول دماغك من اكتشاف التهديدات إلى الفضول، مما يقلل من تنشيط اللوزة الدماغية.")}>
               {lang === 'en' ? "Ask a clarifying question" : "اطرح سؤالا توضيحيا"}
             </button>
             <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', textAlign: lang === 'ar' ? 'right' : 'left' }}
               onClick={() => handleRewireChoice('breathe', 25, lang === 'en' ? "Deep breathing directly signals the vagus nerve to calm the nervous system and lower cortisol." : "التنفس العميق يشير مباشرة إلى العصب المبهم لتهدئة الجهاز العصبي وخفض الكورتيزول.")}>
               {lang === 'en' ? "Breathe and acknowledge" : "تأمل واعترف"}
             </button>
             <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', textAlign: lang === 'ar' ? 'right' : 'left' }}
               onClick={() => handleRewireChoice('separate', 25, lang === 'en' ? "Separating behaviour from identity prevents the feedback from being registered as a social survival threat." : "فصل السلوك عن الهوية يمنع من تفسير الملاحظات كتهديد للبقاء الاجتماعي.")}>
               {lang === 'en' ? "Separate behaviour from identity" : "افصل السلوك عن الهوية"}
             </button>
             <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', textAlign: lang === 'ar' ? 'right' : 'left' }}
               onClick={() => handleRewireChoice('thank', 25, lang === 'en' ? "Thanking them acknowledges the gift of feedback, overriding defensive barriers and establishing psychological safety." : "شكرهم يعترف بهدية الملاحظات، متجاوزاً حواجز الدفاع ومؤسساً للأمان النفسي.")}>
               {lang === 'en' ? "Thank them and reflect later" : "اشكرهم وتأمل لاحقا"}
             </button>
           </div>
        </div>
      )}

      {phase === PHASE_EXPLANATION && (
        <div>
          <h3 style={{ color: 'var(--secondary-color)' }}>🧠 {lang === 'en' ? "Neuroscience Insight" : "رؤية علم الأعصاب"}</h3>
          <p style={{ fontSize: '18px', margin: '20px auto', maxWidth: '600px', lineHeight: '1.5' }}>
            {currentExplanation}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--secondary-color)" strokeWidth="3" />
              <path d="M30 50 L45 65 L70 35" fill="none" stroke="var(--secondary-color)" strokeWidth="5" />
            </svg>
          </div>
          <button className="btn" onClick={nextRound}>
            {round + 1 >= TOTAL_ROUNDS ? (lang === 'en' ? "SEE FINAL RESULTS" : "رؤية النتائج النهائية") : (lang === 'en' ? "NEXT ROUND" : "الجولة التالية")}
          </button>
        </div>
      )}

      {phase === PHASE_RESULTS && (
        <div>
          <div className="card-header-gradient" style={{ margin: '-30px -30px 20px -30px', padding: '30px' }}>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{lang === 'en' ? "TRAINING COMPLETE" : "اكتمل التدريب"}</h2>
          </div>
          <p>{lang === 'en' ? "Your Reflection Score:" : "درجة التأمل الخاصة بك:"} <strong>{rewireScore} / 100</strong></p>
          
          <div style={{ 
            backgroundColor: 'var(--bg-dark)', 
            color: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            margin: '20px auto',
            maxWidth: '400px'
          }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, margin: 0 }}>{lang === 'en' ? "Final Badge" : "الشارة النهائية"}</p>
            <h2 style={{ color: 'var(--accent-color)', fontSize: '32px', margin: '10px 0 0 0' }}>{badge}</h2>
          </div>
          
          <p className="mb-3" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
            {lang === 'en' ? "Dominant Instinctive Pattern tracked mostly as:" : "نمط الغريزة المهيمن متتبع في الغالب كـ:"} <strong style={{color: 'var(--warning-color)'}}>{patternLabel}</strong>.<br/>
            {lang === 'en' ? "Remember, your initial physical reaction is biological and automatic. Excellence comes from how quickly you can engage your prefrontal cortex to process the feedback constructively!" : "تذكر، رد فعلك الجسدي الأولي بيولوجي وتلقائي. التميز يأتي من مدى سرعتك في إشراك قشرتك الجبهية لمعالجة الملاحظات بشكل بناء!"}
          </p>

          <button className="btn btn-accent" onClick={() => {
            setRound(0);
            setRewireScore(0);
            setInstinctiveCounts({ defend: 0, shutdown: 0, panic: 0, reflect: 0 });
            setPhase(PHASE_START);
          }}>{lang === 'en' ? "Practice Again" : "تدرب مرة أخرى"}</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}} />
    </div>
  );
}

export default ReactionDrill;
