/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings for packages that need native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
};

export default nextConfig;
