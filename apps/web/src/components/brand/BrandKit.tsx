'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Palette, Type, Trash2, Edit2 } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  color: string;
  fonts: string[];
}

const defaultColors = [
  '#7c3aed', '#a855f7', '#e94560', '#f472b6', '#34d399', '#60a5fa',
  '#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981',
];

const defaultFonts = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
];

export function BrandKit() {
  const [brands, setBrands] = useState<Brand[]>([
    { id: '1', name: 'My Brand', color: '#7c3aed', fonts: ['Inter', 'Roboto'] },
  ]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(brands[0]);
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#7c3aed');

  const addBrand = () => {
    if (!newBrandName) return;
    
    const newBrand: Brand = {
      id: Math.random().toString(36).substr(2, 9),
      name: newBrandName,
      color: newBrandColor,
      fonts: ['Inter'],
    };
    
    setBrands([...brands, newBrand]);
    setNewBrandName('');
    setNewBrandColor('#7c3aed');
    setShowNewBrand(false);
  };

  const deleteBrand = (brandId: string) => {
    setBrands(brands.filter((b) => b.id !== brandId));
    if (selectedBrand?.id === brandId) {
      setSelectedBrand(brands[0] || null);
    }
  };

  const addFontToBrand = (brandId: string, font: string) => {
    setBrands(brands.map((b) => {
      if (b.id === brandId && !b.fonts.includes(font)) {
        return { ...b, fonts: [...b.fonts, font] };
      }
      return b;
    }));
  };

  const removeFontFromBrand = (brandId: string, font: string) => {
    setBrands(brands.map((b) => {
      if (b.id === brandId) {
        return { ...b, fonts: b.fonts.filter((f) => f !== font) };
      }
      return b;
    }));
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Brands */}
      <div className="w-80 bg-surface-dark border-r border-border overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Your Brands</h3>
            <button
              onClick={() => setShowNewBrand(true)}
              className="btn-ghost p-1.5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showNewBrand && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg border border-brand-500 bg-brand-500/10"
            >
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
                <button onClick={addBrand} className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            {brands.map((brand) => (
              <motion.div
                key={brand.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all',
                  selectedBrand?.id === brand.id
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-border hover:border-border-light'
                )}
                onClick={() => setSelectedBrand(brand)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: brand.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-text-primary">{brand.name}</div>
                    <div className="text-xs text-text-dim">{brand.fonts.length} fonts</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBrand(brand.id);
                    }}
                    className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Brand Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedBrand ? (
          <div className="p-6 max-w-4xl">
            <h2 className="text-xl font-bold text-text-primary mb-6">Brand Details</h2>

            {/* Brand Color */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Brand Color</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl shadow-lg"
                  style={{ backgroundColor: selectedBrand.color }}
                />
                <div>
                  <input
                    type="color"
                    value={selectedBrand.color}
                    onChange={(e) => {
                      setBrands(brands.map((b) =>
                        b.id === selectedBrand.id ? { ...b, color: e.target.value } : b
                      ));
                      setSelectedBrand({ ...selectedBrand, color: e.target.value });
                    }}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                  <p className="text-xs text-text-dim mt-1">{selectedBrand.color}</p>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Color Palette</h3>
              <div className="grid grid-cols-6 gap-3">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                    }}
                    className="group relative"
                    title={`Copy ${color}`}
                  >
                    <div
                      className="w-full aspect-square rounded-lg shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Copy
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Brand Fonts</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBrand.fonts.map((font) => (
                  <div
                    key={font}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light border border-border"
                  >
                    <span className="text-sm" style={{ fontFamily: font }}>{font}</span>
                    <button
                      onClick={() => removeFontFromBrand(selectedBrand.id, font)}
                      className="text-text-dim hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addFontToBrand(selectedBrand.id, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="select-field w-full"
              >
                <option value="">Add a font...</option>
                {defaultFonts
                  .filter((f) => !selectedBrand.fonts.includes(f))
                  .map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
              </select>

              <div className="mt-4 space-y-2">
                {selectedBrand.fonts.map((font) => (
                  <div
                    key={font}
                    className="p-4 rounded-lg border border-border bg-surface-dark"
                  >
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
