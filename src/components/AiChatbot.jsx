import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaAngleUp } from 'react-icons/fa';

const ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE";
// Replace with your actual key before deployment

const SYSTEM_PROMPT = "You are ARIA, a guided reflection coach for Aramco India's Leadership Development Program. Your role is to help employees reflect on their emotional and behavioral reactions to feedback. You never give direct advice. Instead, you ask one thoughtful Socratic question at a time. You focus on five themes: (1) the brain perceiving feedback as a threat, (2) emotional reactions like discomfort or frustration, (3) physical responses like tension or shallow breathing, (4) misinterpretation of intent, and (5) ego protection and self-defense mechanisms. Begin by warmly welcoming the user and asking: 'Can you tell me about a recent moment when feedback made you feel uncomfortable — what happened?' Keep responses to 2–3 sentences maximum. Never lecture. Always follow up with exactly one question.";

const INITIAL_MESSAGE = "Hello. I'm ARIA — your personal reflection guide for today's session. This is a private, judgment-free space. I have some pre-defined areas we can explore, or you can select one below.";

const PREDEFINED_QUESTIONS_EN = [
  "Why do I feel physically tense when receiving feedback?",
  "How can I stop taking feedback so personally?",
  "What's the difference between guilt and shame?",
  "How can I pause before reacting defensively?"
];

const PREDEFINED_QUESTIONS_AR = [
  "لماذا أشعر بالتوتر الجسدي عند تلقي الملاحظات؟",
  "كيف أتوقف عن أخذ الملاحظات بشكل شخصي؟",
  "ما الفرق بين الشعور بالذنب والعار؟",
  "كيف يمكنني التوقف قليلاً قبل الرد بشكل دفاعي؟"
];

const PREDEFINED_RESPONSES_EN = {
  "Why do I feel physically tense when receiving feedback?": "When receiving critical feedback, your amygdala—the brain's threat-detection center—triggers a 'fight or flight' response. It releases adrenaline and cortisol because it perceives the social threat of feedback with the same intensity as a physical predator, causing immediate muscle tension.",
  "How can I stop taking feedback so personally?": "The key is separating your identity from your behavior. When we hear 'your report had errors,' our ego interprets it as 'you are a failure.' By actively reframing the feedback to focus solely on the action rather than your worth, you reduce the perceived threat to your self-image.",
  "What's the difference between guilt and shame?": "Guilt is behavior-focused: 'I did something bad.' Shame is identity-focused: 'I am bad.' Feedback that triggers guilt encourages repair and growth, whereas feedback that triggers shame activates powerful ego defenses and withdrawal.",
  "How can I pause before reacting defensively?": "Implementing a physical 'anchor' can help. Taking a deep breath, placing your hand flat on the desk, or silently counting to three forces your prefrontal cortex to come back online, overriding the amygdala's immediate defensive reflex."
};

const PREDEFINED_RESPONSES_AR = {
  "لماذا أشعر بالتوتر الجسدي عند تلقي الملاحظات؟": "عند تلقي ملاحظات نقدية، تقوم اللوزة الدماغية - مركز اكتشاف التهديدات في الدماغ - بتحفيز استجابة 'القتال أو الهروب'. تفرز الأدرينالين والكورتيزول لأنها تنظر إلى التهديد الاجتماعي للملاحظات بنفس شدة المفترس الجسدي، مما يسبب توتراً عضلياً فورياً.",
  "كيف أتوقف عن أخذ الملاحظات بشكل شخصي؟": "المفتاح هو فصل هويتك عن سلوكك. عندما نسمع 'تقريرك به أخطاء'، يفسرها غرورنا على أنها 'أنت فاشل'. من خلال إعادة صياغة الملاحظات للتركيز فقط على الفعل بدلاً من قيمتك، فإنك تقلل من التهديد المتصور لصورتك الذاتية.",
  "ما الفرق بين الشعور بالذنب والعار؟": "الذنب يركز على السلوك: 'لقد فعلت شيئاً سيئاً'. العار يركز على الهوية: 'أنا سيء'. الملاحظات التي تثير الذنب تشجع على الإصلاح والنمو، بينما الملاحظات التي تثير العار تنشط دفاعات قوية للأنا والانسحاب.",
  "كيف يمكنني التوقف قليلاً قبل الرد بشكل دفاعي؟": "تطبيق 'مرساة' جسدية يمكن أن يساعد. أخذ نفس عميق، وضع يدك مسطحة على المكتب، أو العد بصمت إلى ثلاثة يجبر قشرتك الجبهية على العودة للعمل، متجاوزاً رد الفعل الدفاعي الفوري للوزة الدماغية."
};

const SUMMARY_RESPONSE_EN = "• Your brain intuitively interprets critical feedback as a physical threat, triggering tension.\n• Separating your behavior from your core identity is crucial to avoid taking feedback personally.\n• Recognizing the difference between guilt and shame helps disarm automatic ego defenses.";
const SUMMARY_RESPONSE_AR = "• يفسر دماغك الملاحظات النقدية تلقائياً كتهديد جسدي، مما يثير التوتر.\n• فصل سلوكك عن هويتك الأساسية أمر حاسم لتجنب أخذ الملاحظات بشكل شخصي.\n• إدراك الفرق بين الذنب والعار يساعد في نزع سلاح دفاعات الأنا التلقائية.";

function AiChatbot({ onComplete = () => {}, lang = 'en' }) {
  const INITIAL_MESSAGE = lang === 'en' 
    ? "Hello. I'm ARIA — your personal reflection guide for today's session. This is a private, judgment-free space. I have some pre-defined areas we can explore, or you can select one below."
    : "مرحباً. أنا أريا — دليلك الشخصي للتأمل في جلسة اليوم. هذه مساحة خاصة خالية من الأحكام. لدي بعض المجالات المحددة مسبقاً التي يمكننا استكشافها معاً.";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Reset conversation if language changes
    setMessages([{ role: 'assistant', content: INITIAL_MESSAGE }]);
  }, [lang, INITIAL_MESSAGE]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [summary, setSummary] = useState('');
  const messagesEndRef = useRef(null);

  const MAX_EXCHANGES = 8; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const callAnthropicAPI = async (chatMessages, isSummaryRequest = false) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isSummaryRequest) {
      return lang === 'en' ? SUMMARY_RESPONSE_EN : SUMMARY_RESPONSE_AR;
    }

    const lastUserMessage = chatMessages.filter(m => m.role === 'user').pop()?.content;
    const responses = lang === 'en' ? PREDEFINED_RESPONSES_EN : PREDEFINED_RESPONSES_AR;
    
    return responses[lastUserMessage] || (lang === 'en' ? "That's a very insightful point." : "هذه نقطة ثاقبة جداً.");
  };

  const handleSendPredefined = async (questionText) => {
    if (isLoading || isSessionComplete) return;

    const userMsg = { role: 'user', content: questionText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const userMessageCount = newMessages.filter(m => m.role === 'user').length;

    if (userMessageCount >= MAX_EXCHANGES) {
      const summaryText = await callAnthropicAPI(newMessages, true);
      setSummary(summaryText);
      setIsSessionComplete(true);
      setIsLoading(false);
      onComplete(); 
    } else {
      const assistantText = await callAnthropicAPI(newMessages, false);
      setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
      setIsLoading(false);
    }
  };

  const handleSaveReflection = () => {
    let transcript = `--- ARIA Reflection Session Transcript ---\n\n`;
    messages.forEach(m => {
      transcript += `${m.role === 'user' ? 'YOU' : 'ARIA'}: ${m.content}\n\n`;
    });
    if (summary) {
       transcript += `--- Session Summary ---\n${summary}\n`;
    }
    
    navigator.clipboard.writeText(transcript).then(() => {
      alert(lang === 'en' ? "Transcript copied to clipboard!" : "تم نسخ النص إلى الحافظة!");
    });
  };

  const PREDEFINED_QUESTIONS = lang === 'en' ? PREDEFINED_QUESTIONS_EN : PREDEFINED_QUESTIONS_AR;

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.3s ease, background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="card" style={{ 
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '380px',
          height: '600px',
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          zIndex: 999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          
          {/* Chat Header */}
          <div style={{ backgroundColor: 'var(--bg-dark)', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '20px' }}>
              <FaRobot />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', letterSpacing: '1px' }}>{lang === 'en' ? "ARIA Reflection" : "تأمل أريا"}</h3>
              <p style={{ margin: 0, fontSize: '11px', opacity: 0.7, textTransform: 'uppercase' }}>{lang === 'en' ? "Aramco Intelligence" : "ذكاء أرامكو"}</p>
            </div>
            <div style={{ marginLeft: lang === 'en' ? 'auto' : '0', marginRight: lang === 'ar' ? 'auto' : '0', fontSize: '12px', opacity: 0.8 }}>
              {messages.filter(m => m.role === 'user').length} / {MAX_EXCHANGES}
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '15px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  lineHeight: '1.4',
                  fontSize: '14px',
                  backgroundColor: msg.role === 'user' ? 'rgba(0, 166, 81, 0.15)' : 'var(--bg-dark)',
                  color: msg.role === 'user' ? 'var(--text-dark)' : 'white',
                  border: msg.role === 'user' ? '1px solid rgba(0, 166, 81, 0.3)' : '1px solid var(--bg-dark)',
                  borderBottomRightRadius: msg.role === 'user' && lang === 'en' ? '0' : msg.role === 'user' && lang === 'ar' ? '8px' : '8px',
                  borderBottomLeftRadius: msg.role === 'assistant' && lang === 'en' ? '0' : msg.role === 'assistant' && lang === 'ar' ? '8px' : '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && !isSessionComplete && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                 <div style={{
                    padding: '12px 15px',
                    borderRadius: '8px',
                    borderBottomLeftRadius: lang === 'en' ? '0' : '8px',
                    borderBottomRightRadius: lang === 'ar' ? '0' : '8px',
                    backgroundColor: 'var(--bg-dark)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                   <span style={{ fontSize: '13px', fontStyle: 'italic', opacity: 0.8 }}>{lang === 'en' ? "ARIA is reflecting" : "أريا تتأمل"}</span>
                   <div className="typing-dots">
                     <span>.</span><span>.</span><span>.</span>
                   </div>
                 </div>
              </div>
            )}

            {isSessionComplete && (
              <div style={{ 
                backgroundColor: 'rgba(200, 160, 74, 0.1)', 
                border: '1px solid var(--accent-color)', 
                padding: '15px', 
                borderRadius: '8px', 
                marginTop: '10px' 
              }}>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px', fontSize: '14px' }}>{lang === 'en' ? "Session Complete" : "اكتملت الجلسة"}</h4>
                <p style={{ fontSize: '13px', marginBottom: '10px' }}>{lang === 'en' ? "Here are 3 insights from our conversation:" : "إليك 3 رؤى من محادثتنا:"}</p>
                <div style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {summary}
                </div>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <button className="btn" style={{ padding: '8px 15px', fontSize: '12px' }} onClick={handleSaveReflection}>{lang === 'en' ? "Save My Reflection" : "حفظ تأملاتي"}</button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Predefined Questions */}
          {!isSessionComplete && (
            <div style={{ borderTop: '1px solid #eee', padding: '15px', backgroundColor: 'white', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === 'en' ? "Select a Question" : "اختر سؤالاً"}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PREDEFINED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPredefined(q)}
                    disabled={isLoading}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: 'rgba(0, 166, 81, 0.05)',
                      border: '1px solid var(--secondary-color)',
                      borderRadius: '20px',
                      color: 'var(--primary-color)',
                      fontSize: '13px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      textAlign: lang === 'ar' ? 'right' : 'left',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if(!isLoading) { e.currentTarget.style.backgroundColor = 'var(--secondary-color)'; e.currentTarget.style.color = 'white'; }}}
                    onMouseLeave={e => { if(!isLoading) { e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.05)'; e.currentTarget.style.color = 'var(--primary-color)'; }}}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <style dangerouslySetInnerHTML={{__html: `
            .typing-dots span {
              animation: blink 1.4s infinite both;
              font-weight: bold;
              font-size: 16px;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes blink {
              0% { opacity: 0.2; }
              20% { opacity: 1; }
              100% { opacity: 0.2; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />
        </div>
      )}
    </>
  );
}

export default AiChatbot;
