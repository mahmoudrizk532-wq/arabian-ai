import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isKidsMode, setIsKidsMode] = useState(false);

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-indigo-950' : 'bg-slate-950'} text-white font-sans`} dir="rtl">
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/50">
        <h1 className="text-xl font-bold text-amber-400">المساعد العربي الذكي البرفيشنال</h1>
        <button 
          onClick={() => setIsKidsMode(!isKidsMode)}
          className="px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 rounded-full text-sm"
        >
          {isKidsMode ? 'وضع الأطفال مفعل' : 'وضع البالغين مفعل'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>المحادثة الذكية</button>
          <button onClick={() => setActiveTab('homework')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'homework' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>حل الواجبات (60% مجاناً)</button>
          <button onClick={() => setActiveTab('pricing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'pricing' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>خطط الاشتراك (Paymob)</button>
        </div>

        {activeTab === 'chat' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
            <h2 className="text-lg font-bold mb-2 text-amber-400">مرحباً بك في الذكاء الاصطناعي العربي</h2>
            <p className="text-slate-400">اطرح أي سؤال أو اكتب مسألة رياضية أو علمية ليتم إجابتك فوراً.</p>
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-2">مساعد حل الواجبات المدرسية</h2>
            <div className="w-full bg-slate-800 h-3 rounded-full mb-4">
              <div className="bg-amber-400 h-3 rounded-full w-[60%]"></div>
            </div>
            <p className="text-sm text-amber-300 mb-4">الرصيد المجاني المتبقي: 60%</p>
            <input type="file" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500 file:text-slate-950"/>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-lg">الباقة المجانية</h3>
              <p className="text-2xl font-bold my-2">0 ج.م</p>
              <p className="text-sm text-slate-400">محادثة غير محدودة + 60% حل واجبات</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/50">
              <h3 className="font-bold text-lg text-amber-400">الباقة الأساسية</h3>
              <p className="text-2xl font-bold my-2">150 ج.م <span className="text-xs text-slate-400">/شهرياً</span></p>
              <p className="text-sm text-slate-400">100% حل واجبات + صور وفيديوهات</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-lg">الباقة الاحترافية</h3>
              <p className="text-2xl font-bold my-2">350 ج.م <span className="text-xs text-slate-400">/شهرياً</span></p>
              <p className="text-sm text-slate-400">فودافون كاش - انستاباي - كروت بنكية</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
