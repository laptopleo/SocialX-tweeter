import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  
  // ⚡ Output standalone para Docker
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
        port: "",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material', '@mui/icons-material', 'ui-library'],
    // ⚡ DESHABILITADO: workerThreads causa problemas con webpack config personalizado
    // workerThreads: true,
    // cpus: 1,
    // memoryBasedWorkersCount: true, 
  },
  
  productionBrowserSourceMaps: false,
  
  // ⚡ Next.js 15 permite controlar el caching de las páginas
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },

  webpack(config, { isServer, dev }) {
    if (!dev) {
      // SVG loader
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      
      // Optimización de chunks solo en cliente
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 5,
            cacheGroups: {
              default: false,
              vendors: false,
              vendor: {
                name: 'vendor',
                chunks: 'all',
                test: /node_modules/,
                priority: 20,
                reuseExistingChunk: true,
              },
              mui: {
                name: 'mui',
                test: /[\\/]node_modules[\\/]@mui[\\/]/,
                chunks: 'all',
                priority: 30,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }
    
    // Caché de memoria en desarrollo
    if (dev && config.cache) {
      config.cache = {
        type: 'memory',
        maxGenerations: 1,
      };
    }
    
    return config;
  },
};

export default nextConfig;