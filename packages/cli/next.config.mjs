export default {
  eslint: {
    ignoreDuringBuilds: !process.env.MM_DEV,
  },
  experimental: {
    // Next.js 15 optimizations
    serverMinification: true,
    optimizePackageImports: ['lodash', 'react-icons'],
  },
}; 