'use client';

import React, { useState, useRef } from 'react';

import {
  Play, Pause, SkipBack, SkipForward,
  Upload, Download, Scissors, Trash2,
  Type, Music, Image, Film, Wand2,
  Plus, Volume2, Layers, Timer
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

const trackTypes = ['Video', 'Video', 'Video', 'Audio'];
const trackColors = [
  { bg: 'bg-brand-500/90', text: 'text-white' },
  { bg: 'bg-accent-cool/90', text: 'text-white' },
  { bg: 'bg-accent-yellow/90', text: 'text-white' },
  { bg: 'bg-accent-green/90', text: 'text-white' },
];

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

  const handleImport = (type: 'video' | 'image' | 'audio') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        startFrame: 0,
        duration: type === 'image' ? 50 : type === 'audio' ? 200 : 150,
        track: type === 'audio' ? 3 : 0,
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
    const firstHalf: VideoClip = { ...clip, duration: splitPoint, id: clip.id + '_1' };
    const secondHalf: VideoClip = {
      ...clip,
      startFrame: playhead,
      duration: clip.duration - splitPoint,
      name: clip.name + ' (2)',
      id: clip.id + '_2',
    };
    setClips([...clips.filter((c) => c.id !== clip.id), firstHalf, secondHalf]);
  };

  const addEffect = (effectName: string) => {
    setEffects([...effects, { name: effectName, type: effectName.toLowerCase(), params: {} }]);
  };

  const addSubtitle = () => {
    const newSubtitle: Subtitle = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New subtitle',
      startTime: playhead * (1000 / fps),
      endTime: (playhead + 50) * (1000 / fps),
    };
    setSubtitles([...subtitles, newSubtitle]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Toolbar */}
      <div className="h-11 shrink-0 border-b border-border bg-surface-medium flex items-center px-3 gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => handleImport('video')} className="btn-secondary h-7 text-xs px-2.5">
            <Film className="w-3 h-3" /> Video
          </button>
          <button onClick={() => handleImport('image')} className="btn-secondary h-7 text-xs px-2.5">
            <Image className="w-3 h-3" /> Image
          </button>
          <button onClick={() => handleImport('audio')} className="btn-secondary h-7 text-xs px-2.5">
            <Music className="w-3 h-3" /> Audio
          </button>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <button onClick={addSubtitle} className="btn-ghost h-7 text-xs px-2.5">
          <Type className="w-3 h-3" /> Text
        </button>
        <button className="btn-ghost h-7 text-xs px-2.5">
          <Wand2 className="w-3 h-3" /> Effects
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1 bg-surface-dark rounded-lg px-1 py-0.5 border border-border">
          <button onClick={() => setZoom(Math.max(1, zoom - 1))} className="btn-ghost h-6 w-6 p-0 text-xs">-</button>
          <span className="text-[10px] text-text-secondary min-w-[44px] text-center">Zoom {zoom}x</span>
          <button onClick={() => setZoom(Math.min(8, zoom + 1))} className="btn-ghost h-6 w-6 p-0 text-xs">+</button>
        </div>

        <button className="btn-secondary h-7 text-xs px-2.5">
          <Download className="w-3 h-3" /> Export
        </button>
      </div>

      {/* Playback Controls */}
      <div className="h-10 shrink-0 border-b border-border bg-surface-medium flex items-center px-3 gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setPlayhead(Math.max(0, playhead - fps))} className="btn-ghost h-7 w-7 p-0">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={togglePlay} className="btn-primary h-8 w-8 p-0 rounded-full">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => setPlayhead(Math.min(totalFrames, playhead + fps))} className="btn-ghost h-7 w-7 p-0">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <Timer className="w-3.5 h-3.5 text-text-dim" />
          <span>{formatTime(playhead)}</span>
          <span className="text-text-dim">/</span>
          <span>{formatTime(totalFrames)}</span>
        </div>

        <div className="flex-1" />

        <span className="text-[10px] text-text-dim">{fps} FPS</span>
      </div>

      {/* Main Area */}
      <div className="flex-1 min-h-0 flex">
        {/* Preview */}
        <div className="flex-1 min-w-0 flex items-center justify-center bg-surface-darkest p-4">
          <div className="w-full max-w-4xl aspect-video bg-surface-dark rounded-xl border border-border shadow-depth flex items-center justify-center overflow-hidden">
            {clips.length === 0 ? (
              <div className="text-center text-text-dim">
                <Film className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-text-secondary">Import media to start editing</p>
                <p className="text-xs mt-1">Use the import buttons above</p>
              </div>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <span className="text-white/50 text-sm">Video Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 shrink-0 panel border-l overflow-y-auto scrollbar-thin">
          <div className="p-3">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Clip Properties</h3>

            {selectedClip ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">Name</label>
                  <input
                    type="text"
                    value={selectedClip.name}
                    className="input-field w-full text-xs"
                    onChange={(e) => {
                      setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, name: e.target.value } : c)));
                      setSelectedClip({ ...selectedClip, name: e.target.value });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Duration</label>
                    <input
                      type="number"
                      value={selectedClip.duration}
                      className="input-field w-full text-xs h-7"
                      onChange={(e) => {
                        const newDuration = parseInt(e.target.value);
                        setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, duration: newDuration } : c)));
                        setSelectedClip({ ...selectedClip, duration: newDuration });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Track</label>
                    <input
                      type="number"
                      value={selectedClip.track}
                      min={0}
                      max={3}
                      className="input-field w-full text-xs h-7"
                      onChange={(e) => {
                        const track = parseInt(e.target.value);
                        setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, track: Math.min(3, Math.max(0, track)) } : c)));
                        setSelectedClip({ ...selectedClip, track: Math.min(3, Math.max(0, track)) });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">Volume</label>
                  <input type="range" min="0" max="200" defaultValue="100" className="w-full accent-brand-600" />
                </div>

                <div>
                  <label className="text-[10px] text-text-muted mb-1 block">Opacity</label>
                  <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-brand-600" />
                </div>

                <button
                  onClick={() => handleSplitClip(selectedClip)}
                  className="btn-secondary w-full text-xs"
                >
                  <Scissors className="w-3.5 h-3.5" /> Split at Playhead
                </button>

                <button
                  onClick={() => handleDeleteClip(selectedClip.id)}
                  className="w-full py-2 px-3 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 transition-colors text-xs font-medium inline-flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Clip
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-surface-dark border border-border text-center">
                <Layers className="w-6 h-6 text-text-dim mx-auto mb-2" />
                <p className="text-xs text-text-dim">Select a clip to edit properties</p>
              </div>
            )}

            <div className="mt-5">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Effects</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {['Blur', 'Brightness', 'Contrast', 'Grayscale', 'Sepia', 'Vignette', 'Fade In', 'Fade Out'].map((effect) => (
                  <button key={effect} onClick={() => addEffect(effect)} className="btn-ghost text-[10px] h-7 px-2">
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {effects.length > 0 && (
              <div className="mt-4 space-y-1.5">
                {effects.map((effect, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary p-2 rounded-lg bg-white border border-border">
                    <Wand2 className="w-3 h-3 text-text-dim" />
                    {effect.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-48 shrink-0 bg-surface-dark border-t border-border flex">
        {/* Track Headers */}
        <div className="w-20 border-r border-border flex flex-col shrink-0">
          {trackTypes.map((track, i) => (
            <div key={i} className="h-12 border-b border-border flex items-center px-2 gap-1.5">
              <Layers className="w-3 h-3 text-text-dim" />
              <span className="text-[10px] font-medium text-text-secondary">{track}</span>
            </div>
          ))}
        </div>

        {/* Timeline Area */}
        <div className="flex-1 min-w-0 overflow-x-auto relative scrollbar-thin">
          {/* Ruler */}
          <div className="h-6 bg-surface-medium border-b border-border flex items-center">
            {Array.from({ length: Math.ceil(totalFrames / fps) }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 border-r border-border-light text-[10px] text-text-dim px-1.5 flex items-center h-full"
                style={{ width: `${zoom * 20}px` }}
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
                  .map((clip) => {
                    const colors = trackColors[trackIndex] || trackColors[0];
                    return (
                      <div
                        key={clip.id}
                        className={cn(
                          'absolute h-10 rounded-md cursor-pointer flex items-center px-2 text-xs transition-all duration-150 border border-transparent',
                          colors.bg,
                          colors.text,
                          selectedClip?.id === clip.id && 'ring-2 ring-brand-400 border-white'
                        )}
                        style={{
                          left: `${(clip.startFrame / totalFrames) * 100}%`,
                          width: `${(clip.duration / totalFrames) * 100}%`,
                        }}
                        onClick={() => setSelectedClip(clip)}
                      >
                        <span className="truncate font-medium">{clip.name}</span>
                      </div>
                    );
                  })}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent-hot z-10"
              style={{ left: `${(playhead / totalFrames) * 100}%` }}
            >
              <div className="w-3 h-3 bg-accent-hot rounded-full -ml-1.5 -mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
