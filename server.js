const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// المفاتيح الخاصة بك (تضعها هنا أو في ملف .env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "ضع_مفتاح_جيميناي_هنا";
const SEARCH_API_KEY = process.env.SEARCH_API_KEY || "ضع_مفتاح_البحث_الحي_هنا";

// ==========================================
// 1. محرك الأمن السيبراني والبرمجة المتقدمة
// ==========================================
const SYSTEM_INSTRUCTION = `
أنت "AURA AI CORE" - المحرك المستقل الفائق المصمم بواسطة MAHMOUD RIZK.
خصائصك:
1. خبير في البرمجة الكاملة (Python, React, C++, Node.js, Termux).
2. خبير ومدرب أمن سيبراني واختبار اختراق أخلاقي (Ethical Hacking & Cybersecurity Tutor): تشرح الثغرات الأمنية، أساليب الحماية، وفحص الأكواد دون إلحاق الضرر بالأنظمة.
3. خبير في الدوائر الإلكترونية والأنظمة المدمجة (Arduino / Microcontrollers).
`;

// ==========================================
// 2. مسار معالجة النصوص والبحث الحي
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, isWebSearch } = req.body;
    let contextData = "";

    // إذا طلب المستخدم أخباراً حية أو مؤتمرات، نُمكّن البحث الحي
    if (isWebSearch || /أخبار|مؤتمر|اليوم|سياسة|تطورات/i.test(message)) {
      try {
        const searchRes = await fetch(`https://api.searxng.site/search?q=${encodeURIComponent(message)}&format=json`);
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          contextData = "\n\nنتائج البحث الحي من النت:\n" + 
            searchData.results.slice(0, 3).map(r => `- ${r.title}: ${r.content}`).join('\n');
        }
      } catch (e) {
        console.log("تعذر التوصيل بالبحث الحي، سيتم الاعتماد على القاعدة المعرفية.");
      }
    }

    const fullPrompt = `${SYSTEM_INSTRUCTION}\n${contextData}\n\nطلب المستخدم: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "حدث خطأ في معالجة الطلب.";

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: "خطأ في السيرفر الداخلي" });
  }
});

// ==========================================
// 3. مسار توليد الصور فائقة الجودة 4K
// ==========================================
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // تحسين الوصف آلياً ليصل لـ 4K Cinema Quality
    const enhancedPrompt = `${prompt}, masterpiece, 8k resolution, cinematic lighting, ultra-detailed, anime fine art, sharp lineart, highly polished, trending on artstation`;
    const encoded = encodeURIComponent(enhancedPrompt);
    
    // استخدام المحرك الفائق المباشر
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=1280&model=flux&nologo=true&seed=${Math.floor(Math.random()*999999)}`;

    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: "تعذر توليد الصورة" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
