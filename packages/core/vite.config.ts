import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MailingCore',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        // Node.js built-ins
        'fs', 'path', 'url', 'os', 'util', 'child_process', 'timers',
        'stream', 'crypto', 'events', 'http', 'https', 'net', 'tls', 'zlib',
        // React ecosystem (should be peer dependencies)
        'react', 'react-dom', 'react/jsx-runtime',
        // MJML and email dependencies
        '@faire/mjml-react', 'mjml', 'node-html-parser',
        // Other dependencies that should remain external
        'nodemailer', 'prisma',
        // All other dependencies
        /^@/,
        /^[a-z]/
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          '@faire/mjml-react': 'MjmlReact'
        }
      }
    },
    target: 'node18',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  esbuild: {
    target: 'node18'
  }
}); 