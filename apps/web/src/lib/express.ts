export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const quickActions: QuickAction[] = [
  {
    id: 'resize',
    label: 'Resize',
    icon: 'MoveDiagonal',
    description: 'Resize design to any social media format',
  },
  {
    id: 'remove-background',
    label: 'Remove Background',
    icon: 'Eraser',
    description: 'Remove image backgrounds automatically',
  },
  {
    id: 'convert-video',
    label: 'Convert Video',
    icon: 'Film',
    description: 'Convert video to MP4, WebM, or GIF',
  },
  {
    id: 'trim-video',
    label: 'Trim Video',
    icon: 'Scissors',
    description: 'Trim and cut video clips',
  },
  {
    id: 'text-to-speech',
    label: 'Text to Speech',
    icon: 'Volume2',
    description: 'Generate natural voiceover audio',
  },
  {
    id: 'ai-image',
    label: 'AI Image',
    icon: 'Wand2',
    description: 'Generate images with Ideogram',
  },
  {
    id: 'logo-maker',
    label: 'Logo Maker',
    icon: 'Hexagon',
    description: 'Generate professional logo designs',
  },
  {
    id: 'poster',
    label: 'Poster',
    icon: 'Image',
    description: 'Create promotional posters',
  },
];

export const socialPresets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Instagram Reel', width: 1080, height: 1920 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'YouTube Banner', width: 2560, height: 1440 },
  { name: 'YouTube Short', width: 1080, height: 1920 },
  { name: 'TikTok', width: 1080, height: 1920 },
  { name: 'Twitter / X Post', width: 1200, height: 675 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'Pinterest Pin', width: 1000, height: 1500 },
  { name: 'Presentation 16:9', width: 1920, height: 1080 },
  { name: 'Presentation 4:3', width: 1024, height: 768 },
  { name: 'A4 Portrait', width: 2480, height: 3508 },
  { name: 'A4 Landscape', width: 3508, height: 2480 },
  { name: 'HD 1080p', width: 1920, height: 1080 },
  { name: 'Square 1024', width: 1024, height: 1024 },
  { name: 'Logo', width: 1024, height: 1024 },
  { name: 'Business Card', width: 1050, height: 600 },
];
