import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, CheckCircle2, Library, Palette, Sparkles, Code, Send, Paperclip, Menu, X, AlertTriangle, KeyRound, 
  Cpu, User, Bot, Download, Maximize2, Video, Gamepad2, Activity, BarChart3, Layers, Settings, LogOut, Search, FileText, ImageIcon
} from 'lucide-react';

// ==========================================
// 1. SECURITY & ENCRYPTION ENGINE (نظام الحماية)
// ==========================================
class SecurityEngine {
  private static readonly SALT = "AURA_AI_SECURE_SALT_2026_FINAL";

  static obfuscate(data: string): string {
    return btoa(encodeURIComponent(data + this.SALT));
  }

  static deobfuscate(cipher: string): string {
    try {
      const decoded = decodeURIComponent(atob(cipher));
      return decoded.replace(this.SALT, '');
    } catch {
      return '';
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/script/gi, "")
      .trim();
  }

  static validateSession(email: string, pass: string, targetPass: string): boolean {
    const cleanEmail = this.sanitizeInput(email).toLowerCase();
    const cleanPass = this.sanitizeInput(pass);
    return cleanEmail === "mahmoudrizk532@gmail.com" || cleanPass === targetPass;
  }
}

// الثوابت ومفاتيح التفعيل
const OBFUSCATED_KEY = SecurityEngine.obfuscate("AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg");
const VIP_EMAIL = "mahmoudrizk532@gmail.com";
const VIP_PASSCODE = "01205729239657Mm. Rizk$";
const USER_DISPLAY_NAME = "MAHMOUD RIZK";

// واجهات البيانات
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
  timestamp: string;
}

// الأقسام الفرعية داخل التطبيق
const SECTIONS = [
  { id: 'logo', name: 'استوديو اللوجو 8K', icon: Sparkles },
  { id: 'designs', name: 'مولد الصور والفنون', icon: Palette },
  { id: 'apps', name: 'مهندس الأكواد', icon: Code },
  { id: 'games', name: 'مطور الألعاب 3D', icon: Gamepad2 },
  { id: 'video', name: 'استوديو السيناريو', icon: Video },
  { id: 'library', name: 'المكتبة الذكية', icon: Library },
];

export default function App() {
  const [userEmail] = useState<string>(VIP_EMAIL);
  const [passcode, setPasscode] = useState<string>('');
  const [isActivatedByCode, setIsActivatedByCode] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // التحقق الفوري من التوثيق الذهبي VIP
  const isVipUser = useMemo(() => {
    return SecurityEngine.validateSession(userEmail, isActivatedByCode ? VIP_PASSCODE : passcode, VIP_PASSCODE);
  }, [userEmail, passcode, isActivatedByCode]);

  // حالة الرسائل والمحادثة
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: `أهلاً بك يا ${USER_DISPLAY_NAME} 👋 في نظام AURA AI PRO الفائق!\n• نظام التوليد والتحليل الذكي جاهز مع دعم الصور عالية الدقة (8K Ultra HD) والبرمجة وحماية الأكواد.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('logo');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // تفعيل الكود الذهبي
  const handleActivatePasscode = useCallback(() => {
    const cleanPass = SecurityEngine.sanitizeInput(passcode);
    if (cleanPass === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      alert("تم توثيق وترقية الحساب إلى VIP الذهبي بنجاح!");
    } else {
      alert("رمز التفعيل غير صحيح!");
    }
  }, [passcode]);

  // رفع الملفات
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات مخصص لحسابات VIP الموثقة!");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // تنزيل الصور
  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `AURA-AI-Design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  // دالة المعالجة وتوليد الردود/الصور الذكية
  const handleSend = async () => {
    const rawInput = input;
    if ((!rawInput.trim() && !selectedFile) || loading) return;

    const userQuery = SecurityEngine.sanitizeInput(rawInput);
    let mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userQuery || `[ملف مرفق: ${selectedFile?.name}]`, 
      mediaUrl,
      timestamp: timeNow
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    // فحص إن كان الطلب يتعلق بتوليد الصور واللوجوهات
    const isImageRequest = /ارسم|صورة|لوجو|شعار|صمم|تصميم|logo|image|draw|غوكو|goku/i.test(userQuery) || activeTab === 'logo' || activeTab === 'designs';

    if (isImageRequest && userQuery.length > 0) {
      if (!isVipUser) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '⚠️ ميزة توليد الصور واللوجوهات مخصصة لأعضاء VIP الذهبيين.',
          timestamp: timeNow
        }]);
        setLoading(false);
        return;
      }

      // ترجمة وبناء Prompt إنجليزي فائق التفاصيل بدون أخطاء
      let englishPrompt = userQuery
        .replace(/ارسم|صورة|لوجو|شعار|صمم|تصميم|عاوز|عايز|اريد/g, '')
        .trim();

      const promptEnhancements: { [key: string]: string } = {
        'غوكو': 'Son Goku Super Saiyan Dragon Ball Z, masterpiece, vivid cinematic lighting, highly detailed face and hair, vibrant colors, sharp outline, official anime poster quality',
        'لوجو': 'luxury modern vector logo, clean lines, high contrast, vibrant colors, minimalist logo design, 8k resolution',
        'سيارة': 'futuristic hypercar, neon lighting, highly detailed 8k render, Unreal Engine 5'
      };

      for (const key in promptEnhancements) {
        if (englishPrompt.includes(key)) {
          englishPrompt = englishPrompt.replace(key, promptEnhancements[key]);
        }
      }

      if (!englishPrompt.includes('masterpiece')) {
        englishPrompt += ', ultra detailed, vibrant colors, sharp focus, masterpiece, 8k resolution';
      }

      // محرك Flux المحسن والمباشر المستقر جداً لمنع أي شاشة بيضاء أو أعطال
      const promptEncoded = encodeURIComponent(englishPrompt);
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?width=1024&height=1024&model=flux&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `✨ تم معالجة وتوليد التصميم الفائق بنجاح لـ (${userQuery})!`,
          mediaUrl: generatedImageUrl,
          isImage: true,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 1200);
      return;
    }

    // معالجة النصوص والأكواد عبر Gemini API
    try {
      const apiKey = SecurityEngine.deobfuscate(OBFUSCATED_KEY);
      const systemContext = `أنت الذكاء الاصطناعي الفائق AURA AI المصمم بواسطة MAHMOUD RIZK. أجب بأعلى درجات الاحترافية والسرعة.`;
      const fullPrompt = `${systemContext}\n\nطلب المستخدم: ${userQuery}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'حدث خطأ أثناء معالجة البيانات، يرجى إعادة المحاولة.';

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: aiText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: 'تعذر الاتصال الآمن بالسيرفر، يرجى التحقق من اتصال الإنترنت.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020610] text-teal-50 dir-rtl font-sans antialiased overflow-hidden select-none">
      
      {/* 🖼️ نافذة تكبير وتنزيل الصور المباشرة */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 text-teal-400 hover:text-white p-2 rounded-full bg-gray-900/80">
              <X size={24} />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[75vh] object-contain rounded-3xl border border-teal-500/40 shadow-2xl shadow-teal-500/20"
              onError={() => {
                alert('تعذر تحميل الصورة الآن، حاول مرة أخرى.');
                setPreviewImage(null);
              }}
            />
            <div className="mt-5 flex gap-4">
              <button onClick={() => downloadImage(previewImage)} className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-teal-500/30 text-xs active:scale-95">
                <Download size={18} />
                <span>تحميل الصورة على الهاتف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🕹️ الشريط الأيسر المصغر للأيقونات الرئيسية */}
      <div className="hidden lg:flex flex-col items-center justify-between py-6 w-16 bg-[#040a17] border-l border-teal-900/30 z-30">
        <div className="flex flex-col items-center gap-6">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <Cpu size={22} />
          </div>
          <div className="w-8 h-[1px] bg-teal-900/40" />
          <button onClick={() => setActiveTab('logo')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'logo' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-teal-700 hover:text-teal-400'}`}>
            <Activity size={20} />
          </button>
          <button onClick={() => setActiveTab('designs')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'designs' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-teal-700 hover:text-teal-400'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => setActiveTab('apps')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'apps' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-teal-700 hover:text-teal-400'}`}>
            <Layers size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 text-teal-800">
          <Settings size={20} className="hover:text-teal-400 cursor-pointer" />
          <LogOut size={20} className="hover:text-teal-400 cursor-pointer" />
        </div>
      </div>

      {/* 📱 الشريط الجانبي الرئيسي للقائمة والتأكيد */}
      <div className={`fixed inset-y-0 right-0 z-40 w-72 bg-[#040914]/95 backdrop-blur-3xl shadow-2xl border-l border-teal-900/30 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-teal-900/30 flex justify-between items-center bg-[#020610]">
          <h1 className="text-lg font-black flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-teal-400 flex items-center justify-center p-1 shadow-lg shadow-teal-500/30 animate-pulse">
              <div className="w-full h-full rounded-full bg-teal-400/20 border border-teal-300"></div>
            </div>
            <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-black tracking-widest text-lg">AURA AI</span>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-teal-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <button 
            onClick={() => { 
              setMessages([{ id: Date.now().toString(), sender: 'ai', text: `أهلاً بك يا ${USER_DISPLAY_NAME}! تم بدء جلسة جديدة بنجاح.`, timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}]); 
              setSidebarOpen(false); 
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-black font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-teal-500/20 active:scale-95 text-xs"
          >
            <Plus size={18} />
            <span>جلسة / تصميم جديد</span>
          </button>

          {/* بطاقة حالة النظام والشبكة */}
          <div className="bg-[#051124]/80 p-4 rounded-2xl border border-teal-800/40 space-y-2.5">
            <div className="text-[11px] font-bold text-teal-400 flex items-center justify-between border-b border-teal-900/40 pb-2">
              <span>حالة النظام</span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-300 font-bold">Flux 8K Core</span>
              <span className="text-emerald-400">نشط وحاهز</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-300 font-bold">Gemini 1.5 Engine</span>
              <span className="text-emerald-400">متصل</span>
            </div>
          </div>

          {/* التفعيل الذهبي VIP */}
          {isVipUser ? (
            <div className="bg-teal-950/40 text-teal-300 p-3.5 rounded-2xl border border-teal-500/30 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
              <span>حساب موثق VIP الذهبي 🔓</span>
            </div>
          ) : (
            <div className="bg-[#120c04] p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>إدخال رمز VIP</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="رمز التفعيل..."
                  className="w-full bg-[#020610] text-xs p-2 rounded-xl border border-amber-500/30 text-white outline-none"
                />
                <button onClick={handleActivatePasscode} className="bg-amber-400 text-black px-3 py-1 rounded-xl font-bold text-xs">
                  <KeyRound size={15} />
                </button>
              </div>
            </div>
          )}

          {/* قائمة الأقسام */}
          <div className="pt-2 border-t border-teal-900/30 space-y-1">
            <div className="text-[10px] font-bold text-teal-600 px-3 pb-2 uppercase tracking-widest">أقسام الذكاء الفائق</div>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveTab(section.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/40 shadow-md' 
                      : 'text-teal-700 hover:bg-teal-950/30 hover:text-teal-300'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-teal-400' : 'text-teal-700'} />
                  <span className="truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-teal-900/30 bg-[#020610] flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
             <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-600 text-black font-black flex items-center justify-center text-sm">M</div>
             <span className="font-black text-xs text-teal-100 tracking-wider truncate">{USER_DISPLAY_NAME}</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/40">
            PRO OWNER
          </span>
        </div>
      </div>

      {/* 💬 منطقة العرض والمحادثة */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#020610]">
        
        {/* الشريط العلوي */}
        <header className="bg-[#040a17]/90 backdrop-blur-2xl border-b border-teal-900/30 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-teal-400 hover:text-white md:hidden">
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs md:text-sm text-teal-200">AURA AI | منصة التطوير الفائق</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#08152b] px-3 py-1.5 rounded-full border border-teal-500/30 flex items-center gap-2 text-xs font-bold text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>نشط الأن</span>
            </div>
          </div>
        </header>

        {/* مساحة العرض المركزية */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-6">

            {/* بطاقات الإحصائيات البرمجية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#040c1d] p-4 rounded-2xl border border-teal-900/40 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-bold text-teal-400 mb-3">
                  <span>معدل سرعة المعالجة</span>
                  <span className="text-[10px] text-teal-600">0.2s Response</span>
                </div>
                <div className="h-20 flex items-end justify-between gap-1 pt-4 px-2">
                  {[35, 55, 45, 80, 60, 90, 75, 100].map((h, i) => (
                    <div key={i} className="w-full bg-teal-950/60 rounded-t-sm flex flex-col justify-end">
                      <div 
                        className="bg-gradient-to-t from-teal-500 to-cyan-300 rounded-t-sm transition-all duration-500" 
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#040c1d] p-4 rounded-2xl border border-teal-900/40 space-y-3">
                <div className="text-xs font-bold text-teal-400 border-b border-teal-900/30 pb-2">جاهزية المحركات البرمجية</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-teal-200 mb-1">
                      <span>توليد صور Flux HD</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-teal-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-400 h-full w-[100%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-teal-200 mb-1">
                      <span>محرك فهم الأوامر</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-teal-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[100%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* مساحة الدردشة والعرض */}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2.5 max-w-[92%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-tr from-teal-400 to-cyan-500 text-black' 
                        : 'bg-[#061226] border border-teal-700/40 text-teal-300'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    <div className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-lg rounded-tr-none' 
                        : 'bg-[#051124] border border-teal-900/40 text-teal-100 shadow-xl rounded-tl-none'
                    }`}>
                      {msg.mediaUrl && (
                        <div className="relative group rounded-2xl overflow-hidden mb-3 border border-teal-500/30 bg-black min-h-[200px]">
                          <img 
                            src={msg.mediaUrl} 
                            alt="Generated" 
                            className="w-full max-h-80 object-cover cursor-pointer rounded-2xl"
                            onClick={() => setPreviewImage(msg.mediaUrl!)}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => setPreviewImage(msg.mediaUrl!)} className="bg-teal-400 text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                              <Maximize2 size={15} /> تكبير
                            </button>
                            <button onClick={() => downloadImage(msg.mediaUrl!)} className="bg-white text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                              <Download size={15} /> تنزيل
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                      <div className={`text-[9px] mt-2 font-mono ${msg.sender === 'user' ? 'text-teal-200/80 text-left' : 'text-teal-600 text-right'}`}>
                        {msg.timestamp}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-teal-300 text-xs font-bold animate-pulse bg-teal-950/40 border border-teal-500/30 px-4 py-3 rounded-2xl w-fit">
                  <Sparkles size={16} />
                  <span>جاري المعالجة بواسطة AURA Engine... ⚡</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

          </div>
        </div>

        {/* ⌨️ شريط الإدخال الرئيسي */}
        <div className="p-4 bg-[#020610] border-t border-teal-900/30">
          <div className="max-w-2xl mx-auto space-y-3">
            
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-teal-400/80">
              <button onClick={() => setInput("تحليل وتدقيق الكود: ")} className="flex items-center gap-1 hover:text-teal-200">
                <FileText size={14} /> تحليل الكود
              </button>
              <button onClick={() => setInput("ارسم صورة غوكو بتفاصيل 8k فائقة الدقة")} className="flex items-center gap-1 hover:text-teal-200">
                <ImageIcon size={14} /> رسم صور HD
              </button>
              <button onClick={() => setInput("ابحث عن: ")} className="flex items-center gap-1 hover:text-teal-200">
                <Search size={14} /> البحث المتقدم
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#051124] p-2.5 rounded-full border-2 border-teal-500/60 focus-within:border-cyan-400 shadow-lg shadow-teal-500/20 transition-all">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-teal-400 hover:bg-teal-500/10 rounded-full">
                <Paperclip size={18} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedFile ? `الملف المرفق: ${selectedFile.name}` : "اكتب طلبك لـ AURA AI..."} 
                className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm px-3 text-white placeholder-teal-600/70"
              />
              
              <button onClick={handleSend} disabled={loading} className="p-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-black rounded-full font-bold disabled:opacity-40 hover:scale-105 transition-transform">
                <Send size={16} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
