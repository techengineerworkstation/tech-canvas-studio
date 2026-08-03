const path = require('path');

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: 'com.tech-canvas-studio.desktop',
  productName: 'Tech Canvas Studio',
  copyright: 'Copyright © 2026 TechEngineer Workstation',
  directories: {
    output: 'dist-electron',
    buildResources: 'build-resources',
  },
  files: [
    {
      filter: ['dist/**/*', 'icons/**/*', 'package.json'],
    },
  ],
  extraResources: [
    {
      from: '../../apps/web/out',
      to: 'web/out',
      filter: ['**/*'],
    },
  ],
  linux: {
    target: [
      { target: 'AppImage', arch: ['x64'] },
      { target: 'tar.gz', arch: ['x64'] },
    ],
    category: 'Graphics',
    icon: 'icons',
    maintainer: 'TechEngineer Workstation <tech@example.com>',
    vendor: 'TechEngineer Workstation',
    synopsis: 'All-in-one creative suite for design, video, and AI',
    description: 'Tech Canvas Studio is a cross-platform creative workspace for Linux, featuring design canvas, video editing, AI image generation, audio tools, brand kits, and templates.',
    executableName: 'tech-canvas-studio',
    artifactName: 'tech-canvas-studio-${version}-linux-${arch}.${ext}',
    syncDesktopName: true,
    publish: {
      provider: 'github',
      owner: 'techengineerworkstation',
      repo: 'tech-canvas-studio',
    },
  },
  appImage: {
    artifactName: 'TechCanvasStudio-${version}-${arch}.${ext}',
  },

  mac: {
    target: [
      { target: 'dmg', arch: ['x64', 'arm64'] },
      { target: 'zip', arch: ['x64', 'arm64'] },
    ],
    icon: 'icons/icon.icns',
    category: 'public.app-category.graphics-design',
  },
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    icon: 'icons/icon.ico',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    artifactName: 'TechCanvasStudio-Setup-${version}.${ext}',
  },
};

module.exports = config;
