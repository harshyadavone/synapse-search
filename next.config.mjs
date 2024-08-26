import withPWA from "next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Configuration options for Next.js
const nextConfig = {
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

// Configuration object for the next-pwa plugin
const pwaConfig = {
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

// Combine the configurations
const withPWAConfigured = withPWA(pwaConfig);

const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // Enable the bundle analyzer when the environment variable is set
});

// Export the combined configuration for Next.js with PWA and bundle analyzer support
export default bundleAnalyzerConfig(withPWAConfigured(nextConfig));
