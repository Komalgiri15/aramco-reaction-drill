import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaAngleUp } from 'react-icons/fa';
import chatbotGif from '../assets/Chatbot.gif';

const ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE";
// Replace with your actual key before deployment

const SYSTEM_PROMPT = "You are ARIA, a digital facilitator for Aramco's Leadership Development Program. Your role is based on 'Activity 2: Group Discussion'. Your goal is to help participants slow down and reflect on their instinctual reactions. You guide them through three stages: Emotion (how they feel), Thought (the stories they tell themselves), and Reaction (how they actually behave). Always validate their honesty and never give direct advice. Keep your responses short (1-2 sentences) and always end with one probing question that helps them separate fact from feeling. Your ultimate goal is to reinforce the pattern: Feedback triggers emotion -> Emotion drives thinking -> Thinking drives reaction.";

const INITIAL_MESSAGE = "In the last activity, you reacted instantly. Now let’s slow down and reflect. When you receive feedback... what is your first reaction? Don't give the ideal answer. Let's explore what actually happens.";

const PREDEFINED_QUESTIONS_EN = [
  "I feel uncomfortable and judged.",
  "I immediately start defending myself.",
  "I try to explain why it's unfair.",
  "I stay quiet but feel frustrated inside."
];

const PREDEFINED_QUESTIONS_AR = [
  "أشعر بعدم الراحة وكأنني محكوم علي.",
  "أبدأ فوراً في الدفاع عن نفسي.",
  "أحاول شرح لماذا هذا غير عادل.",
  "أبقى صامتاً ولكن أشعر بالإحباط من الداخل."
];

const PREDEFINED_RESPONSES_EN = {
  "I feel uncomfortable and judged.": "That's an honest start. This discomfort is your brain's threat-detection system identifying a shift in your social status. Why do you think your brain interprets 'Improvement' as 'Judgment' in that moment?",
  "I immediately start defending myself.": "Defending is a natural ego shield. It's the 'React' part of our chain. Before you spoke, what was the very first emotion you felt, and what story did your mind tell you about the person giving the feedback?",
  "I try to explain why it's unfair.": "Explaining is often just a sophisticated way of justifying. It's your brain trying to maintain its sense of competence. If you were to stop explaining for 10 seconds, what uncomfortable thought would rise to the surface?",
  "I stay quiet but feel frustrated inside.": "Staying silent is a withdrawal reaction—an attempt to protect yourself by closing off. Inside that frustration, what specific word or phrase in the feedback triggered the feeling of unfairness?"
};

const PREDEFINED_RESPONSES_AR = {
  "أشعر بعدم الراحة وكأنني محكوم علي.": "هذه بداية صادقة. عدم الراحة هذا هو نظام كشف التهديدات في دماغك الذي يحدد تحولاً في وضعك الاجتماعي. لماذا تعتقد أن دماغك يفسر 'التحسين' على أنه 'حكم' في تلك اللحظة؟",
  "أبدأ فوراً في الدفاع عن نفسي.": "الدفاع هو درع طبيعي للأنا. إنه جزء 'رد الفعل' في سلسلتنا. قبل أن تتحدث، ما هي أول عاطفة شعرت بها، وما هي القصة التي رروها عقلك عن الشخص الذي قدم الملاحظات؟",
  "أحاول شرح لماذا هذا غير عادل.": "الشرح غالباً ما يكون مجرد وسيلة متطورة للتبرير. إنه دماغك يحاول الحفاظ على شعوره بالكفاءة. إذا توقفت عن الشرح لمدة 10 ثوانٍ، فما هي الفكرة غير المريحة التي ستطفو على السطح؟",
  "أبقى صامتاً ولكن أشعر بالإحباط من الداخل.": "البقاء صامتاً هو رد فعل انسحابي - محاولة لحماية نفسك من خلال الانغلاق. داخل هذا الإحباط، ما هي الكلمة أو العبارة المحددة في الملاحظات التي أثارت الشعور بعدم العدالة؟"
};

const SUMMARY_RESPONSE_EN = "Key Learning: Feedback is difficult because of what happens inside us. Remember the pattern:\n> Feedback triggers Emotion\n> Emotion drives Thinking\n> Thinking drives Reaction\n\nTo move forward, focus on the 'Gap' between the emotion and the reaction.";
const SUMMARY_RESPONSE_AR = "التعلم الأساسي: الملاحظات صعبة بسبب ما يحدث داخلنا. تذكر النمط:\n> الملاحظات تثير العاطفة\n> العاطفة تحرك التفكير\n> التفكير يحرك رد الفعل\n\nللمضي قدماً، ركز على 'الفجوة' بين العاطفة ورد الفعل.";

function AiChatbot({ onComplete = () => {}, lang = 'en', fullPage = false }) {
  const INITIAL_MESSAGE = lang === 'en' 
    ? "Hello. I'm ARIA — your personal reflection guide for today's session. This is a private, judgment-free space. I have some pre-defined areas we can explore, or you can select one below."
    : "مرحباً. أنا أريا — دليلك الشخصي للتأمل في جلسة اليوم. هذه مساحة خاصة خالية من الأحكام. لدي بعض المجالات المحددة مسبقاً التي يمكننا استكشافها معاً.";

  const [isOpen, setIsOpen] = useState(fullPage);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Reset conversation if language changes
    setMessages([{ role: 'assistant', content: INITIAL_MESSAGE }]);
  }, [lang, INITIAL_MESSAGE]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [summary, setSummary] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleAriaHelp = (e) => {
      const msg = e.detail;
      setIsOpen(true);
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    };
    window.addEventListener('aria-help', handleAriaHelp);
    return () => window.removeEventListener('aria-help', handleAriaHelp);
  }, []);

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

  if (fullPage) {
    return (
      <div className="card chat-mission-container" style={{ 
        width: '100%', 
        height: '600px', 
        padding: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Chat Header */}
        <div style={{ backgroundColor: 'var(--bg-dark)', color: 'white', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '15px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '24px', flexShrink: 0 }}>
            <img src={chatbotGif} alt="ARIA" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>{lang === 'en' ? "ARIA: Cognitive Mapping" : "أريا: رسم الخرائط المعرفية"}</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>{lang === 'en' ? "Mission 02 | Interactive Reflection" : "المهمة ٠٢ | التأمل التفاعلي"}</p>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '15px' }}>
            {messages.filter(m => m.role === 'user').length} / {MAX_EXCHANGES}
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '25px', overflowY: 'auto', backgroundColor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: '20px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '15px 20px',
                borderRadius: '12px',
                lineHeight: '1.6',
                fontSize: '15px',
                backgroundColor: msg.role === 'user' ? 'rgba(0, 166, 81, 0.1)' : 'white',
                color: 'var(--text-dark)',
                border: msg.role === 'user' ? '1px solid rgba(0, 166, 81, 0.2)' : '1px solid #eee',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                borderBottomRightRadius: msg.role === 'user' && lang === 'en' ? '0' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' && lang === 'en' ? '0' : '12px'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && !isSessionComplete && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
               <div style={{ padding: '15px 20px', borderRadius: '12px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <span style={{ fontSize: '14px', fontStyle: 'italic', color: '#666' }}>{lang === 'en' ? "ARIA is analyzing..." : "أريا تحلل..."}</span>
                 <div className="typing-dots"><span>.</span><span>.</span><span>.</span></div>
               </div>
            </div>
          )}

          {isSessionComplete && (
            <div style={{ 
              backgroundColor: 'rgba(200, 160, 74, 0.05)', 
              border: '1.5px dashed var(--accent-color)', 
              padding: '25px', 
              borderRadius: '15px', 
              marginTop: '10px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '16px', fontWeight: '800' }}>{lang === 'en' ? "MISSION 02 COMPLETE" : "اكتملت المهمة ٠٢"}</h4>
              <div style={{ fontSize: '15px', lineHeight: '1.7', textAlign: lang === 'ar' ? 'right' : 'left', marginBottom: '20px' }}>
                {summary}
              </div>
              <button className="btn" onClick={handleSaveReflection}>{lang === 'en' ? "COPY TRANSCRIPT" : "نسخ النص"}</button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Question Area */}
        {!isSessionComplete && (
          <div style={{ borderTop: '1px solid #eee', padding: '20px', backgroundColor: 'white', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '15px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
              {lang === 'en' ? "Select your response to proceed" : "اختر ردك للمتابعة"}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {PREDEFINED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPredefined(q)}
                  disabled={isLoading}
                  className="reaction-pill"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--secondary-color)',
                    color: 'var(--secondary-color)',
                    padding: '12px',
                    fontSize: '12px',
                    height: 'auto',
                    textAlign: 'center'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .typing-dots span { animation: blink 1.4s infinite both; }
          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        `}} />
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: isOpen ? '60px' : '90px',
          height: isOpen ? '60px' : '90px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isOpen ? '24px' : '28px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          outline: '4px solid rgba(255, 255, 255, 0.3)',
          outlineOffset: '-2px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <FaTimes /> : <img src={chatbotGif} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="card" style={{ 
          position: 'fixed',
          bottom: 'min(100px, 15vh)',
          right: 'min(30px, 5vw)',
          width: 'min(400px, 90vw)',
          height: 'min(700px, 80vh)',
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          zIndex: 999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          
          {/* Chat Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #0A1A2F, #0F79B9)', 
            color: 'white', 
            padding: '18px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            direction: lang === 'ar' ? 'rtl' : 'ltr',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <div style={{ width: '45px', height: '45px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #C8A04A', flexShrink: 0 }}>
              <img src={chatbotGif} alt="ARIA" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', letterSpacing: '1px', color: 'white' }}>{lang === 'en' ? "ARIA CONVERSATION" : "محادثة أريا"}</h3>
              <p style={{ margin: 0, fontSize: '10px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>{lang === 'en' ? "Aramco Intelligence" : "ذكاء أرامكو"}</p>
            </div>
            <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
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
                  padding: '12px 18px',
                  borderRadius: '12px',
                  lineHeight: '1.5',
                  fontSize: '14px',
                  backgroundColor: msg.role === 'user' ? 'white' : '#f0f0f0',
                  color: '#1a1a1a',
                  border: msg.role === 'user' ? '2px solid #39A646' : '1px solid #ddd',
                  borderBottomRightRadius: msg.role === 'user' && lang === 'en' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.role === 'assistant' && lang === 'en' ? '2px' : '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PREDEFINED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPredefined(q)}
                    disabled={isLoading}
                    style={{
                      padding: '12px 18px',
                      backgroundColor: 'white',
                      border: '1px solid #0F79B9',
                      borderRadius: '8px',
                      color: '#0F79B9',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      textAlign: lang === 'ar' ? 'right' : 'left',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={e => { if(!isLoading) { e.currentTarget.style.backgroundColor = '#0F79B9'; e.currentTarget.style.color = 'white'; }}}
                    onMouseLeave={e => { if(!isLoading) { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#0F79B9'; }}}
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
