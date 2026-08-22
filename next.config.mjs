/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  // Produce a lean server bundle for Google Cloud Run
  output: 'standalone',
};

export default nextConfig;
