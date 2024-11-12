/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  // basePath 명시
  basePath: '',
  images: {
    unoptimized: true
  },
};

module.exports = nextConfig