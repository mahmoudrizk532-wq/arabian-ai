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
  Zap,
  Download,
  Maximize2,
  Video,
  Gamepad2,
  Cpu
} from 'lucide-react';

// مفتاح API لـ Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg";

// بيانات حساب محمود رزق VIP
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
  { id: 'logo', name: 'تصميم الشعارات واللوجو 8K', icon: Sparkles },
  { id: 'designs', name: 'استوديو الصور والفنون', icon: Palette },
  { id: 'apps', name: 'تطوير الأكواد والبرمجيات', icon: Code },
  { id: 'games', name: 'مساعد تصميم الألعاب 3D', icon: Gamepad2 },
  { id: 'video', name: 'صناعة سيناريو الفيديو', icon: Video },
  { id: 'library', name: 'المكتبة الرقمية الشاملة', icon: Library },
];

export default function App() {
  const [userEmail] = useState<string>(VIP_EMAIL);
  const [passcode, setPasscode] = useState<string>('');
  const [isActivatedByCode, setIsActivatedByCode] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isVipUser = (userEmail.toLowerCase().trim() === VIP_EMAIL.toLowerCase()) || isActivatedByCode;

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: isVipUser 
        ? `مرحباً بك يا محمود (MAHMOUD RIZK) في تطبيق ARABIAN AI VIP 🚀\nتم تفعيل النظام الذهبي الشامل:\n• توليد وتنزيل الشعارات والتصاميم عالية الدقة 8K.\n• كتابة وتطوير أكواد البرمجة والألعاب.\n• معالجة واستجابة فورية عبر Gemini API.`
        : 'أهلاً بك في Arabian AI Pro. يرجى إدخال رمز VIP لفتح جميع الإمكانيات.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('logo');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleActivatePasscode = () => {
    if (passcode.trim() === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      alert("تم تفعيل حساب VIP الذهبي بنجاح!");
    } else {
      alert("رمز التفعيل غير صحيح!");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات متاح فقط لحسابات VIP!");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // دالة تنزيل الصور مباشرة على التليفون/الكمبيوتر
  const downloadImage = async (url: string, filename: string = 'ArabianAI-Design.png') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userQuery = input.trim();
    let mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userQuery || `[ملف مرفق: ${selectedFile?.name}]`, 
      mediaUrl 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    // فحص طلبات الصور واللوجوهات والتصاميم
    const isImageRequest = /ارسم|صورة|لوجو|شعار|صمم|تصميم|logo|image|draw/i.test(userQuery) || activeTab === 'logo' || activeTab === 'designs';

    if (isImageRequest && userQuery.length > 0) {
      if (!isVipUser) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '⚠️ ميزة توليد الصور واللوجوهات مخصصة لأعضاء VIP.'
        }]);
        setLoading(false);
        return;
      }

      const promptEncoded = encodeURIComponent(userQuery + ", ultra detailed 8k resolution, professional masterwork vector artwork");
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `✨ تم إنجاز التصميم بنجاح! اضغط على الصورة للتكبير أو اضغط زر التنزيل للحفظ المباشر على جهازك.`,
          mediaUrl: generatedImageUrl,
          isImage: true
        }]);
        setLoading(false);
      }, 2000);
      return;
    }

    // معالجة البرمجة والأكواد والردود العامة عبر Gemini API
    try {
      const systemContext = `أنت مساعد ذكي احترافي مدمج في تطبيق Arabian AI المصمم بواسطة MAHMOUD RIZK. قم بالرد بدقة عالية، وتوفير الأكواد كاملة بدون اختصارات عند طلب البرمجة.`;
      const fullPrompt = `${systemContext}\n\nطلب المستخدم: ${userQuery}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      const data = await response.json();
      
      let aiText = '';
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else {
        aiText = 'عذراً، حدثت مشكلة في الاتصال بالخادم الرئيسي، يرجى المحاولة ثانية.';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText }]);

    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: 'حدث خطأ في الشبكة أثناء الاتصال.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030508] text-gray-100 dir-rtl font-sans antialiased overflow-hidden select-none">
      
      {/* نافذة التكبير والتنزيل الفوري */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900/80"
            >
              <X size={24} />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-cyan-500/40" />
            <div className="mt-5 flex gap-4">
              <button 
                onClick={() => downloadImage(previewImage)}
                className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-black px-7 py-3.5 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
              >
                <Download size={22} />
                <span>تحميل الصورة على الهاتف فوراً</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* القائمة الجانبية الفاخرة */}
      <div className={`fixed inset-y-0 right-0 z-40 w-72 bg-[#070a10]/98 backdrop-blur-2xl shadow-2xl border-l border-cyan-950/40 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-cyan-950/40 flex justify-between items-center bg-[#05070c]">
          <h1 className="text-lg font-black tracking-wider flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-black shadow-lg shadow-cyan-500/20">
              <Cpu size={22} />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-black tracking-widest text-base">ARABIAN AI</span>
              <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest">PRO EDITION</span>
            </div>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <button 
            onClick={() => { setMessages([{ id: Date.now().toString(), sender: 'ai', text: `أهلاً بك يا محمود! التطبيق جاهز لمعالجة كافة الأوامر البرمجية والتصميمية.`}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black py-3.5 px-4 rounded-2xl font-black transition-all shadow-lg shadow-cyan-500/20 active:scale-95 text-xs"
          >
            <Plus size={18} />
            <span>جلسة عمل جديدة</span>
          </button>

          <div className="bg-[#0b101a] p-3.5 rounded-2xl border border-cyan-900/30 space-y-1">
            <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>المطور / الحساب VIP:</span>
            </div>
            <div className="text-xs font-mono font-bold text-gray-200 truncate" title={userEmail}>{userEmail}</div>
          </div>

          {isVipUser ? (
            <div className="bg-cyan-950/30 text-cyan-300 p-3.5 rounded-2xl border border-cyan-500/30 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
              <span>اشتراك VIP Unlimited نشط مدى الحياة</span>
            </div>
          ) : (
            <div className="bg-[#161007] p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>إدخال كود VIP</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="رمز التفعيل..."
                  className="w-full bg-[#070a10] text-xs p-2 rounded-xl border border-amber-500/30 text-white outline-none focus:border-amber-400"
                />
                <button onClick={handleActivatePasscode} className="bg-amber-400 text-black px-3 py-1 rounded-xl font-bold text-xs">
                  <KeyRound size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-800/40 space-y-1">
            <div className="text-[10px] font-bold text-gray-500 px-3 pb-2 uppercase tracking-widest">أقسام الذكاء الاصطناعي</div>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveTab(section.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md' 
                      : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                  <span className="truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-cyan-950/40 bg-[#05070c] flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-black font-black flex items-center justify-center text-sm shadow-md">M</div>
             <span className="font-black text-xs text-gray-200 tracking-wider truncate" title="MAHMOUD RIZK">MAHMOUD RIZK</span>
          </div>
          <span className="px-2 py-1 rounded-lg text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider">
            OWNER
          </span>
        </div>
      </div>

      {/* شاشة العمل الرئيسية */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#030508]">
        <header className="bg-[#060910]/90 backdrop-blur-xl border-b border-cyan-950/30 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white md:hidden p-1">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse"></span>
            <span className="font-bold text-xs md:text-sm text-gray-200">
              {SECTIONS.find(s => s.id === activeTab)?.name || 'الرئيسية'}
            </span>
          </div>
          <div className="w-6" />
        </header>

        {/* عرض محادثة الرسائل والمخرجات */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-3xl max-w-[92%] text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold shadow-lg shadow-cyan-500/10' 
                    : 'bg-[#080d17] border border-cyan-950/60 text-gray-200 shadow-xl'
                }`}>
                  {msg.mediaUrl && (
                    <div className="relative group rounded-2xl overflow-hidden mb-3 border border-cyan-500/20 bg-black">
                      <img 
                        src={msg.mediaUrl} 
                        alt="AI Generated" 
                        className="w-full max-h-80 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        onClick={() => setPreviewImage(msg.mediaUrl!)}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setPreviewImage(msg.mediaUrl!)}
                          className="bg-cyan-400 text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-lg"
                        >
                          <Maximize2 size={15} /> تكبير
                        </button>
                        <button 
                          onClick={() => downloadImage(msg.mediaUrl!)}
                          className="bg-white text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-lg"
                        >
                          <Download size={15} /> تنزيل
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-mono">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-cyan-400 text-xs font-bold animate-pulse bg-cyan-950/30 border border-cyan-500/20 px-4 py-3 rounded-2xl w-fit">
                <Sparkles size={16} />
                <span>جاري تحليل الطلب وإنتاج المخرجات بدقة فائقة... ⚡</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* حقل الإدخال والأوامر */}
        <div className="p-4 bg-[#05070c] border-t border-cyan-950/30">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#090e18] p-2.5 rounded-2xl border border-cyan-900/40 focus-within:border-cyan-500/60 transition-all shadow-2xl">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2.5 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
            >
              <Paperclip size={19} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? `الملف المرفق: ${selectedFile.name}` : "اطلب رسم شعار، كتابة كود، أو تصميم لعبة..."} 
              className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm px-2 text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSend} 
              disabled={loading}
              className="p-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black rounded-xl hover:brightness-110 transition-all font-bold disabled:opacity-40 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
