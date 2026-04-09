import React, { useState } from 'react';
import { FaHeart, FaBrain, FaBolt, FaSync, FaLightbulb, FaCheckCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

function ReflectionWorksheet({ onComplete, lang = 'en' }) {
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commitment, setCommitment] = useState("");
  const [formState, setFormState] = useState({
    emotionDesc: "",
    intensity: 5,
    dominantEmotion: "",
    thought: "",
    accuracy: 5,
    story: "",
    reactions: [],
    breakChain: "",
    reframing: "",
    anchor: ""
  });

  const TOTAL_STEPS = 6;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
    onComplete();
  };

  const t = {
    phases: lang === 'en' 
        ? ["EMOTION", "THOUGHT", "REACTION", "INSIGHT", "REFRAME", "COMMIT"]
        : ["العاطفة", "الفكر", "رد الفعل", "البصيرة", "إعادة الصياغة", "الالتزام"],
    q1: lang === 'en' ? "What was the very first thing you FELT?" : "ما هو أول شيء شعرت به؟",
    q2: lang === 'en' ? "Rate the intensity of discomfort (1-10)" : "قيم شدة عدم الارتياح (١-١٠)",
    q3: lang === 'en' ? "Select dominant emotion:" : "اختر العاطفة المهيمنة:",
    emotions: lang === 'en' 
      ? ["Select...", "Uncomfortable", "Frustrated", "Judged", "Angry", "Fearful", "Defensive"]
      : ["اختر...", "غير مرتاح", "محباط", "محكوم علي", "غاضب", "خائف", "دفاعي"],
    q4: lang === 'en' ? "What went through your mind in that moment?" : "ماذا دار في ذهنك في تلك اللحظة؟",
    q5: lang === 'en' ? "How accurate was that thought in hindsight?" : "ما مدى دقة ذلك التفكير لاحقاً؟",
    q6: lang === 'en' ? "What 'Story' did your brain tell you about the person?" : "ما هي 'القصة' التي رواها لك دماغك عن الشخص؟",
    q7: lang === 'en' ? "What did you actually DO next?" : "ماذا فعلت فعلياً بعد ذلك؟",
    defenses: lang === 'en'
      ? ['Defending', 'Justifying', 'Silent', 'People-pleasing', 'Counter-attacking']
      : ['الدفاع', 'التبرير', 'الصمت', 'إرضاء الناس', 'الهجوم المضاد'],
    q8: lang === 'en' ? "Where can you break this chain next time?" : "أين يمكنك كسر هذه السلسلة في المرة القادمة؟",
    q9: lang === 'en' ? "What would an 'Agile' version of you do?" : "ماذا ستفعل النسخة 'الرشيقة' منك؟",
    q10: lang === 'en' ? "Identify ONE physical anchor to slow down." : "حدد مرساة جسدية واحدة للإبطاء.",
    q11: lang === 'en' ? "Personal Commitment:" : "التزام شخصي:",
    q11Sub: lang === 'en' ? "\"Next time I receive tough feedback, I will...\"" : "\"في المرة القادمة التي أتلقى فيها ملاحظات صعبة، سأقوم بـ...\"",
    finish: lang === 'en' ? "GENERATE ROADMAP" : "إنشاء خارطة الطريق"
  };

  if (isSubmitted) {
    const roadmapSteps = [
      { key: "EMOTION", title: lang === 'en' ? "THE TRIGGER" : "المحفز", data: formState.emotionDesc, subData: `Intensity: ${formState.intensity}/10`, icon: <FaHeart />, color: "#39A646" },
      { key: "THOUGHT", title: lang === 'en' ? "THE OLD STORY" : "القصة القديمة", data: formState.thought, subData: formState.story, icon: <FaBrain />, color: "#0F79B9" },
      { key: "REACTION", title: lang === 'en' ? "AUTOMATIC PATTERN" : "النمط التلقائي", data: formState.reactions.join(", "), icon: <FaBolt />, color: "#D94F3D" },
      { key: "REFRAME", title: lang === 'en' ? "THE NEW REFRAME" : "إعادة الصياغة الجديدة", data: formState.reframing, icon: <FaSync />, color: "#C8A04A" },
      { key: "ANCHOR", title: lang === 'en' ? "YOUR SHIFT ANCHOR" : "مرساة التحول", data: formState.anchor, icon: <FaLightbulb />, color: "#1A1A1A" },
      { key: "COMMIT", title: lang === 'en' ? "PERSONAL COMMITMENT" : "الالتزام الشخصي", data: commitment, icon: <FaCheckCircle />, color: "#0A1A2F" }
    ];

    return (
      <div className="roadmap-zig-zag-container text-fade-in" style={{ padding: '40px 20px', backgroundColor: '#fdfdfd', borderRadius: '24px', boxShadow: '0 4px 40px rgba(0,0,0,0.05)', position: 'relative' }}>
        <div className="text-center" style={{ marginBottom: '60px' }}>
           <h2 style={{ fontSize: '28px', color: 'var(--primary-color)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{lang === 'en' ? "Your Behavioral Agility Map" : "خارطة طريق الرشاقة السلوكية"}</h2>
           <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '600px', margin: '15px auto' }}>{lang === 'en' ? "Follow the path below to navigate your next feedback interaction." : "اتبع المسار أدناه للتنقل في تفاعلك القادم مع الملاحظات."}</p>
        </div>

        <div className="timeline-journey">
          {/* Vertical Spine */}
          <div className="timeline-spine"></div>

          {roadmapSteps.map((stepData, index) => {
            const isLeft = index % 2 === 0;
            return (
               <div key={index} className={`timeline-node ${isLeft ? 'node-left' : 'node-right'}`}>
                  
                  {/* Step Label */}
                  <div className="node-step-info">
                     <span className="label-txt">STEP</span>
                     <span className="label-val">0{index + 1}</span>
                  </div>

                  {/* Marker on Line */}
                  <div className="node-marker" style={{ borderColor: stepData.color }}>
                     <div className="marker-inner" style={{ backgroundColor: stepData.color }}></div>
                  </div>

                  {/* Content Pill Card */}
                  <div className="node-card" style={{ borderLeft: isLeft ? `6px solid ${stepData.color}` : 'none', borderRight: !isLeft ? `6px solid ${stepData.color}` : 'none' }}>
                     <div className="node-card-icon" style={{ backgroundColor: stepData.color }}>
                        {stepData.icon}
                     </div>
                     <div className="node-card-content">
                        <div className="node-card-title" style={{ color: stepData.color }}>{stepData.title}</div>
                        <div className="node-card-data">{stepData.data || "---"}</div>
                        {stepData.subData && <div className="node-card-sub">{stepData.subData}</div>}
                     </div>
                  </div>

               </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" style={{ borderRadius: '30px', padding: '12px 30px' }} onClick={() => setIsSubmitted(false)}>
            {lang === 'en' ? "EDIT ANSWERS" : "تعديل الإجابات"}
          </button>
          <button className="btn" style={{ borderRadius: '30px', padding: '12px 40px', background: 'var(--primary-color)' }} onClick={handlePrint}>
            {lang === 'en' ? "EXPORT PDF" : "تصدير إلى PDF"}
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
            .timeline-journey { position: relative; max-width: 850px; margin: 0 auto; padding: 20px 0; }
            .timeline-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background-image: linear-gradient(to bottom, #ddd 50%, rgba(255,255,255,0) 0%); background-position: center; background-size: 2px 15px; background-repeat: repeat-y; transform: translateX(-50%); z-index: 1; }
            .timeline-node { display: flex; align-items: center; margin-bottom: 60px; position: relative; z-index: 2; width: 100%; transition: all 0.3s; }
            .node-left { flex-direction: row; }
            .node-right { flex-direction: row-reverse; }
            .node-marker { width: 24px; height: 24px; background: white; border: 2px solid #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; margin: 0 40px; }
            .marker-inner { width: 10px; height: 10px; border-radius: 50%; }
            .node-card { flex: 1; background: white; padding: 20px 25px; border-radius: 15px; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
            .node-card-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .node-card-content { flex: 1; text-align: left; }
            .node-node-right .node-card-content { text-align: left; }
            .node-card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; }
            .node-card-data { font-size: 15px; font-weight: 700; color: #333; line-height: 1.4; }
            .node-card-sub { font-size: 11px; color: #888; margin-top: 4px; font-weight: 500; }
            .node-step-info { width: 100px; display: flex; flex-direction: column; }
            .node-left .node-step-info { text-align: right; }
            .node-right .node-step-info { text-align: left; }
            .label-txt { font-size: 11px; font-weight: 900; color: #bbb; letter-spacing: 2px; }
            .label-val { font-size: 44px; font-weight: 900; color: #0A1A2F; line-height: 1; opacity: 0.15; }
            @media (max-width: 768px) {
               .timeline-spine { left: 30px; transform: none; }
               .timeline-node { flex-direction: row !important; margin-bottom: 40px; }
               .node-marker { margin: 0 20px 0 10px; }
               .node-step-info { display: none; }
               .node-card { padding: 15px; gap: 15px; }
            }
        `}} />
      </div>
    );
  }

  return (
    <div className="card worksheet-interactive" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
       
       <div className="worksheet-stepper">
          {t.phases.map((phase, i) => (
             <div key={i} className={`step-dot ${i <= step ? 'active' : ''}`}>
                <div className="dot-circle">{i + 1}</div>
                <span>{phase}</span>
             </div>
          ))}
       </div>

       <div className="step-content text-fade-in" style={{ flex: 1, padding: '20px 0' }}>
          {step === 0 && (
             <div>
                <div className="phase-header">
                   <FaHeart className="phase-icon" style={{ color: '#ff4757' }} />
                   <h3>{lang === 'en' ? "PHASE 1: EMOTION" : "المرحلة الأولى: العاطفة"}</h3>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q1}</label>
                   <textarea className="form-control" value={formState.emotionDesc} onChange={e => setFormState({...formState, emotionDesc: e.target.value})} placeholder={lang === 'en' ? "e.g. A knot in my stomach..." : "مثلاً: غصة في حلقي..."}></textarea>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q2} ({formState.intensity})</label>
                   <input type="range" min="1" max="10" className="form-range" value={formState.intensity} onChange={e => setFormState({...formState, intensity: e.target.value})} />
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q3}</label>
                   <select className="form-control" value={formState.dominantEmotion} onChange={e => setFormState({...formState, dominantEmotion: e.target.value})}>
                      {t.emotions.map((emo, i) => (
                         <option key={i} value={i === 0 ? "" : emo}>{emo}</option>
                      ))}
                   </select>
                </div>
             </div>
          )}

          {step === 1 && (
             <div>
                <div className="phase-header">
                   <FaBrain className="phase-icon" style={{ color: 'var(--secondary-color)' }} />
                   <h3>{lang === 'en' ? "PHASE 2: THOUGHT" : "المرحلة الثانية: الفكر"}</h3>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q4}</label>
                   <textarea className="form-control" value={formState.thought} onChange={e => setFormState({...formState, thought: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q5} ({formState.accuracy})</label>
                   <input type="range" min="1" max="10" className="form-range" value={formState.accuracy} onChange={e => setFormState({...formState, accuracy: e.target.value})} />
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q6}</label>
                   <textarea className="form-control" style={{ minHeight: '80px' }} value={formState.story} onChange={e => setFormState({...formState, story: e.target.value})}></textarea>
                </div>
             </div>
          )}

          {step === 2 && (
             <div>
                <div className="phase-header">
                   <FaBolt className="phase-icon" style={{ color: 'var(--warning-color)' }} />
                   <h3>{lang === 'en' ? "PHASE 3: REACTION" : "المرحلة الثالثة: رد الفعل"}</h3>
                </div>
                <label className="form-label mb-3">{t.q7}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                   {t.defenses.map((def, i) => (
                      <button 
                        key={i} 
                        className={`reaction-pill ${formState.reactions.includes(def) ? 'active' : ''}`}
                        onClick={() => {
                           const active = formState.reactions.includes(def) 
                              ? formState.reactions.filter(r => r !== def)
                              : [...formState.reactions, def];
                           setFormState({...formState, reactions: active});
                        }}
                      >
                         {def}
                      </button>
                   ))}
                </div>
             </div>
          )}

          {step === 3 && (
             <div>
                <div className="phase-header">
                   <FaLightbulb className="phase-icon" style={{ color: 'var(--accent-color)' }} />
                   <h3>{lang === 'en' ? "PHASE 4: INSIGHT" : "المرحلة الرابعة: البصيرة"}</h3>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q8}</label>
                   <textarea className="form-control" value={formState.breakChain} onChange={e => setFormState({...formState, breakChain: e.target.value})}></textarea>
                </div>
             </div>
          )}

          {step === 4 && (
             <div>
                <div className="phase-header">
                   <FaSync className="phase-icon" style={{ color: 'var(--secondary-color)' }} />
                   <h3>{lang === 'en' ? "PHASE 5: REFRAME" : "المرحلة الخامسة: إعادة الصياغة"}</h3>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q9}</label>
                   <textarea className="form-control" value={formState.reframing} onChange={e => setFormState({...formState, reframing: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q10}</label>
                   <input type="text" className="form-control" value={formState.anchor} onChange={e => setFormState({...formState, anchor: e.target.value})} placeholder={lang === 'en' ? "e.g. Deep breath, count to 3" : "مثلاً: نفس عميق، العد لـ ٣"} />
                </div>
             </div>
          )}

          {step === 5 && (
             <div>
                <div className="phase-header">
                   <FaCheckCircle className="phase-icon" style={{ color: 'var(--primary-color)' }} />
                   <h3>{lang === 'en' ? "PHASE 6: COMMITMENT" : "المرحلة السادسة: الالتزام"}</h3>
                </div>
                <div className="form-group">
                   <label className="form-label">{t.q11}</label>
                   <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{t.q11Sub}</p>
                   <textarea className="form-control" maxLength="200" value={commitment} onChange={e => setCommitment(e.target.value)} style={{ minHeight: '100px' }}></textarea>
                   <div style={{ textAlign: 'right', fontSize: '11px', color: '#999', marginTop: '5px' }}>{commitment.length}/200</div>
                </div>
             </div>
          )}
       </div>

       <div className="stepper-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button className="btn" onClick={handlePrev} disabled={step === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <FaChevronLeft /> {lang === 'en' ? "Back" : "الخلف"}
          </button>
          
          {step < TOTAL_STEPS - 1 ? (
             <button className="btn btn-secondary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {lang === 'en' ? "Next Phase" : "المرحلة التالية"} <FaChevronRight />
             </button>
          ) : (
             <button className="btn btn-accent" onClick={handleSubmit}>
                {t.finish}
             </button>
          )}
       </div>

       <style dangerouslySetInnerHTML={{__html: `
          .worksheet-stepper { display: flex; justify-content: space-between; margin-bottom: 40px; position: relative; }
          .worksheet-stepper::before { content: ''; position: absolute; top: 15px; left: 0; right: 0; height: 2px; background: #eee; z-index: 1; }
          .step-dot { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
          .dot-circle { width: 32px; height: 32px; background: white; border: 2px solid #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #999; transition: all 0.3s; }
          .step-dot span { font-size: 9px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
          .step-dot.active .dot-circle { border-color: var(--secondary-color); color: var(--secondary-color); box-shadow: 0 0 10px rgba(0, 166, 81, 0.2); }
          .step-dot.active span { color: var(--primary-color); }
          .phase-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
          .phase-icon { font-size: 32px; }
          .phase-header h3 { margin: 0; color: var(--primary-color); }
          .reaction-pill { padding: 12px; border-radius: 12px; border: 1px solid #eee; background: white; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; text-align: center; }
          .reaction-pill:hover { border-color: var(--secondary-color); background: rgba(0, 166, 81, 0.05); }
          .reaction-pill.active { background: var(--secondary-color); color: white; border-color: var(--secondary-color); }
          .form-range { width: 100%; accent-color: var(--secondary-color); }
       `}} />
    </div>
  );
}

export default ReflectionWorksheet;
