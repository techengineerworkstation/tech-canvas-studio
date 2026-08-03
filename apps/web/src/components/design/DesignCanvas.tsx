'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  MousePointer, Type, Square, Circle, Star, 
  Triangle, Minus, ArrowRight, Diamond, Hexagon,
  Plus, ZoomIn, ZoomOut, Maximize, Grid3X3,
  Undo2, Redo2, Trash2, Copy, Lock, Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
];

const canvasPresets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'YouTube Banner', width: 2560, height: 1440 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'HD 1080p', width: 1920, height: 1080 },
  { name: 'A4 Portrait', width: 2480, height: 3508 },
  { name: 'Square', width: 1024, height: 1024 },
];

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width / 2,
      height: canvasSize.height / 2,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    fabricRef.current = canvas;
    setCanvasReady(true);

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

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

    let obj: fabric.Object;

    switch (toolId) {
      case 'text':
        obj = new fabric.IText('Text', {
          left: 100,
          top: 100,
          fontSize: 48,
          fill: '#1a1a2e',
          fontFamily: 'Inter',
        });
        break;
      case 'rect':
        obj = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: '#7c3aed',
          rx: 8,
          ry: 8,
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: '#e94560',
        });
        break;
      case 'triangle':
        obj = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 150,
          height: 130,
          fill: '#34d399',
        });
        break;
      case 'line':
        obj = new fabric.Line([100, 100, 300, 100], {
          stroke: '#60a5fa',
          strokeWidth: 3,
        });
        break;
      default:
        return;
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  }, []);

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

  const handleUndo = () => {
    // TODO: Implement undo/redo with canvas history
  };

  const handleRedo = () => {
    // TODO: Implement undo/redo with canvas history
  };

  const handleDelete = () => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.remove(selectedObject);
    fabricRef.current.renderAll();
    setSelectedObject(null);
  };

  const handleDuplicate = () => {
    if (!fabricRef.current || !selectedObject) return;
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
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
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        fabric.Image.fromURL(imgUrl, (img) => {
          img.scaleToWidth(400);
          fabricRef.current!.add(img);
          fabricRef.current!.setActiveObject(img);
          fabricRef.current!.renderAll();
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleExport = () => {
    if (!fabricRef.current) return;
    
    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex h-full">
      {/* Left Toolbar */}
      <div className="w-16 bg-surface-dark border-r border-border flex flex-col items-center py-4 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                activeTool === tool.id
                  ? 'bg-brand-500 text-white'
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
          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-light hover:text-text-primary transition-all duration-200"
          title="Add Image"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="flex-1"></div>

        <button
          onClick={handleDelete}
          disabled={!selectedObject}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
            selectedObject
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-text-dim cursor-not-allowed'
          )}
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleDuplicate}
          disabled={!selectedObject}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
            selectedObject
              ? 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              : 'text-text-dim cursor-not-allowed'
          )}
          title="Duplicate"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="h-12 bg-surface-dark border-b border-border flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <select
              value={canvasSize.width + 'x' + canvasSize.height}
              onChange={(e) => {
                const preset = canvasPresets.find(p => p.width + 'x' + p.height === e.target.value);
                if (preset) setCanvasSize({ width: preset.width, height: preset.height });
              }}
              className="select-field"
            >
              {canvasPresets.map((preset) => (
                <option key={preset.name} value={preset.width + 'x' + preset.height}>
                  {preset.name} ({preset.width}×{preset.height})
                </option>
              ))}
            </select>

            <div className="w-px h-6 bg-border mx-2"></div>

            <button onClick={handleUndo} className="btn-ghost p-2" title="Undo">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={handleRedo} className="btn-ghost p-2" title="Redo">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => handleZoom('out')} className="btn-ghost p-2" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-secondary min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => handleZoom('in')} className="btn-ghost p-2" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => handleZoom('fit')} className="btn-ghost p-2" title="Fit to Screen">
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm" onClick={handleExport}>
              Export
            </button>
            <button className="btn-primary text-sm">
              Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-surface-darkest flex items-center justify-center p-8">
          <div className="relative shadow-2xl" style={{ transform: `scale(${Math.min(1, (window.innerWidth - 200) / canvasSize.width * 0.5)})` }}>
            <canvas ref={canvasRef} className="bg-white rounded-lg shadow-depth"></canvas>
          </div>
        </div>
      </div>

      {/* Right Panel */}
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
                      onChange={(e) => {
                        selectedObject.set('left', parseInt(e.target.value));
                        fabricRef.current?.renderAll();
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedObject.top || 0)}
                      className="input-field w-full text-sm"
                      onChange={(e) => {
                        selectedObject.set('top', parseInt(e.target.value));
                        fabricRef.current?.renderAll();
                      }}
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
                      onChange={(e) => {
                        const w = parseInt(e.target.value);
                        selectedObject.scaleX = w / (selectedObject.width || 1);
                        fabricRef.current?.renderAll();
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">H</label>
                    <input
                      type="number"
                      value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                      className="input-field w-full text-sm"
                      onChange={(e) => {
                        const h = parseInt(e.target.value);
                        selectedObject.scaleY = h / (selectedObject.height || 1);
                        fabricRef.current?.renderAll();
                      }}
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
                  className="w-full"
                  onChange={(e) => {
                    selectedObject.set('angle', parseInt(e.target.value));
                    fabricRef.current?.renderAll();
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(selectedObject.opacity || 1) * 100}
                  className="w-full"
                  onChange={(e) => {
                    selectedObject.set('opacity', parseInt(e.target.value) / 100);
                    fabricRef.current?.renderAll();
                  }}
                />
              </div>

              {(selectedObject instanceof fabric.IText) && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Font Size</label>
                  <input
                    type="number"
                    value={selectedObject.fontSize || 48}
                    className="input-field w-full text-sm"
                    onChange={(e) => {
                      selectedObject.set('fontSize', parseInt(e.target.value));
                      fabricRef.current?.renderAll();
                    }}
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-text-muted mb-1 block">Fill Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(selectedObject.fill as string) || '#7c3aed'}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    onChange={(e) => {
                      selectedObject.set('fill', e.target.value);
                      fabricRef.current?.renderAll();
                    }}
                  />
                  <input
                    type="text"
                    value={(selectedObject.fill as string) || '#7c3aed'}
                    className="input-field flex-1 text-sm"
                    onChange={(e) => {
                      selectedObject.set('fill', e.target.value);
                      fabricRef.current?.renderAll();
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-dim text-center py-8">
              Select an object to edit its properties
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
