import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,

  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },

  async redirects() {
    return [
      {
        source: "/digipriatel/vice",
        destination: "/digipriatel/viac",
        permanent: true,
      },
      // German GrowByte site locale removed in favor of Japanese.
      { source: "/de", destination: "/ja", permanent: true },
      { source: "/solutions/de", destination: "/solutions/ja", permanent: true },
      {
        source: "/solutions/de/:slug",
        destination: "/solutions/ja/:slug",
        permanent: true,
      },
      {
        source: "/case-studies/de",
        destination: "/case-studies/ja",
        permanent: true,
      },
      {
        source: "/case-studies/de/lebenslauf-suchmaschine",
        destination: "/case-studies/ja/rirekisho-kensaku",
        permanent: true,
      },
      {
        source: "/case-studies/de/marketing-analyse-tool",
        destination: "/case-studies/ja/marketing-bunseki",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
