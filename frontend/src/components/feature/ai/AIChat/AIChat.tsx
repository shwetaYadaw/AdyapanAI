import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/hooks';
import { sendChatMessageThunk, addUserMessage, clearChat } from '../../../../features/ai/aiSlice';
import Button from '../../../../shared/components/Button/Button';
import { clsx } from 'clsx';

export default function AIChat() {
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const { chatMessages, isThinking, error } = useAppSelector((s) => s.ai);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isThinking) return;
    setInput('');
    dispatch(addUserMessage(msg));
    dispatch(sendChatMessageThunk({ message: msg }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SUGGESTIONS = [
    'Explain React hooks with examples',
    'How do I crack a Google interview?',
    'What skills do I need for a Data Analyst role?',
    'Create a 30-day study plan for DSA',
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">ADYAPAN AI</p>
            <p className="text-xs text-gray-400">Your career & learning assistant</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearChat())}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Clear conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center"
            >
              <Bot className="w-8 h-8 text-primary-500" />
            </motion.div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">How can I help you today?</p>
              <p className="text-sm text-gray-400">Ask me anything about learning, careers, or placement</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-left text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={clsx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    msg.role === 'user'
                      ? 'bg-primary-500'
                      : 'bg-gradient-to-br from-primary-500 to-purple-600'
                  )}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot className="w-3.5 h-3.5 text-white" />
                    }
                  </div>
                  <div className={clsx(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.timestamp && (
                      <p className={clsx('text-xs mt-1 opacity-60', msg.role === 'user' ? 'text-right' : '')}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
        {error && (
          <p className="text-xs text-red-500 text-center py-2">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 items-end bg-gray-50 dark:bg-gray-800 rounded-2xl p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none focus:outline-none px-2 py-1.5 max-h-32 scrollbar-thin"
            style={{ minHeight: '36px' }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            loading={isThinking}
            size="sm"
            className="!rounded-xl !px-3 !py-2 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1.5">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
