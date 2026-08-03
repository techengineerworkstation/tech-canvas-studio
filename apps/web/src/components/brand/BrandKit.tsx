'use client';

import React, { useState } from 'react';
import { Plus, Palette, Trash2, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';

const defaultColors = [
  '#c26e3a', '#a1542e', '#dfa575', '#f2dec7',
  '#5a8fa8', '#5a9a6e', '#d4a843', '#c45c3e',
  '#6b5d50', '#9a8b7a', '#2c241c', '#e8dfd2',
];

const defaultFonts = [
  'Inter', 'Playfair Display', 'Roboto', 'Montserrat', 'Open Sans',
  'Lato', 'Poppins', 'Merriweather', 'Oswald', 'Raleway',
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
];

export function BrandKit() {
  const brands = useStudioStore((s) => s.brands);
  const activeBrandId = useStudioStore((s) => s.activeBrandId);
  const setActiveBrand = useStudioStore((s) => s.setActiveBrand);
  const addBrand = useStudioStore((s) => s.addBrand);
  const updateBrand = useStudioStore((s) => s.updateBrand);

  const selectedBrand = brands.find((b) => b.id === activeBrandId) || brands[0] || null;
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#c26e3a');

  const addBrandLocal = () => {
    if (!newBrandName) return;
    const newBrand = {
      id: Math.random().toString(36).substring(2, 15),
      name: newBrandName,
      color: newBrandColor,
      fonts: ['Inter'],
    };
    addBrand(newBrand);
    setActiveBrand(newBrand.id);
    setNewBrandName('');
    setNewBrandColor('#c26e3a');
    setShowNewBrand(false);
  };

  const deleteBrand = (brandId: string) => {
    if (brands.length <= 1) return;
    if (selectedBrand?.id === brandId) {
      const next = brands.find((b) => b.id !== brandId);
      setActiveBrand(next?.id || null);
    }
  };

  const addFontToBrand = (brandId: string, font: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand || brand.fonts.includes(font)) return;
    updateBrand(brandId, { fonts: [...brand.fonts, font] });
  };

  const removeFontFromBrand = (brandId: string, font: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand || brand.fonts.length <= 1) return;
    updateBrand(brandId, { fonts: brand.fonts.filter((f) => f !== font) });
  };

  return (
    <div className="flex h-full">
      {/* Brand List */}
      <div className="w-72 shrink-0 panel border-r overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Your Brands</h3>
            <button onClick={() => setShowNewBrand(true)} className="btn-ghost h-7 w-7 p-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showNewBrand && (
            <div className="mb-4 p-3 rounded-lg border border-brand-300 bg-brand-50">
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                className="input-field w-full mb-2 text-xs"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newBrandColor}
                  onChange={(e) => setNewBrandColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-border p-0.5 bg-white"
                />
                <button onClick={addBrandLocal} className="btn-primary flex-1 text-xs">Create</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={cn(
                  'p-2.5 rounded-lg border cursor-pointer transition-colors duration-150',
                  selectedBrand?.id === brand.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-border bg-white hover:border-brand-300'
                )}
                onClick={() => setActiveBrand(brand.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-border shadow-sm" style={{ backgroundColor: brand.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-text-primary truncate">{brand.name}</div>
                    <div className="text-[10px] text-text-dim">{brand.fonts.length} fonts</div>
                  </div>
                  {brands.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBrand(brand.id); }}
                      className="text-text-dim hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Details */}
      <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin bg-surface-darkest">
        {selectedBrand ? (
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Brand Details</h2>
              <p className="text-xs text-text-dim">Manage colors, fonts, and styles for {selectedBrand.name}.</p>
            </div>

            {/* Brand Color */}
            <div className="bg-surface-medium border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Brand Color</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl shadow-depth border border-border" style={{ backgroundColor: selectedBrand.color }} />
                <div className="flex-1">
                  <input
                    type="color"
                    value={selectedBrand.color}
                    onChange={(e) => updateBrand(selectedBrand.id, { color: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer border border-border p-0.5 bg-white"
                  />
                  <p className="text-[10px] text-text-dim mt-1 font-mono">{selectedBrand.color}</p>
                </div>
              </div>
            </div>

            {/* Palette */}
            <div className="bg-surface-medium border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Color Palette</h3>
              <div className="grid grid-cols-8 gap-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateBrand(selectedBrand.id, { color })}
                    className="group relative aspect-square rounded-lg border border-border shadow-sm hover:scale-110 transition-transform duration-150"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Use</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div className="bg-surface-medium border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3 flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Brand Fonts
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedBrand.fonts.map((font) => (
                  <div
                    key={font}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border text-xs"
                  >
                    <span className="text-text-primary" style={{ fontFamily: font }}>{font}</span>
                    {selectedBrand.fonts.length > 1 && (
                      <button
                        onClick={() => removeFontFromBrand(selectedBrand.id, font)}
                        className="text-text-dim hover:text-red-500 text-[10px]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <select
                onChange={(e) => { if (e.target.value) { addFontToBrand(selectedBrand.id, e.target.value); e.target.value = ''; } }}
                className="select-field w-full text-xs"
              >
                <option value="">Add a font...</option>
                {defaultFonts.filter((f) => !selectedBrand.fonts.includes(f)).map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>

              <div className="mt-4 space-y-2">
                {selectedBrand.fonts.map((font) => (
                  <div key={font} className="p-3 rounded-lg border border-border bg-white">
                    <div className="text-[10px] text-text-dim mb-1">{font}</div>
                    <div style={{ fontFamily: font }} className="text-xl text-text-primary">
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <Palette className="w-14 h-14 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text-secondary">Select or create a brand</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
