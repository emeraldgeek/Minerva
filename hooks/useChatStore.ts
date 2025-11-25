import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message } from '../types';
import { generateTitle } from '../services/geminiService';

const STORAGE_KEY = 'minerva_sessions';

export const useChatStore = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save to local storage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  const addMessage = useCallback((sessionId: string, message: Message) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, message],
          lastModified: Date.now(),
        };
      }
      return session;
    }));
  }, []);

  const updateLastMessage = useCallback((sessionId: string, content: string, groundingMetadata?: any) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const msgs = [...session.messages];
        if (msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1];
          // Only update if it's the model's message we are streaming
          if (lastMsg.role === 'model') {
             msgs[msgs.length - 1] = {
               ...lastMsg,
               content,
               groundingMetadata: groundingMetadata || lastMsg.groundingMetadata,
               isLoading: false
             };
          }
        }
        return { ...session, messages: msgs, lastModified: Date.now() };
      }
      return session;
    }));
  }, []);

  const updateSessionTitle = useCallback(async (sessionId: string, firstMessage: string) => {
      const title = await generateTitle(firstMessage);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
      }
      // If we deleted everything, clear local storage
      if (newSessions.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
      return newSessions;
    });
  }, [currentSessionId]);

  return {
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
  };
};
