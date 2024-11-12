/** @type {import('next').NextConfig} */
const prefix = process.env.NODE_ENV === 'production' ? 'https://jinsung4069.github.io' : ''
const nextConfig = {
  output: 'export',
  assetPrefix: prefix,
  // basePath: '',
  // images: {
  //   unoptimized: true
  // }
}

module.exports = nextConfig