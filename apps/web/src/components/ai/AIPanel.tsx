'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, Image, RefreshCw, Download, 
  ChevronDown, Loader2, Check, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

const models = [
  { id: 'V3', name: 'Ideogram 3.0 (Best)', description: 'Best quality and text rendering' },
  { id: 'V2', name: 'Ideogram 2.0', description: 'Balanced quality and speed' },
  { id: 'V2A', name: 'Ideogram 2a', description: 'Fast generation' },
];

const aspectRatios = [
  { id: '16x9', name: '16:9', description: 'Landscape' },
  { id: '9x16', name: '9:16', description: 'Portrait' },
  { id: '1x1', name: '1:1', description: 'Square' },
  { id: '4x3', name: '4:3', description: 'Classic' },
  { id: '3x4', name: '3:4', description: 'Portrait Classic' },
];

const styles = [
  { id: 'AUTO', name: 'Auto', description: 'Automatic style selection' },
  { id: 'REALISTIC', name: 'Realistic', description: 'Photorealistic images' },
  { id: 'DESIGN', name: 'Design', description: 'Graphic design style' },
  { id: 'ANIME', name: 'Anime', description: 'Japanese animation style' },
  { id: '3D', name: '3D Render', description: '3D rendered images' },
];

const templates = [
  { name: 'Logo', prompt: 'A professional minimalist logo for "{subject}", clean vector style, white background, modern design' },
  { name: 'Social Media Post', prompt: 'Eye-catching social media post about "{subject}", vibrant colors, modern typography, engaging layout' },
  { name: 'YouTube Thumbnail', prompt: 'Bold YouTube thumbnail for "{subject}", dramatic lighting, expressive, high contrast' },
  { name: 'Poster', prompt: 'Creative poster design for "{subject}", professional layout, bold typography, artistic composition' },
  { name: 'Banner', prompt: 'Wide banner for "{subject}", clean modern design, gradient background, professional look' },
  { name: 'Product Photo', prompt: 'Professional product photography of "{subject}", studio lighting, clean white background' },
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export function AIPanel() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('V3');
  const [selectedRatio, setSelectedRatio] = useState('16x9');
  const [selectedStyle, setSelectedStyle] = useState('AUTO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleGenerate = async () => {
    if (!apiKey || !prompt) return;

    setIsGenerating(true);
    
    // TODO: Implement actual Ideogram API call
    // For now, simulate generation
    setTimeout(() => {
      const mockImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: `https://placehold.co/800x450/7c3aed/ffffff?text=Generated+Image`,
        prompt: prompt,
        timestamp: new Date(),
      };
      setGeneratedImages([mockImage, ...generatedImages]);
      setSelectedImage(mockImage);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    const subject = prompt || 'AI design';
    setPrompt(template.prompt.replace('{subject}', subject));
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Controls */}
      <div className="w-96 bg-surface-dark border-r border-border overflow-y-auto">
        <div className="p-4">
          {/* API Key */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">API Configuration</h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Ideogram API key"
                  className="input-field w-full pr-10"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-secondary"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-text-dim">
                Get your API key from developer.ideogram.ai
              </p>
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="input-field w-full h-24 resize-none"
            />
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Model</h3>
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-all duration-200',
                    selectedModel === model.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-text-dim">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Aspect Ratio</h3>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-all duration-200',
                    selectedRatio === ratio.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm">{ratio.name}</div>
                  <div className="text-xs text-text-dim">{ratio.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-all duration-200',
                    selectedStyle === style.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!apiKey || !prompt || isGenerating}
            className={cn(
              'btn-primary w-full flex items-center justify-center gap-2',
              isGenerating && 'opacity-75 cursor-wait'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center - Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-surface-darkest p-8">
          {selectedImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-full"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="max-w-full max-h-[60vh] rounded-xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/90 line-clamp-2">{selectedImage.prompt}</p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-text-dim">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Generate an image to see preview</p>
              <p className="text-sm mt-2">Enter a prompt and click Generate</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedImage && (
          <div className="h-14 bg-surface-dark border-t border-border flex items-center px-4 justify-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Image className="w-4 h-4" />
              Add to Design Canvas
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - History */}
      <div className="w-72 bg-surface-dark border-l border-border overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Generation History</h3>
          
          {generatedImages.length === 0 ? (
            <p className="text-sm text-text-dim text-center py-8">
              No images generated yet
            </p>
          ) : (
            <div className="space-y-3">
              {generatedImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'cursor-pointer rounded-lg border overflow-hidden transition-all duration-200',
                    selectedImage?.id === image.id
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-border hover:border-border-light'
                  )}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 bg-surface-dark">
                    <p className="text-xs text-text-secondary line-clamp-2">{image.prompt}</p>
                    <p className="text-xs text-text-dim mt-1">
                      {image.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Templates</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => handleUseTemplate(template)}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-light transition-all text-sm"
              >
                <div className="font-medium text-text-primary">{template.name}</div>
                <div className="text-xs text-text-dim line-clamp-1">{template.prompt}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeOff({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
