import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Code, Search, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'أهلاً بك يا MAHMOUD RIZK! تم بدء جلسة جديدة بنجاح.',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentPrompt = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [
            {
              role: 'system',
              content: 'أنت Takallam AI (تكلّم)، مساعد ذكاء اصطناعي عربي مقتدر ومتكامل. تجيب بأسلوب دقيق، فصيح، ومباشر على كافة الأسئلة حول العالم.'
            },
            { role: 'user', content: currentPrompt }
          ]
        })
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]?.message?.content) {
        const aiReply = data.choices[0].message.content;
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('فشل الاستجابة');
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'حدث خطأ أثناء معالجة الطلب، يرجى إعادة المحاولة.',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#090d16] text-white dir-rtl font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#0d1322] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-600/20 rounded-xl border border-cyan-500/30">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-cyan-400">Takallam AI</h1>
            <p className="text-xs text-gray-400">العقل المدبر الخاص بك</p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-800 border border-cyan-500/30'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-[#111827] text-gray-200 border border-gray-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              <span className="text-[10px] text-gray-400 mt-2 block text-left">{msg.time}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Takallam AI يفكر الان...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#0d1322] border-t border-gray-800">
        <div className="flex items-center gap-2 bg-[#161f33] border border-cyan-500/30 rounded-2xl p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب طلبك لـ Takallam AI..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
