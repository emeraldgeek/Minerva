import React from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Trash2, X, Plus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div 
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-md-sys-color-surfaceContainerLow border-r border-md-sys-color-outline/10
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-md-sys-color-onSurface tracking-tight">History</h2>
          <button 
            onClick={onClose}
            className="md:hidden p-2 rounded-full hover:bg-md-sys-color-surfaceContainerHigh text-md-sys-color-onSurfaceVariant"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 mb-4">
           <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-md-sys-color-primaryContainer text-md-sys-color-onPrimaryContainer rounded-[16px] font-medium transition-transform active:scale-95 hover:shadow-md"
           >
             <Plus size={20} />
             <span>New Chat</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-md-sys-color-outline text-sm">
              <MessageSquare size={24} className="mb-2 opacity-50" />
              <span>No history yet</span>
            </div>
          ) : (
            sessions.sort((a,b) => b.lastModified - a.lastModified).map(session => (
              <div 
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-[16px] cursor-pointer transition-colors
                  ${currentSessionId === session.id 
                    ? 'bg-md-sys-color-secondaryContainer text-md-sys-color-onSecondaryContainer font-medium' 
                    : 'text-md-sys-color-onSurfaceVariant hover:bg-md-sys-color-surfaceContainerHigh'}
                `}
              >
                <MessageSquare size={16} className={currentSessionId === session.id ? 'opacity-100' : 'opacity-50'} />
                <span className="truncate text-sm flex-1">{session.title}</span>
                
                <button
                  onClick={(e) => onDeleteSession(e, session.id)}
                  className={`
                    absolute right-2 p-1.5 rounded-full hover:bg-md-sys-color-error/10 hover:text-red-400 transition-opacity
                    ${currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    md:opacity-0 md:group-hover:opacity-100
                  `}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-md-sys-color-outline/10 text-xs text-center text-md-sys-color-outline">
            v1.0.0 • Minerva
        </div>
      </div>
    </>
  );
};
