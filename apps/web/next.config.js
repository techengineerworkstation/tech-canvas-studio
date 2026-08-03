/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  assetPrefix: '.',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@tech-canvas-studio/ui', '@tech-canvas-studio/canvas', '@tech-canvas-studio/shared'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

module.exports = nextConfig;
