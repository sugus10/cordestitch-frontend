// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'product-images-2024.s3.ap-south-1.amazonaws.com',
      'images.pexels.com',
    ],
  },
  output: 'standalone'
};

export default nextConfig;
