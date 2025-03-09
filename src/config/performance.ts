import type { NextConfig } from "next"

export const performanceConfig: Partial<NextConfig> = {
  // Оптимізація збірки
  swcMinify: true,
  poweredByHeader: false,

  // Оптимізація зображень
  images: {
    domains: ["localhost", process.env.S3_BUCKET + ".s3." + process.env.AWS_REGION + ".amazonaws.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },

  // Оптимізація шрифтів
  optimizeFonts: true,

  // Налаштування webpack
  webpack: (config, { dev, isServer }) => {
    // Оптимізація модулів
    config.optimization = {
      ...config.optimization,
      moduleIds: "deterministic",
      splitChunks: {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    }

    // Додаємо компресію для продакшену
    if (!dev) {
      const CompressionPlugin = require("compression-webpack-plugin")
      config.plugins.push(
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: "gzip",
        }),
      )
    }

    return config
  },
}

