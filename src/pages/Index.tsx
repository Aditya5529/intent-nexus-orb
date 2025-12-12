import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IntentGraph } from '@/three/IntentGraph';
import { SearchBar } from '@/components/SearchBar';
import { AgentOverlay } from '@/components/AgentOverlay';
import { IntentPanel } from '@/components/IntentPanel';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { useIntentStore } from '@/store/intentStore';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery } = useIntentStore();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* 3D Graph Background */}
      <IntentGraph />

      {/* Header */}
      <Header />

      {/* Empty state hint when no search */}
      {!searchQuery && <EmptyState />}

      {/* Agent overlay for reasoning */}
      <AgentOverlay />

      {/* Search bar */}
      <SearchBar />

      {/* Side panel for intent details */}
      <IntentPanel />
    </div>
  );
};

export default Index;
