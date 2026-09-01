import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = [
    { id: 'library', name: 'المكتبة', icon: Library },
    { id: 'designs', name: 'التصميمات', icon: Palette },
    { id: 'logo', name: 'صنع اللوجو', icon: Sparkles },
    { id: 'ads', name: 'المنشورات الدعائية', icon: ImageIcon },
    { id: 'apps', name: 'صنع التطبيقات', icon: Code },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 dir-rtl font-sans antialiased overflow-hidden">
      {/* Sidebar - القائمة الجانبية المحدثة */}
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
          <button className="w-full flex items-center justify-center gap-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-5 rounded-2xl font-semibold transition-colors shadow-sm">
            <Plus size={19} className="shrink-0" />
            <span>محادثة جديدة ✏️</span>
          </button>

          {/* بطاقة حالة المستخدم */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 shadow-inner">
            <div className="text-xs font-medium text-gray-500">البريد النشط:</div>
            <div className="text-sm font-bold text-gray-800 truncate">mahmoudrizk532@gmail.com</div>
          </div>

          <div className="bg-green-50 text-green-800 p-4 rounded-2xl border border-green-200 text-sm font-bold flex items-center gap-3 shadow-green-100/30 shadow-sm">
            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
            <span>تم تفعيل الوصول الكامل والكرت المفتوح مجاناً!</span>
          </div>

          {/* أقسام الملاحة - هنا الإضافة الجديدة */}
          <div className="pt-5 border-t border-gray-100 space-y-1.5">
            <div className="text-xs font-bold text-gray-400 px-3 pb-2.5 tracking-wider">الأقسام الرئيسية</div>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
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

         <div className="p-5 border-t border-gray-100 mt-auto bg-gray-50">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-inner">M</div>
             <span className="font-semibold text-sm text-gray-800 truncate">MAHMOUD RIZK</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 md:hidden transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-gray-900">
            {sections.find(s => s.id === activeTab)?.name || 'Arabian AI'}
          </span>
          <div className="w-6" />
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={38} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">مرحباً بك</h2>
            <p className="text-gray-600 text-base">اختر قسماً من القائمة الجانبية لاستكشاف أدوات الذكاء الاصطناعي الخاصة بنا.</p>
          </div>
        </div>

        {/* Input Box */}
        <div className="p-5 bg-white border-t border-gray-100 shadow-inner">
          <div className="max-w-3xl mx-auto flex items-center gap-2.5 bg-gray-100 p-2.5 rounded-2xl border border-gray-200 shadow-sm">
            <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Paperclip size={21} />
            </button>
            <input 
              type="text" 
              placeholder="اكتب طلبك هنا..." 
              className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-gray-800 placeholder-gray-400"
            />
            <button className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow">
              <Send size={19} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
