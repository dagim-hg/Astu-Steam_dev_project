import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Info } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const AIAssistant = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello ${user?.name}! I'm your ASTU Smart Assistant. How can I help you with your complaints or system navigation today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let response = "I'm currently in training to better assist with ASTU-specific campus issues. For now, you can submit maintenance, IT, or facility complaints through the 'Submit Complaint' page!";

            if (input.toLowerCase().includes('how') || input.toLowerCase().includes('submit')) {
                response = "To submit a complaint, click 'Submit Complaint' in the sidebar, fill in the details like category and location, and hit 'Submit'. I'll give you a tracking ID immediately!";
            } else if (input.toLowerCase().includes('track') || input.toLowerCase().includes('status')) {
                response = "You can track your complaints in the 'My Complaints' section. Each entry shows its current status: Open, In Progress, or Resolved.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-fade-in pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Bot className="text-blue-600" />
                        AI Assistant
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 italic font-medium">Get instant guidance on system usage and campus procedures.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-700 text-xs font-bold border border-blue-100">
                    <Sparkles size={14} />
                    POWERED BY ASTU AI
                </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
                {/* Decorative background logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                    <Bot size={400} />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                            <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600'
                                    }`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-md shadow-blue-200'
                                        : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none font-medium italic'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-blue-600 flex items-center justify-center">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce animation-delay-200"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce animation-delay-400"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 sm:p-6 bg-gray-50/50 border-t border-gray-100 relative z-10">
                    <div className="max-w-4xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your question here (e.g., 'How do I submit a complaint?')..."
                            className="w-full pl-6 pr-14 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm shadow-blue-500/5 bg-white font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-all shadow-md shadow-blue-500/40"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                            <Info size={10} />
                            AI model can occasionally provide inaccurate system info. Verify critical status via Registry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
