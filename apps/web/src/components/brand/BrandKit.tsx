'use client';

import React, { useState } from 'react';
import { Plus, Palette, Trash2, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';

const defaultColors = [
  '#d4884f', '#c26e3a', '#a1542e', '#dfa575', '#f2dec7',
  '#5a8fa8', '#5a9a6e', '#d4a843', '#c45c3e', '#8fa86e',
  '#6b5d50', '#9a8b7a', '#3d3229', '#e8dfd2', '#faf6f0',
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
  const [newBrandColor, setNewBrandColor] = useState('#d4884f');

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
    setNewBrandColor('#d4884f');
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
    if (!brand) return;
    updateBrand(brandId, { fonts: brand.fonts.filter((f) => f !== font) });
  };

  return (
    <div className="flex h-full">
      <div className="w-80 bg-surface-dark border-r border-border overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Your Brands</h3>
            <button onClick={() => setShowNewBrand(true)} className="btn-ghost p-1.5">
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
                className="input-field w-full mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newBrandColor}
                  onChange={(e) => setNewBrandColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer"
                />
                <button onClick={addBrandLocal} className="btn-primary flex-1">Create</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-colors duration-150',
                  selectedBrand?.id === brand.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-border hover:border-border-light'
                )}
                onClick={() => setActiveBrand(brand.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: brand.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-text-primary truncate">{brand.name}</div>
                    <div className="text-xs text-text-dim">{brand.fonts.length} fonts</div>
                  </div>
                  {brands.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBrand(brand.id); }}
                      className="btn-ghost p-1.5 text-text-dim hover:text-red-500"
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

      <div className="flex-1 overflow-y-auto">
        {selectedBrand ? (
          <div className="p-6 max-w-4xl">
            <h2 className="text-xl font-bold text-text-primary mb-6">Brand Details</h2>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Brand Color</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl shadow-lg" style={{ backgroundColor: selectedBrand.color }} />
                <div>
                  <input
                    type="color"
                    value={selectedBrand.color}
                    onChange={(e) => updateBrand(selectedBrand.id, { color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                  <p className="text-xs text-text-dim mt-1">{selectedBrand.color}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Color Palette</h3>
              <div className="grid grid-cols-6 gap-3">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { navigator.clipboard.writeText(color); updateBrand(selectedBrand.id, { color }); }}
                    className="group relative"
                    title={`Use ${color}`}
                  >
                    <div
                      className="w-full aspect-square rounded-lg shadow-md transition-transform duration-150 group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      Use
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Brand Fonts</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBrand.fonts.map((font) => (
                  <div
                    key={font}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light border border-border"
                  >
                    <span className="text-sm text-text-primary" style={{ fontFamily: font }}>{font}</span>
                    <button
                      onClick={() => removeFontFromBrand(selectedBrand.id, font)}
                      className="text-text-dim hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <select
                onChange={(e) => { if (e.target.value) { addFontToBrand(selectedBrand.id, e.target.value); e.target.value = ''; } }}
                className="select-field w-full"
              >
                <option value="">Add a font...</option>
                {defaultFonts.filter((f) => !selectedBrand.fonts.includes(f)).map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>

              <div className="mt-4 space-y-2">
                {selectedBrand.fonts.map((font) => (
                  <div key={font} className="p-4 rounded-lg border border-border bg-surface-dark">
                    <div className="text-xs text-text-dim mb-1">{font}</div>
                    <div style={{ fontFamily: font }} className="text-2xl text-text-primary">
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
              <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select or create a brand</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
