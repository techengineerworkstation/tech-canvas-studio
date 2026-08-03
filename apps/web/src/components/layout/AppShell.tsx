'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid, Video, Music, Image, Palette, Search, Bell, User, Sparkles
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
  { id: 'video', label: 'Video', icon: Video },
  { id: 'ai', label: 'AI', icon: Sparkles },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'templates', label: 'Templates', icon: Image },
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
    <div className="flex flex-col h-screen bg-surface-darkest overflow-hidden">
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-border bg-surface-medium flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gradient leading-tight">Tech Canvas Studio</h1>
            <p className="text-[10px] text-text-dim truncate leading-tight">
              {currentProject ? currentProject.name : 'Untitled Project'}
              {activeBrand && (
                <span className="inline-flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: activeBrand.color }} />
                  {activeBrand.name}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
                  active
                    ? 'tab-active shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-dark'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <button className="btn-ghost w-8 h-8 p-0 rounded-lg">
            <Search className="w-4 h-4" />
          </button>
          <button className="btn-ghost w-8 h-8 p-0 rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-hot rounded-full border border-surface-medium" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-brand-100 border border-brand-200 flex items-center justify-center ml-1">
            <User className="w-4 h-4 text-brand-700" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <footer className="h-7 shrink-0 border-t border-border bg-surface-medium flex items-center px-4 text-[11px] text-text-dim justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-text-secondary">Tech Canvas Studio</span>
          <span>v0.1.0</span>
          <span className="text-border">|</span>
          <span>{currentProject ? `${currentProject.width} × ${currentProject.height}` : '1920 × 1080'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ready</span>
        </div>
      </footer>
    </div>
  );
}
