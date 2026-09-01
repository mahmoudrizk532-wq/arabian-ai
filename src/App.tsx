import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Library, 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Code, 
  Send, 
  Paperclip,
  Menu,
  X,
  AlertTriangle,
  KeyRound
} from 'lucide-react';

// مفتاح API الخاص بك
const GEMINI_API_KEY = "AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg";

// البريد المميز ورمز التفعيل الخاص بك
const VIP_EMAIL = "mahmoudrizk532@gmail.com";
const VIP_PASSCODE = "01205729239657Mm. Rizk$";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
}

const SECTIONS = [
  { id: 'library', name: 'المكتبة', icon: Library },
  { id: 'designs', name: 'التصميمات', icon: Palette },
  { id: 'logo', name: 'صنع اللوجو', icon: Sparkles },
  { id: 'ads', name: 'المنشورات الدعائية', icon: ImageIcon },
  { id: 'apps', name: 'صنع التطبيقات', icon: Code },
];

export default function App() {
  const [userEmail] = useState<string>(VIP_EMAIL);
  const [passcode, setPasscode] = useState<string>('');
  const [isActivatedByCode, setIsActivatedByCode] = useState<boolean>(false);

  // التحقق هل الحساب مفعل عبر البريد المميز أو عبر رمز التفعيل
  const isVipUser = (userEmail.toLowerCase().trim() === VIP_EMAIL.toLowerCase()) || isActivatedByCode;

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: isVipUser 
        ? `مرحباً محمود (${VIP_EMAIL})! تم التعرف على حسابك وتفعيل كافة المزايا المتقدمة مجاناً بدون اشتراك 🔓.`
        : 'أهلاً بك! يرجى إدخال رمز التفعيل أو الاشتراك للوصول إلى كافة المزايا المتقدمة.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'designs' | 'logo' | 'ads' | 'apps'>('chat');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // دالة تفعيل الكود
  const handleActivatePasscode = () => {
    if (passcode.trim() === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      alert("تم تفعيل جميع الخدمات بنجاح! مرحباً بك في VIP UNLIMITED 🚀");
    } else {
      alert("رمز التفعيل غير صحيح!");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات متاح فقط لحسابات VIP أو بعد تفعيل الرمز!");
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
          text: '⚠️ ميزة توليد الصور واللوجوهات مغلقة. يرجى تسجيل الدخول بحساب mahmoudrizk532@gmail.com أو أدخل رمز التفعيل الصحيح.'
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

  const getActiveSectionName = () => {
    if (activeTab === 'chat') return 'المحادثة الرئيسية';
    return SECTIONS.find(s => s.id === activeTab)?.name || 'القسم المجهول';
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 dir-rtl font-sans antialiased overflow-hidden">
      
      {/* القائمة الجانبية (Sidebar) */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-l border-gray-100`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            <span>Arabian AI</span>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {/* زر محادثة جديدة */}
          <button 
            onClick={() => { setActiveTab('chat'); setMessages([{ id: Date.now().toString(), sender: 'ai', text: `مرحباً محمود (${VIP_EMAIL})! تم التعرف على حسابك وتفعيل كافة المزايا المتقدمة مجاناً بدون اشتراك 🔓.`}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-5 rounded-2xl font-semibold transition-colors shadow-sm"
          >
            <Plus size={19} className="shrink-0" />
            <span>محادثة جديدة ✏️</span>
          </button>

          {/* بطاقة حالة البريد والمستخدم */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 shadow-inner">
            <div className="text-xs font-medium text-gray-500">البريد النشط:</div>
            <div className="text-sm font-bold text-gray-800 truncate" title={userEmail}>{userEmail}</div>
          </div>

          {/* حالة الاشتراك / إدخال الرمز */}
          {isVipUser ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-2xl border border-green-200 text-sm font-bold flex items-center gap-3 shadow-green-100/30 shadow-sm">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <span>تم تفعيل الوصول الكامل والكرت المفتوح مجاناً!</span>
            </div>
          ) : (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3 shadow-amber-100/30 shadow-sm">
              <div className="text-amber-900 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>إدخال رمز التفعيل المميز</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخل الرمز هنا..."
                  className="w-full bg-white text-xs p-2 rounded-xl border border-amber-300 outline-none"
                />
                <button 
                  onClick={handleActivatePasscode}
                  className="bg-amber-600 text-white p-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shrink-0"
                >
                  <KeyRound size={16} />
                </button>
              </div>
            </div>
          )}

          {/* أقسام الملاحة (Navigation Sections) */}
          <div className="pt-5 border-t border-gray-100 space-y-1.5">
            <div className="text-xs font-bold text-gray-400 px-3 pb-2.5 tracking-wider">الأقسام الرئيسية</div>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveTab(section.id as any); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === section.id 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  <Icon size={19} className={`shrink-0 ${activeTab === section.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 mt-auto bg-gray-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
             <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-inner">M</div>
             <span className="font-semibold text-sm text-gray-800 truncate" title="MAHMOUD RIZK">MAHMOUD RIZK</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isVipUser ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
            {isVipUser ? 'VIP UNLIMITED' : 'FREE'}
          </span>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
        {/* الشريط العلوي (Header) */}
        <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 md:hidden transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isVipUser ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>M</div>
            <span className="font-bold text-lg text-gray-900">
              {getActiveSectionName()}
            </span>
          </div>
          <div className="w-6" />
        </header>

        {/* منطقة إظهار المحادثات والرسائل */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="media" className="max-w-full rounded-xl mb-2 border border-gray-100 shadow-sm" />
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm animate-pulse">جاري التفكير والتوليد... ⏳</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* حقل الإدخال السفلي */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-gray-100 p-2 rounded-2xl border border-gray-200 shadow-sm">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-2 rounded-xl transition-colors ${isVipUser ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-200'}`}
              title={isVipUser ? "إرفاق ملف" : "متاح فقط للـ VIP"}
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? `جاهز لإرسال: ${selectedFile.name}` : "اكتب سؤالك أو طلبك هنا..."} 
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
            />
            <button 
              onClick={handleSend} 
              disabled={loading}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow disabled:bg-gray-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
