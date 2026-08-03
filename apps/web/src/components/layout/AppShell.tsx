'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Video, Music, Image, Palette, 
  Settings, HelpCircle, Moon, Sun, Menu, X,
  ChevronDown, Search, Bell, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [isDark, setIsDark] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

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
      {/* Header */}
      <header className="h-14 border-b border-border bg-surface-dark flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gradient">Adobe Creative Suite</h1>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'text-brand-400 bg-surface-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="btn-ghost p-2 rounded-lg">
            <Search className="w-4 h-4" />
          </button>
          <button className="btn-ghost p-2 rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-hot rounded-full"></span>
          </button>
          <button 
            className="btn-ghost p-2 rounded-lg"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <footer className="h-8 border-t border-border bg-surface-dark flex items-center px-4 text-xs text-text-dim justify-between">
        <div className="flex items-center gap-4">
          <span>Adobe Creative Suite v0.1.0</span>
          <span>•</span>
          <span>Canvas: 1920 × 1080</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Zoom: 100%</span>
          <span>•</span>
          <span>60 FPS</span>
        </div>
      </footer>
    </div>
  );
}
