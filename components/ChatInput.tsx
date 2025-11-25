import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  onNewChat: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, onNewChat }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-md-sys-color-primary to-md-sys-color-tertiary rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        
        <div className="relative flex items-end gap-2 bg-md-sys-color-surfaceContainer p-2 rounded-[28px] shadow-lg border border-md-sys-color-outline/10">
          
          {/* New Chat Button (Mobile visible, Desktop subtle) */}
          <button
            onClick={onNewChat}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-md-sys-color-onSurfaceVariant hover:bg-md-sys-color-surfaceContainerHighest hover:text-md-sys-color-primary transition-colors"
            title="New Conversation"
          >
            <Plus size={24} />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask Minerva..."
            rows={1}
            className="w-full bg-transparent text-md-sys-color-onSurface placeholder:text-md-sys-color-onSurfaceVariant/50 text-[16px] px-2 py-3 md:py-3.5 focus:outline-none resize-none max-h-[150px] overflow-y-auto"
            style={{ minHeight: '48px' }}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || disabled}
            className={`
              flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-200
              ${input.trim() && !disabled 
                ? 'bg-md-sys-color-primary text-md-sys-color-onPrimary hover:scale-105 shadow-md' 
                : 'bg-transparent text-md-sys-color-onSurfaceVariant/30 cursor-not-allowed'}
            `}
          >
            {disabled ? (
              <Sparkles size={20} className="animate-pulse" />
            ) : (
              <Send size={20} className={input.trim() ? 'ml-0.5' : ''} />
            )}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[10px] md:text-xs text-md-sys-color-outline">
          Minerva can make mistakes. Check important info. • Powered by Gemini 2.5 Flash
        </p>
      </div>
    </div>
  );
};
