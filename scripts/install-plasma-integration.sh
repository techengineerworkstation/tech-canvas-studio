#!/usr/bin/env bash
set -euo pipefail

# Tech Canvas Studio - Plasma Desktop Integration Helper
# This script creates a local .desktop entry and installs icons so the app
# appears in the KDE Plasma Application Launcher and can be pinned to the taskbar.

APPIMAGE_PATH="${1:-}"
if [[ -z "$APPIMAGE_PATH" ]]; then
  echo "Usage: $0 /path/to/TechCanvasStudio-*.AppImage"
  exit 1
fi

APPIMAGE_PATH="$(realpath "$APPIMAGE_PATH")"
if [[ ! -f "$APPIMAGE_PATH" ]]; then
  echo "AppImage not found: $APPIMAGE_PATH"
  exit 1
fi

APP_NAME="Tech Canvas Studio"
APP_ID="tech-canvas-studio"
ICON_DIR="$HOME/.local/share/icons/hicolor"
APPS_DIR="$HOME/.local/share/applications"

mkdir -p "$APPS_DIR" "$ICON_DIR/512x512/apps" "$ICON_DIR/256x256/apps" "$ICON_DIR/128x128/apps"

# Extract icons from the AppImage
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

"$APPIMAGE_PATH" --appimage-extract >/dev/null 2>&1
cp -r squashfs-root/usr/share/icons/hicolor/* "$ICON_DIR/" 2>/dev/null || true
rm -rf squashfs-root

# Create the .desktop entry
cat > "$APPS_DIR/$APP_ID.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=$APP_NAME
GenericName=Creative Studio
Comment=Design, video, and AI creative suite
Exec=$APPIMAGE_PATH --no-sandbox %U
Icon=$APP_ID
Categories=Graphics;2DGraphics;RasterGraphics;Video;AudioVideo;
Keywords=design;video;photo;editor;canvas;ai;audio;brand;templates;
StartupWMClass=$APP_ID
StartupNotify=true
Terminal=false
MimeType=image/png;image/jpeg;image/svg+xml;image/webp;video/mp4;video/webm;audio/mpeg;audio/wav;
Actions=new-project;open-project;

[Desktop Action new-project]
Name=New Project
Exec=$APPIMAGE_PATH --new-project
Icon=$APP_ID

[Desktop Action open-project]
Name=Open Project
Exec=$APPIMAGE_PATH --open-project
Icon=$APP_ID
EOF

update-desktop-database "$APPS_DIR" 2>/dev/null || true

echo "$APP_NAME integrated into Plasma."
echo "You can now find it in the Application Launcher and pin it to the taskbar."
