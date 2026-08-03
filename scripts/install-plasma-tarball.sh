#!/usr/bin/env bash
set -euo pipefail

# Tech Canvas Studio - Plasma Desktop Integration for the portable tar.gz build
# Untars the archive, installs icons, and creates a .desktop entry with
# Intel Haswell iGPU compatibility.

TARBALL_PATH="${1:-}"
if [[ -z "$TARBALL_PATH" ]]; then
  echo "Usage: $0 /path/to/tech-canvas-studio-*.tar.gz"
  exit 1
fi

TARBALL_PATH="$(realpath "$TARBALL_PATH")"
if [[ ! -f "$TARBALL_PATH" ]]; then
  echo "Tarball not found: $TARBALL_PATH"
  exit 1
fi

APP_NAME="Tech Canvas Studio"
APP_ID="tech-canvas-studio"
INSTALL_DIR="$HOME/.local/share/$APP_ID"
ICON_DIR="$HOME/.local/share/icons/hicolor"
APPS_DIR="$HOME/.local/share/applications"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ICON_SRC="${SCRIPT_DIR}/../apps/desktop/icons/icon.png"

if [[ ! -f "$ICON_SRC" ]]; then
  echo "Icon source not found: $ICON_SRC"
  exit 1
fi

mkdir -p "$INSTALL_DIR" "$APPS_DIR" "$ICON_DIR"

echo "Extracting $TARBALL_PATH ..."
rm -rf "$INSTALL_DIR"/*
tar -xvzf "$TARBALL_PATH" -C "$INSTALL_DIR"

# Make the binary executable
chmod +x "$INSTALL_DIR/$APP_ID"

# Install icons at common sizes
for size in 16 32 48 64 128 256 512; do
  mkdir -p "$ICON_DIR/${size}x${size}/apps"
  if command -v magick >/dev/null 2>&1; then
    magick "$ICON_SRC" -resize "${size}x${size}" "$ICON_DIR/${size}x${size}/apps/$APP_ID.png"
  elif command -v convert >/dev/null 2>&1; then
    convert "$ICON_SRC" -resize "${size}x${size}" "$ICON_DIR/${size}x${size}/apps/$APP_ID.png"
  else
    cp "$ICON_SRC" "$ICON_DIR/${size}x${size}/apps/$APP_ID.png"
    break
  fi
done

# Create wrapper script that handles Haswell iGPU compatibility
LAUNCHER="$INSTALL_DIR/$APP_ID-launcher.sh"
cat > "$LAUNCHER" <<'EOF'
#!/usr/bin/env bash
set -e

APP_DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
APP_EXE="$APP_DIR/tech-canvas-studio"
COMPAT_FLAGS=()

detect_haswell() {
  if command -v lspci >/dev/null 2>&1; then
    lspci -nn 2>/dev/null | grep -qiE \
      "Intel.*Haswell|Intel.*4th.*Gen|8086:040[2-6]|8086:041[2-6]|8086:042[2-6]|8086:0a16|8086:0a26|8086:0a2e|8086:0a1e|8086:0d2[26]|8086:041e"
    return $?
  fi
  return 1
}

if detect_haswell; then
  COMPAT_FLAGS+=(--disable-gpu --no-sandbox)
fi

# Allow user override of GPU/sandbox flags
if [[ -n "${TECH_CANVAS_GPU_FLAGS:-}" ]]; then
  IFS=' ' read -ra COMPAT_FLAGS <<< "$TECH_CANVAS_GPU_FLAGS"
fi

exec "$APP_EXE" "${COMPAT_FLAGS[@]}" "$@"
EOF
chmod +x "$LAUNCHER"

# Create .desktop entry
cat > "$APPS_DIR/$APP_ID.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=$APP_NAME
GenericName=Creative Studio
Comment=Design, video, AI, and audio creative suite
Exec=$LAUNCHER %u
Icon=$APP_ID
Categories=Graphics;2DGraphics;RasterGraphics;
Keywords=design;video;photo;editor;canvas;ai;audio;brand;templates;
StartupWMClass=$APP_ID
StartupNotify=true
Terminal=false
MimeType=image/png;image/jpeg;image/svg+xml;image/webp;video/mp4;video/webm;audio/mpeg;audio/wav;
Actions=new-project;open-project;

[Desktop Action new-project]
Name=New Project
Exec=$LAUNCHER --new-project
Icon=$APP_ID

[Desktop Action open-project]
Name=Open Project
Exec=$LAUNCHER --open-project
Icon=$APP_ID
EOF

chmod +x "$APPS_DIR/$APP_ID.desktop"

update-desktop-database "$APPS_DIR" 2>/dev/null || true
gtk-update-icon-cache -f -t "$ICON_DIR" 2>/dev/null || true

echo "$APP_NAME installed from tarball."
echo "Location: $INSTALL_DIR"
echo "Launcher: $LAUNCHER"
echo "Desktop entry: $APPS_DIR/$APP_ID.desktop"
echo "You can now find it in the Plasma Application Launcher and pin it to the taskbar."
