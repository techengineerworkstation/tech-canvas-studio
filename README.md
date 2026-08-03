# Tech Canvas Studio

A professional creative workspace for Linux — design, video, AI generation, audio, brand kits, and templates. Built with modern web technologies and packaged as a cross-compatible desktop application.

## Features

### Design Canvas
- 2D design canvas with Fabric.js
- Social media and print presets
- Shape tools (rect, circle, triangle, star, diamond, hexagon, arrow, line)
- Text editing with brand fonts
- Image import and manipulation
- AI image insertion from Ideogram
- Export to PNG

### Video Editor
- Timeline-based editing
- Video/image/audio clips
- Effects and transitions
- Text overlays
- Subtitles and captions
- Export with FFmpeg.wasm

### AI Generation (Ideogram)
- Text-to-image generation via Ideogram API
- Multiple models (V3, V2, V2a)
- Aspect ratio control
- Style presets (Auto, Realistic, Design, Anime, 3D)
- Generation history
- Quick templates (logo, social post, YouTube thumbnail, poster, banner, product photo)

### Audio (Chatterbox TTS)
- Text-to-speech via self-hosted Chatterbox
- Voice selection
- Audio import and playback
- Copyright-free audio source links

### Brand Kit
- Brand colors and fonts
- Color palette management
- Active brand applied to design canvas

### Templates
- Social media templates
- Video templates
- Print templates
- Web templates

## Tech Stack

- **Framework**: Next.js 15 + React 18
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js 7
- **Video**: FFmpeg.wasm
- **Animations**: Framer Motion
- **State**: Zustand
- **UI**: Radix UI + Lucide Icons
- **Monorepo**: Turborepo
- **Desktop**: Electron 43 + electron-builder

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build web and desktop
npm run build

# Package desktop app (AppImage + tar.gz)
cd apps/desktop && npm run package
```

## Desktop Installation (Linux)

### AppImage (recommended)
1. Download `TechCanvasStudio-<version>-x86_64.AppImage` from the [releases page](https://github.com/techengineerworkstation/tech-canvas-studio/releases).
2. Make it executable:
   ```bash
   chmod +x TechCanvasStudio-*.AppImage
   ```
3. Run it:
   ```bash
   ./TechCanvasStudio-*.AppImage
   ```
4. For Plasma desktop integration (launcher + taskbar pinning), use [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) or integrate manually:
   ```bash
   ./TechCanvasStudio-*.AppImage --appimage-extract
   # Copy the .desktop file and icons to your local applications directory
   ```

### Portable Archive
Extract `tech-canvas-studio-<version>-linux-x64.tar.gz` and run the `tech-canvas-studio` executable.

## Plasma Desktop Integration

The AppImage includes a `.desktop` entry with:
- `StartupWMClass=tech-canvas-studio` for reliable window-to-launcher matching
- `Categories=Graphics;` for correct app launcher placement
- HiDPI icon set (16px–512px)

This allows the app to appear in the KDE Plasma Application Launcher and be pinned to the taskbar.

## Project Structure

```
tech-canvas-studio/
├── apps/
│   ├── web/                    # Next.js app (creative workspace)
│   └── desktop/                # Electron wrapper + packaging
│       ├── src/
│       │   ├── main.ts         # Electron main process
│       │   └── preload.ts      # Secure preload bridge
│       ├── icons/              # App icons (SVG, PNG, ICO, ICNS)
│       └── electron-builder.js # Packaging config
├── packages/
│   ├── canvas/                 # Canvas engine
│   ├── video/                  # Video engine
│   └── shared/                 # Shared utilities
└── turbo.json                  # Turborepo config
```

## API Keys

- **Ideogram**: Get an API key from [developer.ideogram.ai](https://developer.ideogram.ai) and enter it in the AI Generation panel.
- **Chatterbox TTS**: Configure the self-hosted Chatterbox URL in the Audio panel.

## License

MIT

---

Tech Canvas Studio is an independent project and is not affiliated with Adobe, Canva, CapCut, Kdenlive, or Ideogram.
