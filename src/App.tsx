import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);

  // رمز التفعيل الخاص لفتح كل المميزات مجاناً وبدون أي حدود
  const VIP_PASSWORD = "$01205729239657Mm. rizk"; 

  const handleAdminLogin = () => {
    if (passInput === VIP_PASSWORD) {
      setIsAdmin(true);
      setShowAdminModal(false);
      alert('تم تفعيل رمز الوصول الكامل! جميع الميزات (التطبيقات، الألعاب، الواجبات) مفتوحة لك مجاناً وبدون أي حدود 🚀');
    } else {
      alert('رمز التفعيل غير صحيح!');
    }
  };

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-indigo-950' : 'bg-slate-950'} text-white font-sans pb-10`} dir="rtl">
      {/* شريط أعلى الموقع */}
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          المساعد العربي الذكي 🚀
          {isAdmin && <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500 px-2 py-0.5 rounded-full">👑 حساب مفتوح الميزات بالكامل (مجاني)</span>}
        </h1>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAdminModal(true)}
            className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-full text-sm hover:bg-amber-400"
          >
            {isAdmin ? '👑 الحساب المميز مفعل' : '🔑 دخول بالرمز'}
          </button>

          <button 
            onClick={() => setIsKidsMode(!isKidsMode)}
            className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-sm font-bold"
          >
            {isKidsMode ? '🧸 الأطفال' : '👨‍💻 المحترفين'}
          </button>
        </div>
      </header>

      {/* نافذة إدخال الرمز */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 p-6 rounded-xl border border-amber-500 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-amber-400 mb-2">تفعيل الوصول المجاني الكامل</h3>
            <p className="text-xs text-slate-400 mb-4">أدخل رمز التفعيل الخاص لفتح كافة الميزات مجاناً وبدون أي حدود</p>
            <input 
              type="password" 
              placeholder="اكتب رمز التفعيل هنا"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 mb-4 text-center text-white"
            />
            <div className="flex gap-2">
              <button onClick={handleAdminLogin} className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded">تفعيل الرمز</button>
              <button onClick={() => setShowAdminModal(false)} className="w-full bg-slate-800 text-slate-300 py-2 rounded">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-4">
        {/* التبويبات */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>💬 المحادثة</button>
          <button onClick={() => setActiveTab('homework')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'homework' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>📚 الواجبات</button>
          <button onClick={() => setActiveTab('studio')} className={`px-4 py-2 rounded-lg whitespace-nowrap shadow-lg ${activeTab === 'studio' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 border border-amber-500/30 text-amber-400'}`}>🎨 استوديو الإبداع</button>
          <button onClick={() => setActiveTab('pricing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'pricing' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'}`}>💳 الاشتراكات</button>
        </div>

        {/* المحادثة */}
        {activeTab === 'chat' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
            <h2 className="text-lg font-bold mb-2 text-amber-400">مرحباً بك في الذكاء الاصطناعي العربي</h2>
            <p className="text-slate-400">اطرح أي سؤال أو اكتب مسألة رياضية أو علمية ليتم إجابتك فوراً.</p>
          </div>
        )}

        {/* الواجبات */}
        {activeTab === 'homework' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-2">مساعد حل الواجبات المدرسية</h2>
            <div className="w-full bg-slate-800 h-3 rounded-full mb-4">
              <div className={`h-3 rounded-full ${isAdmin ? 'bg-emerald-400 w-full' : 'bg-amber-400 w-[50%]'}`}></div>
            </div>
            <p className="text-sm text-amber-300 mb-4">
              {isAdmin ? '👑 رصيدك: غير محدود (100% مجاني بفضل الرمز)' : 'الرصيد المتبقي لحل الواجبات حسب باقتك الحالية'}
            </p>
            <input type="file" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500 file:text-slate-950"/>
          </div>
        )}

        {/* استوديو الإبداع والبرمجة والتصميم والألعاب */}
        {activeTab === 'studio' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl border border-amber-500/30 text-center">
              <h2 className="text-2xl font-bold mb-2 text-amber-400">استوديو تطوير الألعاب والتطبيقات والتصميم</h2>
              <p className="text-slate-300 text-sm">
                {isAdmin ? '👑 تم تفعيل الرمز: جميع الأدوات مجانية وبدون أي حدود استخدام!' : 'اختر الأداة الذكية لبناء مشروعك، تطوير ألعاب الأونلاين والتطبيقات، أو تصميم الشعارات.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* البرمجة وتطوير التطبيقات */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-amber-500 transition-all">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="font-bold text-lg mb-1">صناعة التطبيقات والمواقع</h3>
                <p className="text-sm text-slate-400 mb-3">
                  {isAdmin 
                    ? 'الاستخدام: غير محدود مجاناً 👑' 
                    : 'يتطلب الاشتراك: الباقة المتوسطة (محدود) / الباقة الكبيرة (شبه محدود).'}
                </p>
                <button className="w-full bg-slate-800 text-amber-400 font-bold py-2 rounded-lg text-sm hover:bg-slate-700">ابدأ البرمجة</button>
              </div>

              {/* قسم الألعاب الضخمة والسيرفرات (Zenless Zone Zero وألعاب الأونلاين) */}
              <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/40 hover:border-amber-400 transition-all">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="font-bold text-lg mb-1 text-amber-300">تطوير الألعاب السحابية والسيرفرات (مثل Zenless Zone Zero)</h3>
                <p className="text-sm text-slate-400 mb-3">توليد أنظمة ألعاب الأونلاين الكبيرة، ربط السيرفرات العالمية، الأكواد البرمجية لـ Unreal/Unity وشبكات اللعب الجماعي.</p>
                <button className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-sm hover:bg-amber-400">برمجة الألعاب والتأطير</button>
              </div>

              {/* تصميم اللوجوهات والصور */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-amber-500 transition-all">
                <div className="text-3xl mb-3">🖼️</div>
                <h3 className="font-bold text-lg mb-1">تصميم اللوجوهات والصور</h3>
                <p className="text-sm text-slate-400 mb-3">ابتكر شعارات احترافية للشركات وصوراً عالية الجودة بأمر نصي بسيط.</p>
                <button className="w-full bg-slate-800 text-amber-400 font-bold py-2 rounded-lg text-sm hover:bg-slate-700">ابدأ التصميم</button>
              </div>

              {/* المنشورات والإعلانات */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-amber-500 transition-all">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold text-lg mb-1">المنشورات الدعائية والتسويق</h3>
                <p className="text-sm text-slate-400 mb-3">صياغة إعلانات جذابة، نصوص تسويقية، وخطط ترويجية متكاملة لجميع المنصات.</p>
                <button className="w-full bg-slate-800 text-amber-400 font-bold py-2 rounded-lg text-sm hover:bg-slate-700">صمّم إعلانك</button>
              </div>

              {/* صناعة الفيديوهات */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-amber-500 transition-all">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="font-bold text-lg mb-1">صناعة الفيديوهات والأنيميشن</h3>
                <p className="text-sm text-slate-400 mb-3">تحويل النصوص والأفكار إلى مقاطع فيديو قصيرة أو مشاهد أنيميشن متحركة.</p>
                <button className="w-full bg-slate-800 text-amber-400 font-bold py-2 rounded-lg text-sm hover:bg-slate-700">صانع الفيديوهات</button>
              </div>
            </div>
          </div>
        )}

        {/* الاشتراكات */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg">الباقة المجانية (الصغيرة)</h3>
                <p className="text-2xl font-bold my-2">0 ج.م</p>
                <ul className="text-sm text-slate-400 space-y-2 mt-4">
                  <li>🔹 استوديو الإبداع: محدود جداً</li>
                  <li>❌ صناعة التطبيقات: <b>غير متوفرة</b></li>
                  <li>🔹 حل الواجبات: غير متوفر</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-slate-800 text-white font-bold py-2 rounded-lg text-sm">مجانية</button>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-amber-500/50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-amber-400">الباقة الأساسية (المتوسطة)</h3>
                <p className="text-2xl font-bold my-2">150 ج.م <span className="text-xs text-slate-400">/شهرياً</span></p>
                <ul className="text-sm text-slate-300 space-y-2 mt-4">
                  <li>✨ صناعة التطبيقات والمواقع: <b>محدود</b></li>
                  <li>✨ استوديو الإبداع والألعاب: شبه محدود</li>
                  <li>✨ حل واجبات: أقل من شبه محدود (50%)</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-sm">اشترك</button>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-amber-400 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-amber-300">الباقة الاحترافية (الكبيرة)</h3>
                <p className="text-2xl font-bold my-2">350 ج.م <span className="text-xs text-slate-400">/شهرياً</span></p>
                <ul className="text-sm text-slate-300 space-y-2 mt-4">
                  <li>🚀 صناعة التطبيقات والمواقع: <b>شبه محدود</b></li>
                  <li>🚀 استوديو الإبداع والألعاب: غير محدود</li>
                  <li>🚀 حل واجبات كامل 100%</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-sm">اشترك</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
