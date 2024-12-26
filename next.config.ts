// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  i18n: {
    locales: ["en", "ja", "it"],
    defaultLocale: "ja",
  },
};

export default nextConfig;
