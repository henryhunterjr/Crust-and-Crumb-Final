'use client';

import React, { useRef, useEffect } from 'react';
import { X, Send, Loader2, ChefHat } from 'lucide-react';
import { useDialogFocus } from './useDialogFocus';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, messages, setMessages, input, setInput }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, dialogRef, false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));

    const responseText = await sendMessageToGemini(history, userMessage.text);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-label="Ask Krusty, the bread concierge" className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-amber-200 flex flex-col overflow-hidden h-[min(500px,calc(100dvh-3rem))] animate-in slide-in-from-bottom-5 fade-in duration-300">
      
      {/* Header */}
      <div className="bg-amber-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <ChefHat size={20} />
          <span className="font-semibold">Krusty - Bread Concierge</span>
        </div>
        <button onClick={onClose} aria-label="Close Ask Krusty" className="hover:bg-amber-700 p-2 min-h-11 min-w-11 shrink-0 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-amber-50 space-y-4" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-amber-200 shadow-sm rounded-tl-none'
              }`}
            >
              {msg.text.split(/(https?:\/\/[^\s)]+)/g).map((part, index) => part.startsWith('https://') || part.startsWith('http://')
                ? <a key={index} href={part.replace(/[.,;!?]+$/, '')} className="underline break-words">{part}</a>
                : <React.Fragment key={index}>{part}</React.Fragment>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-amber-200 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
              <Loader2 className="animate-spin text-amber-500" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask Krusty..."
          aria-label="Ask Krusty a baking question"
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send question"
          className="p-2 min-h-11 min-w-11 shrink-0 bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
