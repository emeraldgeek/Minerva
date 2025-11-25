import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { GroundingSources } from './GroundingSources';
import { Bot, User, RefreshCw } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isLatest: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-slide-up group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-md-sys-color-primary text-md-sys-color-onPrimary' : 'bg-md-sys-color-secondaryContainer text-md-sys-color-onSecondaryContainer'}
        `}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Bubble */}
        <div className={`
          flex flex-col
          ${isUser ? 'items-end' : 'items-start'}
        `}>
          <div className={`
            px-5 py-3.5 rounded-2xl text-[15px]
            ${isUser 
              ? 'bg-md-sys-color-primaryContainer text-md-sys-color-onPrimaryContainer rounded-tr-sm' 
              : 'bg-md-sys-color-surfaceContainerHigh text-md-sys-color-onSurface rounded-tl-sm'}
            shadow-sm
          `}>
             {message.isLoading ? (
               <div className="flex gap-1 items-center h-6">
                 <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             ) : (
               <MarkdownRenderer content={message.content} />
             )}
          </div>

          {/* Metadata & Actions */}
          {!isUser && !message.isLoading && (
            <>
              {message.groundingMetadata && <GroundingSources metadata={message.groundingMetadata} />}
            </>
          )}
          
          <div className="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-md-sys-color-outline flex gap-2">
             <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
