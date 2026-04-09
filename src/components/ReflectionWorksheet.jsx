import React, { useState } from 'react';

function ReflectionWorksheet({ onComplete, lang = 'en' }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commitment, setCommitment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    onComplete();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSubmitted) {
    return (
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto', border: '2px solid var(--accent-color)' }}>
        <div style={{ color: 'var(--accent-color)', marginBottom: '20px' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 style={{ color: 'var(--primary-color)' }}>{lang === 'en' ? "Reflection Complete" : "اكتمل التأمل"}</h2>
        <p className="mb-3">{lang === 'en' ? "Thank you for taking the time to map out your feedback reactions. Self-awareness is the first step to behavioral agility." : "شكرًا لك على تخصيص الوقت لرسم ردود أفعالك تجاه الملاحظات. الوعي الذاتي هو الخطوة الأولى نحو الرشاقة السلوكية."}</p>
        
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: '8px', textAlign: lang === 'ar' ? 'right' : 'left', marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--primary-color)', fontSize: '12px', marginBottom: '10px' }}>{lang === 'en' ? "YOUR COMMITMENT:" : "التزامك:"}</h4>
          <p style={{ fontStyle: 'italic', margin: 0 }}>"{commitment || (lang === 'en' ? 'I will practice slowing down my reaction to feedback.' : 'سأتدرب على إبطاء رد فعلي تجاه الملاحظات.')}"</p>
        </div>

        <button className="btn" onClick={handlePrint}>{lang === 'en' ? "Download as PDF (Print)" : "تنزيل كـ PDF (طباعة)"}</button>
      </div>
    );
  }

  const t = {
    title: lang === 'en' ? "My Feedback Reaction Profile" : "ملف تفاعلي مع الملاحظات",
    subtitle: lang === 'en' ? "Personal Reflection Journal" : "يوميات التأمل الشخصي",
    printBtn: lang === 'en' ? "Print / Save PDF" : "طباعة / حفظ كملف PDF",
    secA: lang === 'en' ? "SECTION A — RECALL A REAL MOMENT" : "القسم أ — تذكر لحظة حقيقية",
    q1: lang === 'en' ? "Q1: Describe a specific time you received feedback that triggered a strong reaction in you. (What was said? By whom? In what context?)" : "س١: صف وقتًا محددًا تلقيت فيه ملاحظات أثارت رد فعل قوي لديك. (ماذا قيل؟ من قبل من؟ في أي سياق؟)",
    q2: lang === 'en' ? "Q2: What was your immediate physical response? (e.g., tension, flushed face, heart racing, silence)" : "س٢: ما كان استجابتك الجسدية المباشرة؟ (مثل: التوتر، احمرار الوجه، تسارع دقات القلب، الصمت)",
    q3: lang === 'en' ? "Q3: What emotion did you feel first? (e.g., anger, shame, fear, confusion)" : "س٣: ما هي العاطفة التي شعرت بها أولاً؟ (مثل: الغضب، العار، الخوف، الارتباك)",
    emotions: lang === 'en' 
      ? ["Select dominant emotion...", "Anger", "Shame", "Fear", "Confusion", "Hurt", "Defensiveness", "Disbelief", "Other"]
      : ["اختر العاطفة المهيمنة...", "الغضب", "العار", "الخوف", "الارتباك", "الألم", "الدفاعية", "عدم التصديق", "أخرى"],
    secB: lang === 'en' ? "SECTION B — DECODE THE THREAT" : "القسم ب — فك شفرة التهديد",
    q4: lang === 'en' ? "Q4: In that moment, what did your brain interpret as the threat? (Was it your competence? Your status? Your identity?)" : "س٤: في تلك اللحظة، ماذا فسر دماغك على أنه تهديد؟ (هل كانت كفاءتك؟ مكانتك؟ هويتك؟)",
    q5: lang === 'en' ? "Q5: On a scale of 1–10, how accurate was that interpretation in hindsight?" : "س٥: على مقياس من 1 إلى 10، ما مدى دقة هذا التفسير لاحقاً؟",
    q5Min: lang === 'en' ? "1 (Inaccurate)" : "١ (غير دقيق)",
    q5Max: lang === 'en' ? "10 (Accurate)" : "١٠ (دقيق)",
    q6: lang === 'en' ? "Q6: What story did you tell yourself about the person giving the feedback?" : "س٦: ما القصة التي رويتها لنفسك عن الشخص الذي أعطاك الملاحظات؟",
    secC: lang === 'en' ? "SECTION C — YOUR DEFAULT DEFENSE" : "القسم ج — دفاعك الافتراضي",
    q7: lang === 'en' ? "Q7: Which defense mechanism did you use? (select all that apply)" : "س٧: أي آليات الدفاع استخدمتها؟ (اختر كل ما ينطبق)",
    defenses: lang === 'en'
      ? [
          'Justification ("Yes, but...")',
          'Deflection ("They do it too")',
          'Minimizing ("It\'s not a big deal")',
          'Counter-attack ("What about your mistakes?")',
          'Silence / Withdrawal',
          'People-pleasing (fake agreement)',
          'Rumination (replaying it for days)'
        ]
      : [
          'التبرير ("نعم، لكن...")',
          'التحويل ("هم يفعلون ذلك أيضاً")',
          'التقليل ("الأمر ليس مهماً")',
          'الهجوم المضاد ("ماذا عن أخطائك؟")',
          'الصمت / الانسحاب',
          'إرضاء الناس (موافقة وهمية)',
          'الاجترار (إعادة التفكير فيه لعدة أيام)'
        ],
    secD: lang === 'en' ? "SECTION D — THE COST" : "القسم د — التكلفة",
    q8: lang === 'en' ? "Q8: What did your defensive reaction cost you? (Relationship? Opportunity? Learning? Reputation?)" : "س٨: ماذا كلفتك استجابتك الدفاعية؟ (علاقة؟ فرصة؟ تعلم؟ سمعة؟)",
    secE: lang === 'en' ? "SECTION E — THE REFRAME" : "القسم هـ — إعادة الصياغة",
    q9: lang === 'en' ? "Q9: If you could go back, what would a \"feedback-agile\" version of you have said or done?" : "س٩: إذا تمكنت من العودة بالزمن، ماذا كانت النسخة \"الرشيقة مع الملاحظات\" منك لتقول أو تفعل؟",
    q10: lang === 'en' ? "Q10: What is ONE physical anchor you can use next time to slow down your reaction? (e.g., take one breath, place hand on desk, count to 3 silently)" : "س١٠: ما هو مرساك الجسدي الواحد الذي يمكنك استخدامه في المرة القادمة لإبطاء استجابتك؟",
    secF: lang === 'en' ? "SECTION F — COMMITMENT" : "القسم و — الالتزام",
    q11: lang === 'en' ? "Q11: Write a personal commitment statement:" : "س١١: اكتب بياناً شخصياً لالتزامك:",
    q11Sub: lang === 'en' ? "\"When I receive challenging feedback, I commit to...\"" : "\"عندما أتلقى ملاحظات صعبة، ألتزم بـ...\"",
    chars: lang === 'en' ? "characters" : "حرف",
    submit: lang === 'en' ? "SUBMIT REFLECTION" : "إرسال التأمل"
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: lang === 'ar' ? 'right' : 'left' }}>
      <div className="text-center mb-3">
        <h2 style={{ color: 'var(--primary-color)' }}>{t.title}</h2>
        <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-dark)' }}>{t.subtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: lang === 'en' ? 'flex-end' : 'flex-start', marginBottom: '20px' }}>
         <button className="btn btn-secondary" onClick={handlePrint} style={{ fontSize: '12px', padding: '8px 16px' }}>{t.printBtn}</button>
      </div>

      <form onSubmit={handleSubmit} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        
        {/* SECTION A */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secA}</h3>
          
          <div className="form-group">
            <label className="form-label">{t.q1}</label>
            <textarea className="form-control" required></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">{t.q2}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">{t.q3}</label>
            <select className="form-control" required defaultValue="">
              <option value="" disabled>{t.emotions[0]}</option>
              {t.emotions.slice(1).map((em, i) => <option key={i} value={em}>{em}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION B */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secB}</h3>
          
          <div className="form-group">
            <label className="form-label">{t.q4}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">{t.q5}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', direction: 'ltr' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.q5Min}</span>
              <input type="range" min="1" max="10" defaultValue="5" style={{ flex: 1, accentColor: 'var(--secondary-color)' }} />
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.q5Max}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.q6}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>
        </div>

        {/* SECTION C */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secC}</h3>
          <label className="form-label mb-2">{t.q7}</label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            {t.defenses.map((def, i) => (
              <label key={i} className="checkbox-label" style={{ alignItems: 'center' }}>
                <input type="checkbox"/> <span style={{ marginRight: lang === 'ar' ? '8px' : '0' }}>{def}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION D */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secD}</h3>
          <div className="form-group">
            <label className="form-label">{t.q8}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>
        </div>

        {/* SECTION E */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secE}</h3>
          <div className="form-group">
            <label className="form-label">{t.q9}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">{t.q10}</label>
            <textarea className="form-control" style={{ minHeight: '60px' }} required></textarea>
          </div>
        </div>

        {/* SECTION F */}
        <div className="mb-3">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>{t.secF}</h3>
          <div className="form-group">
            <label className="form-label">{t.q11}</label>
            <p style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-dark)' }}>{t.q11Sub}</p>
            <textarea 
              className="form-control" 
              style={{ minHeight: '80px' }} 
              maxLength="200"
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              required
            ></textarea>
            <div style={{ textAlign: lang === 'en' ? 'right' : 'left', fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {commitment.length} / 200 {t.chars}
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <button type="submit" className="btn btn-accent" style={{ fontSize: '16px', padding: '15px 40px' }}>{t.submit}</button>
        </div>

      </form>
    </div>
  );
}

export default ReflectionWorksheet;
