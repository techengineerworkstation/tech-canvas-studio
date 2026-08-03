# Adobe Creative Suite

A professional design and video editing application built with modern web technologies, inspired by Canva, CapCut, and Kdenlive.

## Features

### Design Canvas (like Canva)
- 2D design canvas with Fabric.js
- Layer management
- Shape tools (rect, circle, triangle, star, etc.)
- Text editing with fonts
- Image import and manipulation
- Export to PNG/JPEG/PDF

### Video Editor (like CapCut/Kdenlive)
- Timeline-based editing
- Video/image/audio clips
- Effects and transitions
- Text overlays
- Subtitles and captions
- Export with FFmpeg.wasm

### AI Generation (Ideogram)
- Text-to-image generation
- Multiple models (V3, V2, V2a)
- Aspect ratio control
- Style presets
- Batch generation
- Image history

### Audio (Chatterbox TTS)
- Text-to-speech via self-hosted Chatterbox
- Copyright-free audio sources
- Audio import and mixing

### Brand Kit
- Brand colors
- Brand fonts
- Color palette management

### Templates
- Social media templates
- Video templates
- Print templates
- Web templates

## Tech Stack

- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js
- **Video**: FFmpeg.wasm
- **Animations**: Framer Motion
- **State**: Zustand
- **UI**: Radix UI + Lucide Icons
- **Monorepo**: Turborepo

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
adobe-creative-suite/
├── apps/
│   └── web/                    # Next.js app
│       └── src/
│           ├── app/            # App router
│           ├── components/     # React components
│           │   ├── design/     # Canvas components
│           │   ├── video/      # Video editor
│           │   ├── ai/         # Ideogram integration
│           │   ├── audio/      # TTS and audio
│           │   ├── brand/      # Brand kit
│           │   └── templates/  # Templates
│           └── lib/            # Utilities
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── canvas/                 # Canvas engine
│   ├── video/                  # Video engine
│   └── shared/                 # Shared utilities
└── turbo.json                  # Turborepo config
```

## License

MIT
