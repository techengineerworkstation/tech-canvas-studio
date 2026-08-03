'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Upload, Download, Scissors, Trash2,
  Type, Music, Image, Film, Wand2,
  Volume2, VolumeX, Settings, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoClip {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  startFrame: number;
  duration: number;
  track: number;
  thumbnail?: string;
}

interface Effect {
  name: string;
  type: string;
  params: Record<string, any>;
}

interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export function VideoEditor() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [totalFrames, setTotalFrames] = useState(300);
  const [fps] = useState(30);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [zoom, setZoom] = useState(4);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      if (playRef.current) clearInterval(playRef.current);
    } else {
      playRef.current = setInterval(() => {
        setPlayhead((prev) => {
          if (prev >= totalFrames) return 0;
          return prev + 1;
        });
      }, 1000 / fps);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (frames: number) => {
    const totalSeconds = frames / fps;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const ms = Math.floor((totalSeconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleImportVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'video',
        startFrame: 0,
        duration: 150,
        track: 0,
      };
      setClips([...clips, newClip]);
    };
    input.click();
  };

  const handleImportImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'image',
        startFrame: 0,
        duration: 50,
        track: 0,
      };
      setClips([...clips, newClip]);
    };
    input.click();
  };

  const handleImportAudio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'audio',
        startFrame: 0,
        duration: 200,
        track: 3,
      };
      setClips([...clips, newClip]);
    };
    input.click();
  };

  const handleDeleteClip = (clipId: string) => {
    setClips(clips.filter((c) => c.id !== clipId));
    if (selectedClip?.id === clipId) setSelectedClip(null);
  };

  const handleSplitClip = (clip: VideoClip) => {
    if (playhead <= clip.startFrame || playhead >= clip.startFrame + clip.duration) return;
    
    const splitPoint = playhead - clip.startFrame;
    
    const firstHalf: VideoClip = {
      ...clip,
      duration: splitPoint,
      id: clip.id + '_1',
    };
    
    const secondHalf: VideoClip = {
      ...clip,
      startFrame: playhead,
      duration: clip.duration - splitPoint,
      name: clip.name + ' (2)',
      id: clip.id + '_2',
    };
    
    setClips([
      ...clips.filter((c) => c.id !== clip.id),
      firstHalf,
      secondHalf,
    ]);
  };

  const addEffect = (effectName: string) => {
    const newEffect: Effect = {
      name: effectName,
      type: effectName.toLowerCase(),
      params: {},
    };
    setEffects([...effects, newEffect]);
  };

  const addSubtitle = (text: string) => {
    const newSubtitle: Subtitle = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      startTime: playhead * (1000 / fps),
      endTime: (playhead + 50) * (1000 / fps),
    };
    setSubtitles([...subtitles, newSubtitle]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Toolbar */}
      <div className="h-12 bg-surface-dark border-b border-border flex items-center px-4 gap-2">
        <button onClick={handleImportVideo} className="btn-secondary text-xs flex items-center gap-1">
          <Film className="w-3 h-3" /> Import Video
        </button>
        <button onClick={handleImportImage} className="btn-secondary text-xs flex items-center gap-1">
          <Image className="w-3 h-3" /> Import Image
        </button>
        <button onClick={handleImportAudio} className="btn-secondary text-xs flex items-center gap-1">
          <Music className="w-3 h-3" /> Import Audio
        </button>
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <button className="btn-ghost text-xs flex items-center gap-1">
          <Type className="w-3 h-3" /> Add Text
        </button>
        <button className="btn-ghost text-xs flex items-center gap-1">
          <Wand2 className="w-3 h-3" /> Effects
        </button>

        <div className="flex-1"></div>
        
        <button className="btn-secondary text-xs">Export</button>
        <button className="btn-primary text-xs">Save</button>
      </div>

      {/* Playback Controls */}
      <div className="h-10 bg-surface-dark border-b border-border flex items-center px-4 justify-center gap-3">
        <button 
          onClick={() => setPlayhead(Math.max(0, playhead - fps))}
          className="btn-ghost p-1.5"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button onClick={togglePlay} className="btn-primary p-2 rounded-full">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button 
          onClick={() => setPlayhead(Math.min(totalFrames, playhead + fps))}
          className="btn-ghost p-1.5"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-border mx-2"></div>

        <span className="text-xs text-text-secondary font-mono">
          {formatTime(playhead)} / {formatTime(totalFrames)}
        </span>

        <div className="flex-1"></div>

        <span className="text-xs text-text-dim">{fps} FPS</span>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center bg-surface-darkest">
          <div className="w-full max-w-3xl aspect-video bg-surface-dark rounded-lg border border-border flex items-center justify-center">
            {clips.length === 0 ? (
              <div className="text-center text-text-dim">
                <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Import media to start editing</p>
                <p className="text-sm mt-2">Drag and drop files or use the import buttons above</p>
              </div>
            ) : (
              <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                <span className="text-white/50">Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-72 bg-surface-dark border-l border-border overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Clip Properties</h3>
            
            {selectedClip ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Name</label>
                  <input
                    type="text"
                    value={selectedClip.name}
                    className="input-field w-full text-sm"
                    onChange={(e) => {
                      setClips(clips.map((c) => 
                        c.id === selectedClip.id ? { ...c, name: e.target.value } : c
                      ));
                      setSelectedClip({ ...selectedClip, name: e.target.value });
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Duration</label>
                  <input
                    type="number"
                    value={selectedClip.duration}
                    className="input-field w-full text-sm"
                    onChange={(e) => {
                      const newDuration = parseInt(e.target.value);
                      setClips(clips.map((c) => 
                        c.id === selectedClip.id ? { ...c, duration: newDuration } : c
                      ));
                      setSelectedClip({ ...selectedClip, duration: newDuration });
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="100"
                    className="w-full"
                  />
                </div>

                <button 
                  onClick={() => handleSplitClip(selectedClip)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4" /> Split at Playhead
                </button>
                
                <button 
                  onClick={() => handleDeleteClip(selectedClip.id)}
                  className="w-full py-2 px-4 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" /> Delete Clip
                </button>
              </div>
            ) : (
              <p className="text-sm text-text-dim text-center py-8">
                Select a clip to edit properties
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Effects</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Blur', 'Brightness', 'Contrast', 'Grayscale', 'Sepia', 'Vignette', 'Fade In', 'Fade Out'].map((effect) => (
                  <button
                    key={effect}
                    onClick={() => addEffect(effect)}
                    className="btn-ghost text-xs"
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-48 bg-surface-dark border-t border-border">
        {/* Track Headers */}
        <div className="flex h-full">
          <div className="w-20 border-r border-border flex flex-col">
            {['Video 1', 'Video 2', 'Video 3', 'Audio'].map((track, i) => (
              <div key={track} className="h-12 border-b border-border flex items-center px-2">
                <span className="text-xs text-text-secondary">{track}</span>
              </div>
            ))}
          </div>

          {/* Timeline Area */}
          <div className="flex-1 overflow-x-auto relative">
            {/* Ruler */}
            <div className="h-6 bg-surface-medium border-b border-border flex items-center px-2">
              {Array.from({ length: Math.ceil(totalFrames / fps) }, (_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 border-r border-border-light text-xs text-text-dim px-2"
                >
                  {formatTime(i * fps)}
                </div>
              ))}
            </div>

            {/* Tracks */}
            <div className="relative">
              {Array.from({ length: 4 }, (_, trackIndex) => (
                <div key={trackIndex} className="h-12 border-b border-border relative">
                  {clips
                    .filter((c) => c.track === trackIndex)
                    .map((clip) => (
                      <motion.div
                        key={clip.id}
                        className={cn(
                          'absolute h-10 rounded-md cursor-pointer flex items-center px-2 text-xs',
                          clip.type === 'video' && 'bg-brand-500/80',
                          clip.type === 'image' && 'bg-accent-cool/80',
                          clip.type === 'audio' && 'bg-accent-green/80',
                          selectedClip?.id === clip.id && 'ring-2 ring-brand-400'
                        )}
                        style={{
                          left: `${(clip.startFrame / totalFrames) * 100}%`,
                          width: `${(clip.duration / totalFrames) * 100}%`,
                        }}
                        onClick={() => setSelectedClip(clip)}
                      >
                        <span className="text-white truncate">{clip.name}</span>
                      </motion.div>
                    ))}
                </div>
              ))}

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-accent-hot z-10"
                style={{ left: `${(playhead / totalFrames) * 100}%` }}
              >
                <div className="w-3 h-3 bg-accent-hot rounded-full -ml-1.5 -mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
