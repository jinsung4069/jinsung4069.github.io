/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: '',
  images: {
    unoptimized: true
  },
};

// module.exports = nextConfig
export default nextConfig;
