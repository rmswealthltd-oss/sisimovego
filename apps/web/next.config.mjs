/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // Turbo must be an object in Next.js 14+
    turbo: {
      rules: {},
    }
    // serverActions is enabled by default — remove it
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },

  webpack: (config) => {
    config.resolve.alias["leaflet"] = false; // prevents SSR issues
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Powered-By", value: "SisimoveGo" },
          { key: "Cache-Control", value: "no-store" }
        ]
      }
    ];
  }
};

export default nextConfig;
