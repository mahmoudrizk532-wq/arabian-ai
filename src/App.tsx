import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: 'code' | 'design' | 'text';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'design' | 'marketing'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'أهلاً بك في منصة الذكاء الاصطناعي الشاملة! اختر الخدمة المطلوبة ابدأ بالتفاعل.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let responseText = '';
      if (activeTab === 'code') {
        responseText = `🔨 [استوديو البرمجة والتطبيقات]\nتمت معالجة طلبك لتطوير: "${currentInput}"\n\n```javascript\n// كود برمجي جاهز بناءً على طلبك\nfunction createApplication() {\n  console.log("جاري إنشاء التطبيق وبناء الواجهات...");\n}\n````;
      } else if (activeTab === 'design') {
        responseText = `🎨 [استوديو التصميم واللوجو]\nجاري صياغة مفهوم التصميم والشعار لـ: "${currentInput}"\n\n- ألوان الشعار المقترحة: الأزرق والذهبي.\n- النمط: حديث وبسيط (Minimalist).\n- جاهز للتصدير كـ SVG/PNG.`;
      } else if (activeTab === 'marketing') {
        responseText = `📢 [مُنشئ المنشورات والإعلانات]\nإليك منشور إعلاني جاهز للنشر لـ "${currentInput}":\n\n🚀 "اكتشف الحل الأمثل لتطوير أعمالك اليوم! تصميمات احترافية وخدمات مبتكرة لتلبية احتياجاتك."\n#تسويق #إعلان #ابتكار`;
      } else {
        responseText = `🤖 تم استلام سؤالك: "${currentInput}". كيف يمكنني مساعدتك أكثر في هذا الموضوع؟`;
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif', direction: 'rtl' }}>
      
      {/* الهيدر وشريط الخدمات */}
      <header style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '12px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#38bdf8', fontSize: '1.2rem' }}>🚀 منصة الذكاء الاصطناعي الشاملة</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('chat')} style={tabStyle(activeTab === 'chat')}>💬 المحادثة</button>
          <button onClick={() => setActiveTab('code')} style={tabStyle(activeTab === 'code')}>💻 البرمجة والتطبيقات</button>
          <button onClick={() => setActiveTab('design')} style={tabStyle(activeTab === 'design')}>🎨 اللوجو والتصميم</button>
          <button onClick={() => setActiveTab('marketing')} style={tabStyle(activeTab === 'marketing')}>📢 المنشورات الإعلانية</button>
        </div>
      </header>

      {/* منطقة عرض الرسائل والنتائج */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#0284c7' : '#334155',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '85%',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: '#94a3b8' }}>جاري التوليد والمعالجة... ⏳</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* حقل الإدخال */}
      <div style={{ padding: '12px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            activeTab === 'code' ? 'اطلب كوداً أو فكرة تطبيق...' :
            activeTab === 'design' ? 'صف اللوجو أو التصميم المطلوب...' :
            activeTab === 'marketing' ? 'اكتب تفاصيل الإعلان أو المنشور...' : 'اكتب سؤالك هنا...'
          }
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
        />
        <button onClick={handleSend} style={{ padding: '12px 20px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          تنفيذ ⚡
        </button>
      </div>
    </div>
  );
}

const tabStyle = (isActive: boolean) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: isActive ? '#0284c7' : '#475569',
  color: '#fff',
  fontSize: '0.85rem',
  cursor: 'pointer'
});
