import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MedicalCard from '../components/UI/MedicalCard';
import api from '../api/axios';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user?.name || 'there'}! I'm DermaAI Assistant. How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot/ask', { message: userMsg.text });
      const botMsg = { id: Date.now() + 1, text: res.data?.reply || 'Received your message but no reply found.', sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Sorry, I am having trouble connecting to the server. Please try again later.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">AI Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400">Ask medical questions or get guidance instantly.</p>
      </div>

      <MedicalCard className="flex-1 flex flex-col p-0 overflow-hidden relative border border-gray-200 dark:border-gray-700">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
              <div className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary-teal text-white' : 'bg-teal-50 dark:bg-gray-700 text-primary-teal'}`}>
                  {msg.sender === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-primary-teal text-white rounded-tr-sm' 
                    : 'bg-gray-100 dark:bg-gray-800 text-text-dark dark:text-gray-100 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex mr-auto justify-start max-w-[85%] md:max-w-[75%]">
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-teal-50 dark:bg-gray-700 text-primary-teal flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary-teal" size={16} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">DermaAI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="input-field pr-14 py-4 rounded-full bg-white dark:bg-gray-900 border-gray-200 shadow-sm"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-3 bg-primary-teal text-white rounded-full hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} className="translate-x-0.5" />
            </button>
          </form>
        </div>
      </MedicalCard>
    </div>
  );
};

export default Chatbot;
