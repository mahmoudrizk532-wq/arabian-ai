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
  AlertTriangle
} from 'lucide-react';

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

const SECTIONS = [
  { id: 'library', name: 'المكتبة', icon: Library },
  { id: 'designs', name: 'التصميمات', icon: Palette },
  { id: 'logo', name: 'صنع اللوجو', icon: Sparkles },
  { id: 'ads', name: 'المنشورات الدعائية', icon: ImageIcon },
  { id: 'apps', name: 'صنع التطبيقات', icon: Code },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'designs' | 'logo' | 'ads' | 'apps'>('chat');
  
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
            onClick={() => { setActiveTab('chat'); setMessages([{ id: '1', sender: 'ai', text: `مرحباً محمود (${VIP_EMAIL})! تم التعرف على حسابك وتفعيل كافة المزايا المتقدمة مجاناً بدون اشتراك 🔓.`}]); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-5 rounded-2xl font-semibold transition-colors shadow-sm"
          >
            <Plus size={19} className="shrink-0" />
            <span>محادثة جديدة ✏️</span>
          </button>

          {/* بطاقة حالة المستخدم */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 shadow-inner">
            <div className="text-xs font-medium text-gray-500">البريد النشط:</div>
            <div className="text-sm font-bold text-gray-800 truncate" title={userEmail}>{userEmail}</div>
          </div>

          {isVipUser ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-2xl border border-green-200 text-sm font-bold flex items-center gap-3 shadow-green-100/30 shadow-sm">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <span>تم تفعيل الوصول الكامل والكرت المفتوح مجاناً!</span>
            </div>
          ) : (
             <div className="bg-amber-50 text-amber-900 p-4 rounded-2xl border border-amber-200 text-sm font-medium flex items-center gap-3 shadow-amber-100/30 shadow-sm">
              <AlertTriangle size={20} className="text-amber-600 shrink-0" />
              <span>🔒 حساب عادي (يلزم الاشتراك أو الدخول بحساب VIP)</span>
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
              {getActiveSectionName()}http://googleusercontent.com/generated_image_content/0
