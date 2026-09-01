import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'أهلاً بك! أنا مساعدك العربي الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // محاكاة استجابة ذكية (يمكن ربطها بـ API الخاص بك هنا)
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `تم استلام سؤالك: "${userMsg.text}". أنا جاهز للإجابة والتفاعل معك!`
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      direction: 'rtl'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: '#38bdf8'
      }}>
        🤖 المساعد العربي الذكي (Arabian AI)
      </header>

      {/* Messages Box */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#0284c7' : '#334155',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '16px',
            maxWidth: '80%',
            lineHeight: '1.5',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.9rem' }}>
            جاري التفكير والأجابة... ⏳
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب سؤالك هنا..."
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid #475569',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '14px 24px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          إرسال 🚀
        </button>
      </div>
    </div>
  );
}
