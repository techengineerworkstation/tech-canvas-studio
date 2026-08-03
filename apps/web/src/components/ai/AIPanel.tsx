'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Image, Download, Loader2, Eye, EyeOff, AlertCircle, Plus, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { generateIdeogramImage, mapAspectRatio, mapModelId, mapStyleType } from '@/lib/ideogram';

const models = [
  { id: 'V3', name: 'Ideogram 3.0', description: 'Best quality and text rendering' },
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
  { name: 'Logo', prompt: 'A professional minimalist logo for "{subject}", clean vector style, cream beige background, modern design' },
  { name: 'Social Post', prompt: 'Eye-catching social media post about "{subject}", warm cream beige palette, modern typography, engaging layout' },
  { name: 'YouTube Thumbnail', prompt: 'Bold YouTube thumbnail for "{subject}", dramatic lighting, warm cream beige tones, high contrast' },
  { name: 'Poster', prompt: 'Creative poster design for "{subject}", professional layout, bold typography, warm cream beige palette' },
  { name: 'Banner', prompt: 'Wide banner for "{subject}", clean modern design, warm gradient background, professional look' },
  { name: 'Product Photo', prompt: 'Professional product photography of "{subject}", studio lighting, clean cream beige background' },
];

export function AIPanel() {
  const apiKey = useStudioStore((s) => s.apiKey);
  const setApiKey = useStudioStore((s) => s.setApiKey);
  const addGeneratedImage = useStudioStore((s) => s.addGeneratedImage);
  const generatedImages = useStudioStore((s) => s.generatedImages);
  const selectedImage = useStudioStore((s) => s.getSelectedImage());
  const selectImage = useStudioStore((s) => s.selectImage);

  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('V3');
  const [selectedRatio, setSelectedRatio] = useState('16x9');
  const [selectedStyle, setSelectedStyle] = useState('AUTO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!apiKey || !prompt) return;
    setError(null);
    setIsGenerating(true);

    try {
      const data = await generateIdeogramImage(apiKey, prompt, {
        model: mapModelId(selectedModel),
        aspectRatio: mapAspectRatio(selectedRatio),
        style: mapStyleType(selectedStyle),
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      const first = data.data?.[0];
      if (!first?.url) {
        throw new Error('No image returned from Ideogram API');
      }

      addGeneratedImage({
        id: Math.random().toString(36).substring(2, 15),
        url: first.url,
        prompt: first.prompt || prompt,
        model: selectedModel,
        ratio: selectedRatio,
        style: selectedStyle,
        timestamp: new Date(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = (template: (typeof templates)[0]) => {
    const subject = prompt || 'my project';
    setPrompt(template.prompt.replace('{subject}', subject));
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    const a = document.createElement('a');
    a.href = selectedImage.url;
    a.download = `tech-canvas-${selectedImage.id}.png`;
    a.click();
  };

  const handleCopy = () => {
    if (!selectedImage) return;
    navigator.clipboard.writeText(selectedImage.url);
  };

  return (
    <div className="flex h-full">
      <div className="w-96 bg-surface-dark border-r border-border overflow-y-auto">
        <div className="p-4">
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
                Get your key from <a href="https://developer.ideogram.ai" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">developer.ideogram.ai</a>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="input-field w-full h-24 resize-none"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Model</h3>
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors duration-150',
                    selectedModel === model.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm text-text-primary">{model.name}</div>
                  <div className="text-xs text-text-dim">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Aspect Ratio</h3>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-colors duration-150',
                    selectedRatio === ratio.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm text-text-primary">{ratio.name}</div>
                  <div className="text-xs text-text-dim">{ratio.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-colors duration-150',
                    selectedStyle === style.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="font-medium text-sm text-text-primary">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

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

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-surface-darkest p-8">
          {selectedImage ? (
            <div className="relative max-w-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="max-w-full max-h-[60vh] rounded-xl shadow-depth"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/90 line-clamp-2">{selectedImage.prompt}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-dim">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Generate an image to see preview</p>
              <p className="text-sm mt-2">Enter a prompt and click Generate</p>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="h-14 bg-surface-dark border-t border-border flex items-center px-4 justify-center gap-3">
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy URL
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add to Canvas
            </button>
          </div>
        )}
      </div>

      <div className="w-72 bg-surface-dark border-l border-border overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">History</h3>
          {generatedImages.length === 0 ? (
            <p className="text-sm text-text-dim text-center py-8">No images generated yet</p>
          ) : (
            <div className="space-y-3">
              {generatedImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => selectImage(image.id)}
                  className={cn(
                    'cursor-pointer rounded-lg border overflow-hidden transition-colors duration-150',
                    selectedImage?.id === image.id
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <img src={image.url} alt={image.prompt} className="w-full h-32 object-cover" />
                  <div className="p-2 bg-surface-dark">
                    <p className="text-xs text-text-secondary line-clamp-2">{image.prompt}</p>
                    <p className="text-xs text-text-dim mt-1">{image.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Templates</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => handleUseTemplate(template)}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-light transition-colors duration-150 text-sm"
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
