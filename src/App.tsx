import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [isKidsMode, setIsKidsMode] = useState(false);

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-indigo-950' : 'bg-slate-950'} text-white font-sans pb-10`} dir="rtl">
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-amber-400">المساعد العربي الذكي 🚀</h1>
        <button 
          onClick={() => setIsKidsMode(!isKidsMode)}
          className="px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 rounded-full text-sm font-bold"
        >
          {isKidsMode ? '🧸 وضع الأطفال' : '👨‍💻 وضع المحترفين'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>💬 المحادثة</button>
          <button onClick={() => setActiveTab('homework')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'homework' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>📚 الواجبات</button>
          <button onClick={() => setActiveTab('studio')} className={`px-4 py-2 rounded-lg whitespace-nowrap shadow-lg ${activeTab === 'studio' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 border border-amber-500/30 text-amber-400'}`}>🎨 استوديو الإبداع</button>
          <button onClick={() => setActiveTab('pricing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'pricing' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>💳 الاشتراكات</button>
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
              <div className="bg-amber-400
