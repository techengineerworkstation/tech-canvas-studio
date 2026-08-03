'use client';

import React from 'react';
import { useStudioStore } from '@/store/studioStore';
import { socialPresets } from '@/lib/express';

const categories = [
  { name: 'Social Media', filter: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok', 'Pinterest'] },
  { name: 'Video', filter: ['YouTube', 'Reel', 'Short', 'HD', '4K', 'Presentation'] },
  { name: 'Print', filter: ['A4', 'Letter', 'Flyer', 'Poster', 'Business Card'] },
  { name: 'Web', filter: ['Square', 'Blog', 'Email', 'Logo', 'Presentation'] },
];

export function Templates() {
  const setCurrentProject = useStudioStore((s) => s.setCurrentProject);
  const addRecentProject = useStudioStore((s) => s.addRecentProject);

  const handleSelect = (preset: (typeof socialPresets)[0]) => {
    const project = {
      id: Math.random().toString(36).substring(2, 15),
      name: preset.name,
      width: preset.width,
      height: preset.height,
      lastModified: new Date(),
    };
    setCurrentProject(project);
    addRecentProject(project);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-text-primary mb-2">Design Templates</h2>
        <p className="text-sm text-text-dim mb-6">Select a template to start designing with the perfect size.</p>

        <div className="space-y-8">
          {categories.map((category) => {
            const items = socialPresets.filter((p) => category.filter.some((f) => p.name.includes(f)));
            return (
              <div key={category.name}>
                <h3 className="text-sm font-semibold text-text-secondary mb-3">{category.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => handleSelect(template)}
                      className="group relative aspect-[4/3] rounded-xl border border-border overflow-hidden bg-surface-dark hover:border-brand-300 hover:bg-brand-50 transition-colors duration-150 text-left"
                    >
                      <div className="absolute inset-0 opacity-10 bg-brand-600" />
                      <div className="relative p-4 h-full flex flex-col justify-end">
                        <div className="font-medium text-sm text-text-primary">{template.name}</div>
                        <div className="text-xs text-text-dim">{template.width} × {template.height}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
