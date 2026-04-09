import React, { useState } from 'react';

const QUIZ_DATA_EN = [
  {
    question: "Your manager says in a team meeting: 'The client presentation wasn't up to our standard.' You feel your face flush. What is the most effective immediate response?",
    options: [
      { id: 'A', text: "Say 'Actually, I think it went well — the client seemed happy.'" },
      { id: 'B', text: "Stay silent and nod, but plan to address it privately later." },
      { id: 'C', text: "Take a breath, say 'Thank you for flagging that — can we debrief after the meeting so I can understand what to improve?'" },
      { id: 'D', text: "Ask why they chose to say this in front of everyone." }
    ],
    correct: 'C',
    debrief: "This response activates your prefrontal cortex — it buys time, acknowledges the feedback without agreeing or disagreeing immediately, and signals openness. Options A and D trigger ego protection. B stores resentment."
  },
  {
    question: "A peer tells you: 'You tend to talk over people in meetings.' Your first thought is 'They do it too.' What is happening neurologically?",
    options: [
      { id: 'A', text: "You are processing the feedback logically." },
      { id: 'B', text: "Your brain is using deflection as an ego protection mechanism to avoid a threat to self-image." },
      { id: 'C', text: "You are correctly identifying a double standard." },
      { id: 'D', text: "You are being assertive about injustice." }
    ],
    correct: 'B',
    debrief: "'They do it too' is a classic deflection defense. The brain redirects attention outward to protect the self-concept rather than processing the feedback."
  },
  {
    question: "You receive written feedback: 'This deliverable needs significant rework.' Your chest tightens. This physical response is because:",
    options: [
      { id: 'A', text: "The brain's threat detection system (amygdala) treats negative feedback like physical danger, releasing cortisol and adrenaline." },
      { id: 'B', text: "You have a respiratory condition triggered by stress." },
      { id: 'C', text: "The feedback is factually wrong and your body knows it." },
      { id: 'D', text: "You are allergic to the word 'rework.'" }
    ],
    correct: 'A',
    debrief: "The amygdala cannot distinguish between a tiger and a critical comment. Both trigger the fight-or-flight stress response in the body."
  },
  {
    question: "Your skip-level manager gives you developmental feedback in your annual review. You immediately begin defending your actions point by point. This behavior is driven by:",
    options: [
      { id: 'A', text: "A desire to provide context for fair evaluation." },
      { id: 'B', text: "Ego protection — your status and competence identity feel threatened by someone in authority." },
      { id: 'C', text: "Strong communication skills and assertiveness." },
      { id: 'D', text: "A genuine misunderstanding of the feedback intent." }
    ],
    correct: 'B',
    debrief: "Justifying to authority figures specifically activates status-threat circuits. The brain perceives hierarchical feedback as a dominance challenge, not a gift."
  },
  {
    question: "A colleague gives you feedback about your email tone. You think: 'They're just being oversensitive. This is a professional environment.' What cognitive trap is this?",
    options: [
      { id: 'A', text: "Misinterpretation of intent — dismissing the feedback by invalidating the giver's emotional experience rather than examining your behaviour." },
      { id: 'B', text: "Accurate assessment of professional norms." },
      { id: 'C', text: "Evidence-based reasoning." },
      { id: 'D', text: "Cultural intelligence." }
    ],
    correct: 'A',
    debrief: "Labeling the other person as 'too sensitive' is a classic mechanism to avoid self-examination. It shifts the problem from your behavior to their reaction."
  },
  {
    question: "After receiving feedback, you replay it for 3 days, re-reading the email and catastrophizing what it means for your career. This is called:",
    options: [
      { id: 'A', text: "Deep processing of feedback." },
      { id: 'B', text: "Rumination — a self-defense mechanism disguised as reflection that reinforces threat perception without producing action." },
      { id: 'C', text: "Due diligence." },
      { id: 'D', text: "Emotional intelligence in practice." }
    ],
    correct: 'B',
    debrief: "Rumination feels like thinking but is actually the brain looping on threat signals rather than problem-solving. It increases cortisol and decreases cognitive flexibility."
  },
  {
    question: "The most effective time to respond substantively to challenging feedback is:",
    options: [
      { id: 'A', text: "Immediately, to show you are engaged and alert." },
      { id: 'B', text: "Never — some feedback should be ignored." },
      { id: 'C', text: "After a brief pause or a day — when the prefrontal cortex has had time to override the initial amygdala response." },
      { id: 'D', text: "Only after consulting others who agree with you." }
    ],
    correct: 'C',
    debrief: "The prefrontal cortex needs time to 'come back online' after an emotional hijack. A brief pause isn't weakness — it's neuroscience."
  },
  {
    question: "You've noticed that you only push back on feedback from certain colleagues but accept the same feedback from others. This is most likely because:",
    options: [
      { id: 'A', text: "You respect some colleagues more professionally." },
      { id: 'B', text: "Your brain filters feedback through relationship trust and perceived intent — not content. The same words feel like attacks or gifts depending on who says them." },
      { id: 'C', text: "Some colleagues give better quality feedback." },
      { id: 'D', text: "You are selectively practicing feedback agility." }
    ],
    correct: 'B',
    debrief: "Psychological safety determines how the brain codes incoming feedback. Low-trust relationships activate threat; high-trust relationships activate learning."
  },
  {
    question: "Which of the following is the LEAST effective way to build feedback agility over time?",
    options: [
      { id: 'A', text: "Seeking feedback proactively before it's given to you." },
      { id: 'B', text: "Naming your emotional reaction out loud before responding." },
      { id: 'C', text: "Waiting until you feel ready to receive feedback without any emotional reaction." },
      { id: 'D', text: "Asking clarifying questions to understand specific examples." }
    ],
    correct: 'C',
    debrief: "Waiting until you feel 'ready' is avoidance disguised as self-care. Emotional reactions to feedback never fully disappear — the goal is learning to act wisely despite them."
  },
  {
    question: "A team leader's feedback makes you feel shame rather than just guilt. The key difference is:",
    options: [
      { id: 'A', text: "Shame is stronger than guilt but both lead to growth." },
      { id: 'B', text: "Guilt says 'I did something bad' (behavior-focused) while shame says 'I am bad' (identity-focused). Shame triggers ego defense; guilt triggers repair." },
      { id: 'C', text: "Shame is healthier because it drives introspection." },
      { id: 'D', text: "There is no meaningful difference." }
    ],
    correct: 'B',
    debrief: "This is Brené Brown's core insight. When feedback attacks identity rather than behavior, the brain goes into self-protection overdrive. Separating 'what I did' from 'who I am' is the key to receiving feedback without defensiveness."
  }
];

const QUIZ_DATA_AR = [
  {
    question: "يقول مديرك في اجتماع للفريق: 'النتائج مع العميل لم تكن ترقى لمستوى معاييرنا'. تشعر باحمرار وجهك. ما هي أفضل استجابة فورية؟",
    options: [
      { id: 'A', text: "أن تقول 'في الواقع، أعتقد أنها كانت جيدة - العميل بدا سعيداً'." },
      { id: 'B', text: "أن تبقى صامتاً وتومئ برأسك، وتخطط لمناقشة الأمر على انفراد لاحقاً." },
      { id: 'C', text: "خذ نفساً، وقل: 'شكراً لتوضيح ذلك - هل يمكننا التحدث بعد الاجتماع حتى أفهم ما يمكن تحسينه؟'" },
      { id: 'D', text: "أن تسأل عن سبب اختياره لقول هذا أمام الجميع." }
    ],
    correct: 'C',
    debrief: "هذه الاستجابة تنشط قشرتك الجبهية - إنها تكسبك الوقت، وتعترف بالملاحظات دون موافقة أو رفض فوري، وتشير إلى الانفتاح. الخياران A و D يثيران حماية الأنا. الخيار B يولد الاستياء."
  },
  {
    question: "يخبرك أحد الأقران: 'أنت تميل إلى مقاطعة الناس في الاجتماعات'. فكرتك الأولى هي 'إنه يفعل ذلك أيضاً'. ما الذي يحدث عصبياً؟",
    options: [
      { id: 'A', text: "أنت تقوم بمعالجة الملاحظات بشكل منطقي." },
      { id: 'B', text: "يستخدم دماغك الانحراف (التحويل) كآلية لحماية الأنا لتجنب تضرر صورتك الذاتية." },
      { id: 'C', text: "أنت تحدد بشكّل صحيح معايير مزدوجة." },
      { id: 'D', text: "أنت حازم بشأن عدم العدالة." }
    ],
    correct: 'B',
    debrief: "'إنه يفعل ذلك أيضاً' هو آلية دفاع كلاسيكية تتمثل في تصريف الانتباه. يوجه الدماغ الانتباه للخارج لحماية مفهوم الذات بدلاً من معالجة الملاحظات."
  },
  {
    question: "تتلقى ملاحظات مكتوبة: 'يحتاج هذا العمل إلى تعديل كبير'. يضيق صدرك. هذا التفاعل الجسدي يرجع إلى أن:",
    options: [
      { id: 'A', text: "نظام اكتشاف التهديدات في الدماغ (اللوزة) يتعامل مع الملاحظات السلبية كتهديد جسدي، ويفرز الكورتيزول والأدرينالين." },
      { id: 'B', text: "لديك حالة تنفسية ناتجة عن التوتر." },
      { id: 'C', text: "الملاحظات خاطئة بشكل واقعي وجسدك يعلم ذلك." },
      { id: 'D', text: "لديك حساسية من كلمة 'تعديل'." }
    ],
    correct: 'A',
    debrief: "لا يمكن للوزة الدماغية التمييز بين نمس مفترس والتعليقات النقدية. كلاهما يطلق استجابة الضغط النفسي (إما القتال أو الهروب) في الجسم."
  },
  {
    question: "مدير إدارتك يعطيك ملاحظات تطويرية في مراجعتك السنوية. تبدأ فوراً في الدفاع عن أفعالك نقطة بنقطة. هذا السلوك مدفوع بـ:",
    options: [
      { id: 'A', text: "رغبة في توضيح السياق من أجل تقييم عادل." },
      { id: 'B', text: "حماية الأنا - تشعر هويتك وصورتك كشخص كفؤ بالتهديد من شخص ذي سلطة." },
      { id: 'C', text: "مهارات تواصل قوية وحزم." },
      { id: 'D', text: "سوء فهم حقيقي للقصد من המلاحظات." }
    ],
    correct: 'B',
    debrief: "التبرير لمن هم في السلطة يثير دوائر تهديد المكانة. يعتبر الدماغ الملاحظات الهرمية بمثابة تحدٍ للسيطرة، وليس كهدية."
  },
  {
    question: "أحد الزملاء يقدم لك ملاحظات عن نبرة رسائلك الإلكترونية. تفكر: 'إنه حساس أكثر من اللازم، نحن في بيئة مهنية'. ما هو هذا الفخ المعرفي؟",
    options: [
      { id: 'A', text: "سوء تقدير القصد - استبعاد الملاحظات بالتقليل من تجربة المعطي العاطفية بدلاً من فحص سلوكك." },
      { id: 'B', text: "تقييم دقيق للمعايير المهنية." },
      { id: 'C', text: "استنتاج مبني على الأدلة." },
      { id: 'D', text: "الذكاء الثقافي." }
    ],
    correct: 'A',
    debrief: "وصف الشخص الآخر بأنه 'حساس للغاية' هو آلية كلاسيكية لتجنب الفحص الذاتي لمعرفة الأخطاء. فهو يحول المشكلة من سلوكك إلى رد فعله."
  },
  {
    question: "بعد تلقي الملاحظات، تعيد التفكير فيها لـ 3 أيام، وتقرأ الإيميل مجدداً وتتخيل أثرها الكارثي على مسيرتك المهنية. هذا يُطلق عليه:",
    options: [
      { id: 'A', text: "معالجة عميقة للملاحظات." },
      { id: 'B', text: "الاجترار - آلية دفاع ذاتية مقنعة على أنها تفكير تعزز الشعور بالتهديد دون إنتاج أفعال." },
      { id: 'C', text: "العناية الواجبة." },
      { id: 'D', text: "الذكاء العاطفي مطبقاً." }
    ],
    correct: 'B',
    debrief: "يبدو الاجترار تفكيراً إلا أنه في الواقع دوران العقل في دوامة حول التهديدات بدل حل المشاكل. يزيد من مستويات الكورتيزول ويخفض مرونة الإدراك."
  },
  {
    question: "أفضل وقت للرد بفاعلية وبشكل جوهري على الملاحظات الصعبة هو:",
    options: [
      { id: 'A', text: "فوراً، لتظهر أنك متفاعل ويقظ." },
      { id: 'B', text: "أبداً - يجب تجاهل بعض الملاحظات." },
      { id: 'C', text: "بعد توقف قصير أو في اليوم التالي - حين أتيح لللقشرة الجبهية الوقت للتغلب على استجابة اللوزة الأولية." },
      { id: 'D', text: "فقط بعد استشارة اشخاص يوافقونك الرأي." }
    ],
    correct: 'C',
    debrief: "تحتاج القشرة الجبهية لوقت لـ 'تبدأ العمل من جديد' بعد حدوث اختطاف عاطفي للدماغ. الوقفة القصيرة ليست ضعفاً، إنها تطبيق عملي لعلم الأعصاب."
  },
  {
    question: "لاحظت أنك تقاوم الملاحظات من زملاء محددين ولكنك تتقبلها تماماً من زملاء آخرين. هذا على الأرجح بسبب:",
    options: [
      { id: 'A', text: "أنك تحترم بعض الزملاء مهنياً أكثر من غيرهم." },
      { id: 'B', text: "أن دماغك يفلتر الملاحظات بناءاً على الثقة المتبادلة والنية - ليس المحتوى. نفس الكلمات تُفهم كاعتداء أو كهدية بناءً على القائل." },
      { id: 'C', text: "أن بعض الزملاء يقدمون النوع الأفضل من الملاحظات." },
      { id: 'D', text: "أنك تطبق المرونة حول الملاحظات بشكل انتقائي." }
    ],
    correct: 'B',
    debrief: "السلامة النفسية تحدد كيف يتفاعل الدماغ مع الملاحظات. العلاقات ضعيفة الثقة تحفز رسائل التهديد؛ أما قوية الثقة فتحفز دوائر التعلم."
  },
  {
    question: "أي من التالي هو الطريقة 'الأقل' فاعلية لبناء الاستجابة الرشيقة للملاحظات بمرور الوقت؟",
    options: [
      { id: 'A', text: "البحث عن الملاحظات بنشاط واستباقية قبل أن تُعطى لك." },
      { id: 'B', text: "تسمية ردة فعلك العاطفية بصوت عالٍ قبل الاستجابة." },
      { id: 'C', text: "الانتظار حتى تشعر بأنك 'مستعد' لتلقي الملاحظات بدون أي تفاعل عاطفي." },
      { id: 'D', text: "طرح أسئلة توضيحية لفهم أمثلة الملاحظة بوضوح." }
    ],
    correct: 'C',
    debrief: "الانتظار إلى أن تشعر أنك 'مستعد' هو تجنب بوضع الرعاية الذاتية. إن ردات الفعل العاطفية نحو الملاحظات لن تتوقف تماماً. الهدف أن تتعلم التصرف بحكمة على الرغم منها."
  },
  {
    question: "ملاحظات قائد الفريق تشعرك بالعار بدلاً من مجرد الذنب. الاختلاف الأساسي هو:",
    options: [
      { id: 'A', text: "العار أقوى من الذنب ولكلاهما يقود للنمو." },
      { id: 'B', text: "الذنب هو: 'فعلتُ شيء سيء' (يركز ع السلوك) والعار هو: 'أنا سيء' (يركز ع الهوية). يثير العار الحماية، ويثير الذنب أفعال التغيير والإصلاح." },
      { id: 'C', text: "العار أكثر صحية لأنه يحفز الاستبطان." },
      { id: 'D', text: "لا يوجد فرق حقيقي بينهما." }
    ],
    correct: 'B',
    debrief: "عندما تهاجم الملاحظات الشخص بدلاً من أفعاله، يستنفر الدماغ وضعيات الحماية بالكامل. فصل 'ماذا فعلت' عن 'مَن أكون' هو السر لتلقي الملاحظات دون دفاعية."
  }
];


function BehavioralQuiz({ onComplete, lang = 'en' }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDebrief, setShowDebrief] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const QUIZ_DATA = lang === 'ar' ? QUIZ_DATA_AR : QUIZ_DATA_EN;
  const question = QUIZ_DATA[currentQuestionIndex];

  const handleOptionSelect = (id) => {
    if (showDebrief) return;
    setSelectedOption(id);
    setShowDebrief(true);
    if (id === question.correct) {
      setScore(s => s + 1);
    } else {
      // Trigger chatbot help
      const helpMsg = lang === 'en' 
        ? `I noticed that was a tricky one! "${question.question.substring(0, 40)}..." remember that our goal is to shift from reactive protection to cognitive agility. Let me help you understand why.`
        : `لقد لاحظت أن هذا السؤال كان صعباً! تذكر أن هدفنا هو التحول من الحماية التفاعلية إلى الرشاقة المعرفية. دعني أساعدك في فهم السبب.`;
      
      window.dispatchEvent(new CustomEvent('aria-help', { detail: helpMsg }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < QUIZ_DATA.length) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowDebrief(false);
    } else {
      setQuizFinished(true);
      onComplete();
    }
  };

  if (quizFinished) {
    let resultMessage = "";
    if (score <= 4) {
      resultMessage = lang === 'en' 
        ? "Reactive Learner — Your feedback instincts are still wired for protection. This is normal. Start with Module 1 again."
        : "المتعلم المتفاعل — ما زالت غرائز الملاحظة لديك مبرمجة للحماية. هذا أمر طبيعي. ابدأ بالوحدة التدريبية 1 مرة أخرى.";
    } else if (score <= 7) {
      resultMessage = lang === 'en'
        ? "Developing Agility — You understand the theory. Your challenge is real-time application."
        : "تطوير الرشاقة — أنت تفهم النظرية. التحدي الذي يواجهك الآن هو التطبيق المباشر الميداني.";
    } else {
      resultMessage = lang === 'en'
        ? "Feedback Intelligent — You have the knowledge. Now build the habits."
        : "الذكاء في الملاحظات — أنت تمتلك المعرفة اللازمة الآن. حان الوقت لبناء العادات.";
    }

    return (
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>{lang === 'en' ? "ASSESSMENT COMPLETE" : "اكتمل التقييم"}</h2>
        <div style={{ padding: '30px', backgroundColor: 'var(--bg-light)', borderRadius: '8px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '48px', color: 'var(--secondary-color)', margin: '0' }}>{score} / 10</h1>
          <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px', marginTop: '10px' }}>{lang === 'en' ? "Your Final Score" : "النتيجة النهائية"}</p>
        </div>
        <div style={{ padding: '20px', borderLeft: lang === 'en' ? '4px solid var(--accent-color)' : 'none', borderRight: lang === 'ar' ? '4px solid var(--accent-color)' : 'none', textAlign: lang === 'ar' ? 'right' : 'left', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{lang === 'en' ? "RESULT:" : "النتيجة:"}</h4>
          <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{resultMessage}</p>
        </div>
      </div>
    );
  }

  const progress = (currentQuestionIndex / QUIZ_DATA.length) * 100;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="text-center mb-3">
        <h2 style={{ color: 'var(--primary-color)' }}>{lang === 'en' ? "Feedback Intelligence Assessment" : "تقييم قوة التعامل مع الملاحظات"}</h2>
        <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-dark)' }}>{lang === 'en' ? "Select the most effective response in each scenario" : "اختر الاستجابة الأكثر فاعلية في كل سيناريو المذكورين"}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: 'var(--secondary-color)', width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
        <div style={{ textAlign: lang === 'ar' ? 'left' : 'right', fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {lang === 'en' ? `Question ${currentQuestionIndex + 1} of ${QUIZ_DATA.length}` : `سؤال ${currentQuestionIndex + 1} من ${QUIZ_DATA.length}`}
        </div>
      </div>

      <div className="mb-3">
        <h3 style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '20px', textAlign: lang === 'ar' ? 'right' : 'left' }}>{question.question}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {question.options.map(opt => {
            let bgColor = 'transparent';
            let borderColor = '#e0e0e0';
            if (showDebrief && opt.id === question.correct) {
               bgColor = 'rgba(0, 166, 81, 0.1)';
               borderColor = 'var(--secondary-color)';
            } else if (showDebrief && selectedOption === opt.id && opt.id !== question.correct) {
               bgColor = 'rgba(217, 79, 61, 0.1)';
               borderColor = 'var(--warning-color)';
            } else if (!showDebrief && selectedOption === opt.id) {
               borderColor = 'var(--secondary-color)';
            }

            return (
              <label 
                key={opt.id} 
                className="radio-label" 
                style={{ backgroundColor: bgColor, borderColor: borderColor }}
              >
                <input 
                  type="radio" 
                  name="quiz_option" 
                  checked={selectedOption === opt.id}
                  onChange={() => handleOptionSelect(opt.id)}
                  disabled={showDebrief}
                />
                <span style={{ fontSize: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  {opt.text}
                </span>
                {showDebrief && opt.id === question.correct && (
                  <span style={{ marginLeft: lang === 'ar' ? '0' : 'auto', marginRight: lang === 'ar' ? 'auto' : '0', color: 'var(--secondary-color)', fontWeight: 'bold' }}>✓</span>
                )}
                {showDebrief && selectedOption === opt.id && opt.id !== question.correct && (
                  <span style={{ marginLeft: lang === 'ar' ? '0' : 'auto', marginRight: lang === 'ar' ? 'auto' : '0', color: 'var(--warning-color)', fontWeight: 'bold' }}>✗</span>
                )}
              </label>
            )
          })}
        </div>
      </div>

      {showDebrief && (
        <div style={{ padding: '20px', backgroundColor: 'rgba(200, 160, 74, 0.1)', borderLeft: lang === 'en' ? '4px solid var(--accent-color)' : 'none', borderRight: lang === 'ar' ? '4px solid var(--accent-color)' : 'none', borderRadius: '8px', marginBottom: '20px', animation: 'slideIn 0.3s ease-out' }}>
          <h4 style={{ color: 'var(--primary-color)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {selectedOption === question.correct ? (lang === 'en' ? "✅ CORRECT" : "✅ إجابة صحيحة") : (lang === 'en' ? "❌ INCORRECT" : "❌ إجابة خاطئة")} — {lang === 'en' ? "Neuroscience Debrief" : "تحليل علم الأعصاب"}
          </h4>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {question.debrief}
          </p>
        </div>
      )}

      {showDebrief && (
        <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
          <button className="btn" onClick={nextQuestion}>
            {currentQuestionIndex + 1 === QUIZ_DATA.length 
              ? (lang === 'en' ? "SEE FINAL SCORE" : "عرض النتيجة النهائية") 
              : (lang === 'en' ? "NEXT QUESTION →" : "← السؤال التالي")}
          </button>
        </div>
      )}
    </div>
  );
}

export default BehavioralQuiz;
