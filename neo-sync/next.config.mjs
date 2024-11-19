/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.tiny.cloud'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig;
