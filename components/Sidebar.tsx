import React from 'react';
import { ChatSession } from '../types';
import { Plus, MessageSquare, Trash2, Menu, Cpu, Sparkles, ChevronRight } from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  toggleSidebar
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <div className={`fixed md:relative z-50 flex flex-col h-full bg-[#030305]/80 backdrop-blur-2xl w-[280px] transform transition-transform duration-300 ease-in-out border-r border-white/5 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Branding Header */}
        <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-gradient-to-r from-transparent via-indigo-900/10 to-transparent">
          <div className="relative group">
             <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
             <div className="relative w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-xl">
                <Cpu className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              KTR <span className="text-indigo-400">BOT</span>
            </span>
            <span className="text-[9px] text-gray-500 font-mono tracking-[0.2em] uppercase">System v3.1</span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-6">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="relative overflow-hidden flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-indigo-900/20 group hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
            <Plus className="w-4 h-4" />
            <span>NEW CHAT</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-800 px-3 pb-4">
          <div className="text-[10px] font-bold text-indigo-300/50 px-3 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Chat History
          </div>
          <div className="flex flex-col gap-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`group relative flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 border ${
                  currentSessionId === session.id 
                    ? 'bg-indigo-500/10 text-white border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]' 
                    : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${currentSessionId === session.id ? 'text-indigo-400' : 'text-gray-600 group-hover:text-gray-500'}`} />
                <div className="flex-1 truncate text-left pr-8 font-light text-[13px]">
                  {session.title || 'New Conversation'}
                </div>
                
                {/* Active Indicator Arrow */}
                {currentSessionId === session.id && (
                   <ChevronRight className="absolute right-2 w-3 h-3 text-indigo-500 opacity-50" />
                )}

                {/* Delete Action */}
                <div 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                    currentSessionId === session.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                  } transition-all duration-200`}
                >
                  <div 
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
            
            {sessions.length === 0 && (
              <div className="mt-4 px-4 py-8 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                <p className="text-xs text-gray-500 font-medium">No history found</p>
                <p className="text-[10px] text-gray-600 mt-1">Start a conversation to see it here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Removed as requested */}
        {/* Empty div for spacing if needed */}
        <div className="h-4"></div>

      </div>
      
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white md:hidden shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;