'use client';

import React, { useState, useRef } from 'react';
import {
  Music, Volume2, Play, Pause, Upload, Download,
  Wand2, Globe, ExternalLink, Loader2, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/store/studioStore';
import { generateChatterboxTTS, downloadBlob } from '@/lib/chatterbox';

const copyrightFreeSources = [
  { name: 'Pixabay Music', url: 'https://pixabay.com/music/search/', description: 'Free royalty-free music' },
  { name: 'Pixabay Sound Effects', url: 'https://pixabay.com/sound-effects/search/', description: 'Free sound effects' },
  { name: 'Epidemic Sound', url: 'https://www.epidemicsound.com/music/', description: 'Professional royalty-free (subscription)' },
  { name: 'Artlist', url: 'https://artlist.io/royalty-free-music/', description: 'Royalty-free music and SFX' },
  { name: 'Uppbeat', url: 'https://uppbeat.io/browse/music/', description: 'Free music for creators' },
  { name: 'Freesound', url: 'https://freesound.org/', description: 'Collaborative sound database' },
  { name: 'Mixkit', url: 'https://mixkit.co/free-sound-effects/', description: 'Free sound effects and music' },
  { name: 'Incompetech', url: 'https://incompetech.com/music/', description: 'Royalty-free by Kevin MacLeod' },
];

const ttsVoices = [
  { id: 'default', name: 'Default', description: 'Natural sounding voice' },
  { id: 'narrator', name: 'Narrator', description: 'Clear narration voice' },
  { id: 'dramatic', name: 'Dramatic', description: 'Expressive voice' },
  { id: 'casual', name: 'Casual', description: 'Conversational tone' },
  { id: 'professional', name: 'Professional', description: 'Business-like tone' },
];

interface AudioTrack {
  id: string;
  name: string;
  duration: number;
  url: string;
  type: 'music' | 'sfx' | 'voice';
}

export function AudioPanel() {
  const chatterboxUrl = useStudioStore((s) => s.chatterboxUrl);
  const setChatterboxUrl = useStudioStore((s) => s.setChatterboxUrl);

  const [ttsText, setTtsText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateTTS = async () => {
    if (!ttsText) return;
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generateChatterboxTTS(chatterboxUrl, ttsText, selectedVoice);
      const url = URL.createObjectURL(blob);
      const newTrack: AudioTrack = {
        id: Math.random().toString(36).substring(2, 15),
        name: `TTS - ${ttsText.substring(0, 20)}...`,
        duration: 5.2,
        url,
        type: 'voice',
      };
      setAudioTracks([newTrack, ...audioTracks]);
      setTtsText('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate speech. Is the Chatterbox server running?');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportAudio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const newTrack: AudioTrack = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        duration: 3.5,
        url: URL.createObjectURL(file),
        type: 'music',
      };
      setAudioTracks([newTrack, ...audioTracks]);
    };
    input.click();
  };

  const togglePlay = (track: AudioTrack) => {
    if (playingTrack === track.id) {
      audioRef.current?.pause();
      setPlayingTrack(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.url;
      audioRef.current.play();
    } else {
      const audio = new Audio(track.url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setPlayingTrack(null);
    }
    setPlayingTrack(track.id);
  };

  const handleDownloadTrack = (track: AudioTrack) => {
    if (track.type === 'voice' && track.url.startsWith('blob:')) {
      fetch(track.url)
        .then((r) => r.blob())
        .then((blob) => downloadBlob(blob, `tts-${track.id}.mp3`));
    } else {
      const a = document.createElement('a');
      a.href = track.url;
      a.download = track.name;
      a.click();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full">
      <div className="w-96 bg-surface-dark border-r border-border overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Text to Speech</h3>
            <p className="text-xs text-text-dim mb-3">
              Generate speech using Chatterbox TTS (self-hosted)
            </p>

            <input
              type="url"
              value={chatterboxUrl}
              onChange={(e) => setChatterboxUrl(e.target.value)}
              placeholder="Chatterbox TTS URL"
              className="input-field w-full mb-3 text-xs"
            />

            <textarea
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="input-field w-full h-24 resize-none mb-3"
            />

            <div className="mb-3">
              <label className="text-xs text-text-muted mb-1 block">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="select-field w-full"
              >
                {ttsVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateTTS}
              disabled={!ttsText || isGenerating}
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
                  Generate Speech
                </>
              )}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Import Audio</h3>
            <button
              onClick={handleImportAudio}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Audio File
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowSources(!showSources)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-border-light transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-text-primary">Copyright-Free Audio</span>
              </div>
              <ChevronDown className={cn('w-4 h-4 transition-transform duration-150', showSources && 'rotate-180')} />
            </button>

            {showSources && (
              <div className="mt-2 space-y-2">
                {copyrightFreeSources.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded-lg hover:bg-surface-light transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{source.name}</div>
                        <div className="text-xs text-text-dim">{source.description}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-text-dim" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-surface-dark border-b border-border flex items-center px-4">
          <h3 className="text-sm font-semibold text-text-primary">Audio Library</h3>
          <div className="flex-1"></div>
          <span className="text-xs text-text-dim">{audioTracks.length} tracks</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {audioTracks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-dim">
              <div className="text-center">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No audio tracks yet</p>
                <p className="text-sm mt-2">Generate speech or import audio files</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {audioTracks.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg border transition-colors duration-150',
                    playingTrack === track.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border hover:border-border-light'
                  )}
                >
                  <button onClick={() => togglePlay(track)} className="btn-ghost p-2">
                    {playingTrack === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-text-primary truncate">{track.name}</div>
                    <div className="flex items-center gap-2 text-xs text-text-dim">
                      <span className="px-1.5 py-0.5 rounded bg-surface-light">{track.type}</span>
                      <span>{formatDuration(track.duration)}</span>
                    </div>
                  </div>

                  <button onClick={() => handleDownloadTrack(track)} className="btn-ghost p-2">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
