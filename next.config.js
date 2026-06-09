/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Lint is run separately; skip it during the build for speed.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
