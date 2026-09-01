import React, { useState, useRef, useEffect } from 'react';

interface ChatHistory {
  id: string;
  title: string;
  category: string;
  messages: { sender: 'user' | 'ai'; text: string }[];
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'design' | 'marketing' | 'pricing'>('chat');
  
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'مرحباً بك في Arabian AI! كيف يمكنني مساعدتك في مشروعك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // محاكاة تسجيل الدخول بحساب جوجل
  const handleGoogleLogin = () => {
    setUser({ name: 'المستخدم المحترف', email: 'user@gmail.com' });
    setIsLoggedIn(true);
  };

  // حفظ المحادثة الحالية
  const saveCurrentChat = (newMessages: { sender: 'user' | 'ai'; text: string }[]) => {
    setHistory(prev => {
      const existing = prev.find(h => h.id === currentChatId);
      if (existing) {
        return prev.map(h => h.id === currentChatId ? { ...h, messages: newMessages } : h);
      } else {
        return [{
          id: currentChatId,
          title: newMessages[1]?.text.slice(0, 20) || 'محادثة جديدة',
          category: activeTab,
          messages: newMessages
        }, ...prev];
      }
    });
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: input };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    const currentInput = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiText = '';
      if (activeTab === 'code') {
        aiText = `💻 [استوديو البرمجة والتطبيقات]\nتم بناء هيكل التطبيق لطلبك: "${currentInput}"\n\n\`\`\`javascript\n// App Component\nexport default function DynamicApp() {\n  return <div>تطبيقك جاهز للتشغيل!</div>;\n}\n\`\`\``;
      } else if (activeTab === 'design') {
        aiText = `🎨 [استوديو اللوجو والتصميم]\nتم توليد الشعار والتصميم لـ: "${currentInput}"\n\n✨ النمط: Modern Minimalist\n🎨 الألوان: Gold & Navy Blue\n📐 الصيغ: SVG / PNG الجاهزة للتحميل.`;
      } else if (activeTab === 'marketing') {
        aiText = `📢 [استوديو التسويق والمنشورات]\nإليك خطة المنشور الإعلاني لـ "${currentInput}":\n\n🚀 "ارتقِ بأعمالك الآن مع أحدث حلول الذكاء الاصطناعي!"\n#إعلان #تطوير #ابتكار`;
      } else {
        aiText = `🤖 تم استلام سؤالك: "${currentInput}". كيف يمكنني تطوير هذه الفكرة أكثر؟`;
      }

      const finalMsgs = [...updatedMsgs, { sender: 'ai' as const, text: aiText }];
      setMessages(finalMsgs);
      saveCurrentChat(finalMsgs);
      setLoading(false);
    }, 1000);
  };

  // شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0b0f19', color: '#fff', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: 'rtl', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          {/* اللوجو الاحترافي */}
          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #0284c7, #6366f1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px auto', boxShadow: '0 4px 20px rgba(2,132,199,0.4)' }}>
            ✨
          </div>
          <h2 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Arabian AI Pro</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>منصتك الشاملة لإنشاء التطبيقات، التصاميم، والمحتوى</p>
          
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#ffffff', color: '#000', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span>🔒</span> متابعة باستخدام حساب Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b0f19', color: '#fff', direction: 'rtl', fontFamily: 'sans-serif' }}>
      
      {/* القائمة الجانبية (Sidebar) */}
      <div style={{
        position: 'fixed', top: 0, right: sidebarOpen ? 0 : '-280px', width: '280px', height: '100%', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', transition: '0.3s', zIndex: 1000, padding: '16px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#38bdf8' }}>الأقسام والمحادثات</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* الأقسام الرئيسيّة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }} style={sideBtnStyle(activeTab === 'chat')}>💬 المحادثة العامة</button>
          <button onClick={() => { setActiveTab('code'); setSidebarOpen(false); }} style={sideBtnStyle(activeTab === 'code')}>💻 صناعة التطبيقات والبرمجة</button>
          <button onClick={() => { setActiveTab('design'); setSidebarOpen(false); }} style={sideBtnStyle(activeTab === 'design')}>🎨 اللوجو والتصميم</button>
          <button onClick={() => { setActiveTab('marketing'); setSidebarOpen(false); }} style={sideBtnStyle(activeTab === 'marketing')}>📢 المنشورات الإعلانية</button>
          <button onClick={() => { setActiveTab('pricing'); setSidebarOpen(false); }} style={sideBtnStyle(activeTab === 'pricing')}>⭐ باقات الاشتراك</button>
        </div>

        <hr style={{ borderColor: '#334155', width: '100%', marginBottom: '16px' }} />

        {/* السجل الأخير للمحادثات */}
        <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>آخر المحادثات</h4>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {history.length === 0 ? <span style={{ fontSize: '0.8rem', color: '#64748b' }}>لا يوجد سجل بعد</span> :
            history.map(h => (
              <div key={h.id} onClick={() => { setMessages(h.messages); setSidebarOpen(false); }} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', fontSize: '0.85rem', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {h.title}
              </div>
            ))
          }
        </div>

        {/* معلومات المستخدم */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid #334155', fontSize: '0.85rem', color: '#94a3b8' }}>
          👤 {user?.name}
        </div>
      </div>

      {/* الشاشة الرئيسية */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {/* الهيدر الأعلـى */}
        <header style={{ padding: '12px 16px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0284c7, #6366f1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✨</div>
            <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
              {activeTab === 'chat' && 'المحادثة الذكية'}
              {activeTab === 'code' && 'صناعة التطبيقات والبرمجة'}
              {activeTab === 'design' && 'استوديو اللوجو والتصميم'}
              {activeTab === 'marketing' && 'صناعة المنشورات الإعلانية'}
              {activeTab === 'pricing' && 'خطط الاشتراك'}
            </span>
          </div>

          <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>خروج</button>
        </header>

        {/* محتوى قسم الباقات والاشتراكات */}
        {activeTab === 'pricing' ? (
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ color: '#38bdf8' }}>اختر خطة الاشتراك المناسبة</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', width: '100%' }}>
              <div style={planCard}>
                <h3>الخطة المجانية</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$0 / شهرياً</p>
                <ul>
                  <li>10 محادثات يومياً</li>
                  <li>مولد أكواد أساسي</li>
                </ul>
                <button style={planBtn}>مُفعل حالياً</button>
              </div>
              <div style={{ ...planCard, borderColor: '#0284c7', backgroundColor: '#1e293b' }}>
                <h3 style={{ color: '#38bdf8' }}>الخطة الاحترافية Pro</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$19 / شهرياً</p>
                <ul>
                  <li>استخدام بلا حدود</li>
                  <li>بناء تطبيقات كاملة</li>
                  <li>تصدير الشعارات بدقة عالية</li>
                </ul>
                <button style={{ ...planBtn, backgroundColor: '#0284c7' }}>الاشتراك الان</button>
              </div>
            </div>
          </div>
        ) : (
          /* منطقة المحادثة والإدخال */
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#0284c7' : '#1e293b',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {msg.text}
                </div>
              ))}
              {loading && <div style={{ alignSelf: 'flex-start', color: '#94a3b8' }}>جاري التوليد والمعالجة... ⏳</div>}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '12px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب طلبك أو فكرتك هنا..."
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0b0f19', color: '#fff', outline: 'none' }}
              />
              <button onClick={handleSend} style={{ padding: '12px 20px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                إرسال ⚡
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const sideBtnStyle = (active: boolean) => ({
  width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: active ? '#0284c7' : '#0f172a', color: '#fff', textAlign: 'right' as const, cursor: 'pointer'
});

const planCard = {
  flex: 1, minWidth: '240px', padding: '20px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', textAlign: 'center' as const
};

const planBtn = {
  width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#475569', color: '#fff', cursor: 'pointer', fontWeight: 'bold' as const, marginTop: '12px'
};
