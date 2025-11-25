import React, { useEffect, useRef, useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import { GrainyBackground } from './components/GrainyBackground';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { useChatStore } from './hooks/useChatStore';
import { streamResponse } from './services/geminiService';
import { Message } from './types';

function App() {
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    isSidebarOpen,
    setIsSidebarOpen,
    createSession,
    addMessage,
    updateLastMessage,
    updateSessionTitle,
    deleteSession
  } = useChatStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derive current session data
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Auto-create session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !currentSessionId) {
      createSession();
    }
  }, [sessions.length, currentSessionId, createSession]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleSendMessage = async (text: string) => {
    if (!currentSessionId || isGenerating) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    addMessage(currentSessionId, userMsg);
    setIsGenerating(true);

    // If it's the first message, generate a title
    if (messages.length === 0) {
      updateSessionTitle(currentSessionId, text);
    }

    // Add placeholder bot message
    const botMsgId = crypto.randomUUID();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      role: 'model',
      content: '', // Empty initially
      timestamp: Date.now(),
      isLoading: true
    };
    addMessage(currentSessionId, botMsgPlaceholder);

    try {
      let accumulatedText = '';
      await streamResponse(
        [...messages, userMsg], 
        text, 
        (chunk, metadata) => {
          accumulatedText += chunk;
          updateLastMessage(currentSessionId, accumulatedText, metadata);
        }
      );
    } catch (error) {
      console.error(error);
      updateLastMessage(currentSessionId, "I'm sorry, I encountered an error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    createSession();
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-md-sys-color-onBackground">
      <GrainyBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-md-sys-color-surface/80 backdrop-blur-md border-b border-md-sys-color-outline/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 rounded-full hover:bg-md-sys-color-surfaceContainerHigh text-md-sys-color-onSurface transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-md-sys-color-primary to-md-sys-color-tertiary flex items-center justify-center text-md-sys-color-onPrimary shadow-lg shadow-md-sys-color-primary/20">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-display font-semibold text-xl tracking-tight hidden md:block">Minerva</span>
          </div>
        </div>
        
        <div className="text-sm font-medium text-md-sys-color-onSurfaceVariant/80 bg-md-sys-color-surfaceContainer px-3 py-1 rounded-full border border-md-sys-color-outline/10">
          Gemini 2.5 Flash
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <main 
        className={`
          flex-1 flex flex-col pt-16 transition-all duration-300
          ${isSidebarOpen ? 'md:pl-[280px]' : ''}
        `}
      >
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 overflow-x-hidden">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-0 animate-fade-in mt-20">
               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-md-sys-color-primaryContainer to-md-sys-color-tertiaryContainer mb-6 flex items-center justify-center shadow-2xl shadow-md-sys-color-primary/10">
                 <Zap size={40} className="text-md-sys-color-onPrimaryContainer" />
               </div>
               <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r from-md-sys-color-primary to-md-sys-color-tertiary">
                 Hello, friend.
               </h1>
               <p className="text-md-sys-color-onSurfaceVariant/70 text-center max-w-md">
                 I'm Minerva. I can help you research, write, and plan using the latest information from Google.
               </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatBubble key={msg.id} message={msg} isLatest={idx === messages.length - 1} />
              ))}
              <div ref={bottomRef} className="h-4" />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-md-sys-color-background via-md-sys-color-background/90 to-transparent pt-10">
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={isGenerating} 
            onNewChat={handleNewChat}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
