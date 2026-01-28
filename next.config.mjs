/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for Next.js 14
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle canvas module for @react-pdf/renderer
      config.externals.push('canvas');
    }
    return config;
  },

  // Optimize images
  images: {
    domains: [],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
