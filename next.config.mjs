/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['cheerio'],
  webpack(config) {
    // Enable WebAssembly support — required for @resvg/resvg-wasm static import
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    // Treat .wasm files as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
