'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid, Video, Music, Image, Palette,
  Search, Bell, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { DesignCanvas } from '@/components/design/DesignCanvas';
import { VideoEditor } from '@/components/video/VideoEditor';
import { AudioPanel } from '@/components/audio/AudioPanel';
import { AIPanel } from '@/components/ai/AIPanel';
import { BrandKit } from '@/components/brand/BrandKit';
import { Templates } from '@/components/templates/Templates';

const tabs = [
  { id: 'design', label: 'Design', icon: LayoutGrid },
  { id: 'video', label: 'Video Editor', icon: Video },
  { id: 'ai', label: 'AI Generation', icon: Image },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'brand', label: 'Brand Kit', icon: Palette },
  { id: 'templates', label: 'Templates', icon: LayoutGrid },
];

export function AppShell() {
  const [activeTab, setActiveTab] = useState('design');
  const activeBrand = useStudioStore((s) => s.getActiveBrand());
  const currentProject = useStudioStore((s) => s.currentProject);

  const renderContent = () => {
    switch (activeTab) {
      case 'design': return <DesignCanvas />;
      case 'video': return <VideoEditor />;
      case 'ai': return <AIPanel />;
      case 'audio': return <AudioPanel />;
      case 'brand': return <BrandKit />;
      case 'templates': return <Templates />;
      default: return <DesignCanvas />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface-darkest">
      <header className="h-14 border-b border-border bg-surface-dark flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gradient">Tech Canvas Studio</h1>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  activeTab === tab.id
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="btn-ghost p-2 rounded-lg">
            <Search className="w-4 h-4" />
          </button>
          <button className="btn-ghost p-2 rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-hot rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="h-8 border-t border-border bg-surface-dark flex items-center px-4 text-xs text-text-dim justify-between">
        <div className="flex items-center gap-4">
          <span>Tech Canvas Studio v0.1.0</span>
          <span>•</span>
          <span>{currentProject ? `${currentProject.name} (${currentProject.width}×${currentProject.height})` : 'Canvas: 1920 × 1080'}</span>
          {activeBrand && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeBrand.color }}></span>
                {activeBrand.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>Ready</span>
        </div>
      </footer>
    </div>
  );
}
