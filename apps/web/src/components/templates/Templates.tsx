'use client';

import React, { useState } from 'react';
import { Layout, Image, FileText, Music, Video, Star, Search, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { templates } from '@/lib/express';

const categories = [
  { id: 'all', name: 'All', icon: Layout },
  { id: 'social', name: 'Social', icon: Image },
  { id: 'document', name: 'Docs', icon: FileText },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'audio', name: 'Audio', icon: Music },
  { id: 'favorites', name: 'Favorites', icon: Star },
];

export function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const favorites = useStudioStore((s) => s.favorites);
  const toggleFavorite = useStudioStore((s) => s.toggleFavorite);
  const addRecentTemplate = useStudioStore((s) => s.addRecentTemplate);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all'
      || (selectedCategory === 'favorites' && favorites.includes(template.id))
      || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
      || (template.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    addRecentTemplate(templateId);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Categories */}
      <div className="w-56 shrink-0 panel border-r overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150',
                    selectedCategory === category.id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-dark hover:text-text-primary'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="flex-1 min-w-0 flex flex-col bg-surface-darkest">
        {/* Header */}
        <div className="h-14 shrink-0 border-b border-border bg-surface-medium px-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="input-field w-full pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md transition-colors duration-150',
                viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-text-dim hover:text-text-primary'
              )}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors duration-150',
                viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-text-dim hover:text-text-primary'
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs text-text-dim">
            {filteredTemplates.length} template{filteredTemplates.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin">
          {filteredTemplates.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-dim">
              <div className="text-center">
                <Layout className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-text-secondary">No templates found</p>
                <p className="text-xs mt-1">Try a different search or category</p>
              </div>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
                : 'flex flex-col gap-2 max-w-4xl'
            )}>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    'group bg-white border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-brand-300 hover:shadow-md',
                    viewMode === 'list' && 'flex items-center gap-3'
                  )}
                >
                  <div
                    className={cn(
                      'relative bg-surface-darker flex items-center justify-center overflow-hidden',
                      viewMode === 'grid' ? 'aspect-[4/3]' : 'w-24 h-20 shrink-0 rounded-l-xl'
                    )}
                    style={template.previewColor ? { backgroundColor: template.previewColor } : undefined}
                  >
                    <template.icon className="w-8 h-8 text-white/70" />
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className={cn(
                        'absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-150',
                        favorites.includes(template.id) ? 'text-yellow-400' : 'text-white/70 hover:text-white'
                      )}
                    >
                      <Star className={cn('w-3.5 h-3.5', favorites.includes(template.id) && 'fill-current')} />
                    </button>
                  </div>

                  <div className={cn('flex-1', viewMode === 'grid' ? 'p-3' : 'p-3 pr-3')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-text-primary truncate">{template.name}</h4>
                        {template.description && (
                          <p className="text-[10px] text-text-dim mt-0.5 line-clamp-2">{template.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-dark border border-border text-text-dim capitalize">
                        {template.category}
                      </span>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="btn-primary text-[10px] px-2.5 py-1.5 h-auto"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
