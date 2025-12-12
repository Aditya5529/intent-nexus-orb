import { motion } from 'framer-motion';
import { Compass, MousePointer2, MessageSquare } from 'lucide-react';

export function EmptyState() {
  const tips = [
    {
      icon: MousePointer2,
      title: 'Click & Drag',
      description: 'Rotate the view to explore',
    },
    {
      icon: Compass,
      title: 'Hover Nodes',
      description: 'Discover intent meanings',
    },
    {
      icon: MessageSquare,
      title: 'Ask Anything',
      description: 'Natural language search',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3 text-glow">
          Explore by Intent
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Navigate through meaning, not pages. Each node represents a distinct purpose.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/30 border border-border/30"
          >
            <tip.icon className="w-4 h-4 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
