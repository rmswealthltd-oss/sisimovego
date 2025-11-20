/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures better error detection in dev
  reactStrictMode: true,

  // Modern build pipeline — required for optimal performance
  experimental: {
    turbo: {
      resolveAlias: {},
      rules: {},
    },
    // Enable partial prerendering if you want speed + SSR blend
    ppr: "incremental",
  },

  // Automatic image optimization (remote OK)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },

  // Faster refresh, fewer memory leaks
  devIndicators: {
    buildActivity: false,
  },

  // Security + performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Powered-By", value: "SisimoveGo" },
          // Improve font & icon caching
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable"
          }
        ],
      },

      // API routes should NOT be cached
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store"
          }
        ]
      }
    ];
  },

  // Fix SSR problems with libraries that break in Node (Leaflet, Mapbox)
  webpack(config) {
    config.resolve.alias["leaflet"] = false;
    return config;
  },
};

export default nextConfig;
