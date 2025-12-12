import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, AlertCircle } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';

export function AgentOverlay() {
  const { agentDecision, isAgentThinking, searchQuery } = useIntentStore();

  return (
    <AnimatePresence>
      {/* Thinking indicator */}
      {isAgentThinking && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-6 left-6 z-20"
        >
          <div className="glass-panel rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Agent thinking...</p>
              <p className="text-xs text-muted-foreground">Analyzing: "{searchQuery}"</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decision result */}
      {agentDecision && !isAgentThinking && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-6 left-6 z-20"
        >
          <div className="glass-panel rounded-xl px-4 py-3 max-w-sm">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                agentDecision.confidence === 'high' ? 'bg-confidence-high/20' :
                agentDecision.confidence === 'medium' ? 'bg-confidence-medium/20' :
                'bg-confidence-low/20'
              }`}>
                {agentDecision.confidence === 'high' ? (
                  <Zap className="w-4 h-4 text-confidence-high" />
                ) : agentDecision.confidence === 'medium' ? (
                  <Target className="w-4 h-4 text-confidence-medium" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-confidence-low" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider">
                    {agentDecision.action.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    agentDecision.confidence === 'high' ? 'bg-confidence-high/20 text-confidence-high' :
                    agentDecision.confidence === 'medium' ? 'bg-confidence-medium/20 text-confidence-medium' :
                    'bg-confidence-low/20 text-confidence-low'
                  }`}>
                    {agentDecision.confidence || 'analyzing'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {agentDecision.reason}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
