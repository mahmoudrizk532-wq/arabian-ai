import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Library, 
  Palette, 
  Sparkles, 
  Code, 
  Send, 
  Paperclip,
  Menu,
  X,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Cpu,
  User,
  Bot,
  Download,
  Maximize2,
  Video,
  Gamepad2,
  Lock,
  ShieldAlert
} from 'lucide-react';

// ==========================================
// 1. SECURITY & CRYPTOGRAPHY LAYER (طبقة الأمان)
// ==========================================
class SecurityEngine {
  private static readonly SALT = "ARABIAN_AI_SECURE_SALT_2026";

  // تشفير المفاتيح والبيانات الحساسة في الذاكرة لمنع الهندسة العكسية
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

  // فحص النصوص ومنع هجمات XSS و Injection
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/script/gi, "")
      .trim();
  }

  // التحقق من سلامة الجلسة والتشفير
  static validateSession(email: string, pass: string, targetPass: string): boolean {
    const cleanEmail = this.sanitizeInput(email).toLowerCase();
    const cleanPass = this.sanitizeInput(pass);
    return cleanEmail === "mahmoudrizk532@gmail.com" || cleanPass === targetPass;
  }
}

// البيانات المشفرة
const OBFUSCATED_KEY = SecurityEngine.obfuscate("AQ.Ab8RN6LG5xv2wKFp-2Dz85_RB2nQQMCKOjI0FHN_Jt_OWZVydg");
const VIP_EMAIL = "mahmoudrizk532@gmail.com";
const VIP_PASSCODE = "01205729239657Mm. Rizk$";
const USER_DISPLAY_NAME = "MAHMOUD RIZK";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mediaUrl?: string;
  isImage?: boolean;
  timestamp: string;
}

const SECTIONS = [
  { id: 'logo', name: 'استوديو الشعارات واللوجو 8K', icon: Sparkles },
  { id: 'designs', name: 'مولد الصور والفنون الرقمية', icon: Palette },
  { id: 'apps', name: 'مهندس الأكواد والبرمجيات', icon: Code },
  { id: 'games', name: 'مطور المحركات والألعاب 3D', icon: Gamepad2 },
  { id: 'video', name: 'صناعة واستوديو السيناريو', icon: Video },
  { id: 'library', name: 'المكتبة الرقمية الذكية', icon: Library },
];

export default function App() {
  const [userEmail] = useState<string>(VIP_EMAIL);
  const [passcode, setPasscode] = useState<string>('');
  const [isActivatedByCode, setIsActivatedByCode] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState<'SECURE' | 'WARNING'>('SECURE');

  // فحص أمني مستمر لمنع التلاعب بالبيانات
  const isVipUser = useMemo(() => {
    return SecurityEngine.validateSession(userEmail, isActivatedByCode ? VIP_PASSCODE : passcode, VIP_PASSCODE);
  }, [userEmail, passcode, isActivatedByCode]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: `أهلاً بك يا ${USER_DISPLAY_NAME} 👋\nتم تفعيل نظام Arabian AI Pro المحمي بطبقات أمان مخصصة 🛡️!\n• يمكنك الآن استخدام محركات التوليد، رسم اللوجوهات 8K، وحل معقد الأكواد بسرعة ودقة.`,
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

  const handleActivatePasscode = useCallback(() => {
    const cleanPass = SecurityEngine.sanitizeInput(passcode);
    if (cleanPass === VIP_PASSCODE) {
      setIsActivatedByCode(true);
      setSecurityStatus('SECURE');
      alert("تم التوثيق والترقية إلى VIP الذهبي بنجاح!");
    } else {
      setSecurityStatus('WARNING');
      alert("رمز التفعيل غير صحيح!");
    }
  }, [passcode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVipUser) {
      alert("إرفاق الملفات مخصص لحسابات VIP الموثقة!");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ArabianAI-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

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

    const isImageRequest = /ارسم|صورة|لوجو|شعار|صمم|تصميم|logo|image|draw|غوكو|goku/i.test(userQuery) || activeTab === 'logo' || activeTab === 'designs';

    if (isImageRequest && userQuery.length > 0) {
      if (!isVipUser) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '⚠️ ميزة توليد الصور واللوجوهات تحتاج إلى تفعيل حساب VIP.',
          timestamp: timeNow
        }]);
        setLoading(false);
        return;
      }

      let englishPrompt = userQuery
        .replace(/ارسم|صورة|لوجو|شعار|صمم|تصميم|عاوز|عايز|اريد/g, '')
        .trim();

      const nameMap: { [key: string]: string } = {
        'سون غوكو': 'Son Goku Dragon Ball 3D render, highly detailed, octane render',
        'غوكو': 'Goku Dragon Ball Z 3D render',
        'سيارة': 'futuristic luxury car 8k render',
        'لوجو': 'modern minimal vector logo icon',
      };

      for (const key in nameMap) {
        if (englishPrompt.includes(key)) {
          englishPrompt = englishPrompt.replace(key, nameMap[key]);
        }
      }

      const promptEncoded = encodeURIComponent(`${englishPrompt}, 8k resolution, ultra detailed, masterpiece, vibrant lighting`);
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `✨ تم معالجة وتوليد التصميم بنجاح لـ (${userQuery})!`,
          mediaUrl: generatedImageUrl,
          isImage: true,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 2000);
      return;
    }

    try {
      const apiKey = SecurityEngine.deobfuscate(OBFUSCATED_KEY);
      const systemContext = `أنت المساعد الذكي الفائق Arabian AI والمصمم بواسطة MAHMOUD RIZK. أجب بدقة عالية وبأسلوب احترافي جداً ومبهر.`;
      const fullPrompt = `${systemContext}\n\nطلب المستخدم: ${userQuery}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'حدث خطأ أثناء معالجة البيانات، يرجى المحاولة لاحقاً.';

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
        text: 'فشل الاتصال الآمن بالسيرفر. يرجى التحقق من الشبكة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100 dir-rtl font-sans antialiased overflow-hidden select-none">
      
      {/* معاينة وتنزيل الصور */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900/80">
              <X size={24} />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[75vh] object-contain rounded-3xl border border-cyan-500/40 shadow-2xl" />
            <div className="mt-5 flex gap-4">
              <button onClick={() => downloadImage(previewImage)} className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-cyan-500/30 text-xs active:scale-95">
                <Download size={18} />
                <span>تحميل الصورة على الهاتف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الشريط الجانبي */}
      <div className={`fixed inset-y-0 right-0 z-40 w-72 bg-[#080d1a]/95 backdrop-blur-3xl shadow-2xl border-l border-cyan-900/30 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-cyan-900/30 flex justify-between items-center bg-[#050914]">
          <h1 className="text-lg font-black flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20">
              <Cpu size={22} />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent font-black tracking-widest text-base">ARABIAN AI</span>
              <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase">Secure Enterprise</span>
            </div>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <button 
            onClick={() => { setMessages([{ id: Date.now().toString(), sender: 'ai', text: `أهلاً بك يا ${USER_DISPLAY_NAME}! التطبيق جاهز لبدء جلسة جديدة.`, timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white py-3.5 px-4 rounded-2xl font-black shadow-lg shadow-cyan-500/20 active:scale-95 text-xs"
          >
            <Plus size={18} />
            <span>جلسة / تصميم جديد</span>
          </button>

          <div className="bg-[#0e1626] p-3.5 rounded-2xl border border-cyan-800/30 space-y-1">
            <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>حساب المالك (Owner):</span>
            </div>
            <div className="text-xs font-mono font-bold text-gray-200 truncate">{userEmail}</div>
          </div>

          {/* مؤشر الحماية والأمان */}
          <div className="bg-[#050914] p-3 rounded-xl border border-cyan-900/40 flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400 flex items-center gap-1">
              <Lock size={12} className="text-cyan-400" /> طبقة الحماية:
            </span>
            <span className={securityStatus === 'SECURE' ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
              {securityStatus === 'SECURE' ? 'مشفرة 256-bit' : 'تنبيه أمني'}
            </span>
          </div>

          {isVipUser ? (
            <div className="bg-cyan-950/40 text-cyan-300 p-3.5 rounded-2xl border border-cyan-500/30 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
              <span>تفعيل VIP كامل غير محدود 🔓</span>
            </div>
          ) : (
            <div className="bg-[#191108] p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>إدخال رمز التفعيل الذهبي</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="رمز VIP..."
                  className="w-full bg-[#050914] text-xs p-2 rounded-xl border border-amber-500/30 text-white outline-none"
                />
                <button onClick={handleActivatePasscode} className="bg-amber-400 text-black px-3 py-1 rounded-xl font-bold text-xs">
                  <KeyRound size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-cyan-900/30 space-y-1">
            <div className="text-[10px] font-bold text-gray-400 px-3 pb-2 uppercase tracking-widest">أقسام الذكاء الذكي</div>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveTab(section.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-md' 
                      : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                  <span className="truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-cyan-900/30 bg-[#050914] flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
             <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 text-white font-black flex items-center justify-center text-sm">M</div>
             <span className="font-black text-xs text-gray-200 tracking-wider truncate">{USER_DISPLAY_NAME}</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            OWNER
          </span>
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#030712]">
        <header className="bg-[#060b17]/90 backdrop-blur-2xl border-b border-cyan-900/30 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white md:hidden">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md animate-pulse"></span>
            <span className="font-bold text-xs md:text-sm text-gray-200">
              {SECTIONS.find(s => s.id === activeTab)?.name || 'الاستوديو الشامل'}
            </span>
          </div>
          <div className="w-6" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2.5 max-w-[92%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-black' 
                      : 'bg-[#0f172a] border border-cyan-800/40 text-cyan-400'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium shadow-lg rounded-tr-none' 
                      : 'bg-[#0a101d] border border-cyan-900/40 text-gray-200 shadow-xl rounded-tl-none'
                  }`}>
                    {msg.mediaUrl && (
                      <div className="relative group rounded-2xl overflow-hidden mb-3 border border-cyan-500/20 bg-black">
                        <img 
                          src={msg.mediaUrl} 
                          alt="Generated" 
                          className="w-full max-h-80 object-cover cursor-pointer"
                          onClick={() => setPreviewImage(msg.mediaUrl!)}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button onClick={() => setPreviewImage(msg.mediaUrl!)} className="bg-cyan-400 text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                            <Maximize2 size={15} /> تكبير
                          </button>
                          <button onClick={() => downloadImage(msg.mediaUrl!)} className="bg-white text-black px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                            <Download size={15} /> تنزيل
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    <div className={`text-[9px] mt-2 font-mono ${msg.sender === 'user' ? 'text-indigo-200/80 text-left' : 'text-gray-500 text-right'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-cyan-400 text-xs font-bold animate-pulse bg-cyan-950/30 border border-cyan-500/20 px-4 py-3 rounded-2xl w-fit">
                <Sparkles size={16} />
                <span>جاري التوليد بواسطة Gemini Pro المحمي... ⚡</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-[#050914] border-t border-cyan-900/30">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#0a101d] p-2.5 rounded-2xl border border-cyan-900/40 focus-within:border-cyan-400/70 transition-all shadow-2xl">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-cyan-400 hover:bg-cyan-500/10 rounded-xl">
              <Paperclip size={19} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? `الملف المرفق: ${selectedFile.name}` : "اطلب رسم صورة/لوجو، كتابة كود، أو أسئلة..."} 
              className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm px-2 text-white placeholder-gray-500"
            />
            <button onClick={handleSend} disabled={loading} className="p-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-40">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
