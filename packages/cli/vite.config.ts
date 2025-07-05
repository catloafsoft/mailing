import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mailing',
      fileName: 'mailing',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        // Node.js built-ins
        /^node:/,
        'fs', 'path', 'url', 'os', 'util', 'child_process', 'timers',
        'stream', 'crypto', 'events', 'http', 'https', 'net', 'tls', 'zlib',
        // Dependencies that should remain external
        'next', 'react', 'react-dom',
        'fs-extra', 'chokidar', 'yargs', 'lodash',
        'esbuild', 'prettier', 'mjml', 'socket.io',
        '@prisma/client', 'bcrypt', 'nodemailer',
        // All other dependencies (external for CLI)
        /^@/,
        /^[a-z]/
      ]
    },
    target: 'node18',
    outDir: 'dist',
    emptyOutDir: true,
    minify: false // Keep readable for debugging
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['@faire/mjml-react']
  }
}); 