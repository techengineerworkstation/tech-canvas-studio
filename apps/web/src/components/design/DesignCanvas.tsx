'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import {
  MousePointer, Type, Square, Circle, Triangle, Star,
  Minus, ArrowRight, Diamond, Hexagon, Plus, ZoomIn, ZoomOut,
  Maximize, Grid3X3, Undo2, Redo2, Trash2, Copy, Lock, Unlock,
  Wand2, Layers, Image as ImageIcon, Palette, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { socialPresets } from '@/lib/express';

const tools = [
  { id: 'select', label: 'Select', icon: MousePointer },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'rect', label: 'Rectangle', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'line', label: 'Line', icon: Minus },
  { id: 'arrow', label: 'Arrow', icon: ArrowRight },
  { id: 'diamond', label: 'Diamond', icon: Diamond },
  { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
];

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<InstanceType<typeof fabric.Canvas> | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [selectedObject, setSelectedObject] = useState<InstanceType<typeof fabric.FabricObject> | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const activeBrand = useStudioStore((s) => s.getActiveBrand());
  const selectedImage = useStudioStore((s) => s.getSelectedImage());

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width / 2,
      height: canvasSize.height / 2,
      backgroundColor: '#faf6f0',
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.on('selection:created', (e: { selected?: InstanceType<typeof fabric.FabricObject>[] }) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    canvas.on('selection:updated', (e: { selected?: InstanceType<typeof fabric.FabricObject>[] }) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    canvas.on('selection:cleared', () => setSelectedObject(null));

    fabricRef.current = canvas;
    setCanvasReady(true);

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

  useEffect(() => {
    if (activeBrand && fabricRef.current) {
      const canvas = fabricRef.current;
      const textObjects = canvas.getObjects().filter((obj) => obj.type === 'i-text');
      textObjects.forEach((obj) => {
        const font = activeBrand.fonts[0] || 'Inter';
        obj.set('fill', activeBrand.color);
        try {
          (obj as any).set('fontFamily', font);
        } catch {}
      });
      canvas.renderAll();
    }
  }, [activeBrand]);

  const handleToolClick = useCallback((toolId: string) => {
    setActiveTool(toolId);
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (toolId === 'select') {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      return;
    }

    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';

    const brandColor = activeBrand?.color || '#d4884f';
    let obj: InstanceType<typeof fabric.FabricObject>;

    switch (toolId) {
      case 'text':
        obj = new fabric.IText('Double click to edit', {
          left: 100,
          top: 100,
          fontSize: 36,
          fill: brandColor,
          fontFamily: activeBrand?.fonts[0] || 'Inter',
        });
        break;
      case 'rect':
        obj = new fabric.Rect({ left: 100, top: 100, width: 200, height: 150, fill: brandColor, rx: 8, ry: 8 });
        break;
      case 'circle':
        obj = new fabric.Circle({ left: 100, top: 100, radius: 75, fill: brandColor });
        break;
      case 'triangle':
        obj = new fabric.Triangle({ left: 100, top: 100, width: 150, height: 130, fill: brandColor });
        break;
      case 'line':
        obj = new fabric.Line([100, 100, 300, 100], { stroke: brandColor, strokeWidth: 3 });
        break;
      case 'star':
        obj = new fabric.Polygon(
          [
            { x: 75, y: 0 }, { x: 90, y: 50 }, { x: 150, y: 50 },
            { x: 105, y: 80 }, { x: 120, y: 130 }, { x: 75, y: 100 },
            { x: 30, y: 130 }, { x: 45, y: 80 }, { x: 0, y: 50 }, { x: 60, y: 50 },
          ],
          { left: 100, top: 100, fill: brandColor }
        );
        break;
      case 'diamond':
        obj = new fabric.Polygon(
          [
            { x: 75, y: 0 }, { x: 150, y: 75 }, { x: 75, y: 150 }, { x: 0, y: 75 },
          ],
          { left: 100, top: 100, fill: brandColor }
        );
        break;
      case 'hexagon':
        obj = new fabric.Polygon(
          [
            { x: 75, y: 0 }, { x: 140, y: 37 }, { x: 140, y: 113 },
            { x: 75, y: 150 }, { x: 10, y: 113 }, { x: 10, y: 37 },
          ],
          { left: 100, top: 100, fill: brandColor }
        );
        break;
      case 'arrow':
        obj = new fabric.Line([100, 100, 300, 100], { stroke: brandColor, strokeWidth: 6 });
        break;
      default:
        return;
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setActiveTool('select');
    canvas.selection = true;
    canvas.defaultCursor = 'default';
  }, [activeBrand]);

  const handleZoom = (direction: 'in' | 'out' | 'fit') => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    let newZoom = zoom;
    if (direction === 'in') newZoom = Math.min(zoom * 1.2, 5);
    if (direction === 'out') newZoom = Math.max(zoom / 1.2, 0.1);
    if (direction === 'fit') newZoom = 1;
    canvas.setZoom(newZoom);
    setZoom(newZoom);
    canvas.renderAll();
  };

  const handleDelete = () => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.remove(selectedObject);
    fabricRef.current.renderAll();
    setSelectedObject(null);
  };

  const handleDuplicate = () => {
    if (!fabricRef.current || !selectedObject) return;
    selectedObject.clone()
      .then((cloned: InstanceType<typeof fabric.FabricObject>) => {
        cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
        fabricRef.current!.add(cloned);
        fabricRef.current!.setActiveObject(cloned);
        fabricRef.current!.renderAll();
      });
  };

  const handleAddImage = async () => {
    if (!fabricRef.current) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgUrl = event.target?.result as string;
        const img = await fabric.Image.fromURL(imgUrl);
        img.scaleToWidth(400);
        fabricRef.current!.add(img);
        fabricRef.current!.setActiveObject(img);
        fabricRef.current!.renderAll();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAddAiImage = () => {
    if (!fabricRef.current || !selectedImage) return;
    fabric.Image.fromURL(selectedImage.url)
      .then((img) => {
        img.scaleToWidth(400);
        fabricRef.current!.add(img);
        fabricRef.current!.setActiveObject(img);
        fabricRef.current!.renderAll();
      });
  };

  const handleExport = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = dataUrl;
    link.click();
  };

  const handlePresetChange = (name: string) => {
    const preset = socialPresets.find((p) => p.name === name);
    if (preset) setCanvasSize({ width: preset.width, height: preset.height });
  };

  const handleApplyBackground = (color: string) => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = color;
    fabricRef.current.renderAll();
  };

  return (
    <div className="flex h-full">
      <div className="w-16 bg-surface-dark border-r border-border flex flex-col items-center py-4 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
                activeTool === tool.id
                  ? 'bg-brand-600 text-white'
                  : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              )}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}

        <div className="w-8 h-px bg-border my-2"></div>

        <button
          onClick={handleAddImage}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors duration-150"
          title="Add Image"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
            showQuickActions ? 'bg-brand-100 text-brand-700' : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
          )}
          title="Quick Actions"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <div className="flex-1"></div>

        <button
          onClick={handleDelete}
          disabled={!selectedObject}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
            selectedObject ? 'text-red-500 hover:bg-red-50' : 'text-text-dim cursor-not-allowed'
          )}
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleDuplicate}
          disabled={!selectedObject}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
            selectedObject ? 'text-text-secondary hover:bg-surface-light hover:text-text-primary' : 'text-text-dim cursor-not-allowed'
          )}
          title="Duplicate"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-surface-dark border-b border-border flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <select
              value={canvasSize.width + 'x' + canvasSize.height}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="select-field"
            >
              {socialPresets.map((preset) => (
                <option key={preset.name} value={preset.width + 'x' + preset.height}>
                  {preset.name} ({preset.width}×{preset.height})
                </option>
              ))}
            </select>

            <div className="w-px h-6 bg-border mx-2"></div>

            <button onClick={() => {}} className="btn-ghost p-2" title="Undo">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={() => {}} className="btn-ghost p-2" title="Redo">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => handleZoom('out')} className="btn-ghost p-2" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-secondary min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => handleZoom('in')} className="btn-ghost p-2" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => handleZoom('fit')} className="btn-ghost p-2" title="Fit to Screen">
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedImage && (
              <button onClick={handleAddAiImage} className="btn-secondary text-sm flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> AI Image
              </button>
            )}
            <button className="btn-secondary text-sm" onClick={handleExport}>
              Export
            </button>
            <button className="btn-primary text-sm">Save</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-surface-darkest flex items-center justify-center p-8">
          <div className="relative shadow-depth rounded-lg" style={{ transform: `scale(${Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 200 : 1400) / canvasSize.width * 0.5)})` }}>
            <canvas ref={canvasRef} className="bg-white rounded-lg shadow-depth"></canvas>
          </div>
        </div>
      </div>

      <div className="w-72 bg-surface-dark border-l border-border overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Properties</h3>

          {selectedObject ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1 block">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-text-dim">X</label>
                    <input
                      type="number"
                      value={Math.round(selectedObject.left || 0)}
                      className="input-field w-full text-sm"
                      onChange={(e) => { selectedObject.set('left', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedObject.top || 0)}
                      className="input-field w-full text-sm"
                      onChange={(e) => { selectedObject.set('top', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-text-dim">W</label>
                    <input
                      type="number"
                      value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                      className="input-field w-full text-sm"
                      onChange={(e) => { const w = parseInt(e.target.value); selectedObject.scaleX = w / (selectedObject.width || 1); fabricRef.current?.renderAll(); }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">H</label>
                    <input
                      type="number"
                      value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                      className="input-field w-full text-sm"
                      onChange={(e) => { const h = parseInt(e.target.value); selectedObject.scaleY = h / (selectedObject.height || 1); fabricRef.current?.renderAll(); }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedObject.angle || 0}
                  className="w-full accent-brand-600"
                  onChange={(e) => { selectedObject.set('angle', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                />
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(selectedObject.opacity || 1) * 100}
                  className="w-full accent-brand-600"
                  onChange={(e) => { selectedObject.set('opacity', parseInt(e.target.value) / 100); fabricRef.current?.renderAll(); }}
                />
              </div>

              {(selectedObject instanceof fabric.IText || (selectedObject as any)?.type === 'i-text') && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Font Size</label>
                  <input
                    type="number"
                    value={(selectedObject as unknown as InstanceType<typeof fabric.IText>).fontSize || 36}
                    className="input-field w-full text-sm"
                    onChange={(e) => { selectedObject.set('fontSize', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-text-muted mb-1 block">Fill Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(selectedObject.fill as string) || '#d4884f'}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    onChange={(e) => { selectedObject.set('fill', e.target.value); fabricRef.current?.renderAll(); }}
                  />
                  <input
                    type="text"
                    value={(selectedObject.fill as string) || '#d4884f'}
                    className="input-field flex-1 text-sm"
                    onChange={(e) => { selectedObject.set('fill', e.target.value); fabricRef.current?.renderAll(); }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-brand-50 border border-brand-200">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-brand-600" />
                  <span className="text-sm font-medium text-brand-800">Active Brand</span>
                </div>
                {activeBrand ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: activeBrand.color }}></div>
                      <span className="text-sm text-text-secondary">{activeBrand.name}</span>
                    </div>
                    <div className="text-xs text-text-dim">Fonts: {activeBrand.fonts.join(', ')}</div>
                  </div>
                ) : (
                  <p className="text-xs text-text-dim">No brand selected</p>
                )}
              </div>

              <div>
                <label className="text-xs text-text-muted mb-2 block">Canvas Background</label>
                <div className="flex gap-2 flex-wrap">
                  {['#faf6f0', '#ffffff', '#f5efe7', '#f2dec7', '#e8dfd2', '#3d3229'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplyBackground(c)}
                      className="w-8 h-8 rounded-lg border border-border shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-2 block">Quick Actions</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleApplyBackground(activeBrand?.color || '#d4884f')} className="btn-secondary text-xs">
                    <Palette className="w-3 h-3 inline mr-1" /> Brand BG
                  </button>
                  <button onClick={() => handlePresetChange('Instagram Post')} className="btn-secondary text-xs">
                    <ImageIcon className="w-3 h-3 inline mr-1" /> IG Post
                  </button>
                  <button onClick={() => handlePresetChange('YouTube Thumbnail')} className="btn-secondary text-xs">
                    <ImageIcon className="w-3 h-3 inline mr-1" /> YouTube
                  </button>
                  <button onClick={() => handlePresetChange('A4 Portrait')} className="btn-secondary text-xs">
                    <Layers className="w-3 h-3 inline mr-1" /> A4 Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
