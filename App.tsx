import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import MessageBubble from './components/MessageBubble';
import Snowfall from './components/Snowfall';
import { ChatSession, Message, Role, ModelId } from './types';
import { createChatSession, sendMessageStream, generateChatTitle } from './services/geminiService';
import { Zap, Stars, Sparkles, Terminal, Code2, Cpu, Brain, Laptop, Activity, Atom, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>(ModelId.FLASH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Computed
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('ktr-chatbot-sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ktr-chatbot-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  // --- Handlers ---
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  };

  const handleModelChange = (modelId: ModelId) => {
    setSelectedModel(modelId);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now()
    };

    let sessionId = currentSessionId;
    let newSessionCreated = false;

    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: 'New Chat',
        messages: [userMessage],
        createdAt: Date.now(),
        modelId: selectedModel
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(sessionId);
      newSessionCreated = true;
    } else {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      ));
    }

    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botPlaceholder: Message = {
      id: botMessageId,
      role: Role.MODEL,
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages: [...session.messages, botPlaceholder] }
        : session
    ));

    try {
      const previousMessages = currentSession?.messages || [];
      const chat = createChatSession(selectedModel, previousMessages);
      const stream = sendMessageStream(chat, text);

      let accumulatedText = '';
      
      for await (const chunk of stream) {
        accumulatedText += chunk;
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? {
                ...session,
                messages: session.messages.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, content: accumulatedText }
                    : msg
                )
              }
            : session
        ));
      }

      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? {
              ...session,
              messages: session.messages.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            }
          : session
      ));

      if (newSessionCreated) {
        generateChatTitle(text).then(title => {
          setSessions(prev => prev.map(session => 
            session.id === sessionId ? { ...session, title } : session
          ));
        });
      }

    } catch (error) {
      console.error(error);
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? {
              ...session,
              messages: session.messages.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, isStreaming: false, error: true, content: "Sorry, I encountered an error." }
                  : msg
              )
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#050509] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 z-0 bg-[#020205] pointer-events-none overflow-hidden">
         {/* Top Left Indigo Glow */}
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] opacity-60"></div>
         {/* Bottom Right Purple Glow */}
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] opacity-50"></div>
         {/* Center Cyan Hint */}
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-cyan-900/10 rounded-full blur-[100px] opacity-40"></div>
      </div>
      
      <Snowfall />
      
      {/* Sidebar */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full z-10">
        
        {/* Model Selector Header */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-center p-4 z-20 pointer-events-none">
          <div className="bg-[#0f1015]/80 backdrop-blur-xl p-1.5 rounded-xl flex gap-1 border border-white/10 shadow-2xl pointer-events-auto ring-1 ring-white/5">
            <button 
              onClick={() => handleModelChange(ModelId.FLASH)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                selectedModel === ModelId.FLASH 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg ring-1 ring-white/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${selectedModel === ModelId.FLASH ? 'text-yellow-400' : ''}`} />
              <span>Flash 2.0</span>
            </button>
            <button 
              onClick={() => handleModelChange(ModelId.PRO)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                selectedModel === ModelId.PRO 
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Stars className="w-3.5 h-3.5 text-cyan-200" />
              <span>KTR Pro</span>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pt-20">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-100 -mt-10">
              
              {/* Animated Logo Centerpiece - REPLACED WITH NEW DESIGN */}
              <div className="relative mb-14 group cursor-pointer no-drag select-none">
                {/* Ambient Background Glow */}
                <div className="absolute -inset-20 bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-fuchsia-500/30 rounded-full blur-[80px] opacity-40 animate-pulse-slow"></div>
                
                {/* Main Logo Container */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    
                    {/* Rotating Outer Ring */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-3 rounded-full border border-cyan-500/20 border-dashed animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-6 rounded-full border border-purple-500/10 border-dotted animate-[spin_20s_linear_infinite]"></div>
                    
                    {/* Core Container */}
                    <div className="relative w-28 h-28 bg-[#0a0b10] rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)] border border-white/10 overflow-hidden z-10 group-hover:scale-105 transition-transform duration-500">
                        
                        {/* Internal Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
                        
                        {/* The Icon */}
                        <div className="relative z-20">
                          <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-indigo-500/20 blur-sm" />
                          <Bot className="relative w-16 h-16 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-indigo-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                        </div>
                        
                        {/* Scanning Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent translate-y-[-100%] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Orbiting Particle */}
                    <div className="absolute top-1/2 left-1/2 w-44 h-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent border-t-cyan-500/60 animate-[spin_3s_linear_infinite]"></div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 rounded-full bg-[#050509]/80 border border-indigo-500/30 backdrop-blur-md shadow-lg transform group-hover:scale-105 transition-transform duration-300 z-30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-[11px] font-mono text-indigo-200 tracking-[0.2em] font-bold">ONLINE</span>
                </div>
              </div>
              
              <div className="relative z-10 mb-12 px-4 py-2">
                 <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter drop-shadow-2xl select-none relative pb-2">
                    KTR
                    <span className="block md:inline-block md:ml-4 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent animate-text-gradient bg-[length:200%_auto] filter drop-shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                      CHATBOT
                    </span>
                 </h1>
                 {/* Reflection/Glow under text */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none -z-10"></div>
              </div>
              
              <p className="text-gray-400 mb-12 max-w-lg text-sm leading-relaxed font-light tracking-wide">
                Experience the next generation of AI. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-medium">Ultra-fast. Intelligent. Secure.</span>
              </p>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full px-4">
                {[
                  { icon: Brain, color: 'text-fuchsia-400', from: 'from-fuchsia-500/10', to: 'to-purple-500/5', title: 'Creative Mind', desc: 'Storytelling & Ideation' },
                  { icon: Terminal, color: 'text-cyan-400', from: 'from-cyan-500/10', to: 'to-blue-500/5', title: 'Code Expert', desc: 'Debugging & Development' },
                  { icon: Activity, color: 'text-indigo-400', from: 'from-indigo-500/10', to: 'to-violet-500/5', title: 'Logic Core', desc: 'Reasoning & Analysis' }
                ].map((item, idx) => (
                  <div key={idx} className={`relative bg-gradient-to-b ${item.from} ${item.to} backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 cursor-default group hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}>
                     <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
                     <div className={`mb-4 w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shadow-lg group-hover:border-${item.color.split('-')[1]}-500/30 transition-colors`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                     </div>
                     <h3 className="font-bold text-gray-100 mb-2 tracking-tight">{item.title}</h3>
                     <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-40 pt-4">
              {currentMessages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <InputArea onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;