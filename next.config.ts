import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    domains: ['images.unsplash.com'], // Adding domains for backward compatibility
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 600, 800], // Custom image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Device sizes
    formats: ['image/avif', 'image/webp'], // Preferred formats
    minimumCacheTTL: 60, // Cache time in seconds
  },
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
