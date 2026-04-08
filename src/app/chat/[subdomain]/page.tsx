"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { syncGetDoc, syncSetDoc, syncSubscribe } from '@/lib/db-sync';
import { where, orderBy } from 'firebase/firestore';
import VisitorAuthModal from '@/components/VisitorAuthModal';

export default function ChatPage({ params }: { params: { subdomain: string } }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [targetUser, setTargetUser] = useState<any>(null);

  useEffect(() => {
    async function bindChat() {
      // Find who owns this subdomain
      const mapping = await syncGetDoc('subdomains', params.subdomain) as any;
      if (!mapping || !mapping.userId) {
        setLoading(false);
        return; // invalid subdomain
      }
      setTargetUser(mapping.userId);

      // Bind Real-Time WebSocket listener (Dual Sync Supported)
      const unsub = syncSubscribe('messages', [
        where('room', '==', mapping.userId),
        orderBy('timestamp', 'asc')
      ], (liveMessages) => {
        setMessages(liveMessages);
        setLoading(false);
      });

      return () => unsub();
    }
    bindChat();
  }, [params.subdomain]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !targetUser) return;

    // Trigger visitor auth wall if no session
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const msgId = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9);
    const newMsg = {
      room: targetUser,
      senderId: user.uid,
      text: inputText,
      timestamp: Date.now(),
    };

    // Optimistic UI Update
    setMessages((prev) => [...prev, { id: msgId, ...newMsg }]);
    setInputText('');

    // Active-Replica Write
    await syncSetDoc('messages', msgId, newMsg).catch(() => {
      alert("Network Failed: Cloud not deliver message securely.");
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
            {params.subdomain.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight capitalize">{params.subdomain}'s Space</h1>
            <p className="text-xs text-emerald-400 font-medium">● Online</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`https://${params.subdomain}.nexid.in`} className="btn-secondary !py-2 !px-4 text-xs font-semibold">Back to Portfolio</a>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-500 animate-pulse">
            Connecting to secure chat...
          </div>
        ) : (
          <>
            <div className="text-center text-xs text-gray-600 font-semibold uppercase tracking-widest my-8">
              End-to-End Encrypted Session Started
            </div>
            {messages.map((msg) => {
              const isMe = user?.uid === msg.senderId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] md:max-w-[60%] p-4 rounded-2xl shadow-xl ${
                    isMe 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`text-[10px] mt-2 font-medium opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endOfMessagesRef} />
          </>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-[#0a0a0a] border-t border-white/5">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${params.subdomain}...`}
            className="w-full bg-[#111] border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all pr-16 shadow-inner"
          />
          <button 
            type="submit" 
            onClick={(e) => { 
                if(!inputText.trim() && !user) {
                   e.preventDefault();
                   setShowAuthModal(true);
                }
            }}
            disabled={!inputText.trim() && user !== null}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] ${
              (inputText.trim() || !user) ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            {user ? (
               <svg className="w-4 h-4 text-white translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
               </svg>
            ) : (
               <span className="text-white text-xs font-bold">🔒</span>
            )}
          </button>
        </form>
        {!user && (
          <div className="flex justify-center mt-4">
             <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 font-bold rounded-full text-xs hover:bg-indigo-500/20 transition-colors animate-pulse border border-indigo-500/20">
               Login to Reply securely →
             </button>
          </div>
        )}
      </footer>

      {showAuthModal && <VisitorAuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
