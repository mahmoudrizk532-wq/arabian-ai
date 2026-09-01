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
  KeyRound,
  ShieldCheck,
  Zap
} from 'lucide-react';

// مفتاح API الخاص بك (Gemini API)
const GEMINI_API_KEY = "AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg";

// البريد المميز ورمز التفعيل الخاص بك
const VIP_EMAIL = "mahmoudrizk532@gmail.com";
const VIP_PASSCODE = "01205729239657Mm. Rizk$";

// واجهة الرسائل
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
}

// الأقسام الرئيسية في القائمة الجانبية
const SECTIONS = [
  { id: 'library', name: 'المكتبة الرقمية', icon: Library },
  { id: 'designs', name: 'استوديو التصميم', icon: Palette },
  { id: 'logo', name: 'صناعة الشعارات', icon: Sparkles },
  { id: 'ads', name: 'الحملات الإعلانية', icon: ImageIcon },
  { id: 'apps', name: 'تطوير البرمجيات', icon: Code },
];

export default function App() {
  const [userEmail] = useState<string>(VIP_EMAIL);
  const [passcode, setPasscode] = useState<string>('');
  const [isActivatedByCode, setIsActivatedByCode] = useState<boolean>(false);

  // التحقق هل الحساب مفعل عبر البريد المميز أو عبر رمز التفعيل
  const isVipUser = (userEmail.toLowerCase().trim() === VIP_EMAIL.toLowerCase()) || isActivatedByCode;

  // المحادثة الابتدائية
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: isVipUser 
        ? `أهلاً بك يا محمود 👋\nتم التعرف على حسابك وتفعيل نظام VIP الذهبي بالكامل. جميع المزايا المتقدمة وتوليد الصور والتحليل متاح الآن مجاناً بدون اشتراك 🔓.`
        : 'أهلاً بك في Arabian AI. أدخل رمز التفعيل أو اشترك للوصول إلى كافة المزايا المتقدمة.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'designs' | 'logo' | 'ads' | 'apps'>('chat');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير تلقائياً لآخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // دالة تفعيل الكود
  const handleActivatePasscode = () => {
    if (passcode.trim() === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      alert("تم تفعيل حساب VIP بنجاح! مرحباً بك في VIP UNLIMITED 🚀");
    } else {
      alert("رمز التفعيل غير صحيح!");
    }
  };

  // دالة التعامل مع رفع الملفات
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات متاح فقط لحسابات VIP! يرجى التفعيل.");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // دالة إرسال الرسائل
  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userQuery = input.trim();
    let mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    
    // إضافة رسالة المستخدم
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
        // حجب الخدمة لغير VIP
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '⚠️ ميزة توليد الصور واللوجوهات مغلقة. يرجى تفعيل رمز VIP الخاص بك في القائمة الجانبية أو تسجيل الدخول بحساب mahmoudrizk532@gmail.com لفتحها.'
        }]);
        setLoading(false);
        return;
      }

      // توليد الصورة لـ VIP
      const promptEncoded = encodeURIComponent(userQuery);
      const generatedImageUrl = `https://pollinations.ai/p/${promptEncoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `✨ تم إنشاء التصميم بنجاح لـ (${VIP_EMAIL}): "${userQuery}"`,
          mediaUrl: generatedImageUrl,
          isImage: true
        }]);
        setLoading(false);
      }, 1500);
      return;
    }

    // توليد النص عبر Gemini API لغير طلبات الصور
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
    // الخلفية العامة السوداء الداكنة
    <div className="flex h-screen bg-[#0b0f17] text-gray-100 dir-rtl font-sans antialiased overflow-hidden">
      
      {/* القائمة الجانبية (Sidebar) - Dark Mode */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#111622]/95 backdrop-blur-xl shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-l border-gray-800/60`}>
        {/* هيدر القائمة الجانبية */}
        <div className="p-5 border-b border-gray-800/60 flex justify-between items-center bg-[#111622]">
          <h1 className="text-xl font-black text-white tracking-wider flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap size={20} />
            </div>
            <span>Arabian <span className="text-emerald-400">AI</span></span>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50">
            <X size={20} />
          </button>
        </div>

        {/* محتوى القائمة الجانبية */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          {/* زر محادثة جديدة */}
          <button 
            onClick={() => { setActiveTab('chat'); setMessages([{ id: Date.now().toString(), sender: 'ai', text: `أهلاً بك محمود (${VIP_EMAIL})! تم تفعيل نظام VIP الذهبي بالكامل.`}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 py-3 px-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-98"
          >
            <Plus size={18} />
            <span>محادثة جديدة✏️</span>
          </button>

          {/* بطاقة الحساب المميز */}
          <div className="bg-[#182030]/60 p-3.5 rounded-xl border border-gray-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>الحساب النشط:</span>
            </div>
            <div className="text-xs font-mono font-medium text-emerald-300 truncate" title={userEmail}>{userEmail}</div>
          </div>

          {/* حالة الاشتراك / إدخال الرمز */}
          {isVipUser ? (
            <div className="bg-emerald-950/40 text-emerald-300 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-semibold flex items-center gap-2.5 shadow-green-100/10 shadow-sm">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>تغطية VIP وميزات المحترفين مفعّلة بالكامل والكرت المفتوح مجاناً!</span>
            </div>
          ) : (
            <div className="bg-[#1c170d] p-3.5 rounded-xl border border-amber-500/30 space-y-2.5 shadow-amber-100/10 shadow-sm">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>إدخال رمز التفعيل المميز🔑</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="رمز VIP..."
                  className="w-full bg-[#0b0f17] text-xs p-2 rounded-lg border border-amber-500/20 text-white outline-none focus:border-amber-500/50 placeholder-gray-600"
                />
                <button 
                  onClick={handleActivatePasscode}
                  className="bg-amber-500 text-gray-950 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors shrink-0"
                >
                  <KeyRound size={15} />
                </button>
              </div>
            </div>
          )}

          {/* قائمة الأقسام */}
          <div className="pt-3 border-t border-gray-800/60 space-y-1">
            <div className="text-[11px] font-bold text-gray-400 px-3 pb-2 uppercase tracking-wider">الأقسام الرئيسية</div>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveTab(section.id as any); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                      : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-gray-400'} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* أسفل القائمة الجانبية - معلومات محمود */}
        <div className="p-4 border-t border-gray-800/60 bg-[#0d121c] flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">M</div>
             <span className="font-bold text-xs text-gray-200 truncate" title="MAHMOUD RIZK">MAHMOUD RIZK</span>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${isVipUser ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'} tracking-wider`}>
            {isVipUser ? 'VIP UNLIMITED' : 'FREE'}
          </span>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0b0f17]">
        {/* الشريط العلوي (Header) */}
        <header className="bg-[#111622]/80 backdrop-blur-md border-b border-gray-800/60 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white md:hidden p-1.5 rounded-lg hover:bg-gray-800/50">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isVipUser ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`}></span>
            <span className="font-bold text-sm text-gray-100">
              {getActiveSectionName()}
            </span>
          </div>
          <div className="w-6" />
        </header>

        {/* مساحة المحادثة والرسائل */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center scrollbar-thin scrollbar-thumb-gray-800">
          <div className="w-full max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[88%] text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-medium shadow-lg shadow-emerald-500/10' 
                    : 'bg-[#141b27] border border-gray-800 text-gray-200 shadow-md'
                }`}>
                  {msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="media" className="max-w-full rounded-xl mb-3 border border-gray-700/50 shadow-lg" />
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-pulse bg-emerald-950/30 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-fit">
                <Sparkles size={14} />
                <span>جاري معالجة طلبك بواسطة الذكاء الاصطناعي والتوليد...⏳</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* حقل الإدخال السفلي والتحكم */}
        <div className="p-4 bg-[#111622]/90 border-t border-gray-800/60 shadow-inner-dark">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#171f2e] p-2 rounded-2xl border border-gray-800 focus-within:border-emerald-500/50 transition-all shadow-xl">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-2.5 rounded-xl transition-colors ${isVipUser ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:bg-gray-800/50'}`}
              title={isVipUser ? "إرفاق ملف" : "متاح فقط للـ VIP"}
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? `الملف: ${selectedFile.name}` : "اكتب سؤالك أو اكتب طلب تصميم..."} 
              className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm px-2 text-gray-100 placeholder-gray-500"
            />
            <button 
              onClick={handleSend} 
              disabled={loading}
              className="p-2.5 bg-emerald-500 text-gray-950 rounded-xl hover:bg-emerald-400 transition-all font-bold disabled:opacity-40 shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
