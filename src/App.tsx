import React, { useState, useRef, useEffect } from 'react';

// مفتاح API الخاص بك
const GEMINI_API_KEY = "AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg";

// البريد المميز المسموح له بتخطي الاشتراكات وفتح كل المزايا
const VIP_EMAIL = "mahmoudrizk532@gmail.com";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
}

export default function App() {
  // البريد الحالي للمستخدم
  const [userEmail, setUserEmail] = useState<string>(VIP_EMAIL);
  
  // التحقق تلقائياً هل هذا البريد هو البريد المسموح له بفتح جميع المزايا
  const isVipUser = userEmail.toLowerCase().trim() === VIP_EMAIL.toLowerCase();

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: isVipUser 
        ? `مرحباً محمود (${VIP_EMAIL})! تم التعرف على حسابك وتفعيل كافة المزايا المتقدمة مجاناً بدون اشتراك 🔓.`
        : 'أهلاً بك! يرجى الاشتراك للوصول إلى كافة المزايا المتقدمة.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات متاح فقط للحساب المميز أو بعد الاشتراك!");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userQuery = input.trim();
    let mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userQuery || `[تم إرفاق ملف: ${selectedFile?.name}]`, 
      mediaUrl 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    // فحص طلبات الصور واللوجوهات
    const isImageRequest = /ارسم|صورة|لوجو|شعار|صمم|تصميم/i.test(userQuery);

    if (isImageRequest) {
      if (!isVipUser) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '⚠️ ميزة توليد الصور واللوجوهات مغلقة. يرجى تسجيل الدخول بحساب mahmoudrizk532@gmail.com أو الترقية لفتحها.'
        }]);
        setLoading(false);
        return;
      }

      const promptEncoded = encodeURIComponent(userQuery);
      const generatedImageUrl = `https://pollinations.ai/p/${promptEncoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `🎨 تم إنشاء التصميم بنجاح لـ (${VIP_EMAIL}): "${userQuery}"`,
          mediaUrl: generatedImageUrl,
          isImage: true
        }]);
        setLoading(false);
      }, 1500);
      return;
    }

    // الاتصال بمحرك Gemini API
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }]
        })
      });

      const data = await response.json();
      
      let aiText = '';
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else {
        aiText = 'عذراً، حدثت مشكلة أثناء المعالجة، يرجى إعادة المحاولة.';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText }]);

    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: 'حدث خطأ في الاتصال بالسيرفر.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f4f9', color: '#1f1f1f', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* القائمة الجانبية */}
      <div style={{
        position: 'fixed', top: 0, right: sidebarOpen ? 0 : '-300px', width: '280px', height: '100%', backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', transition: '0.3s ease', zIndex: 1000, padding: '16px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arabian AI</span>
        </div>

        <button onClick={() => { setMessages([]); setSidebarOpen(false); }} style={{ width: '100%', padding: '12px', borderRadius: '25px', border: 'none', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' }}>
          ✏️ محادثة جديدة
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fff', fontSize: '0.85rem', color: '#475569', border: '1px solid #e2e8f0' }}>
            <strong>البريد النشط:</strong><br />
            {userEmail}
          </div>

          {isVipUser ? (
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontWeight: 'bold', fontSize: '0.85rem' }}>
              ✅ تم تفعيل الوصول الكامل والكرت المفتوح مجاناً!
            </div>
          ) : (
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', fontSize: '0.85rem' }}>
              🔒 حساب عادي (يلزم الاشتراك أو الدخول بحساب VIP)
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>MAHMOUD RIZK</span>
          <span style={{ backgroundColor: isVipUser ? '#10b981' : '#64748b', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
            {isVipUser ? 'VIP UNLIMITED' : 'FREE'}
          </span>
        </div>
      </div>

      {/* الشاشة الرئيسية */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {/* الشريط العلوي */}
        <header style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: isVipUser ? '#10b981' : '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>M</div>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
              {isVipUser ? 'Gemini Pro VIP (غير محدود)' : 'Gemini Basic'}
            </span>
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>☰</button>
        </header>

        {/* منطقة الرسائل */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#e0f2fe' : '#ffffff',
                color: '#0f172a',
                padding: '14px 18px',
                borderRadius: '20px',
                maxWidth: '85%',
                lineHeight: '1.6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: msg.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="media" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '10px', display: 'block' }} />
                )}
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', color: '#64748b' }}>جاري التفكير والتوليد... ⏳</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* حقل الإدخال */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '720px', backgroundColor: '#ffffff', borderRadius: '30px', border: '1px solid #cbd5e1', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: isVipUser ? '#0284c7' : '#94a3b8' }} title={isVipUser ? "إرفاق ملف" : "متاح فقط للـ VIP"}>+</button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? `جاهز لإرسال: ${selectedFile.name}` : "اكتب سؤالك أو طلبك هنا..."}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', backgroundColor: 'transparent' }}
            />

            <button onClick={handleSend} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
