/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_STREAM_API_KEY: process.env.STREAM_API_KEY,
  },
};

export default nextConfig;
