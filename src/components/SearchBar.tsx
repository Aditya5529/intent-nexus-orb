import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';
import { getDemoDecision } from '@/api/backend';

export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchQuery,
    setSearchQuery,
    setAgentThinking,
    isAgentThinking,
    setAgentDecision,
    setActiveIntent,
    setCameraTarget,
    setShouldFlyToTarget,
    setPanelOpen,
    nodes,
  } = useIntentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAgentThinking) return;

    setSearchQuery(inputValue);
    setAgentThinking(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Use demo decision for now
      const response = getDemoDecision(inputValue);
      const decision = response.decision;

      setAgentDecision(decision);
      setActiveIntent(decision.intent_id);

      // Find the node and fly to it
      const targetNode = nodes.find((n) => n.id === decision.intent_id);
      if (targetNode) {
        // Generate position (same logic as in IntentGraph)
        const index = nodes.findIndex((n) => n.id === decision.intent_id);
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - (index / (nodes.length - 1)) * 2;
        const radius = Math.sqrt(1 - y * y) * 4;
        const theta = goldenAngle * index;
        
        setCameraTarget([
          Math.cos(theta) * radius,
          y * 3,
          Math.sin(theta) * radius,
        ]);
        setShouldFlyToTarget(true);
        setPanelOpen(true);
      }
    } catch (error) {
      console.error('Agent decision failed:', error);
    } finally {
      setAgentThinking(false);
    }
  };

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 60px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.2)'
              : '0 0 30px rgba(0, 212, 255, 0.1)',
          }}
          className="relative rounded-full overflow-hidden"
        >
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="relative flex items-center bg-secondary/80 backdrop-blur-xl border border-border/50 rounded-full">
            <div className="pl-6 text-muted-foreground">
              {isAgentThinking ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent px-4 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isAgentThinking}
            />

            <AnimatePresence>
              {inputValue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="submit"
                  disabled={isAgentThinking}
                  className="mr-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm 
                           flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-muted-foreground mt-4"
      >
        Try: "How do I apply?" • "Show me courses" • "What are the costs?"
      </motion.p>
    </motion.div>
  );
}
