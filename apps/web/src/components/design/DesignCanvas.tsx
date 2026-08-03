'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import {
  MousePointer, Type, Square, Circle, Triangle, Star,
  Minus, ArrowRight, Diamond, Hexagon, Plus, ZoomIn, ZoomOut,
  Maximize, Trash2, Copy, Wand2, Palette, Image as ImageIcon,
  Layers, Download, Undo2, Redo2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { socialPresets } from '@/lib/express';

const tools = [
  { id: 'select', label: 'Select', icon: MousePointer },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'rect', label: 'Rect', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'line', label: 'Line', icon: Minus },
  { id: 'arrow', label: 'Arrow', icon: ArrowRight },
  { id: 'diamond', label: 'Diamond', icon: Diamond },
  { id: 'hexagon', label: 'Hex', icon: Hexagon },
];

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<InstanceType<typeof fabric.Canvas> | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [selectedObject, setSelectedObject] = useState<InstanceType<typeof fabric.FabricObject> | null>(null);
  const [fitToScreen, setFitToScreen] = useState(false);

  const activeBrand = useStudioStore((s) => s.getActiveBrand());
  const selectedImage = useStudioStore((s) => s.getSelectedImage());
  const currentProject = useStudioStore((s) => s.currentProject);

  // Sync canvas size when project/template changes
  useEffect(() => {
    if (currentProject) {
      setCanvasSize({ width: currentProject.width, height: currentProject.height });
    }
  }, [currentProject]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
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

    // Initial fit
    handleFit(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
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

  const handleFit = (canvas?: InstanceType<typeof fabric.Canvas>) => {
    const c = canvas || fabricRef.current;
    if (!c) return;
    const container = c.wrapperEl?.parentElement;
    if (!container) return;
    const padding = 64;
    const scaleX = (container.clientWidth - padding) / c.width;
    const scaleY = (container.clientHeight - padding) / c.height;
    const newZoom = Math.min(scaleX, scaleY, 1);
    c.setZoom(newZoom);
    c.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0]);
    setZoom(newZoom);
    setFitToScreen(true);
    c.renderAll();
  };

  const handleToolClick = useCallback((toolId: string) => {
    setActiveTool(toolId);
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (toolId === 'select') {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.isDrawingMode = false;
      return;
    }

    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';

    const brandColor = activeBrand?.color || '#c26e3a';
    let obj: InstanceType<typeof fabric.FabricObject>;

    switch (toolId) {
      case 'text':
        obj = new fabric.IText('Double click to edit', {
          left: 80,
          top: 80,
          fontSize: 42,
          fill: brandColor,
          fontFamily: activeBrand?.fonts[0] || 'Inter',
        });
        break;
      case 'rect':
        obj = new fabric.Rect({ left: 80, top: 80, width: 200, height: 150, fill: brandColor, rx: 8, ry: 8 });
        break;
      case 'circle':
        obj = new fabric.Circle({ left: 80, top: 80, radius: 80, fill: brandColor });
        break;
      case 'triangle':
        obj = new fabric.Triangle({ left: 80, top: 80, width: 160, height: 140, fill: brandColor });
        break;
      case 'star':
        obj = new fabric.Polygon(
          [
            { x: 80, y: 0 }, { x: 95, y: 50 }, { x: 155, y: 50 },
            { x: 110, y: 80 }, { x: 125, y: 130 }, { x: 80, y: 100 },
            { x: 35, y: 130 }, { x: 50, y: 80 }, { x: 5, y: 50 }, { x: 65, y: 50 },
          ],
          { left: 80, top: 80, fill: brandColor }
        );
        break;
      case 'diamond':
        obj = new fabric.Polygon(
          [{ x: 80, y: 0 }, { x: 160, y: 80 }, { x: 80, y: 160 }, { x: 0, y: 80 }],
          { left: 80, top: 80, fill: brandColor }
        );
        break;
      case 'hexagon':
        obj = new fabric.Polygon(
          [
            { x: 80, y: 0 }, { x: 150, y: 40 }, { x: 150, y: 120 },
            { x: 80, y: 160 }, { x: 10, y: 120 }, { x: 10, y: 40 },
          ],
          { left: 80, top: 80, fill: brandColor }
        );
        break;
      case 'line':
        obj = new fabric.Line([80, 80, 320, 80], { stroke: brandColor, strokeWidth: 4 });
        break;
      case 'arrow':
        obj = new fabric.Line([80, 80, 320, 80], { stroke: brandColor, strokeWidth: 6 });
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
    if (direction === 'in') newZoom = Math.min(zoom * 1.15, 3);
    if (direction === 'out') newZoom = Math.max(zoom / 1.15, 0.1);
    if (direction === 'fit') {
      handleFit(canvas);
      return;
    }
    canvas.setZoom(newZoom);
    setZoom(newZoom);
    setFitToScreen(false);
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
        cloned.set({ left: (cloned.left || 0) + 24, top: (cloned.top || 0) + 24 });
        fabricRef.current!.add(cloned);
        fabricRef.current!.setActiveObject(cloned);
        fabricRef.current!.renderAll();
      });
  };

  const handleAddImage = () => {
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

  const selectedFill = (selectedObject?.fill as string) || activeBrand?.color || '#c26e3a';
  const isText = selectedObject instanceof fabric.IText || (selectedObject as any)?.type === 'i-text';

  return (
    <div className="flex h-full">
      {/* Left Toolbar */}
      <div className="w-14 shrink-0 panel border-r flex flex-col items-center py-3 gap-1.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150',
                activeTool === tool.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-dark hover:text-text-primary'
              )}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}

        <div className="w-6 h-px bg-border my-1" />

        <button onClick={handleAddImage} className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-dark hover:text-text-primary transition-colors duration-150" title="Add Image">
          <Plus className="w-4 h-4" />
        </button>

        {selectedImage && (
          <button onClick={handleAddAiImage} className="w-9 h-9 rounded-lg flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-colors duration-150" title="Add AI Image">
            <Wand2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1" />

        <button onClick={handleDuplicate} disabled={!selectedObject} className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150', selectedObject ? 'text-text-secondary hover:bg-surface-dark hover:text-text-primary' : 'text-text-dim cursor-not-allowed')} title="Duplicate">
          <Copy className="w-4 h-4" />
        </button>
        <button onClick={handleDelete} disabled={!selectedObject} className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150', selectedObject ? 'text-red-500 hover:bg-red-50' : 'text-text-dim cursor-not-allowed')} title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Toolbar */}
        <div className="h-11 shrink-0 border-b border-border bg-surface-medium flex items-center px-3 justify-between">
          <div className="flex items-center gap-2">
            <select
              value={canvasSize.width + 'x' + canvasSize.height}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="select-field h-7 py-0 text-xs"
            >
              {socialPresets.map((preset) => (
                <option key={preset.name} value={preset.width + 'x' + preset.height}>
                  {preset.name} ({preset.width}×{preset.height})
                </option>
              ))}
            </select>

            <div className="w-px h-5 bg-border mx-1" />

            <button onClick={() => {}} className="btn-ghost h-7 w-7 p-0" title="Undo">
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => {}} className="btn-ghost h-7 w-7 p-0" title="Redo">
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-surface-dark rounded-lg px-1 py-0.5 border border-border">
            <button onClick={() => handleZoom('out')} className="btn-ghost h-6 w-6 p-0" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-text-secondary min-w-[44px] text-center font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => handleZoom('in')} className="btn-ghost h-6 w-6 p-0" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleZoom('fit')} className={cn('btn-ghost h-6 w-6 p-0', fitToScreen && 'text-brand-600 bg-brand-50')} title="Fit to Screen">
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn-secondary h-7 text-xs px-3">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="btn-primary h-7 text-xs px-3">Save</button>
          </div>
        </div>

        {/* Canvas Viewport */}
        <div className="flex-1 min-h-0 bg-surface-darkest overflow-auto flex items-center justify-center p-6 scrollbar-thin">
          <div className="relative shadow-depth rounded-sm bg-white">
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-64 shrink-0 panel border-l overflow-y-auto scrollbar-thin">
        <div className="p-3">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Properties</h3>

          {selectedObject ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedObject.left || 0)}
                    className="input-field w-full text-xs h-7"
                    onChange={(e) => { selectedObject.set('left', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedObject.top || 0)}
                    className="input-field w-full text-xs h-7"
                    onChange={(e) => { selectedObject.set('top', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">W</label>
                  <input
                    type="number"
                    value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                    className="input-field w-full text-xs h-7"
                    onChange={(e) => { const w = parseInt(e.target.value); selectedObject.scaleX = w / (selectedObject.width || 1); fabricRef.current?.renderAll(); }}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">H</label>
                  <input
                    type="number"
                    value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                    className="input-field w-full text-xs h-7"
                    onChange={(e) => { const h = parseInt(e.target.value); selectedObject.scaleY = h / (selectedObject.height || 1); fabricRef.current?.renderAll(); }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-muted mb-1 block">Rotation</label>
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
                <label className="text-[10px] text-text-muted mb-1 block">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(selectedObject.opacity || 1) * 100}
                  className="w-full accent-brand-600"
                  onChange={(e) => { selectedObject.set('opacity', parseInt(e.target.value) / 100); fabricRef.current?.renderAll(); }}
                />
              </div>

              {isText && (
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">Font Size</label>
                  <input
                    type="number"
                    value={(selectedObject as unknown as InstanceType<typeof fabric.IText>).fontSize || 42}
                    className="input-field w-full text-xs h-7"
                    onChange={(e) => { selectedObject.set('fontSize', parseInt(e.target.value)); fabricRef.current?.renderAll(); }}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-text-muted mb-1 block">Fill</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedFill}
                    className="w-8 h-8 rounded cursor-pointer border border-border p-0.5 bg-white"
                    onChange={(e) => { selectedObject.set('fill', e.target.value); fabricRef.current?.renderAll(); }}
                  />
                  <input
                    type="text"
                    value={selectedFill}
                    className="input-field flex-1 text-xs h-8"
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
                  <span className="text-xs font-semibold text-brand-800">Active Brand</span>
                </div>
                {activeBrand ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-border shadow-sm" style={{ backgroundColor: activeBrand.color }} />
                      <span className="text-xs text-text-secondary font-medium">{activeBrand.name}</span>
                    </div>
                    <div className="text-[10px] text-text-muted">Fonts: {activeBrand.fonts.join(', ')}</div>
                  </div>
                ) : (
                  <p className="text-[10px] text-text-muted">No brand selected</p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-text-muted mb-2 block">Canvas Background</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['#ffffff', '#faf6f0', '#f3ece3', '#e8dfd2', '#2c241c', activeBrand?.color || '#c26e3a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplyBackground(c)}
                      className="w-6 h-6 rounded border border-border shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-muted mb-2 block">Quick Presets</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Instagram Post', 'Instagram Story', 'YouTube Thumbnail', 'A4 Portrait'].map((name) => (
                    <button key={name} onClick={() => handlePresetChange(name)} className="btn-secondary text-[10px] px-2 py-1.5 h-auto">
                      <ImageIcon className="w-3 h-3" /> {name.replace('Instagram ', 'IG ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
