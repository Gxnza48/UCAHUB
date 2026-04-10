'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, X, Send, Minimize2, Loader2 } from 'lucide-react';

interface FileContext {
  title: string;
  subject: string;
  career: string;
  description: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot({ fileContext, fileUrl }: { fileContext: FileContext; fileUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy el asistente de IA de UCAHUB. Veo que estás estudiando "${fileContext.title}". ¿En qué te puedo ayudar hoy?`
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContext,
          fileUrl,
          messages: updatedMessages
            .filter(m => m.id !== 'welcome')
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Sin respuesta del servidor.',
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      alert(
        'Hubo un error contactando a la Inteligencia Artificial. Asegúrate que tu OpenAI API Key esté activa, sea correcta y tenga fondos cargados. Detalle interno: ' +
          err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center"
        aria-label="Abrir asistente de IA"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
      isMinimized
        ? 'right-6 bottom-6 w-72 h-14 rounded-t-xl rounded-b-xl cursor-pointer'
        : 'right-4 bottom-4 w-[calc(100%-2rem)] md:right-6 md:bottom-6 md:w-96 h-[75vh] md:h-[500px] max-h-[90vh] md:max-h-[80vh] rounded-2xl'
    }`}>
      {/* Header */}
      <div
        className="h-14 flex items-center justify-between px-4 bg-[#1d3b6f] dark:bg-slate-800 text-white shrink-0"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-2 font-headline font-bold">
          <Bot className="w-5 h-5 text-cta" />
          <span>Asistente UCAHUB</span>
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
            className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {!isMinimized && (
        <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 font-body text-sm bg-slate-50 dark:bg-slate-900/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-primary/20">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                m.role === 'user'
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      {!isMinimized && (
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Haz una pregunta sobre el apunte..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-base md:text-sm font-medium py-3 pl-4 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-1.5 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-[#1d3b6f] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
