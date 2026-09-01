import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, CheckCircle2, Library, Palette, Sparkles, Code, Send, Paperclip, Menu, X, AlertTriangle, KeyRound, 
  Cpu, User, Bot, Download, Maximize2, Video, Gamepad2, Activity, BarChart3, Layers, Settings, LogOut, Search, FileText, ImageIcon
} from 'lucide-react';

// ==========================================
// SECURITY & AI CONFIG LAYER
// ==========================================
class SecurityEngine {
  private static readonly SALT = "AURA_AI_SECURE_SALT_v3_2026";

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
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/script/gi, "").trim();
  }
}

// OBFUSCATED API KEYS (تأكد من تشفير مفاتيحك الحقيقية هنا)
const OBFUSCATED_GEMINI_KEY = SecurityEngine.obfuscate("YOUR_ACTUAL_GEMINI_API_KEY_HERE");
const OBFUSCATED_FLUX_KEY = SecurityEngine.obfuscate("YOUR_ACTUAL_FLUX_SERVER_KEY_HERE"); // مفتاح الخادم الخاص

const VIP_EMAIL = "mahmoudrizk532@gmail.com";
const VIP_PASSCODE = "01205729239657Mm. Rizk$";
const USER_DISPLAY_NAME = "MAHMOUD RIZK";

// واجهة الرسائل
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
  timestamp: string;
}

// واجهة الأقسام
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

  // التحقق من VIP (نظري فقط في واجهة المستخدم، الحماية الحقيقية في الخادم)
  const isVipUser = useMemo(() => {
    return userEmail.toLowerCase().trim() === VIP_EMAIL || isActivatedByCode;
  }, [userEmail, isActivatedByCode]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', sender: 'ai', 
      text: `أهلاً بك يا ${USER_DISPLAY_NAME} 👋 في نظام AURA AI PRO الفائق!\n• اللوحة التفاعلية جاهزة لبناء الأكواد، وتوليد الفنون واللوجوهات بدقة عالية عبر خادمنا الخاص.`,
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // دالة تفعيل VIP
  const handleActivatePasscode = useCallback(() => {
    const cleanPass = SecurityEngine.sanitizeInput(passcode);
    if (cleanPass === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      alert("تم توثيق وترقية الحساب إلى VIP الذهبي بنجاح!");
    } else {
      alert("رمز التفعيل غير صحيح!");
    }
  }, [passcode]);

  // دالة تحميل الصور
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

  // دالة إرسال الرسالة الرئيسية
  const handleSend = async () => {
    const rawInput = input;
    if ((!rawInput.trim() && !selectedFile) || loading) return;

    const userQuery = SecurityEngine.sanitizeInput(rawInput);
    let mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = { 
      id: Date.now().toString(), sender: 'user', text: userQuery || `[ملف مرفق: ${selectedFile?.name}]`, 
      mediaUrl, timestamp: timeNow
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    const isImageRequest = /ارسم|صورة|لوجو|شعار|صمم|تصميم|logo|image|draw|غوكو|goku/i.test(userQuery) || activeTab === 'logo' || activeTab === 'designs';

    if (isImageRequest && userQuery.length > 0) {
      // ⚠️ الحماية الحقيقية يجب أن تكون في الخادم، هذا فقط لواجهة المستخدم
      if (!isVipUser) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), sender: 'ai', text: '⚠️ ميزة توليد الصور واللوجوهات مخصصة لأعضاء VIP.',
          timestamp: timeNow
        }]);
        setLoading(false);
        return;
      }

      // الاتصال بالخادم الخاص لتوليد الصور بجودة فائقة
      try {
        const fluxKey = SecurityEngine.deobfuscate(OBFUSCATED_FLUX_KEY);
        // تأكد من استبدال هذا الرابط برابط خادم Flux الخاص بك
        const serverUrl = "https://your-flux-server-api.com/generate"; 
        
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${fluxKey}`
          },
          body: JSON.stringify({
            prompt: userQuery, // الخادم سيقوم بالترجمة والتحسين تلقائياً
            width: 1024,
            height: 1024,
            model: "flux-pro" // أو HuggingFace Image HD
          })
        });

        if (!response.ok) throw new Error("Server communication failed");

        const data = await response.json();
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), sender: 'ai', 
          text: `✨ تم معالجة وتوليد التصميم بنجاح لـ (${userQuery}) عبر خادمنا الخاص!`,
          mediaUrl: data.imageUrl, // الرابط المباشر للصورة المولدة فائقة الجودة
          isImage: true,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]);

      } catch (error) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), sender: 'ai', 
          text: 'عذراً، حدث خطأ في خادم توليد الصور. يرجى المحاولة لاحقاً.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // الربط مع Gemini Pro للنصوص والأكواد
    try {
      const geminiKey = SecurityEngine.deobfuscate(OBFUSCATED_GEMINI_KEY);
      const systemContext = `أنت المساعد الذكي الفائق AURA AI المصمم بواسطة MAHMOUD RIZK. أجب بدقة علمية وبرمجية متناهية.`;
      const fullPrompt = `${systemContext}\n\nطلب المستخدم: ${userQuery}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'حدث خطأ أثناء معالجة البيانات، يرجى المحاولة لاحقاً.';

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), sender: 'ai', text: aiText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), sender: 'ai', text: 'فشل الاتصال الآمن بالسيرفر. يرجى التحقق من الشبكة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020610] text-teal-50 dir-rtl font-sans antialiased overflow-hidden select-none">
      
      {/* نافذة التكبير والتنزيل */}
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
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                alert('عذراً، تعذر تحميل الصورة من السيرفر الخاص. حاول مرة أخرى!');
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

      {/* الشريط الأيسر المصغر */}
      <div className="hidden lg:flex flex-col items-center justify-between py-6 w-16 bg-[#040a17] border-l border-teal-900/30 z-30">
        <div className="flex flex-col items-center gap-6">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <Cpu size={22} />
          </div>
          <div className="w-8 h-[1px] bg-teal-900/40" />
          {SECTIONS.slice(0, 3).map(section => (
            <button key={section.id} onClick={() => setActiveTab(section.id)} className={`p-2.5 rounded-xl transition-all ${activeTab === section.id ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-teal-700 hover:text-teal-400'}`}>
              <section.icon size={20} />
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 text-teal-800">
          <Settings size={20} className="hover:text-teal-400 cursor-pointer" />
          <LogOut size={20} className="hover:text-teal-400 cursor-pointer" />
        </div>
      </div>

      {/* الشريط الجانبي الرئيسي */}
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

        <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-900/50">
          <button 
            onClick={() => { setMessages([{ id: Date.now().toString(), sender: 'ai', text: `أهلاً بك يا ${USER_DISPLAY_NAME}! جلسة AURA AI جديدة نشطة الآن.`, timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-black font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-teal-500/20 active:scale-95 text-xs"
          >
            <Plus size={18} />
            <span>جلسة / تصميم جديد</span>
          </button>

          {/* بطاقة حالة النظام */}
          <div className="bg-[#051124]/80 p-4 rounded-2xl border border-teal-800/40 space-y-2.5">
            <div className="text-[11px] font-bold text-teal-400 flex items-center justify-between border-b border-teal-900/40 pb-2">
              <span>حالة النظام (Backend)</span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-300 font-bold">Flux-Pro Server</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-300 font-bold">Gemini-Pro API</span>
              <span className="text-green-400">Online</span>
            </div>
          </div>

          {isVipUser ? (
            <div className="bg-teal-950/40 text-teal-300 p-3.5 rounded-2xl border border-teal-500/30 text-xs font-bold flex items-center gap-2.5 shadow-md">
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
              <span>تفعيل AURA VIP الذهبي 🔓</span>
            </div>
          ) : (
            <div className="bg-[#120c04] p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>إدخال رمز VIP الذهبي</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="رمز VIP..."
                  className="w-full bg-[#020610] text-xs p-2 rounded-xl border border-amber-500/30 text-white outline-none focus:border-amber-400"
                />
                <button onClick={handleActivatePasscode} className="bg-amber-400 text-black px-3 py-1 rounded-xl font-bold text-xs hover:bg-amber-300">
                  <KeyRound size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-teal-900/30 space-y-1">
            <div className="text-[10px] font-bold text-teal-600 px-3 pb-2 uppercase tracking-widest">أقسام الذكاء الفائق</div>
            {SECTIONS.map(section => {
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
                  <section.icon size={17} className={isActive ? 'text-teal-400' : 'text-teal-700'} />
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

      {/* منطقة العرض والدردشة */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#020610]">
        
        {/* الهيدر العلوي */}
        <header className="bg-[#040a17]/90 backdrop-blur-2xl border-b border-teal-900/30 px-6 py-4 flex items-center justify-between z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-teal-400 hover:text-white md:hidden p-1 rounded-lg hover:bg-teal-950/50">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs md:text-sm text-teal-200">ذكاء إصطناعي | واجهة تطبيق AURA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#08152b] px-3 py-1.5 rounded-full border border-teal-500/30 flex items-center gap-2 text-xs font-bold text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>ذكاء إصطناعي</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-xs font-bold text-teal-300 shadow-inner">
              M
            </div>
          </div>
        </header>

        {/* جسم الشاشة الرئيسي (المحادثة) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center scrollbar-thin scrollbar-thumb-teal-900/50">
          
          <div className="w-full max-w-4xl space-y-6">

            {/* بطاقات التحليلات الجانبية (مثال) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#040c1d] p-4 rounded-2xl border border-teal-900/40 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-center text-xs font-bold text-teal-400 mb-3 border-b border-teal-900/40 pb-2">
                  <span>أحدث التحليلات (AI Image HD)</span>
                  <span className="text-[10px] text-teal-600 font-mono">3.50%</span>
                </div>
                <div className="h-24 flex items-end justify-between gap-1 pt-4 px-2">
                  {[40, 65, 30, 85, 50, 95, 70, 100].map((h, i) => (
                    <div key={i} className="w-full bg-teal-950/60 rounded-t-sm flex flex-col justify-end">
                      <div className="bg-gradient-to-t from-teal-500 to-cyan-300 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#040c1d] p-4 rounded-2xl border border-teal-900/40 space-y-3 shadow-lg">
                <div className="text-xs font-bold text-teal-400 border-b border-teal-900/30 pb-2">مشاريع جارية (AURA Core)</div>
                <div className="space-y-2">
                  {[ {name: "تطوير اللغة", val: 75, col: "bg-teal-400"}, {name: "محرك الألعاب", val: 50, col: "bg-cyan-400"} ].map(p => (
                    <div key={p.name}>
                      <div className="flex justify-between text-[11px] font-mono text-teal-200 mb-1">
                        <span>{p.name} natural</span>
                        <span>{p.val}%</span>
                      </div>
                      <div className="w-full bg-teal-950 rounded-full h-1.5 overflow-hidden">
                        <div className={`${p.col} h-full rounded-full`} style={{width: `${p.val}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-teal-600 font-mono text-right pt-1">المستخدمون النشطون: 1,450 👤</div>
              </div>
            </div>

            {/* مساحة المحادثة والنتائج */}
            <div className="space-y-4 pt-4 border-t border-teal-900/30">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2.5 max-w-[92%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-tr from-teal-400 to-cyan-500 text-black' : 'bg-[#061226] border border-teal-700/40 text-teal-300'}`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    <div className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed shadow-xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-tr-none' : 'bg-[#051124] border border-teal-900/40 text-teal-100 rounded-tl-none'}`}>
                      {msg.mediaUrl && (
                        <div className="relative group rounded-2xl overflow-hidden mb-3 border border-teal-500/30 bg-black min-h-[200px] shadow-lg">
                          <img 
                            src={msg.mediaUrl} alt="Generated" 
                            className="w-full max-h-80 object-cover cursor-pointer rounded-2xl transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setPreviewImage(msg.mediaUrl!)}
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => setPreviewImage(msg.mediaUrl!)} className="bg-teal-400 text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md hover:bg-teal-300">
                              <Maximize2 size={15} /> تكبير (HD)
                            </button>
                            <button onClick={() => downloadImage(msg.mediaUrl!)} className="bg-white text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md hover:bg-gray-200">
                              <Download size={15} /> تنزيل (8K)
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                      <div className={`text-[9px] mt-2 font-mono ${msg.sender === 'user' ? 'text-teal-200/80 text-left' : 'text-teal-600 text-right'}`}>{msg.timestamp}</div>
                    </div>

                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-teal-300 text-xs font-bold animate-pulse bg-teal-950/40 border border-teal-500/30 px-4 py-3 rounded-2xl w-fit shadow-inner">
                  <Sparkles size={16} className="text-cyan-400" />
                  <span>جاري تحليل الطلب، الترجمة، والتوليد عبر خادم AURA Pro... ⚡</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

          </div>
        </div>

        {/* حقل الإدخال النيون */}
        <div className="p-4 bg-[#020610] border-t border-teal-900/30 z-10">
          <div className="max-w-2xl mx-auto space-y-3">
            
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-teal-400/80 border-b border-teal-900/40 pb-2 mb-2">
              {[ {name: "تحليل النص", Icon: FileText, cmd: "تحليل النص: "}, {name: "توليد صور (Flux Pro)", Icon: ImageIcon, cmd: "ارسم صورة غوكو بتفاصيل 8k سينمائية، إضاءة ناصعة، رسم أنمي حاد"}, {name: "البحث المتقدم", Icon: Search, cmd: "ابحث عن: "} ].map(q => (
                <button key={q.name} onClick={() => setInput(q.cmd)} className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
                  <q.Icon size={14} /> {q.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#051124] p-2.5 rounded-full border-2 border-teal-500/60 focus-within:border-cyan-400 shadow-lg shadow-teal-500/30 focus-within:shadow-cyan-500/40 transition-all duration-300">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-teal-400 hover:bg-teal-500/10 rounded-full transition-colors">
                <Paperclip size={18} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={selectedFile ? `الملف المرفق: ${selectedFile.name}` : "اسأل AURA AI (اللوجو، الأكواد، الصور...)..."} 
                className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm px-3 text-white placeholder-teal-600/70"
              />
              
              <button onClick={handleSend} disabled={loading} className="p-3 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-black rounded-full font-bold disabled:opacity-40 hover:scale-105 transition-transform duration-200">
                <Send size={16} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
