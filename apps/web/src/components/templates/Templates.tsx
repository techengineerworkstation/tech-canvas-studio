'use client';

import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Social Media',
    templates: [
      { name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1', color: '#e94560' },
      { name: 'Instagram Story', width: 1080, height: 1920, ratio: '9:16', color: '#f472b6' },
      { name: 'Twitter Post', width: 1200, height: 675, ratio: '16:9', color: '#60a5fa' },
      { name: 'Facebook Post', width: 1200, height: 630, ratio: '16:9', color: '#3b82f6' },
      { name: 'Facebook Cover', width: 820, height: 312, ratio: '16:9', color: '#2563eb' },
      { name: 'LinkedIn Post', width: 1200, height: 627, ratio: '16:9', color: '#0ea5e9' },
      { name: 'TikTok', width: 1080, height: 1920, ratio: '9:16', color: '#000000' },
      { name: 'Pinterest Pin', width: 1000, height: 1500, ratio: '2:3', color: '#dc2626' },
    ],
  },
  {
    name: 'Video',
    templates: [
      { name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9', color: '#ef4444' },
      { name: 'YouTube Banner', width: 2560, height: 1440, ratio: '16:9', color: '#f97316' },
      { name: 'HD 1080p', width: 1920, height: 1080, ratio: '16:9', color: '#7c3aed' },
      { name: 'HD 720p', width: 1280, height: 720, ratio: '16:9', color: '#a855f7' },
      { name: '4K', width: 3840, height: 2160, ratio: '16:9', color: '#8b5cf6' },
      { name: 'Presentation 16:9', width: 1920, height: 1080, ratio: '16:9', color: '#6366f1' },
    ],
  },
  {
    name: 'Print',
    templates: [
      { name: 'A4 Portrait', width: 2480, height: 3508, ratio: '3:4', color: '#10b981' },
      { name: 'A4 Landscape', width: 3508, height: 2480, ratio: '4:3', color: '#14b8a6' },
      { name: 'Letter Portrait', width: 2550, height: 3300, ratio: '3:4', color: '#06b6d4' },
      { name: 'Flyer', width: 2550, height: 3300, ratio: '3:4', color: '#0891b2' },
      { name: 'Poster', width: 3000, height: 4000, ratio: '3:4', color: '#0e7490' },
      { name: 'Business Card', width: 1050, height: 600, ratio: '16:9', color: '#155e75' },
    ],
  },
  {
    name: 'Web',
    templates: [
      { name: 'Square 1024', width: 1024, height: 1024, ratio: '1:1', color: '#fbbf24' },
      { name: 'Square 512', width: 512, height: 512, ratio: '1:1', color: '#f59e0b' },
      { name: 'Blog Header', width: 1200, height: 630, ratio: '16:9', color: '#d97706' },
      { name: 'Email Header', width: 600, height: 200, ratio: '3:1', color: '#b45309' },
    ],
  },
];

export function Templates() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-text-primary mb-6">Design Templates</h2>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">{category.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.templates.map((template) => (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative aspect-[4/3] rounded-xl border border-border overflow-hidden bg-surface-dark hover:border-border-light transition-all"
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: template.color }}
                    />
                    <div className="relative p-4 h-full flex flex-col justify-end">
                      <div className="font-medium text-sm text-text-primary">{template.name}</div>
                      <div className="text-xs text-text-dim">
                        {template.width} × {template.height}
                      </div>
                      <div className="text-xs text-text-dim mt-1">{template.ratio}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
