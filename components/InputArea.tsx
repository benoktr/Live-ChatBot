import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Command } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onStop }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050509] via-[#050509]/95 to-transparent pt-24 pb-8 px-4 z-20">
      <div className="max-w-3xl mx-auto relative">
        
        {/* Input Container with Gradient Border */}
        <div className={`relative rounded-2xl p-[1px] transition-all duration-300 ${
          isFocused 
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]' 
            : 'bg-white/10'
        }`}>
          <div className="relative flex items-end w-full p-2 bg-[#0a0b10] rounded-2xl">
            
            <div className="pl-3 pb-3 text-gray-500">
               <Sparkles className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-indigo-400' : 'text-gray-600'}`} />
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask KTR anything..."
              className="w-full max-h-[200px] py-3 px-3 bg-transparent text-gray-100 border-0 focus:ring-0 focus:outline-none resize-none placeholder-gray-500 leading-relaxed font-light"
              style={{ minHeight: '48px' }}
            />
            
            <button
              onClick={isLoading ? onStop : handleSend}
              disabled={!input.trim() && !isLoading}
              className={`flex-shrink-0 mb-1.5 mr-1.5 p-2 rounded-xl transition-all duration-300 ${
                (input.trim() || isLoading)
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 scale-100'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed scale-95 opacity-50'
              }`}
            >
              {isLoading ? (
                 <div className="w-5 h-5 flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                 </div>
              ) : (
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-gray-500 tracking-widest font-mono uppercase">
                KTR Chatbot &bull; Austin Beno J S
            </span>
        </div>
      </div>
    </div>
  );
};

export default InputArea;