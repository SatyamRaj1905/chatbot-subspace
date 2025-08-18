/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  // Ensure proper build for Netlify
  trailingSlash: false,
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images (optional, but good practice)
  images: {
    unoptimized: true // For Netlify compatibility
  },
  
  // Ensure server-side rendering for authentication
  poweredByHeader: false,
  
  // Don't use static export since we need server-side features
  // output: 'export' // <-- This would cause the build error we're seeing
};

export default config;
