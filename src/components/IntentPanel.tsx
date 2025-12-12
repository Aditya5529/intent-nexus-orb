import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';

export function IntentPanel() {
  const { 
    isPanelOpen, 
    setPanelOpen, 
    activeIntentId, 
    nodes,
    agentDecision,
    clearHighlights,
  } = useIntentStore();

  const activeNode = nodes.find((n) => n.id === activeIntentId);

  const handleClose = () => {
    setPanelOpen(false);
    clearHighlights();
  };

  return (
    <AnimatePresence>
      {isPanelOpen && activeNode && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full max-w-md z-30"
        >
          <div className="h-full glass-panel border-l border-border/50 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">
                      Intent Match
                    </span>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-semibold text-foreground capitalize"
                  >
                    {activeNode.id.replace(/_/g, ' ')}
                  </motion.h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-foreground leading-relaxed">
                  {activeNode.text}
                </p>
              </motion.div>

              {/* Agent Reasoning */}
              {agentDecision && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 rounded-xl bg-secondary/50 border border-border/30"
                >
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    AI Reasoning
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {agentDecision.reason}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      agentDecision.confidence === 'high' 
                        ? 'bg-confidence-high/20 text-confidence-high' 
                        : agentDecision.confidence === 'medium'
                        ? 'bg-confidence-medium/20 text-confidence-medium'
                        : 'bg-confidence-low/20 text-confidence-low'
                    }`}>
                      {agentDecision.confidence || 'medium'} confidence
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {agentDecision.action}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full p-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 
                                   transition-all duration-200 flex items-center justify-between group">
                    <span className="font-medium text-foreground">View Full Page</span>
                    <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full p-3 rounded-xl hover:bg-secondary border border-border/50 
                                   transition-all duration-200 flex items-center justify-between group">
                    <span className="text-foreground/80">Related Topics</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Related intents */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Related Intents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nodes
                    .filter((n) => n.id !== activeIntentId)
                    .slice(0, 4)
                    .map((node) => (
                      <button
                        key={node.id}
                        className="px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-sm 
                                 text-foreground/70 hover:text-foreground transition-colors capitalize"
                      >
                        {node.id.replace(/_/g, ' ')}
                      </button>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
